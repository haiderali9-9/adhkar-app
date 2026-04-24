import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
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

  const categories = Object.keys(categoryMeta) as AdhkarCategory[];
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
