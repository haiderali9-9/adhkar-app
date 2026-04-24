import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { AdhkarCard } from "@/components/AdhkarCard";
import {
  adhkarData,
  categoryMeta,
  type AdhkarCategory,
} from "@/data/adhkar";
import { getTodayCounts } from "@/lib/storage";

const validCategories = new Set(Object.keys(categoryMeta));

export const Route = createFileRoute("/category/$category")({
  head: ({ params }) => {
    const cat = params.category as AdhkarCategory;
    const meta = categoryMeta[cat];
    const title = meta ? `${meta.title} Adhkar — Sakeenah` : "Adhkar — Sakeenah";
    const description = meta
      ? `${meta.description}. Authentic ${meta.title.toLowerCase()} adhkar with Arabic, transliteration, translation, and source.`
      : "Daily Islamic adhkar.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="px-5 pt-20 text-center">
      <p className="text-muted-foreground">Category not found.</p>
      <Link to="/" className="mt-4 inline-block text-primary">
        Go home
      </Link>
    </div>
  ),
});

function CategoryPage() {
  const { category } = useParams({ from: "/category/$category" });
  const [tick, setTick] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(getTodayCounts());
  }, [tick]);

  if (!validCategories.has(category)) {
    return (
      <div className="px-5 pt-20 text-center">
        <p className="text-muted-foreground">Unknown category.</p>
        <Link to="/" className="mt-4 inline-block text-primary">
          Go home
        </Link>
      </div>
    );
  }

  const cat = category as AdhkarCategory;
  const meta = categoryMeta[cat];
  const items = adhkarData[cat];
  const completed = items.filter((a) => (counts[a.id] ?? 0) >= a.count).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div>
      <header className="px-5 pt-8 pb-4">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-smooth hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <p className="arabic text-3xl text-primary" dir="rtl">
          {meta.arabicTitle}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>

        {/* Progress */}
        <div className="mt-5 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Today's progress
            </span>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {completed}/{items.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-smooth"
              style={{
                width: `${pct}%`,
                background:
                  pct >= 100
                    ? "var(--gradient-gold)"
                    : "var(--gradient-primary)",
              }}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-4 px-5 pt-2">
        {items.map((a, i) => (
          <AdhkarCard
            key={a.id}
            adhkar={a}
            index={i}
            onChange={() => setTick((t) => t + 1)}
          />
        ))}
      </div>
    </div>
  );
}
