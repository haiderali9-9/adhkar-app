import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Pause, BookOpen, Share2 } from "lucide-react";
import { shortSurahs, type Surah } from "@/data/quran";
import { cn } from "@/lib/utils";
import { shareText } from "@/lib/share";

export const Route = createFileRoute("/quran")({
  component: QuranPage,
});

function QuranPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlay = (s: Surah) => {
    if (!audioRef.current) return;
    if (playing === s.id) {
      audioRef.current.pause();
      setPlaying(null);
      return;
    }
    audioRef.current.src = s.audioUrl;
    audioRef.current.play().then(
      () => setPlaying(s.id),
      () => {
        // Failed (network/format) — surface to user
        setPlaying(null);
        alert(
          "Couldn't load audio. Please check your internet connection and try again."
        );
      }
    );
  };

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
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <p className="arabic text-3xl text-primary" dir="rtl">
          القرآن الكريم
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Quranic Verses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Short surahs with recitation by Mishary Alafasy
        </p>
      </header>

      <div className="px-5 pb-2">
        <div className="grid gap-3">
          {shortSurahs.map((s) => {
            const open = activeId === s.id;
            const isPlaying = playing === s.id;
            return (
              <article
                key={s.id}
                className={cn(
                  "overflow-hidden rounded-3xl border bg-card transition-smooth",
                  open ? "border-primary/40 shadow-soft" : "border-border/70"
                )}
              >
                <button
                  data-testid={`surah-row-${s.id}`}
                  onClick={() => setActiveId(open ? null : s.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                    {s.id}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {s.transliteration}
                      </h3>
                      <span
                        className="arabic text-base text-muted-foreground"
                        dir="rtl"
                      >
                        {s.arabicName}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {s.meaning} · {s.ayahCount} verses
                    </p>
                  </div>
                  <div
                    role="button"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(s);
                    }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-smooth cursor-pointer",
                      isPlaying
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-[1px]" />
                    )}
                  </div>
                </button>

                {open && (
                  <div className="border-t border-border/60 px-5 pb-5 pt-3">
                    <p
                      className="arabic mb-4 text-right text-2xl leading-loose text-foreground"
                      dir="rtl"
                    >
                      {s.arabic}
                    </p>
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      {s.translation}
                    </p>
                    <button
                      onClick={() =>
                        shareText({
                          title: `Surah ${s.transliteration} (${s.arabicName})`,
                          text: `${s.arabic}\n\n${s.translation}\n\n— Surah ${s.transliteration} (${s.meaning}), Quran ${s.id}`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
          <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <p>
            Audio streams from mp3quran.net (Mishary Rashid Alafasy). Internet
            required for first play.
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlaying(null)}
        onPause={() => setPlaying((p) => p)}
        preload="none"
      />
    </div>
  );
}
