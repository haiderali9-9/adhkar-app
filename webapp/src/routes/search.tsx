import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import { AdhkarCard } from "@/components/AdhkarCard";
import {
  adhkarData,
  categoryMeta,
  type Adhkar,
  type AdhkarCategory,
} from "@/data/adhkar";
import { getCustomAdhkar } from "@/lib/storage";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

type IndexedAdhkar = Adhkar & {
  _category: AdhkarCategory | "custom";
};

function SearchPage() {
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);
  const [allItems, setAllItems] = useState<IndexedAdhkar[]>([]);

  useEffect(() => {
    const items: IndexedAdhkar[] = [];
    for (const [cat, list] of Object.entries(adhkarData) as [
      AdhkarCategory,
      Adhkar[]
    ][]) {
      for (const a of list) items.push({ ...a, _category: cat });
    }
    for (const c of getCustomAdhkar()) {
      items.push({ ...c, _category: (c.category ?? "custom") as AdhkarCategory });
    }
    setAllItems(items);
  }, [tick]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [] as IndexedAdhkar[];
    return allItems.filter((a) => {
      const hay = `${a.arabic} ${a.transliteration} ${a.translation} ${a.reference}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q, allItems]);

  return (
    <div data-testid="search-page">
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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search across Arabic, transliteration, translation & sources
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            data-testid="search-input"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try ‘Allah’, ‘subhan’, ‘Bukhari’…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <div className="px-5 pb-2">
        {q.trim() === "" ? (
          <p
            data-testid="search-hint"
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            Start typing to find adhkar across all categories.
          </p>
        ) : results.length === 0 ? (
          <p
            data-testid="search-empty"
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            No matches for “{q}”.
          </p>
        ) : (
          <>
            <p
              className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground"
              data-testid="search-count"
            >
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-4">
              {results.map((a, i) => (
                <div key={a.id}>
                  <p className="mb-1 px-1 text-[10px] uppercase tracking-wider text-gold">
                    {categoryMeta[a._category as AdhkarCategory]?.title ??
                      "My Adhkar"}
                  </p>
                  <AdhkarCard
                    adhkar={a}
                    index={i}
                    onChange={() => setTick((t) => t + 1)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
