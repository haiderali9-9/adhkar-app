# Sakeenah Adhkar — APK v3 (Search · Share · Quran · Tasbih)

## Summary
Web app `peaceful-remembrance-main` (TanStack Start SSR) → converted to Vite SPA → wrapped with Capacitor → real Android APK. v3 adds the 4 bonus features the user asked for.

## v3 changes (this iteration)
- **Search** — new `/search` route. Searches Arabic, transliteration, translation & reference across all built-in + custom adhkar. Category label shown above each result. Empty / hint / no-match states.
- **Share dhikr** — new share-icon button on every AdhkarCard (next to favorite heart). Uses Web Share API (works in Capacitor WebView on Android 12+) for native WhatsApp / Telegram / Messages share. Falls back to clipboard with toast notification when Share API not available. Same Share button on Quran detail.
- **Quranic verses with audio** — new `/quran` route with 8 curated short surahs (Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kafirun, Al-Kawthar, An-Nasr, Al-Asr). Each row has a play/pause button streaming Mishary Alafasy recitation from `server8.mp3quran.net`. Tap row to expand → full Arabic + English translation + Share button.
- **Tasbih counter** — new `/tasbih` route. Big circular tap target with animated progress ring, presets (33/99/100), session count + lifetime total, haptic feedback toggle (uses `navigator.vibrate`), reset buttons. State persisted in localStorage.
- **Home tiles** — added 3-column quick-access row above category list: Search · Quran · Tasbih.
- **Share helper** — new `src/lib/share.ts` with cross-platform `shareText()` + lightweight toast.

## APK
- **Download:** https://mobile-apk-gen-5.preview.emergentagent.com/api/download/apk
- **Size:** 4.1 MB · debug · Min Android 6.0+ · App ID `com.sakeenah.adhkar`

## Verified flows
- Search "Allah" → 26 results; "subhan" → no matches state ✅
- Quran row tap expands; Arabic for Al-Ikhlas renders correctly; share button visible ✅
- Tasbih: 5 taps → count=5, lifetime=5; preset switch resets count ✅
- Share button on all dhikr cards triggers Web Share API ✅

## Files added/modified (v3)
- `src/data/quran.ts` — NEW (8 surahs metadata + audio URLs)
- `src/lib/share.ts` — NEW (cross-platform share + toast)
- `src/routes/search.tsx` — NEW
- `src/routes/quran.tsx` — NEW
- `src/routes/tasbih.tsx` — NEW
- `src/components/AdhkarCard.tsx` — added share button
- `src/routes/index.tsx` — added quick-access tiles
