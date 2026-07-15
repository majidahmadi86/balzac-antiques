"use client";

// Product page gallery with a fullscreen lightbox. Tap/click the main photo to
// open; tap again to zoom (2.5x at the tapped point) and drag to pan; arrows,
// thumbnails or swipe move between photos; Esc or the backdrop closes. No
// dependencies — antiques buyers need to inspect condition closely, so zoom
// shows the full-resolution optimised master.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const show = useCallback((i: number) => {
    setActive(i);
    setZoomed(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setZoomed(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show((active + 1) % images.length);
      if (e.key === "ArrowLeft") show((active - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, active, images.length, close, show]);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-hairline bg-parchment">
        <span className="text-[10px] tracking-[0.22em] text-ink/40">PHOTOGRAPHY PENDING</span>
      </div>
    );
  }

  function toggleZoom(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current?.moved) {
      drag.current = null;
      return;
    }
    if (zoomed) {
      setZoomed(false);
      setOffset({ x: 0, y: 0 });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin(`${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}% ${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      setZoomed(true);
    }
  }

  return (
    <div>
      {/* Main photo — click to open the lightbox */}
      <button
        type="button"
        onClick={() => {
          show(0);
          setOpen(true);
        }}
        aria-label="Open photo viewer"
        className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-parchment"
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-3 right-3 border border-ink/15 bg-cream/85 px-2.5 py-1.5 text-[9px] tracking-[0.2em] uppercase text-ink/70">
          Tap to zoom
        </span>
      </button>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.slice(1).map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View photo ${i + 2}`}
              onClick={() => {
                show(i + 1);
                setOpen(true);
              }}
              className="relative aspect-square cursor-zoom-in overflow-hidden bg-parchment shadow-sm transition-shadow hover:shadow-md"
            >
              <Image
                src={src}
                alt={`${title} — view ${i + 2}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* ------------------------------ Lightbox ------------------------------ */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] tracking-[0.2em] text-cream/70">
              {active + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="flex h-10 w-10 items-center justify-center text-[20px] leading-none text-cream/80 transition-colors hover:text-cream"
            >
              ✕
            </button>
          </div>

          <div
            className={`relative flex-1 overflow-hidden ${zoomed ? "cursor-grab" : "cursor-zoom-in"}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom(e);
            }}
            onPointerDown={(e) => {
              if (!zoomed) return;
              drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y, moved: false };
            }}
            onPointerMove={(e) => {
              if (!zoomed || !drag.current) return;
              const x = e.clientX - drag.current.x;
              const y = e.clientY - drag.current.y;
              if (Math.abs(x - offset.x) + Math.abs(y - offset.y) > 2) drag.current.moved = true;
              setOffset({ x, y });
            }}
            onPointerUp={() => {
              if (drag.current && !drag.current.moved) drag.current = null;
            }}
            onTouchStart={(e) => {
              if (!zoomed) touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (zoomed || touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (dx < -48) show((active + 1) % images.length);
              if (dx > 48) show((active - 1 + images.length) % images.length);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${title} — photo ${active + 1}`}
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain transition-transform duration-300"
              style={{
                transform: zoomed ? `translate(${offset.x}px, ${offset.y}px) scale(2.5)` : "none",
                transformOrigin: origin,
              }}
            />
          </div>

          {images.length > 1 ? (
            <div className="flex items-center justify-center gap-6 px-4 py-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => show((active - 1 + images.length) % images.length)}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center border border-cream/25 text-[16px] text-cream/80 transition-colors hover:border-cream/60 hover:text-cream"
              >
                &larr;
              </button>
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => show(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === active}
                    className={`h-[3px] w-7 transition-colors ${i === active ? "bg-gold" : "bg-cream/25 hover:bg-cream/50"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => show((active + 1) % images.length)}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center border border-cream/25 text-[16px] text-cream/80 transition-colors hover:border-cream/60 hover:text-cream"
              >
                &rarr;
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
