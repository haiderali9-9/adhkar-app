import { useState } from "react";
import { Sparkles, BellRing, Heart } from "lucide-react";
import { markOnboarded } from "@/lib/storage";

const slides = [
  {
    icon: Sparkles,
    title: "Welcome",
    arabic: "السلام عليكم",
    body: "A peaceful companion for your daily adhkar — morning, evening, after salah, and before sleep.",
  },
  {
    icon: BellRing,
    title: "Gentle reminders",
    arabic: "تذكير لطيف",
    body: "Set quiet, customizable reminders for each part of your day. Nothing overwhelming.",
  },
  {
    icon: Heart,
    title: "Build a streak",
    arabic: "استمرار",
    body: "Tap to count, save your favorites, and watch your daily consistency grow.",
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const slide = slides[i];
  const Icon = slide.icon;
  const last = i === slides.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="animate-fade-up mb-8 flex h-24 w-24 items-center justify-center rounded-full gradient-primary shadow-glow">
          <Icon className="h-10 w-10 text-primary-foreground" strokeWidth={1.6} />
        </div>
        <p className="arabic mb-3 text-3xl text-primary" dir="rtl">
          {slide.arabic}
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          {slide.title}
        </h1>
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
          {slide.body}
        </p>

        <div className="mt-10 flex gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-smooth ${
                idx === i ? "w-8 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-8 pb-10">
        <button
          onClick={() => {
            markOnboarded();
            onDone();
          }}
          className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
        >
          Skip
        </button>
        <button
          onClick={() => {
            if (last) {
              markOnboarded();
              onDone();
            } else setI(i + 1);
          }}
          className="rounded-2xl gradient-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:shadow-glow active:scale-95"
        >
          {last ? "Begin" : "Next"}
        </button>
      </div>
    </div>
  );
}
