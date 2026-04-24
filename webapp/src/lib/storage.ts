// LocalStorage helpers for offline persistence.
import { format } from "date-fns";

const KEYS = {
  theme: "adhkar:theme",
  favorites: "adhkar:favorites",
  counts: "adhkar:counts", // per-day counts: { "YYYY-MM-DD": { adhkarId: number } }
  completed: "adhkar:completed", // per-day completed categories
  streak: "adhkar:streak",
  reminders: "adhkar:reminders",
  onboarded: "adhkar:onboarded",
} as const;

export const today = () => format(new Date(), "yyyy-MM-dd");

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

// Theme
export type Theme = "light" | "dark";
export const getTheme = (): Theme => read<Theme>(KEYS.theme, "dark");
export const setTheme = (t: Theme) => {
  write(KEYS.theme, t);
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", t === "dark");
  }
};

// Favorites
export const getFavorites = (): string[] => read<string[]>(KEYS.favorites, []);
export const toggleFavorite = (id: string): string[] => {
  const list = getFavorites();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  write(KEYS.favorites, next);
  return next;
};

// Counts (auto-resets daily because we key by date)
type Counts = Record<string, Record<string, number>>;
export const getAllCounts = (): Counts => read<Counts>(KEYS.counts, {});
export const getTodayCounts = (): Record<string, number> => {
  const all = getAllCounts();
  return all[today()] ?? {};
};
export const incrementCount = (adhkarId: string, max: number): number => {
  const all = getAllCounts();
  const day = today();
  const dayCounts = all[day] ?? {};
  const current = dayCounts[adhkarId] ?? 0;
  if (current >= max) return current;
  dayCounts[adhkarId] = current + 1;
  all[day] = dayCounts;
  // Prune older days (keep last 30)
  const keys = Object.keys(all).sort();
  if (keys.length > 30) {
    for (const k of keys.slice(0, keys.length - 30)) delete all[k];
  }
  write(KEYS.counts, all);
  return dayCounts[adhkarId];
};
export const resetCount = (adhkarId: string) => {
  const all = getAllCounts();
  const day = today();
  const dayCounts = all[day] ?? {};
  dayCounts[adhkarId] = 0;
  all[day] = dayCounts;
  write(KEYS.counts, all);
};

// Streak
type StreakState = { current: number; longest: number; lastDay: string | null };
export const getStreak = (): StreakState =>
  read<StreakState>(KEYS.streak, { current: 0, longest: 0, lastDay: null });

export const recordActivity = (): StreakState => {
  const day = today();
  const s = getStreak();
  if (s.lastDay === day) return s;
  let current = 1;
  if (s.lastDay) {
    const last = new Date(s.lastDay);
    const now = new Date(day);
    const diff = Math.round((now.getTime() - last.getTime()) / 86400000);
    if (diff === 1) current = s.current + 1;
    else current = 1;
  }
  const next: StreakState = {
    current,
    longest: Math.max(current, s.longest),
    lastDay: day,
  };
  write(KEYS.streak, next);
  return next;
};

// Reminders (UI state — actual scheduling is best-effort browser notifications)
export type Reminders = {
  morning: { enabled: boolean; time: string };
  evening: { enabled: boolean; time: string };
  afterSalah: { enabled: boolean };
  sleep: { enabled: boolean; time: string };
};
export const getReminders = (): Reminders =>
  read<Reminders>(KEYS.reminders, {
    morning: { enabled: true, time: "06:30" },
    evening: { enabled: true, time: "17:30" },
    afterSalah: { enabled: false },
    sleep: { enabled: true, time: "22:30" },
  });
export const setReminders = (r: Reminders) => write(KEYS.reminders, r);

// Onboarding
export const isOnboarded = (): boolean => read<boolean>(KEYS.onboarded, false);
export const markOnboarded = () => write(KEYS.onboarded, true);
