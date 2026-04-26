// Cross-platform share helper.
// Tries the Web Share API first (works in Capacitor WebView on Android 12+).
// Falls back to copying text to clipboard.

export type ShareInput = {
  title?: string;
  text: string;
  url?: string;
};

export async function shareText(input: ShareInput): Promise<"shared" | "copied" | "failed"> {
  // Try native share
  if (
    typeof navigator !== "undefined" &&
    typeof (navigator as Navigator & { share?: (data: ShareInput) => Promise<void> }).share === "function"
  ) {
    try {
      await (navigator as Navigator & { share: (data: ShareInput) => Promise<void> }).share(input);
      return "shared";
    } catch (e) {
      // User cancelled or blocked — fall through to clipboard
      const err = e as Error;
      if (err && err.name === "AbortError") return "failed";
    }
  }
  // Clipboard fallback
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(
        [input.title, input.text, input.url].filter(Boolean).join("\n")
      );
      try {
        // Light feedback
        if ("vibrate" in navigator) navigator.vibrate?.(20);
      } catch {
        // ignore
      }
      // Surface a tiny toast-style message
      showToast("Copied to clipboard");
      return "copied";
    }
  } catch {
    // ignore
  }
  return "failed";
}

let toastEl: HTMLDivElement | null = null;
let toastTimer: number | null = null;

function showToast(msg: string) {
  if (typeof document === "undefined") return;
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.style.cssText =
      "position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom, 0px));transform:translateX(-50%);background:rgba(13,58,42,0.95);color:#f4ead5;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:0 6px 20px rgba(0,0,0,0.3);z-index:9999;backdrop-filter:blur(8px);transition:opacity 200ms;opacity:0;pointer-events:none;";
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = "1";
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    if (toastEl) toastEl.style.opacity = "0";
  }, 2000);
}
