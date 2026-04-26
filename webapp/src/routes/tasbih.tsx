import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Vibrate } from "lucide-react";
import { cn } from "@/lib/utils";
import { celebrate } from "@/lib/celebrate";

export const Route = createFileRoute("/tasbih")({
  component: TasbihPage,
});

const PRESETS = [33, 99, 100];
const STORAGE_KEY = "adhkar:tasbih";

type State = { count: number; target: number; total: number };

const load = (): State => {
  if (typeof window === "undefined") return { count: 0, target: 33, total: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { count: 0, target: 33, total: 0 };
};

const save = (s: State) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
};

function TasbihPage() {
  const [state, setState] = useState<State>(() => load());
  const [haptic, setHaptic] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    save(state);
  }, [state]);

  const tap = () => {
    setState((s) => {
      const nextCount = s.count + 1;
      const reachedTarget = nextCount >= s.target;
      // Vibrate pattern
      if (haptic && "vibrate" in navigator) {
        try {
          navigator.vibrate(reachedTarget ? [40, 30, 80] : 12);
        } catch {
          // ignore
        }
      }
      if (reachedTarget) {
        celebrate(`${s.target} ✦ Mashallah!`);
      }
      return {
        ...s,
        count: reachedTarget ? 0 : nextCount,
        total: s.total + 1,
      };
    });
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
  };

  const reset = () => {
    setState({ ...state, count: 0 });
  };

  const resetAll = () => {
    if (confirm("Reset total counter to zero?")) {
      setState({ count: 0, target: state.target, total: 0 });
    }
  };

  const setTarget = (t: number) => {
    setState({ ...state, target: t, count: 0 });
  };

  const pct = Math.min(100, (state.count / state.target) * 100);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      data-testid="tasbih-page"
    >
      <div className="px-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-start px-5 pt-4">
        <p className="arabic text-3xl text-primary mb-1" dir="rtl">
          سبحة
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Tasbih Counter
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Tap anywhere on the circle to count
        </p>

        {/* Preset chips */}
        <div className="mt-5 flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              data-testid={`tasbih-preset-${p}`}
              onClick={() => setTarget(p)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-smooth",
                state.target === p
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Big tap circle */}
        <button
          data-testid="tasbih-tap-button"
          onClick={tap}
          className={cn(
            "relative mt-6 flex h-64 w-64 select-none items-center justify-center rounded-full transition-transform active:scale-95",
            pulse && "animate-count"
          )}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--gradient-primary), transparent 70%), var(--gradient-primary)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          {/* Progress ring */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="4"
              className="text-primary-foreground"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-primary-foreground"
              style={{
                strokeDasharray: 2 * Math.PI * 46,
                strokeDashoffset: 2 * Math.PI * 46 * (1 - pct / 100),
                transition: "stroke-dashoffset 200ms",
              }}
            />
          </svg>

          <div className="relative flex flex-col items-center text-primary-foreground">
            <span className="text-7xl font-bold tabular-nums" data-testid="tasbih-count">
              {state.count}
            </span>
            <span className="mt-1 text-xs uppercase tracking-widest opacity-80">
              of {state.target}
            </span>
          </div>
        </button>

        {/* Total + actions */}
        <div className="mt-6 flex w-full max-w-xs items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Lifetime
            </p>
            <p
              className="text-lg font-semibold tabular-nums text-foreground"
              data-testid="tasbih-total"
            >
              {state.total.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHaptic(!haptic)}
              aria-label="Toggle haptic"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-smooth",
                haptic
                  ? "bg-primary/15 text-primary"
                  : "bg-card text-muted-foreground"
              )}
            >
              <Vibrate className="h-4 w-4" />
            </button>
            <button
              data-testid="tasbih-reset-btn"
              onClick={reset}
              aria-label="Reset current count"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={resetAll}
          className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Reset lifetime total
        </button>
      </div>
    </div>
  );
}
