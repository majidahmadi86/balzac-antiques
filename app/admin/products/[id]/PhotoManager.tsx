"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import {
  uploadProductImage,
  deleteProductImage,
  makeCoverPhoto,
  type ImageActionState,
} from "./images/actions";

export type PhotoItem = { id: number; path: string; alt: string | null };

function UploadButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="bg-[#1F1B16] px-5 py-2.5 text-[10px] tracking-[0.24em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A] disabled:opacity-50"
    >
      {pending ? "Uploading…" : "Upload Photo"}
    </button>
  );
}

export default function PhotoManager({
  productId,
  images,
}: {
  productId: string;
  images: PhotoItem[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const uploadWithId = uploadProductImage.bind(null, productId);
  const [state, formAction] = useFormState(uploadWithId, null as ImageActionState);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      setSelectedName(null);
      if (inputRef.current) inputRef.current.value = "";
      startTransition(() => router.refresh());
    }
  }, [state, router]);

  const atCap = images.length >= 5;

  return (
    <div className="border border-[#E4DCCB] bg-white/70 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#6B6154]">Photos</p>
        <p className="text-[12px] tabular-nums text-[#9A8F7D]">
          {images.length} / 5
        </p>
      </div>

      {images.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, index) => (
            <li key={img.id} className="group relative aspect-square overflow-hidden border border-[#E4DCCB] bg-[#F0EADB]">
              <Image
                src={img.path}
                alt={img.alt ?? ""}
                fill
                sizes="160px"
                className="object-cover"
                unoptimized={img.path.startsWith("/uploads/")}
              />
              {index === 0 ? (
                <span className="absolute left-1.5 top-1.5 bg-[#1F1B16]/85 px-1.5 py-0.5 text-[9px] tracking-[0.14em] uppercase text-[#F7F3EA]">
                  Hero
                </span>
              ) : (
                <form action={makeCoverPhoto} className="absolute left-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <input type="hidden" name="productId" value={productId} />
                  <input type="hidden" name="imageId" value={img.id} />
                  <button
                    type="submit"
                    title="Make hero photo"
                    aria-label="Make hero photo"
                    className="bg-[#F7F3EA]/95 px-1.5 py-0.5 text-[12px] text-[#B99A5B] shadow-sm hover:text-[#1F1B16]"
                  >
                    ★
                  </button>
                </form>
              )}
              <form
                action={deleteProductImage}
                className="absolute bottom-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                onSubmit={(e) => {
                  if (!window.confirm("Remove this photo?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="imageId" value={img.id} />
                <button
                  type="submit"
                  className="bg-[#F7F3EA]/95 px-2 py-1 text-[9px] tracking-[0.14em] uppercase text-[#8A5A3C] shadow-sm hover:bg-white"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[13px] text-[#9A8F7D]">No photos yet — upload the first one below.</p>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-[#6B6154]">
        JPG, PNG or WebP, up to 15 MB each, 5 photos per product. Photos are optimised automatically. The FIRST photo is the hero photo: it appears in the collection, at the top of the product page, and in the homepage slideshow. Use ★ to make any photo the hero; the others follow as the gallery, in this order.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={atCap}
          onChange={(e) => setSelectedName(e.target.files?.[0]?.name ?? null)}
          className="block w-full max-w-xs text-[12px] text-[#6B6154] file:mr-3 file:border file:border-[#D8CFBB] file:bg-white file:px-3 file:py-2 file:text-[10px] file:tracking-[0.18em] file:uppercase file:text-[#1F1B16]"
        />
        <UploadButton disabled={atCap || !selectedName} />
      </form>

      {state && "error" in state && state.error ? (
        <p className="mt-3 text-[13px] text-[#8A5A3C]" role="alert">
          {state.error}
        </p>
      ) : null}
      {atCap ? (
        <p className="mt-3 text-[13px] text-[#8A5A3C]">
          This product already has 5 photos. Delete one before uploading another.
        </p>
      ) : null}
    </div>
  );
}
