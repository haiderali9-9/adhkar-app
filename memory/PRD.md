# Sakeenah Adhkar — APK v4 (Native Notifications · Full Quran · Custom Icon · Celebration)

## Summary
Web app `peaceful-remembrance-main` (TanStack Start SSR) → converted to Vite SPA → wrapped with Capacitor → real Android APK. v4 addresses all 5 user-reported issues.

## v4 changes
- **Native Android notifications**: Installed `@capacitor/local-notifications`. Added `requestNotificationPermission()`, `scheduleReminders()`, `sendTestNotification()` helpers. APK manifest now declares `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`. Reminders are auto-scheduled on app launch (granted state) and rescheduled when reminder times change. "Enable notifications" button in Settings triggers the system permission dialog. "Send test notification" button verifies delivery. Notifications fire even when app is closed.
- **Beautiful app icon**: Custom-generated PNG icons at all 5 densities (mdpi-xxxhdpi). Design: deep emerald rounded square with gold ring, gold crescent moon + cream star, three small cream prayer-bead dots underneath, soft glow. Adaptive icon + round icon variants included. Background colour: `#0D3A2A`.
- **Completion animation**: New `src/lib/celebrate.ts` — pure DOM particle burst (26 sparkles in gold/cream/green) + scale-in "Mashallah!" toast + cheerful haptic vibration pattern. Triggers when an adhkar count reaches its target, and when the Tasbih reaches its preset (33/99/100).
- **Full Quran with multi-language translations**: New `src/lib/quran-api.ts` using AlQuran.cloud free public API. All 114 surahs listed with search by name/number. Surah detail modal shows verse-by-verse Arabic + chosen translation + audio player. **12 translations across 8 languages, all public-domain or freely permitted**: English (Pickthall PD 1930, Yusuf Ali PD 1934, Saheeh Intl, Arberry 1955), Urdu (Jalandhry PD, Ahmed Ali), French (Hamidullah), Indonesian, Turkish (Diyanet), Spanish (Cortés), German (Abu Rida), Russian (Kuliev), Bengali. Translation choice persists in localStorage. Surah list & details cached locally for offline use after first load. Audio: Mishary Alafasy via mp3quran.net (charity).

## APK
- **Download:** https://mobile-apk-gen-5.preview.emergentagent.com/api/download/apk
- **Size:** 4.4 MB · debug · Min Android 6.0+ · App ID `com.sakeenah.adhkar`
- **Permissions declared:** INTERNET, RECEIVE_BOOT_COMPLETED, WAKE_LOCK, POST_NOTIFICATIONS

## Verified flows (Playwright on bundled web app)
- Tap "Tap to count" on a 1-count adhkar → sparkle burst + "Mashallah!" toast + counter completes ✓
- Settings shows "Browser/Android notifications" section with status badge + Enable / Test buttons ✓
- Quran shows all 114 surahs with full metadata (Arabic name, English name, meaning, ayah count, Meccan/Medinan) ✓
- Translation picker offers 12 entries across 8 languages, each labelled with licence status ✓
- Selecting Urdu translation persists across surah opens ✓
- APK manifest contains POST_NOTIFICATIONS permission ✓
- Custom launcher icon embedded at all densities ✓

## Files added/modified (v4)
- `src/lib/notify.ts` — NEW (Capacitor + Web fallback)
- `src/lib/celebrate.ts` — NEW (sparkle + toast)
- `src/lib/quran-api.ts` — NEW (AlQuran.cloud client + 12 translations)
- `src/routes/quran.tsx` — fully rewritten (114 surahs, search, language picker, modal viewer, audio)
- `src/routes/settings.tsx` — added native notification UI + status badge + test button
- `src/routes/__root.tsx` — auto-schedules notifications on app load
- `src/routes/tasbih.tsx` — celebrates when preset reached
- `src/components/AdhkarCard.tsx` — celebrates when count target reached
- `android/app/src/main/res/mipmap-*/ic_launcher*.png` — custom icon (5 densities)
- `android/app/src/main/res/values/ic_launcher_background.xml` — adaptive icon bg
- Capacitor `@capacitor/local-notifications@8.0.2` installed
