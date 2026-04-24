import { Flame, Trophy } from "lucide-react";
import type { ReactNode } from "react";

export function StreakBanner({
  current,
  longest,
}: {
  current: number;
  longest: number;
}) {
  return (
    <div className="relative mx-5 overflow-hidden rounded-3xl border border-primary/30 p-5 shadow-soft">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-primary)", opacity: 0.95 }}
      />
      <div
        aria-hidden
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-gold/30 blur-2xl"
      />

      <div className="relative flex items-center justify-between">
        <Stat
          icon={<Flame className="h-5 w-5" />}
          label="Current streak"
          value={`${current} ${current === 1 ? "day" : "days"}`}
        />
        <div className="h-12 w-px bg-primary-foreground/20" />
        <Stat
          icon={<Trophy className="h-5 w-5 text-gold" />}
          label="Longest"
          value={`${longest} ${longest === 1 ? "day" : "days"}`}
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-primary-foreground">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider opacity-80">
          {label}
        </p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}
