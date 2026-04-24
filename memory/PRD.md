# Peaceful Remembrance (Sakeenah) — APK Delivery

## Summary
User uploaded a web app (`peaceful-remembrance-main`, a React + TanStack Router + Tailwind + Vite Islamic adhkar app called "Sakeenah") and asked for an Android APK.

## Approach
Instead of a native Flutter rewrite (Flutter SDK is not available in this environment and a rewrite would require redoing every screen in Dart), the existing web app was wrapped with **Capacitor** into a native Android project and built into a real APK. The UI/UX is identical to the original web app.

## What was done
- Converted the uploaded app from TanStack **Start SSR** → plain Vite SPA (`index.html` + `main.tsx`, hash history for mobile routing)
- Built the Vite bundle (`/app/webapp/dist`)
- Added Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`), config at `/app/webapp/capacitor.config.ts`
- Scaffolded Android project at `/app/webapp/android` (`npx cap add android`)
- Installed toolchain: JDK 21 (`/app/jdk-21`), Android SDK (`/app/android-sdk`), Build Tools 34, Platform 34
- ARM64 host + x86_64 AAPT2 issue resolved via `qemu-x86_64-static` wrapper
- Built debug APK via Gradle: `/app/apk-output/sakeenah-adhkar.apk` (~4.1 MB)
- Added FastAPI endpoints:
  - `GET /api/download/apk/info` — metadata JSON
  - `GET /api/download/apk` — APK file download
- Added Expo landing screen (`/app/frontend/app/index.tsx`) with app info and "Download APK" button

## APK
- **Download URL:** https://mobile-apk-gen-5.preview.emergentagent.com/api/download/apk
- **App ID:** `com.sakeenah.adhkar`
- **Size:** 4.1 MB
- **Type:** Debug (unsigned — requires "Install from unknown sources" on the phone)
- **Min Android:** 6.0+

## Install steps for user
1. Open the download URL on your Android phone (Chrome).
2. Tap the downloaded `sakeenah-adhkar.apk`.
3. If prompted, enable "Allow from this source" / "Install unknown apps" for your browser.
4. Tap **Install**, then **Open**.
