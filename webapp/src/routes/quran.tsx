import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  BookOpen,
  Search as SearchIcon,
  Globe,
  Share2,
  X,
} from "lucide-react";
import {
  getSurahList,
  getSurahDetail,
  getPreferredTranslation,
  setPreferredTranslation,
  TRANSLATIONS,
  type SurahMeta,
  type SurahDetail,
} from "@/lib/quran-api";
import { shareText } from "@/lib/share";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quran")({
  component: QuranPage,
});

function QuranPage() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<SurahMeta | null>(null);
  const [trans, setTrans] = useState(getPreferredTranslation());
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load surah list
  useEffect(() => {
    getSurahList()
      .then((s) => {
        setSurahs(s);
        setError(null);
      })
      .catch(() => setError("Couldn't load Quran. Check your connection."))
      .finally(() => setLoading(false));
  }, []);

  // Load detail when surah opens or translation changes
  useEffect(() => {
    if (!active) return;
    setDetail(null);
    setDetailLoading(true);
    getSurahDetail(active.number, trans)
      .then((d) => setDetail(d))
      .catch(() => setError("Couldn't load surah."))
      .finally(() => setDetailLoading(false));
  }, [active, trans]);

  // Pause audio when closing
  useEffect(() => {
    if (!active && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [active]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return surahs;
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(term) ||
        s.englishNameTranslation.toLowerCase().includes(term) ||
        s.name.includes(term) ||
        String(s.number) === term
    );
  }, [q, surahs]);

  const togglePlay = () => {
    if (!detail || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.src = detail.audioBase;
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() =>
          alert("Couldn't load audio. Check your connection and try again.")
        );
    }
  };

  const handleShareSurah = () => {
    if (!active || !detail) return;
    const sample = detail.arabic
      .slice(0, Math.min(3, detail.arabic.length))
      .map((a, i) => `${a.text}\n${detail.translation[i]?.text ?? ""}`)
      .join("\n\n");
    shareText({
      title: `Surah ${active.englishName} (${active.name})`,
      text: `${sample}\n\n— Surah ${active.englishName} (${active.englishNameTranslation}) — Quran ${active.number}\n\nShared via Sakeenah 🌙`,
    });
  };

  const currentTrans = TRANSLATIONS.find((t) => t.id === trans);

  return (
    <div data-testid="quran-page">
      <header
        className="px-5 pb-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 32px)" }}
      >
        <Link
          to="/"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <p className="arabic text-3xl text-primary" dir="rtl">
          القرآن الكريم
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          The Holy Quran
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          All 114 surahs · Tanzil Arabic · public-domain translations
        </p>

        <button
          onClick={() => setShowLangPicker(true)}
          data-testid="quran-language-btn"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Globe className="h-3.5 w-3.5 text-primary" />
          {currentTrans ? currentTrans.label : "Translation"}
        </button>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            data-testid="quran-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search surah by name or number"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      <div className="px-5 pb-2">
        {error && (
          <p className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading surahs…
          </p>
        ) : (
          <ul className="grid gap-1.5">
            {filtered.map((s) => (
              <li key={s.number}>
                <button
                  data-testid={`surah-${s.number}`}
                  onClick={() => setActive(s)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-smooth hover:border-primary/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {s.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {s.englishName}
                      </h3>
                      <span className="arabic text-base text-foreground" dir="rtl">
                        {s.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {s.englishNameTranslation} · {s.numberOfAyahs} ayahs ·{" "}
                      {s.revelationType}
                    </p>
                  </div>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                No surah matches "{q}".
              </p>
            )}
          </ul>
        )}
      </div>

      {/* Surah detail modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background"
          data-testid="surah-detail"
        >
          <div
            className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur"
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <h2 className="text-sm font-semibold text-foreground">
                {active.englishName}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {active.englishNameTranslation} · {active.numberOfAyahs} ayahs
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleShareSurah}
                aria-label="Share"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                data-testid="play-surah"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-smooth",
                  playing
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 translate-x-[1px]" />
                )}
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto px-5 py-5"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
          >
            {detailLoading || !detail ? (
              <p className="text-center text-sm text-muted-foreground">
                Loading verses…
              </p>
            ) : (
              <>
                {active.number !== 1 && active.number !== 9 && (
                  <p
                    className="arabic mb-6 text-center text-2xl text-primary"
                    dir="rtl"
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                )}
                <ol className="space-y-5">
                  {detail.arabic.map((a, i) => (
                    <li key={a.number} className="rounded-2xl border border-border/60 bg-card px-4 py-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                          {a.numberInSurah}
                        </span>
                      </div>
                      <p
                        className="arabic mb-3 text-right text-2xl leading-loose text-foreground"
                        dir="rtl"
                      >
                        {a.text}
                      </p>
                      {detail.translation[i] && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {detail.translation[i].text}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                  Translation: {currentTrans?.label} · {currentTrans?.note}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Language picker */}
      {showLangPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLangPicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-5"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Translation</h2>
              <button
                onClick={() => setShowLangPicker(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              All translations below are public-domain or freely permitted.
            </p>
            <ul className="grid gap-1.5">
              {TRANSLATIONS.map((t) => {
                const active = trans === t.id;
                return (
                  <li key={t.id}>
                    <button
                      data-testid={`trans-${t.id}`}
                      onClick={() => {
                        setTrans(t.id);
                        setPreferredTranslation(t.id);
                        setShowLangPicker(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 text-left transition-smooth",
                        active
                          ? "border-primary/60 bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {t.language} · {t.note}
                        </p>
                      </div>
                      {active && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                          ON
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Sources note */}
      <div className="mx-5 mb-4 mt-2 flex items-start gap-2 rounded-2xl border border-border/60 bg-card/60 p-3 text-[11px] text-muted-foreground">
        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
        <p>
          Arabic: Tanzil (Uthmani). Translations: public domain / freely permitted.
          Recitation: Mishary Alafasy via mp3quran.net (charity).
        </p>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying((p) => p)}
        preload="none"
      />
    </div>
  );
}
