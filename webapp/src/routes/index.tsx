import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, BookOpen, CircleDot, Compass } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { StreakBanner } from "@/components/StreakBanner";
import { adhkarData, categoryMeta, type AdhkarCategory } from "@/data/adhkar";
import { getTodayCounts, getStreak } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sakeenah — Daily Adhkar" },
      {
        name: "description",
        content:
          "Your daily Islamic remembrance: morning, evening, after salah, and sleep adhkar with progress tracking.",
      },
      { property: "og:title", content: "Sakeenah — Daily Adhkar" },
      {
        property: "og:description",
        content:
          "A calm, beautiful companion for your daily adhkar with streaks and reminders.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    setCounts(getTodayCounts());
    const s = getStreak();
    setStreak({ current: s.current, longest: s.longest });
  }, []);

  const categories = (Object.keys(categoryMeta) as AdhkarCategory[]).filter(
    (c) => c !== "custom"
  );
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 20) return "Good evening";
    return "Peaceful night";
  })();

  return (
    <div>
      <header className="px-5 pt-10 pb-5">
        <p className="text-xs font-medium uppercase tracking-widest text-gold">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {greeting}
        </h1>
        <p className="arabic mt-1 text-2xl text-primary" dir="rtl">
          بسم الله الرحمن الرحيم
        </p>
      </header>

      <StreakBanner current={streak.current} longest={streak.longest} />

      {/* Quick access tiles */}
      <div className="px-5 pt-5">
        <div className="grid grid-cols-4 gap-2">
          <Link
            to="/search"
            data-testid="home-search-tile"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-2.5 transition-smooth hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <Search className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium text-foreground">Search</span>
          </Link>
          <Link
            to="/quran"
            data-testid="home-quran-tile"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-2.5 transition-smooth hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <BookOpen className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium text-foreground">Quran</span>
          </Link>
          <Link
            to="/prayer-times"
            data-testid="home-prayer-tile"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-2.5 transition-smooth hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <Compass className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium text-foreground">Prayer</span>
          </Link>
          <Link
            to="/tasbih"
            data-testid="home-tasbih-tile"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-border/70 bg-card p-2.5 transition-smooth hover:border-primary/40 hover:bg-card/80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <CircleDot className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-medium text-foreground">Tasbih</span>
          </Link>
        </div>
      </div>

      <div className="px-5 pt-7">
        <div className="divider-ornament mb-4">
          <span className="arabic text-sm" dir="rtl">
            الأذكار
          </span>
        </div>

        <div className="grid gap-3">
          {categories.map((cat) => {
            const items = adhkarData[cat];
            const total = items.length;
            const completed = items.filter(
              (a) => (counts[a.id] ?? 0) >= a.count
            ).length;
            return (
              <CategoryCard
                key={cat}
                category={cat}
                progress={completed}
                total={total}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
