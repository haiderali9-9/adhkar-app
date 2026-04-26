/* Lightweight celebration animation — sparkles + Mashallah toast.
   Triggered when a dhikr counter reaches its target. Uses pure DOM,
   so it works without React state plumbing. */

const sparkleColors = ["#d4af5f", "#f4ead5", "#9ae6b4", "#ffd166"];

let active = false;

export function celebrate(message = "Mashallah!") {
  if (typeof document === "undefined" || active) return;
  active = true;

  const root = document.createElement("div");
  root.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden;`;
  document.body.appendChild(root);

  // Toast
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(0.6);
    padding:14px 28px;border-radius:9999px;
    background:linear-gradient(135deg,#0d3a2a,#0d6e4e);
    color:#f4ead5;font-size:18px;font-weight:600;letter-spacing:0.4px;
    box-shadow:0 12px 36px rgba(0,0,0,.35),0 0 0 1px rgba(212,175,95,.4) inset;
    opacity:0;transition:transform 360ms cubic-bezier(.2,1.6,.4,1),opacity 220ms;
    backdrop-filter:blur(6px);text-align:center;
  `;
  root.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%,-50%) scale(1)";
  });

  // Sparkles burst
  const COUNT = 26;
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement("div");
    const size = 6 + Math.random() * 10;
    const color = sparkleColors[i % sparkleColors.length];
    s.style.cssText = `
      position:absolute;left:50%;top:38%;width:${size}px;height:${size}px;
      border-radius:50%;background:${color};
      box-shadow:0 0 ${size}px ${color};
      transform:translate(-50%,-50%);opacity:1;
      transition:transform 900ms cubic-bezier(.2,.8,.4,1),opacity 900ms ease-out;
    `;
    root.appendChild(s);
    const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 140;
    requestAnimationFrame(() => {
      s.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${
        Math.sin(angle) * dist
      }px)) scale(${0.4 + Math.random() * 0.6})`;
      s.style.opacity = "0";
    });
  }

  // Try a cheerful haptic
  try {
    if ("vibrate" in navigator) navigator.vibrate?.([20, 40, 20, 40, 80]);
  } catch {
    // ignore
  }

  // Cleanup
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%,-50%) scale(1.05)";
  }, 1200);
  setTimeout(() => {
    root.remove();
    active = false;
  }, 1700);
}
