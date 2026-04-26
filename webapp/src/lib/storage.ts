// LocalStorage helpers for offline persistence.
import { format } from "date-fns";
import type { Adhkar, AdhkarCategory } from "@/data/adhkar";

const KEYS = {
  theme: "adhkar:theme",
  favorites: "adhkar:favorites",
  counts: "adhkar:counts", // per-day counts: { "YYYY-MM-DD": { adhkarId: number } }
  completed: "adhkar:completed", // per-day completed categories
  streak: "adhkar:streak",
  reminders: "adhkar:reminders",
  onboarded: "adhkar:onboarded",
  custom: "adhkar:custom", // user-added adhkar
} as const;

const STORAGE_VERSION = 1;

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

// ============================================================
// Custom Adhkar (user-added)
// ============================================================
export type CustomAdhkar = Adhkar & {
  category: AdhkarCategory | "custom";
  custom: true;
  createdAt: string;
};

export const getCustomAdhkar = (): CustomAdhkar[] =>
  read<CustomAdhkar[]>(KEYS.custom, []);

export const addCustomAdhkar = (
  data: Omit<CustomAdhkar, "id" | "custom" | "createdAt">
): CustomAdhkar => {
  const list = getCustomAdhkar();
  const item: CustomAdhkar = {
    ...data,
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    custom: true,
    createdAt: new Date().toISOString(),
  };
  list.push(item);
  write(KEYS.custom, list);
  return item;
};

export const updateCustomAdhkar = (
  id: string,
  patch: Partial<Omit<CustomAdhkar, "id" | "custom" | "createdAt">>
): CustomAdhkar | null => {
  const list = getCustomAdhkar();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  write(KEYS.custom, list);
  return list[idx];
};

export const deleteCustomAdhkar = (id: string): void => {
  const list = getCustomAdhkar().filter((a) => a.id !== id);
  write(KEYS.custom, list);
  // Also remove from favorites if present
  const favs = getFavorites().filter((f) => f !== id);
  write(KEYS.favorites, favs);
};

// ============================================================
// Backup: Export / Import
// ============================================================
export type Backup = {
  app: "sakeenah";
  version: number;
  exportedAt: string;
  data: {
    custom: CustomAdhkar[];
    favorites: string[];
    counts: Counts;
    streak: StreakState;
    reminders: Reminders;
    theme: Theme;
  };
};

export const exportBackup = (): Backup => ({
  app: "sakeenah",
  version: STORAGE_VERSION,
  exportedAt: new Date().toISOString(),
  data: {
    custom: getCustomAdhkar(),
    favorites: getFavorites(),
    counts: getAllCounts(),
    streak: getStreak(),
    reminders: getReminders(),
    theme: getTheme(),
  },
});

export const downloadBackup = () => {
  const backup = exportBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = format(new Date(), "yyyy-MM-dd_HHmm");
  a.download = `sakeenah-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export type ImportResult = {
  ok: boolean;
  message: string;
  imported?: {
    custom: number;
    favorites: number;
  };
};

export const importBackup = (
  raw: string,
  options: { merge: boolean } = { merge: true }
): ImportResult => {
  let parsed: Backup;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: "Invalid JSON file." };
  }
  if (!parsed || parsed.app !== "sakeenah" || !parsed.data) {
    return {
      ok: false,
      message: "This file isn't a Sakeenah backup.",
    };
  }
  const d = parsed.data;
  // Custom adhkar (merge or replace)
  const existingCustom = options.merge ? getCustomAdhkar() : [];
  const existingIds = new Set(existingCustom.map((c) => c.id));
  const incomingCustom = (d.custom ?? []).filter(
    (c) => c && c.id && !existingIds.has(c.id)
  );
  const mergedCustom = [...existingCustom, ...incomingCustom];
  write(KEYS.custom, mergedCustom);

  // Favorites
  const existingFavs = options.merge ? getFavorites() : [];
  const mergedFavs = Array.from(new Set([...existingFavs, ...(d.favorites ?? [])]));
  write(KEYS.favorites, mergedFavs);

  // Counts (merge per-day)
  const existingCounts = options.merge ? getAllCounts() : {};
  const mergedCounts: Counts = { ...existingCounts };
  for (const [day, dayCounts] of Object.entries(d.counts ?? {})) {
    mergedCounts[day] = { ...(mergedCounts[day] ?? {}), ...dayCounts };
  }
  write(KEYS.counts, mergedCounts);

  // Streak (take the higher one)
  if (d.streak) {
    const cur = getStreak();
    write(KEYS.streak, {
      current: Math.max(cur.current, d.streak.current ?? 0),
      longest: Math.max(cur.longest, d.streak.longest ?? 0),
      lastDay: d.streak.lastDay ?? cur.lastDay,
    });
  }

  // Reminders (only overwrite if not merging, or if user doesn't have prefs)
  if (d.reminders && !options.merge) {
    write(KEYS.reminders, d.reminders);
  }

  // Theme
  if (d.theme && !options.merge) {
    setTheme(d.theme);
  }

  return {
    ok: true,
    message: `Imported ${incomingCustom.length} custom adhkar and ${
      (d.favorites ?? []).length
    } favorites.`,
    imported: {
      custom: incomingCustom.length,
      favorites: (d.favorites ?? []).length,
    },
  };
};
