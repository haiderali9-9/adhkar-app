import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, BookmarkPlus, Star } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { AdhkarCard } from "@/components/AdhkarCard";
import { categoryMeta, type AdhkarCategory } from "@/data/adhkar";
import {
  getCustomAdhkar,
  addCustomAdhkar,
  updateCustomAdhkar,
  deleteCustomAdhkar,
  type CustomAdhkar,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/custom")({
  component: CustomPage,
});

const CATEGORY_OPTIONS: { value: AdhkarCategory; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "after-salah", label: "After Salah" },
  { value: "sleep", label: "Before Sleep" },
  { value: "general", label: "General" },
  { value: "custom", label: "My Adhkar" },
];

type FormState = {
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  count: number;
  category: AdhkarCategory;
  important: boolean;
};

const EMPTY_FORM: FormState = {
  arabic: "",
  transliteration: "",
  translation: "",
  reference: "Personal",
  count: 1,
  category: "custom",
  important: false,
};

function CustomPage() {
  const [list, setList] = useState<CustomAdhkar[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setList(getCustomAdhkar());
  }, [tick]);

  const openNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: CustomAdhkar) => {
    setEditId(item.id);
    setForm({
      arabic: item.arabic,
      transliteration: item.transliteration,
      translation: item.translation,
      reference: item.reference,
      count: item.count,
      category: (item.category ?? "custom") as AdhkarCategory,
      important: !!item.important,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.arabic.trim() && !form.translation.trim()) return;
    const payload = {
      arabic: form.arabic.trim(),
      transliteration: form.transliteration.trim(),
      translation: form.translation.trim(),
      reference: form.reference.trim() || "Personal",
      count: Math.max(1, Math.min(1000, Number(form.count) || 1)),
      category: form.category,
      important: form.important,
    };
    if (editId) {
      updateCustomAdhkar(editId, payload);
    } else {
      addCustomAdhkar(payload);
    }
    setTick((t) => t + 1);
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Delete this dhikr? This will also remove it from favorites and counts."
      )
    ) {
      deleteCustomAdhkar(id);
      setTick((t) => t + 1);
    }
  };

  return (
    <div>
      <PageHeader
        arabicTitle="أذكاري"
        title="My Adhkar"
        subtitle="Adhkar you've added yourself"
      />

      <div className="px-5 pb-4">
        <button
          data-testid="add-custom-adhkar-btn"
          onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add new dhikr
        </button>
      </div>

      <div className="px-5">
        {list.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <BookmarkPlus className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">
              No custom adhkar yet
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Tap "Add new dhikr" to create your own. They'll appear here and
              inside the category you choose.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {list.map((a, i) => (
              <div key={a.id} className="relative">
                <AdhkarCard
                  adhkar={a}
                  index={i}
                  onChange={() => setTick((t) => t + 1)}
                />
                <div className="absolute right-3 top-3 flex gap-1">
                  <button
                    onClick={() => openEdit(a)}
                    aria-label="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-soft backdrop-blur transition-smooth hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-soft backdrop-blur transition-smooth hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 px-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  In: {categoryMeta[(a.category ?? "custom") as AdhkarCategory]?.title ?? "My Adhkar"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeForm}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="animate-fade-up max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-background p-5 shadow-soft"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editId ? "Edit dhikr" : "New dhikr"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Arabic" hint="The dhikr text">
                <textarea
                  data-testid="custom-arabic-input"
                  value={form.arabic}
                  onChange={(e) => setForm({ ...form, arabic: e.target.value })}
                  dir="rtl"
                  rows={3}
                  className="arabic w-full rounded-xl border border-border bg-card px-3 py-2.5 text-right text-lg leading-loose text-foreground focus:border-primary focus:outline-none"
                  placeholder="سُبْحَانَ اللَّهِ"
                />
              </Field>

              <Field label="Transliteration" hint="Latin script (optional)">
                <input
                  data-testid="custom-transliteration-input"
                  value={form.transliteration}
                  onChange={(e) =>
                    setForm({ ...form, transliteration: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm italic text-foreground focus:border-primary focus:outline-none"
                  placeholder="Subḥān Allāh"
                />
              </Field>

              <Field label="Translation" hint="Meaning in your language">
                <textarea
                  data-testid="custom-translation-input"
                  value={form.translation}
                  onChange={(e) =>
                    setForm({ ...form, translation: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Glory be to Allah"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Count" hint="Times to recite">
                  <input
                    data-testid="custom-count-input"
                    type="number"
                    min={1}
                    max={1000}
                    value={form.count}
                    onChange={(e) =>
                      setForm({ ...form, count: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </Field>

                <Field label="Reference" hint="Source (optional)">
                  <input
                    data-testid="custom-reference-input"
                    value={form.reference}
                    onChange={(e) =>
                      setForm({ ...form, reference: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Bukhari 6406"
                  />
                </Field>
              </div>

              <Field label="Category" hint="Where to show this dhikr">
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: opt.value })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
                        form.category === opt.value
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, important: !form.important })
                }
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left"
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-smooth",
                    form.important
                      ? "fill-gold text-gold"
                      : "text-muted-foreground"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Mark as essential
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Highlights this dhikr with a gold badge
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    form.important ? "text-gold" : "text-muted-foreground"
                  )}
                >
                  {form.important ? "ON" : "OFF"}
                </span>
              </button>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="save-custom-adhkar-btn"
                className="flex-[1.5] rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth active:scale-[0.98]"
              >
                {editId ? "Save changes" : "Add dhikr"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-muted-foreground/70">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}
