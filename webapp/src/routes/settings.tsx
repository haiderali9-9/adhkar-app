import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, BellRing, Sunrise, Sunset, Bed, MoonStar } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import {
  getTheme,
  setTheme,
  getReminders,
  setReminders,
  type Reminders,
  type Theme,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sakeenah" },
      {
        name: "description",
        content:
          "Customize your adhkar reminders, appearance, and notification times.",
      },
      { property: "og:title", content: "Settings — Sakeenah" },
      {
        property: "og:description",
        content: "Customize reminders, theme, and notification times.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [r, setR] = useState<Reminders | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );

  useEffect(() => {
    setThemeState(getTheme());
    setR(getReminders());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }
  }, []);

  const updateReminders = (next: Reminders) => {
    setR(next);
    setReminders(next);
  };

  const requestNotify = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  if (!r) return null;

  return (
    <div>
      <PageHeader
        arabicTitle="الإعدادات"
        title="Settings"
        subtitle="Personalize your experience"
      />

      <div className="space-y-6 px-5">
        {/* Theme */}
        <Section title="Appearance">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
            <ThemeBtn
              active={theme === "light"}
              onClick={() => {
                setThemeState("light");
                setTheme("light");
              }}
              icon={<Sun className="h-4 w-4" />}
              label="Light"
            />
            <ThemeBtn
              active={theme === "dark"}
              onClick={() => {
                setThemeState("dark");
                setTheme("dark");
              }}
              icon={<Moon className="h-4 w-4" />}
              label="Dark"
            />
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BellRing className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Browser notifications</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {permission === "granted"
                    ? "Enabled — you'll receive gentle reminders."
                    : permission === "denied"
                    ? "Blocked. Update your browser permissions to enable."
                    : permission === "unsupported"
                    ? "Not supported on this device."
                    : "Allow notifications to receive reminders."}
                </p>
                {permission === "default" && (
                  <button
                    onClick={requestNotify}
                    className="mt-3 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition-smooth hover:shadow-glow"
                  >
                    Enable notifications
                  </button>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Reminders */}
        <Section title="Reminders">
          <div className="space-y-2">
            <ReminderRow
              icon={<Sunrise className="h-5 w-5" />}
              label="Morning adhkar"
              hint="After Fajr"
              enabled={r.morning.enabled}
              time={r.morning.time}
              onToggle={(v) =>
                updateReminders({ ...r, morning: { ...r.morning, enabled: v } })
              }
              onTime={(t) =>
                updateReminders({ ...r, morning: { ...r.morning, time: t } })
              }
            />
            <ReminderRow
              icon={<Sunset className="h-5 w-5" />}
              label="Evening adhkar"
              hint="Before Maghrib"
              enabled={r.evening.enabled}
              time={r.evening.time}
              onToggle={(v) =>
                updateReminders({ ...r, evening: { ...r.evening, enabled: v } })
              }
              onTime={(t) =>
                updateReminders({ ...r, evening: { ...r.evening, time: t } })
              }
            />
            <ReminderRow
              icon={<MoonStar className="h-5 w-5" />}
              label="After Salah"
              hint="5 daily reminders"
              enabled={r.afterSalah.enabled}
              onToggle={(v) =>
                updateReminders({ ...r, afterSalah: { enabled: v } })
              }
            />
            <ReminderRow
              icon={<Bed className="h-5 w-5" />}
              label="Before sleep"
              hint="Wind-down dhikr"
              enabled={r.sleep.enabled}
              time={r.sleep.time}
              onToggle={(v) =>
                updateReminders({ ...r, sleep: { ...r.sleep, enabled: v } })
              }
              onTime={(t) =>
                updateReminders({ ...r, sleep: { ...r.sleep, time: t } })
              }
            />
          </div>
        </Section>

        <p className="pb-6 text-center text-xs text-muted-foreground">
          May Allah accept your remembrance ✦
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ThemeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-smooth",
        active
          ? "gradient-primary text-primary-foreground shadow-soft"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ReminderRow({
  icon,
  label,
  hint,
  enabled,
  time,
  onToggle,
  onTime,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  enabled: boolean;
  time?: string;
  onToggle: (v: boolean) => void;
  onTime?: (t: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-smooth",
          enabled
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {time && onTime && enabled && (
        <input
          type="time"
          value={time}
          onChange={(e) => onTime(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
      )}
      <Switch checked={enabled} onChange={onToggle} />
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-smooth",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-smooth",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}
