// Aladhan prayer-times client (free, no API key)
// Docs: https://aladhan.com/prayer-times-api

export type PrayerTimings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
};

export type PrayerData = {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    gregorian: { date: string; weekday: { en: string }; month: { en: string } };
    hijri: {
      date: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { en: string; ar: string; number: number };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: { id: number; name: string };
    school: string;
  };
};

export type CalculationMethod = {
  id: number;
  name: string;
  region: string;
};

// Most popular calculation methods supported by Aladhan
export const METHODS: CalculationMethod[] = [
  { id: 2, name: "Islamic Society of North America (ISNA)", region: "🇺🇸 N. America" },
  { id: 3, name: "Muslim World League", region: "🌍 General" },
  { id: 4, name: "Umm Al-Qura, Makkah", region: "🇸🇦 Saudi Arabia" },
  { id: 5, name: "Egyptian General Authority", region: "🇪🇬 Egypt" },
  { id: 1, name: "University of Islamic Sciences, Karachi", region: "🇵🇰 Pakistan, India, BD" },
  { id: 7, name: "Institute of Geophysics, Tehran", region: "🇮🇷 Iran" },
  { id: 8, name: "Gulf Region", region: "🇦🇪 Gulf" },
  { id: 9, name: "Kuwait", region: "🇰🇼 Kuwait" },
  { id: 10, name: "Qatar", region: "🇶🇦 Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura", region: "🇸🇬 Singapore" },
  { id: 12, name: "Union of Islamic Organisations of France", region: "🇫🇷 France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı", region: "🇹🇷 Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia", region: "🇷🇺 Russia" },
  { id: 15, name: "Moonsighting Committee Worldwide", region: "🌙 Moonsighting" },
];

const API = "https://api.aladhan.com/v1";

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export async function getPrayerTimesByCity(
  city: string,
  country: string,
  method = 2,
  school = 0,
  date: Date = new Date()
): Promise<PrayerData> {
  const url = `${API}/timingsByCity/${fmtDate(date)}?city=${encodeURIComponent(
    city
  )}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json?.data) throw new Error(json?.data?.message || "Failed to load prayer times");
  return json.data as PrayerData;
}

export async function getPrayerTimesByCoords(
  lat: number,
  lon: number,
  method = 2,
  school = 0,
  date: Date = new Date()
): Promise<PrayerData> {
  const url = `${API}/timings/${fmtDate(date)}?latitude=${lat}&longitude=${lon}&method=${method}&school=${school}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json?.data) throw new Error(json?.data?.message || "Failed to load prayer times");
  return json.data as PrayerData;
}

// Settings persistence
const LS_LOC = "prayer:location:v1";
const LS_METHOD = "prayer:method:v1";
const LS_SCHOOL = "prayer:school:v1";
const LS_CACHED = "prayer:cached:v1";

export type SavedLocation = {
  city: string;
  country: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
};

export const getSavedLocation = (): SavedLocation | null => {
  try {
    const raw = localStorage.getItem(LS_LOC);
    return raw ? (JSON.parse(raw) as SavedLocation) : null;
  } catch {
    return null;
  }
};

export const saveLocation = (loc: SavedLocation) => {
  try {
    localStorage.setItem(LS_LOC, JSON.stringify(loc));
  } catch {
    // ignore
  }
};

export const getSavedMethod = (): number => {
  try {
    return parseInt(localStorage.getItem(LS_METHOD) || "2", 10);
  } catch {
    return 2;
  }
};

export const saveMethod = (m: number) => {
  try {
    localStorage.setItem(LS_METHOD, String(m));
  } catch {
    // ignore
  }
};

export const getSavedSchool = (): 0 | 1 => {
  try {
    return localStorage.getItem(LS_SCHOOL) === "1" ? 1 : 0;
  } catch {
    return 0;
  }
};

export const saveSchool = (s: 0 | 1) => {
  try {
    localStorage.setItem(LS_SCHOOL, String(s));
  } catch {
    // ignore
  }
};

// Cache today's data so reopen offline still shows
export const cacheToday = (key: string, data: PrayerData) => {
  try {
    localStorage.setItem(LS_CACHED, JSON.stringify({ key, data, savedAt: Date.now() }));
  } catch {
    // ignore
  }
};

export const readCachedToday = (key: string): PrayerData | null => {
  try {
    const raw = localStorage.getItem(LS_CACHED);
    if (!raw) return null;
    const { key: k, data, savedAt } = JSON.parse(raw);
    if (k !== key) return null;
    // Same calendar day?
    if (new Date(savedAt).toDateString() !== new Date().toDateString()) return null;
    return data as PrayerData;
  } catch {
    return null;
  }
};

// Helper: pick the next prayer based on current time
export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
export const PRAYERS: PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function getCurrentAndNext(t: PrayerTimings, now: Date = new Date()): {
  current: PrayerKey | null;
  next: PrayerKey;
  msUntilNext: number;
} {
  const today = (hhmm: string) => {
    const [h, m] = hhmm.slice(0, 5).split(":").map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };
  let current: PrayerKey | null = null;
  let next: PrayerKey = "Fajr";
  let msUntilNext = Number.POSITIVE_INFINITY;
  for (let i = 0; i < PRAYERS.length; i++) {
    const p = PRAYERS[i];
    const at = today(t[p]);
    if (at.getTime() <= now.getTime()) current = p;
    else if (at.getTime() - now.getTime() < msUntilNext) {
      next = p;
      msUntilNext = at.getTime() - now.getTime();
    }
  }
  if (msUntilNext === Number.POSITIVE_INFINITY) {
    // All prayers passed today → next is tomorrow's Fajr
    const fajr = today(t.Fajr);
    fajr.setDate(fajr.getDate() + 1);
    next = "Fajr";
    msUntilNext = fajr.getTime() - now.getTime();
  }
  return { current, next, msUntilNext };
}
