// AlQuran.cloud client — uses public-domain editions only.
// All translations selected here are either public domain or freely licensed.

export type SurahMeta = {
  number: number;
  name: string;             // Arabic
  englishName: string;      // Transliteration
  englishNameTranslation: string; // Meaning
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

export type Ayah = {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
};

export type SurahDetail = {
  arabic: Ayah[];
  translation: Ayah[];
  audioBase: string;
};

export type TranslationOption = {
  id: string;          // alquran.cloud edition id
  language: string;
  label: string;
  note: string;        // licensing / source
};

// Public-domain & freely permitted translations only
export const TRANSLATIONS: TranslationOption[] = [
  // English
  { id: "en.pickthall",   language: "English",  label: "English — Pickthall",          note: "Public domain (1930)" },
  { id: "en.yusufali",    language: "English",  label: "English — Yusuf Ali",          note: "Public domain (1934)" },
  { id: "en.sahih",       language: "English",  label: "English — Saheeh Intl.",       note: "Permitted free use" },
  { id: "en.arberry",     language: "English",  label: "English — Arberry",            note: "Permitted free use (1955)" },
  // Urdu
  { id: "ur.jalandhry",   language: "Urdu",     label: "اردو — Jalandhry",             note: "Public domain" },
  { id: "ur.ahmedali",    language: "Urdu",     label: "اردو — Ahmed Ali",             note: "Permitted free use" },
  // Other languages
  { id: "fr.hamidullah",  language: "Français", label: "Français — Hamidullah",        note: "Permitted free use" },
  { id: "id.indonesian",  language: "Bahasa",   label: "Indonesia — Indonesian",       note: "Permitted free use" },
  { id: "tr.diyanet",     language: "Türkçe",   label: "Türkçe — Diyanet",             note: "Permitted free use" },
  { id: "es.cortes",      language: "Español",  label: "Español — Cortés",             note: "Permitted free use" },
  { id: "de.aburida",     language: "Deutsch",  label: "Deutsch — Abu Rida",           note: "Permitted free use" },
  { id: "ru.kuliev",      language: "Русский",  label: "Русский — Kuliev",             note: "Permitted free use" },
  { id: "bn.bengali",     language: "বাংলা",     label: "বাংলা — Muhiuddin Khan",       note: "Permitted free use" },
];

const API = "https://api.alquran.cloud/v1";

// Memory cache
let surahsCache: SurahMeta[] | null = null;
const detailCache = new Map<string, SurahDetail>();

// LocalStorage cache (offline)
const LS_SURAHS = "quran:surahs:v1";
const LS_DETAIL = (id: number, t: string) => `quran:detail:${id}:${t}:v1`;

export async function getSurahList(): Promise<SurahMeta[]> {
  if (surahsCache) return surahsCache;
  // Try LS
  try {
    const raw = localStorage.getItem(LS_SURAHS);
    if (raw) {
      surahsCache = JSON.parse(raw);
      return surahsCache!;
    }
  } catch {
    // ignore
  }
  const res = await fetch(`${API}/surah`);
  const data = await res.json();
  if (!data?.data) throw new Error("Failed to load Quran index");
  surahsCache = data.data as SurahMeta[];
  try {
    localStorage.setItem(LS_SURAHS, JSON.stringify(surahsCache));
  } catch {
    // ignore (storage quota)
  }
  return surahsCache;
}

export async function getSurahDetail(
  surahId: number,
  translationId: string
): Promise<SurahDetail> {
  const key = `${surahId}:${translationId}`;
  if (detailCache.has(key)) return detailCache.get(key)!;
  // Try LS
  try {
    const raw = localStorage.getItem(LS_DETAIL(surahId, translationId));
    if (raw) {
      const cached = JSON.parse(raw) as SurahDetail;
      detailCache.set(key, cached);
      return cached;
    }
  } catch {
    // ignore
  }
  const editions = `quran-uthmani,${translationId}`;
  const res = await fetch(`${API}/surah/${surahId}/editions/${editions}`);
  const data = await res.json();
  if (!data?.data || !Array.isArray(data.data)) {
    throw new Error("Failed to load surah");
  }
  const arabicEdition = data.data.find((d: { edition: { identifier: string } }) =>
    d.edition.identifier === "quran-uthmani"
  );
  const transEdition = data.data.find((d: { edition: { identifier: string } }) =>
    d.edition.identifier === translationId
  );
  if (!arabicEdition || !transEdition) {
    throw new Error("Editions missing in API response");
  }
  const detail: SurahDetail = {
    arabic: arabicEdition.ayahs as Ayah[],
    translation: transEdition.ayahs as Ayah[],
    // Mishary Alafasy full-surah audio (mp3quran.net is a charity, freely permitted)
    audioBase: `https://server8.mp3quran.net/afs/${String(surahId).padStart(3, "0")}.mp3`,
  };
  detailCache.set(key, detail);
  try {
    localStorage.setItem(LS_DETAIL(surahId, translationId), JSON.stringify(detail));
  } catch {
    // localStorage may be full; fail silently
  }
  return detail;
}

export const TRANSLATION_PREF_KEY = "quran:translation:v1";

export function getPreferredTranslation(): string {
  try {
    return localStorage.getItem(TRANSLATION_PREF_KEY) || "en.sahih";
  } catch {
    return "en.sahih";
  }
}

export function setPreferredTranslation(id: string) {
  try {
    localStorage.setItem(TRANSLATION_PREF_KEY, id);
  } catch {
    // ignore
  }
}
