import { Link, useLocation } from "@tanstack/react-router";
import { Home, Heart, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto mx-3 mb-3 flex w-full max-w-md items-center justify-around rounded-3xl border border-border/60 bg-card/85 px-2 py-2 shadow-soft backdrop-blur-xl">
          {navItems.map((item) => {
            const active =
              item.to === "/"
                ? loc.pathname === "/"
                : loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-smooth",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-smooth",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  arabicTitle,
  back,
}: {
  title: string;
  subtitle?: string;
  arabicTitle?: string;
  back?: { to: string; label?: string };
}) {
  return (
    <header className="px-5 pt-8 pb-4">
      {back && (
        <Link
          to={back.to}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-smooth hover:text-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {back.label ?? "Back"}
        </Link>
      )}
      {arabicTitle && (
        <p className="arabic text-2xl text-primary mb-1" dir="rtl">
          {arabicTitle}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
