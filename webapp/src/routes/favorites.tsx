import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AdhkarCard } from "@/components/AdhkarCard";
import { adhkarData, type Adhkar } from "@/data/adhkar";
import { getFavorites } from "@/lib/storage";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — Sakeenah" },
      {
        name: "description",
        content: "Your saved adhkar for quick daily access.",
      },
      { property: "og:title", content: "Favorites — Sakeenah" },
      {
        property: "og:description",
        content: "Your saved adhkar for quick daily access.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const [favs, setFavs] = useState<Adhkar[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ids = new Set(getFavorites());
    const all: Adhkar[] = [];
    for (const list of Object.values(adhkarData)) {
      for (const item of list) {
        if (ids.has(item.id)) all.push(item);
      }
    }
    setFavs(all);
  }, [tick]);

  return (
    <div>
      <PageHeader
        arabicTitle="المفضلة"
        title="Favorites"
        subtitle="Your saved adhkar"
      />

      <div className="px-5">
        {favs.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">
              No favorites yet
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Tap the heart on any dhikr to save it here for quick access.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-2xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Browse adhkar
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {favs.map((a, i) => (
              <AdhkarCard
                key={a.id}
                adhkar={a}
                index={i}
                onChange={() => setTick((t) => t + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
