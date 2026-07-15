"use client";

// Upload + arrange product photos, mobile-first. Picking photos uploads them
// IMMEDIATELY (no separate Upload press, no Save needed — photos are not part
// of the details form below). Each photo: ← → order, ★ make hero, ↻ rotate,
// Replace in place, ✕ remove. Server does the heavy lifting (sharp).

import { useRef } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { deleteImage, moveImage, rotateImage, replaceImage } from "./images/actions";

export type PhotoRow = { id: number; path: string; alt: string | null };

const iconBtn =
  "flex h-9 min-w-9 items-center justify-center border border-[#D8CFBB] bg-white px-2 text-[13px] leading-none text-[#1F1B16] transition-colors hover:border-[#B99A5B] disabled:opacity-30";

function PickerButton() {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name="photos"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          if (e.currentTarget.files?.length) e.currentTarget.form?.requestSubmit();
        }}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        className="w-full bg-[#1F1B16] px-5 py-3.5 text-[11px] tracking-[0.24em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Uploading & optimising…" : "+ Add Photos"}
      </button>
    </div>
  );
}

function ReplacePicker({ imageId }: { imageId: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form action={replaceImage} className="contents">
      <input type="hidden" name="imageId" value={imageId} />
      <input
        ref={inputRef}
        type="file"
        name="photo"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          if (e.currentTarget.files?.length) e.currentTarget.form?.requestSubmit();
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-9 items-center justify-center border border-[#D8CFBB] bg-white px-2.5 text-[10px] tracking-[0.12em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
        title="Replace this photo"
      >
        Replace
      </button>
    </form>
  );
}

export default function PhotoManager({
  images,
  uploadAction,
  saved,
  error,
}: {
  images: PhotoRow[];
  uploadAction: (formData: FormData) => Promise<void>;
  saved?: string;
  error?: string;
}) {
  return (
    <div id="photos" className="border border-[#E4DCCB] bg-white/70 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#6B6154]">Photos</p>
        <span className="text-[10px] tracking-[0.14em] text-[#9A8F7D]">{images.length} / 5</span>
      </div>

      {error && (
        <p role="alert" className="mt-3 border border-[#C08A6A]/40 bg-[#FBF4EF] px-4 py-3 text-[13px] leading-relaxed text-[#8A5A3C]">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="mt-3 border border-[#B99A5B]/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]">{saved}</p>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((img, i) => (
            <div key={img.id}>
              <div className="relative aspect-square w-full overflow-hidden border border-[#E4DCCB] bg-[#F0EADB]">
                <Image src={img.path} alt={img.alt ?? `Photo ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-0 top-0 bg-[#1F1B16]/85 px-2 py-1 text-[9px] tracking-[0.18em] uppercase text-[#F7F3EA]">
                    Hero
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <form action={moveImage} className="contents">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" name="dir" value="left" disabled={i === 0} className={iconBtn} title="Move earlier" aria-label="Move earlier">
                    &larr;
                  </button>
                  <button type="submit" name="dir" value="right" disabled={i === images.length - 1} className={iconBtn} title="Move later" aria-label="Move later">
                    &rarr;
                  </button>
                  <button type="submit" name="dir" value="cover" disabled={i === 0} className={iconBtn} title="Make hero photo" aria-label="Make hero photo">
                    ★
                  </button>
                </form>
                <form action={rotateImage} className="contents">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" className={iconBtn} title="Rotate 90°" aria-label="Rotate 90 degrees">
                    ↻
                  </button>
                </form>
                <ReplacePicker imageId={img.id} />
                <form action={deleteImage} className="contents">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    type="submit"
                    className="flex h-9 min-w-9 items-center justify-center border border-[#C08A6A]/40 bg-white px-2 text-[13px] leading-none text-[#8A5A3C] transition-colors hover:border-[#8A5A3C]"
                    title="Remove photo"
                    aria-label="Remove photo"
                  >
                    ✕
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={uploadAction} className="mt-5 border-t border-[#E4DCCB] pt-4">
        <PickerButton />
        <p className="mt-3 text-[12px] leading-relaxed text-[#9A8F7D]">
          Photos upload and save INSTANTLY when chosen (the Save button below is only for the text details). JPG, PNG or WebP, up to 15 MB each, 5 per product, optimised automatically. The FIRST photo is the hero: it appears in the collection, at the top of the product page, and in the homepage slideshow. Use ★ to make any photo the hero.
        </p>
      </form>
    </div>
  );
}
