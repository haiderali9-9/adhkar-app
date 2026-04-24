import { Link } from "@tanstack/react-router";
import { Sunrise, Sunset, MoonStar, Bed, Sparkles } from "lucide-react";
import type { AdhkarCategory } from "@/data/adhkar";
import { categoryMeta } from "@/data/adhkar";

const iconMap = {
  sunrise: Sunrise,
  sunset: Sunset,
  "moon-star": MoonStar,
  bed: Bed,
  sparkles: Sparkles,
} as const;

export function CategoryCard({
  category,
  progress,
  total,
}: {
  category: AdhkarCategory;
  progress: number;
  total: number;
}) {
  const meta = categoryMeta[category];
  const Icon = iconMap[meta.icon as keyof typeof iconMap];
  const pct = total === 0 ? 0 : Math.min(100, Math.round((progress / total) * 100));
  const complete = pct >= 100;

  return (
    <Link
      to="/category/$category"
      params={{ category }}
      className="group relative block overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-soft transition-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
    >
      {/* Decorative gradient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-smooth group-hover:opacity-40"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>

        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">
              {meta.title}
            </h3>
            <span
              className="arabic text-base text-muted-foreground"
              dir="rtl"
            >
              {meta.arabicTitle}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {meta.description}
          </p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-smooth"
                style={{
                  width: `${pct}%`,
                  background: complete
                    ? "var(--gradient-gold)"
                    : "var(--gradient-primary)",
                }}
              />
            </div>
            <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
              {progress}/{total}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
