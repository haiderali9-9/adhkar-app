import { useState, useEffect } from "react";
import { Heart, RotateCcw, Star } from "lucide-react";
import type { Adhkar } from "@/data/adhkar";
import { cn } from "@/lib/utils";
import {
  getFavorites,
  getTodayCounts,
  incrementCount,
  resetCount,
  toggleFavorite,
  recordActivity,
} from "@/lib/storage";

export function AdhkarCard({
  adhkar,
  index,
  onChange,
}: {
  adhkar: Adhkar;
  index: number;
  onChange?: () => void;
}) {
  const [count, setCount] = useState(0);
  const [fav, setFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setCount(getTodayCounts()[adhkar.id] ?? 0);
    setFav(getFavorites().includes(adhkar.id));
  }, [adhkar.id]);

  const complete = count >= adhkar.count;
  const pct = Math.min(100, (count / adhkar.count) * 100);

  const handleTap = () => {
    if (complete) return;
    const next = incrementCount(adhkar.id, adhkar.count);
    setCount(next);
    setPulse(true);
    setTimeout(() => setPulse(false), 320);
    if (next > 0) recordActivity();
    onChange?.();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetCount(adhkar.id);
    setCount(0);
    onChange?.();
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = toggleFavorite(adhkar.id);
    setFav(list.includes(adhkar.id));
  };

  return (
    <article
      className={cn(
        "animate-fade-up group relative overflow-hidden rounded-3xl border bg-card p-5 shadow-soft transition-smooth",
        complete
          ? "border-gold/50 bg-gradient-to-br from-card to-gold/5"
          : "border-border/70"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          {adhkar.important && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">
              <Star className="h-3 w-3 fill-current" />
              Essential
            </span>
          )}
        </div>
        <button
          onClick={handleFav}
          aria-label={fav ? "Remove favorite" : "Add favorite"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-smooth hover:bg-muted hover:text-destructive"
        >
          <Heart
            className={cn("h-4 w-4 transition-smooth", fav && "fill-destructive text-destructive")}
          />
        </button>
      </div>

      {/* Arabic */}
      <p
        className="arabic mb-4 text-right text-2xl leading-loose text-foreground"
        dir="rtl"
      >
        {adhkar.arabic}
      </p>

      {/* Transliteration */}
      <p className="mb-2 text-sm italic text-primary/80">
        {adhkar.transliteration}
      </p>

      {/* Translation */}
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {adhkar.translation}
      </p>

      {/* Reference */}
      <p className="mb-5 text-[11px] uppercase tracking-wider text-gold">
        {adhkar.reference}
      </p>

      {/* Counter */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTap}
          disabled={complete}
          className={cn(
            "relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl px-5 py-4 text-left transition-smooth",
            complete
              ? "cursor-default bg-gold/15 text-gold-foreground"
              : "gradient-primary text-primary-foreground shadow-soft active:scale-[0.98]"
          )}
        >
          {/* Progress fill for incomplete */}
          {!complete && (
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 bg-white/15 transition-smooth"
              style={{ width: `${pct}%` }}
            />
          )}
          <span className="relative text-sm font-medium">
            {complete ? "Completed ✓" : "Tap to count"}
          </span>
          <span
            className={cn(
              "relative flex min-w-[64px] items-center justify-center rounded-xl bg-black/15 px-3 py-1.5 text-lg font-semibold tabular-nums",
              pulse && "animate-count"
            )}
          >
            {count} / {adhkar.count}
          </span>
        </button>

        <button
          onClick={handleReset}
          aria-label="Reset count"
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition-smooth hover:border-primary/40 hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
