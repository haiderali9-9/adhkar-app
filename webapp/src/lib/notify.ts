// Native Android notifications via Capacitor + Web Notifications fallback for browsers.
import {
  LocalNotifications,
  type ScheduleOptions,
  type LocalNotificationSchema,
} from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import type { Reminders } from "./storage";

export type ReminderKey = keyof Reminders;

const REMINDER_META: Record<
  ReminderKey,
  { id: number; title: string; body: string }
> = {
  morning: {
    id: 101,
    title: "🌅 Morning Adhkar",
    body: "Begin your day with the remembrance of Allah.",
  },
  evening: {
    id: 102,
    title: "🌙 Evening Adhkar",
    body: "Seal your day with gratitude and remembrance.",
  },
  afterSalah: {
    id: 103,
    title: "🤲 After Salah",
    body: "A gentle reminder for post-prayer adhkar.",
  },
  sleep: {
    id: 104,
    title: "🛏️ Before Sleep",
    body: "Rest under divine protection — recite your sleep adhkar.",
  },
};

export const isNative = () => Capacitor.isNativePlatform();

export async function getNotificationStatus(): Promise<
  "granted" | "denied" | "prompt" | "unsupported"
> {
  if (isNative()) {
    try {
      const r = await LocalNotifications.checkPermissions();
      if (r.display === "granted") return "granted";
      if (r.display === "denied") return "denied";
      return "prompt";
    } catch {
      return "unsupported";
    }
  }
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return "prompt";
}

export async function requestNotificationPermission(): Promise<
  "granted" | "denied" | "prompt" | "unsupported"
> {
  if (isNative()) {
    try {
      const r = await LocalNotifications.requestPermissions();
      if (r.display === "granted") return "granted";
      if (r.display === "denied") return "denied";
      return "prompt";
    } catch {
      return "unsupported";
    }
  }
  if (typeof Notification === "undefined") return "unsupported";
  const p = await Notification.requestPermission();
  if (p === "granted") return "granted";
  if (p === "denied") return "denied";
  return "prompt";
}

function nextOccurrence(time: string): Date {
  // time like "06:30"
  const [hh, mm] = time.split(":").map((x) => parseInt(x, 10));
  const now = new Date();
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  if (d.getTime() <= now.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

/**
 * Schedule (or reschedule) all enabled daily reminders.
 * On native (Capacitor) → real Android notifications even when app is closed.
 * On web → uses setTimeout/Notification API (fires only while page is open).
 */
export async function scheduleReminders(reminders: Reminders): Promise<{
  scheduled: number;
  cleared: number;
  mode: "native" | "web";
}> {
  if (isNative()) {
    // Cancel previously scheduled
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map((n) => ({ id: n.id })),
        });
      }
    } catch {
      // ignore
    }

    const toSchedule: LocalNotificationSchema[] = [];
    (Object.keys(REMINDER_META) as ReminderKey[]).forEach((key) => {
      const r = reminders[key];
      if (!r?.enabled || !r.time) return;
      const meta = REMINDER_META[key];
      const first = nextOccurrence(r.time);
      toSchedule.push({
        id: meta.id,
        title: meta.title,
        body: meta.body,
        schedule: {
          at: first,
          repeats: true,
          every: "day",
          allowWhileIdle: true,
        },
        smallIcon: "ic_launcher_foreground",
        sound: undefined,
      });
    });

    if (toSchedule.length > 0) {
      await LocalNotifications.schedule({
        notifications: toSchedule,
      } as ScheduleOptions);
    }
    return {
      scheduled: toSchedule.length,
      cleared: 0,
      mode: "native",
    };
  }

  // Web fallback (only while the tab is open)
  webTimers.forEach((id) => clearTimeout(id));
  webTimers = [];
  let scheduled = 0;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return { scheduled: 0, cleared: 0, mode: "web" };
  }
  (Object.keys(REMINDER_META) as ReminderKey[]).forEach((key) => {
    const r = reminders[key];
    if (!r?.enabled || !r.time) return;
    const meta = REMINDER_META[key];
    const first = nextOccurrence(r.time);
    const ms = first.getTime() - Date.now();
    const tid = window.setTimeout(() => {
      try {
        new Notification(meta.title, { body: meta.body, icon: "/favicon.ico" });
      } catch {
        // ignore
      }
    }, ms);
    webTimers.push(tid);
    scheduled++;
  });
  return { scheduled, cleared: 0, mode: "web" };
}

let webTimers: number[] = [];

/** Send a small test notification immediately so the user can verify permissions. */
export async function sendTestNotification(): Promise<boolean> {
  if (isNative()) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: "✨ Sakeenah",
            body: "Notifications are working — Alhamdulillah!",
            schedule: { at: new Date(Date.now() + 1500) },
            smallIcon: "ic_launcher_foreground",
          },
        ],
      });
      return true;
    } catch {
      return false;
    }
  }
  if (typeof Notification === "undefined" || Notification.permission !== "granted")
    return false;
  try {
    new Notification("✨ Sakeenah", {
      body: "Notifications are working — Alhamdulillah!",
    });
    return true;
  } catch {
    return false;
  }
}
