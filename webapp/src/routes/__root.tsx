import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Onboarding } from "@/components/Onboarding";
import { AppShell } from "@/components/AppShell";
import { getTheme, setTheme, isOnboarded, getReminders } from "@/lib/storage";
import { getNotificationStatus, scheduleReminders } from "@/lib/notify";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="arabic text-3xl text-primary mb-2" dir="rtl">
          الصفحة غير موجودة
        </p>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="#/"
          className="mt-6 inline-flex items-center justify-center rounded-2xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Return home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const t = getTheme();
    setTheme(t);
    setShowOnboarding(!isOnboarded());
    setReady(true);
    // Re-schedule daily notifications when app launches (Android can clear them)
    getNotificationStatus().then((p) => {
      if (p === "granted") {
        scheduleReminders(getReminders()).catch(() => undefined);
      }
    });
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (showOnboarding) {
    return <Onboarding onDone={() => setShowOnboarding(false)} />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
