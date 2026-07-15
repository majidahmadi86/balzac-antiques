"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import type { ProductFormState } from "./actions";

export type CategoryOption = { id: number; labelEn: string };

export type SpecInput = {
  labelEn: string;
  valueEn: string;
  labelFr: string;
  valueFr: string;
};

export type ProductFormValues = {
  titleEn: string;
  titleFr: string;
  eyebrow: string;
  slug: string;
  categoryId: number | "";
  priceEur: string;
  descriptionEn: string;
  descriptionFr: string;
  origin: string;
  year: string;
  condition: string;
  dimensions: string;
  published: boolean;
  featured: boolean;
  specs: SpecInput[];
};

const inputCls =
  "w-full border border-[#D8CFBB] bg-white px-3.5 py-2.5 text-[14px] text-[#1F1B16] outline-none transition-colors focus:border-[#B99A5B]";
const labelCls = "block text-[10px] tracking-[0.22em] uppercase text-[#6B6154] mb-1.5";
const frTag = <span className="ml-1.5 normal-case tracking-normal text-[#B99A5B]">FR · optional</span>;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 mt-10 first:mt-0">
      <h2 className="font-serif text-[18px] text-[#1F1B16]">{children}</h2>
      <div className="mt-2 h-px w-8 bg-[#B99A5B]/60" />
    </div>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#1F1B16] px-8 py-3.5 text-[11px] tracking-[0.28em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A] disabled:opacity-60"
    >
      {pending ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
    </button>
  );
}

export default function ProductForm({
  action,
  categories,
  initial,
  isNew,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: CategoryOption[];
  initial: ProductFormValues;
  isNew: boolean;
}) {
  const [state, formAction] = useFormState(action, null);
  const [specs, setSpecs] = useState<Array<SpecInput & { key: number }>>(
    initial.specs.length > 0
      ? initial.specs.map((s, i) => ({ ...s, key: i }))
      : [{ labelEn: "", valueEn: "", labelFr: "", valueFr: "", key: 0 }]
  );
  const [nextKey, setNextKey] = useState(initial.specs.length > 0 ? initial.specs.length : 1);

  function addSpec() {
    setSpecs((rows) => [...rows, { labelEn: "", valueEn: "", labelFr: "", valueFr: "", key: nextKey }]);
    setNextKey((k) => k + 1);
  }

  function removeSpec(key: number) {
    setSpecs((rows) => rows.filter((r) => r.key !== key));
  }

  function updateSpec(key: number, field: keyof SpecInput, value: string) {
    setSpecs((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  return (
    <form action={formAction} className="max-w-3xl">
      {state?.error && (
        <p role="alert" className="mb-8 border border-[#C9A35C]/40 bg-[#F4E9D4] px-4 py-3 text-[13px] leading-relaxed text-[#6B5326]">
          {state.error}
        </p>
      )}

      <SectionTitle>Essentials</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelCls}>Title · English</span>
          <input name="titleEn" defaultValue={initial.titleEn} required maxLength={200} className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>Title {frTag}</span>
          <input name="titleFr" defaultValue={initial.titleFr} maxLength={200} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Category</span>
          <select name="categoryId" defaultValue={initial.categoryId === "" ? "" : String(initial.categoryId)} required className={inputCls}>
            <option value="" disabled>
              Choose…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.labelEn}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Price · EUR</span>
          <input name="priceEur" defaultValue={initial.priceEur} required inputMode="decimal" placeholder="e.g. 1250 or 269.99" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Eyebrow <span className="ml-1.5 normal-case tracking-normal text-[#9A8F7D]">small line above the title</span></span>
          <input name="eyebrow" defaultValue={initial.eyebrow} placeholder="e.g. Serge Gainsbourg · 1971" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>URL Slug <span className="ml-1.5 normal-case tracking-normal text-[#9A8F7D]">leave blank to generate from the title</span></span>
          <input name="slug" defaultValue={initial.slug} className={inputCls} />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" name="published" defaultChecked={initial.published} className="h-4 w-4 accent-[#1F1B16]" />
          <span className="text-[12px] tracking-[0.08em] text-[#1F1B16]">Published <span className="text-[#9A8F7D]">· visible on the site</span></span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="h-4 w-4 accent-[#1F1B16]" />
          <span className="text-[12px] tracking-[0.08em] text-[#1F1B16]">Hero <span className="text-[#9A8F7D]">· in the homepage slideshow (max 5)</span></span>
        </label>
      </div>

      <SectionTitle>Description</SectionTitle>
      <div className="grid gap-5">
        <label className="block">
          <span className={labelCls}>Description · English</span>
          <textarea name="descriptionEn" defaultValue={initial.descriptionEn} required rows={6} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Description {frTag}</span>
          <textarea name="descriptionFr" defaultValue={initial.descriptionFr} rows={6} className={inputCls} />
        </label>
      </div>

      <SectionTitle>Details</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Origin</span>
          <input name="origin" defaultValue={initial.origin} placeholder="e.g. France" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Year</span>
          <input name="year" defaultValue={initial.year} placeholder="e.g. 1971 or c. 1850" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Condition</span>
          <input name="condition" defaultValue={initial.condition} placeholder="e.g. Very good vintage condition" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Dimensions</span>
          <input name="dimensions" defaultValue={initial.dimensions} placeholder="e.g. 31 × 31 cm" className={inputCls} />
        </label>
      </div>

      <SectionTitle>Specifications</SectionTitle>
      <p className="-mt-3 mb-5 text-[13px] leading-relaxed text-[#6B6154]">
        Label and value pairs shown on the product page, in order. English is required per row; French is optional.
      </p>
      <div className="grid gap-4">
        {specs.map((row, i) => (
          <div key={row.key} className="border border-[#E4DCCB] bg-white/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#9A8F7D]">Specification {i + 1}</span>
              <button
                type="button"
                onClick={() => removeSpec(row.key)}
                className="text-[10px] tracking-[0.2em] uppercase text-[#8A5A3C] transition-colors hover:text-[#5F3A22]"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="specLabelEn"
                value={row.labelEn}
                onChange={(e) => updateSpec(row.key, "labelEn", e.target.value)}
                placeholder="Label · EN, e.g. Movement"
                className={inputCls}
              />
              <input
                name="specValueEn"
                value={row.valueEn}
                onChange={(e) => updateSpec(row.key, "valueEn", e.target.value)}
                placeholder="Value · EN, e.g. Manual winding"
                className={inputCls}
              />
              <input
                name="specLabelFr"
                value={row.labelFr}
                onChange={(e) => updateSpec(row.key, "labelFr", e.target.value)}
                placeholder="Label · FR, optional"
                className={inputCls}
              />
              <input
                name="specValueFr"
                value={row.valueFr}
                onChange={(e) => updateSpec(row.key, "valueFr", e.target.value)}
                placeholder="Value · FR, optional"
                className={inputCls}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSpec}
        className="mt-4 border border-[#D8CFBB] bg-white px-5 py-2.5 text-[10px] tracking-[0.24em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
      >
        + Add Specification
      </button>

      <div className="sticky bottom-0 z-10 mt-12 -mx-4 flex items-center gap-6 border-t border-[#E4DCCB] bg-[#F7F3EA]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
        <SubmitButton isNew={isNew} />
        <Link href="/admin/products" className="text-[11px] tracking-[0.22em] uppercase text-[#6B6154] transition-colors hover:text-[#1F1B16]">
          Cancel
        </Link>
      </div>
    </form>
  );
}
