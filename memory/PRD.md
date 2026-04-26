# Sakeenah Adhkar — APK v2 (Custom adhkar + Backup/Restore)

## Summary
Web app `peaceful-remembrance-main` was converted from TanStack Start SSR → plain Vite SPA → wrapped with Capacitor → built into a real Android APK. v2 adds custom adhkar CRUD, backup/restore, and a fixed bottom nav bar.

## v2 changes (this iteration)
- **Custom adhkar (full CRUD)**: New `/custom` route ("My Adhkar" tab) with bottom-sheet modal form (Arabic, transliteration, translation, count, reference, category chips, "Essential" toggle); add/edit/delete; all stored in `localStorage` under `adhkar:custom`.
- **Backup & Restore**: New section in Settings.
  - **Export** → downloads `sakeenah-backup-YYYY-MM-DD_HHmm.json` containing `{custom, favorites, counts, streak, reminders, theme}` with version + app marker.
  - **Import** → file picker, validates `app=="sakeenah"`, merges custom adhkar (deduped by id), favorites, counts (per-day), streak (max), with success/error feedback.
- **Bottom nav fix**: Now uses `env(safe-area-inset-bottom)` so it sits above Android gesture-bar / iOS home indicator — no more clipping. Added 4th tab "My Adhkar". Tab labels reduced to fit nicely.
- **Reactive data**: `getAdhkarForCategory()` merges built-in + user-added adhkar by category. Custom adhkar tagged with category appear inside Morning/Evening/etc. detail pages too.
- **Favorites**: Now also pulls from custom adhkar.

## APK
- **Download:** https://mobile-apk-gen-5.preview.emergentagent.com/api/download/apk
- **App ID:** `com.sakeenah.adhkar`
- **Size:** 4.1 MB · debug build, unsigned
- **Min Android:** 6.0+

## Backup file format
```json
{
  "app": "sakeenah",
  "version": 1,
  "exportedAt": "2026-04-26T08:27:00.000Z",
  "data": {
    "custom": [{ "id": "...", "arabic": "...", "category": "morning", ... }],
    "favorites": ["id1", "id2"],
    "counts": { "2026-04-26": { "id": 5 } },
    "streak": { "current": 5, "longest": 12, "lastDay": "..." },
    "reminders": { ... },
    "theme": "dark"
  }
}
```

## Files modified / added
- `src/lib/storage.ts` — added CustomAdhkar CRUD + exportBackup/downloadBackup/importBackup
- `src/data/adhkar.ts` — added "custom" category meta + `getAdhkarForCategory()`
- `src/components/AppShell.tsx` — fixed safe-area-inset, added "My Adhkar" tab
- `src/routes/custom.tsx` — NEW route, full CRUD UI with bottom-sheet modal
- `src/routes/settings.tsx` — added Backup & Restore section
- `src/routes/category.$category.tsx` — merges custom adhkar
- `src/routes/favorites.tsx` — includes custom favorites
- `src/routes/index.tsx` — filters "custom" from home category cards (it's a tab now)
