import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Search as SearchIcon,
  X,
  Settings as SettingsIcon,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudMoon,
  Compass,
  Locate,
} from "lucide-react";
import {
  getPrayerTimesByCity,
  getPrayerTimesByCoords,
  getSavedLocation,
  saveLocation,
  getSavedMethod,
  saveMethod,
  getSavedSchool,
  saveSchool,
  cacheToday,
  readCachedToday,
  getCurrentAndNext,
  METHODS,
  PRAYERS,
  type PrayerData,
  type PrayerKey,
  type SavedLocation,
} from "@/lib/prayer-times";
import { POPULAR_CITIES, type City } from "@/data/cities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prayer-times")({
  component: PrayerPage,
});

const PRAYER_META: Record<
  PrayerKey,
  { arabic: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  Fajr: { arabic: "الفجر", icon: Sunrise, tone: "from-indigo-500/20 to-violet-500/10" },
  Sunrise: { arabic: "الشروق", icon: Sun, tone: "from-amber-400/20 to-orange-300/10" },
  Dhuhr: { arabic: "الظهر", icon: Sun, tone: "from-yellow-400/20 to-amber-400/10" },
  Asr: { arabic: "العصر", icon: Sun, tone: "from-orange-500/20 to-amber-500/10" },
  Maghrib: { arabic: "المغرب", icon: Sunset, tone: "from-rose-500/20 to-orange-500/10" },
  Isha: { arabic: "العشاء", icon: Moon, tone: "from-blue-700/30 to-indigo-700/15" },
};

function PrayerPage() {
  const [loc, setLoc] = useState<SavedLocation | null>(getSavedLocation());
  const [method, setMethod] = useState(getSavedMethod());
  const [school, setSchool] = useState<0 | 1>(getSavedSchool());
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCity, setShowCity] = useState(!loc);
  const [showSettings, setShowSettings] = useState(false);
  const [tick, setTick] = useState(0);

  // Live clock for "next prayer in" countdown
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Fetch when location/method/school changes
  useEffect(() => {
    if (!loc) return;
    const cacheKey = `${loc.city}-${loc.country}-${method}-${school}`;
    const cached = readCachedToday(cacheKey);
    if (cached) setData(cached);
    setLoading(true);
    setError(null);
    const fetcher = loc.lat != null && loc.lon != null
      ? getPrayerTimesByCoords(loc.lat, loc.lon, method, school)
      : getPrayerTimesByCity(loc.city, loc.country, method, school);
    fetcher
      .then((d) => {
        setData(d);
        cacheToday(cacheKey, d);
      })
      .catch(() => setError("Couldn't load prayer times. Check your connection."))
      .finally(() => setLoading(false));
  }, [loc, method, school]);

  const useGeolocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available on this device.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: SavedLocation = {
          city: "Current location",
          country: "—",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        saveLocation(next);
        setLoc(next);
        setShowCity(false);
      },
      () => {
        setError("Couldn't get your location. Please pick a city manually.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const cn_currentNext = data
    ? getCurrentAndNext(data.timings)
    : { current: null, next: "Fajr" as PrayerKey, msUntilNext: 0 };

  const minutesLeft = Math.max(0, Math.round(cn_currentNext.msUntilNext / 60000));
  const hoursLeft = Math.floor(minutesLeft / 60);
  const minsLeft = minutesLeft % 60;
  const _ = tick; // re-render every 30s for countdown

  return (
    <div data-testid="prayer-page">
      <header
        className="px-5 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 32px)" }}
      >
        <Link
          to="/"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <p className="arabic text-3xl text-primary" dir="rtl">
          مواقيت الصلاة
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Prayer Times
            </h1>
            <button
              onClick={() => setShowCity(true)}
              data-testid="change-city-btn"
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-gold" />
              {loc ? `${loc.city}${loc.country !== "—" ? `, ${loc.country}` : ""}` : "Pick a city"}
            </button>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            data-testid="prayer-settings-btn"
            aria-label="Calculation method"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="px-5 pb-2">
        {error && !data && (
          <div className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {!loc ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Compass className="h-7 w-7 text-primary" />
            </div>
            <p className="text-base font-medium text-foreground">Pick your city</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Choose a city from the picker, type your own, or use your phone's
              location for the most precise times.
            </p>
            <button
              onClick={() => setShowCity(true)}
              className="mt-5 rounded-2xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Pick a city
            </button>
          </div>
        ) : loading && !data ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Loading prayer times…
          </p>
        ) : data ? (
          <>
            {/* Date + Hijri */}
            <div className="rounded-3xl gradient-primary px-5 py-4 text-primary-foreground shadow-soft">
              <p className="text-[11px] uppercase tracking-widest opacity-80">
                {data.date.gregorian.weekday.en}, {data.date.readable}
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="arabic text-2xl" dir="rtl">
                  {data.date.hijri.day} {data.date.hijri.month.ar} {data.date.hijri.year}
                </p>
                <p className="text-xs opacity-90">
                  {data.date.hijri.month.en} · {data.meta.timezone}
                </p>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80">Next</p>
                  <p className="text-xl font-semibold">
                    {cn_currentNext.next} · {data.timings[cn_currentNext.next].slice(0, 5)}
                  </p>
                </div>
                <p
                  className="text-xs opacity-90 tabular-nums"
                  data-testid="next-prayer-countdown"
                >
                  in {hoursLeft > 0 ? `${hoursLeft}h ` : ""}
                  {minsLeft}m
                </p>
              </div>
            </div>

            {/* Prayer rows */}
            <ul className="mt-4 grid gap-2.5">
              {PRAYERS.map((p) => {
                const time = data.timings[p as PrayerKey].slice(0, 5);
                const meta = PRAYER_META[p as PrayerKey];
                const Icon = meta.icon;
                const active = cn_currentNext.next === p;
                const past = cn_currentNext.current === p;
                return (
                  <li
                    key={p}
                    data-testid={`prayer-row-${p.toLowerCase()}`}
                    className={cn(
                      "relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-card px-4 py-3.5 transition-smooth",
                      active
                        ? "border-primary/60 shadow-soft"
                        : past
                        ? "border-border/40 opacity-70"
                        : "border-border/70"
                    )}
                  >
                    {active && (
                      <div
                        aria-hidden
                        className={cn(
                          "absolute inset-0 -z-10 bg-gradient-to-br",
                          meta.tone
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        active
                          ? "bg-primary/20 text-primary"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            active ? "text-foreground" : "text-foreground"
                          )}
                        >
                          {p}
                        </p>
                        <p className="arabic text-base text-foreground" dir="rtl">
                          {meta.arabic}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {past ? "Passed" : active ? "Up next" : "Coming up"}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "ml-2 shrink-0 text-lg font-semibold tabular-nums",
                        active ? "text-primary" : "text-foreground"
                      )}
                    >
                      {time}
                    </p>
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 flex items-start gap-2 rounded-xl border border-border/60 bg-card/60 p-3 text-[11px] text-muted-foreground">
              <CloudMoon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>
                Method: {METHODS.find((m) => m.id === method)?.name ?? method} ·
                Asr: {school === 1 ? "Hanafi" : "Standard (Shafi'i / Maliki / Hanbali)"} ·
                Source: aladhan.com
              </span>
            </p>
          </>
        ) : null}
      </div>

      {/* City picker bottom-sheet */}
      {showCity && (
        <CityPicker
          onClose={() => setShowCity(false)}
          onPick={(c) => {
            const next: SavedLocation = {
              city: c.city,
              country: c.country,
              countryCode: c.cc,
            };
            saveLocation(next);
            setLoc(next);
            setShowCity(false);
          }}
          onUseLocation={useGeolocation}
        />
      )}

      {/* Method / school */}
      {showSettings && (
        <MethodPicker
          method={method}
          school={school}
          onClose={() => setShowSettings(false)}
          onMethod={(m) => {
            setMethod(m);
            saveMethod(m);
          }}
          onSchool={(s) => {
            setSchool(s);
            saveSchool(s);
          }}
        />
      )}
    </div>
  );
}

function CityPicker({
  onClose,
  onPick,
  onUseLocation,
}: {
  onClose: () => void;
  onPick: (c: City) => void;
  onUseLocation: () => void;
}) {
  const [q, setQ] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [customCountry, setCustomCountry] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return POPULAR_CITIES.slice(0, 60);
    return POPULAR_CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(term) ||
        c.country.toLowerCase().includes(term) ||
        c.cc.toLowerCase().includes(term)
    ).slice(0, 80);
  }, [q]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Choose city</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onUseLocation}
          data-testid="use-location-btn"
          className="mb-3 flex w-full items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
        >
          <Locate className="h-4 w-4" />
          Use my current location (most precise)
        </button>

        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            data-testid="city-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 130+ cities or country code (e.g. PK, EG)…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <ul className="grid gap-1">
          {filtered.map((c) => (
            <li key={`${c.city}-${c.cc}`}>
              <button
                data-testid={`city-${c.cc}-${c.city.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => onPick(c)}
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-2.5 text-left transition-smooth hover:border-primary/40"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{c.city}</p>
                  <p className="text-[11px] text-muted-foreground">{c.country}</p>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                  {c.cc}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No matches. Type your city + country below.
            </p>
          )}
        </ul>

        <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/40 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or enter your own
          </p>
          <input
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="City (e.g. Multan)"
            className="mb-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <input
            value={customCountry}
            onChange={(e) => setCustomCountry(e.target.value)}
            placeholder="Country (e.g. Pakistan)"
            className="mb-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => {
              if (!customCity.trim() || !customCountry.trim()) return;
              onPick({
                city: customCity.trim(),
                country: customCountry.trim(),
                cc: "",
              });
            }}
            data-testid="custom-city-save"
            disabled={!customCity.trim() || !customCountry.trim()}
            className="w-full rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-50"
          >
            Use this city
          </button>
        </div>
      </div>
    </div>
  );
}

function MethodPicker({
  method,
  school,
  onClose,
  onMethod,
  onSchool,
}: {
  method: number;
  school: 0 | 1;
  onClose: () => void;
  onMethod: (m: number) => void;
  onSchool: (s: 0 | 1) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Calculation method</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Asr juristic method
        </p>
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
          <button
            onClick={() => onSchool(0)}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-semibold transition-smooth",
              school === 0
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Standard
          </button>
          <button
            onClick={() => onSchool(1)}
            data-testid="school-hanafi"
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-semibold transition-smooth",
              school === 1
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Hanafi
          </button>
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Calculation authority
        </p>
        <ul className="grid gap-1.5">
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <li key={m.id}>
                <button
                  data-testid={`method-${m.id}`}
                  onClick={() => onMethod(m.id)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left transition-smooth",
                    active
                      ? "border-primary/60 bg-primary/10"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">{m.region}</p>
                  </div>
                  {active && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary">
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
  );
}
