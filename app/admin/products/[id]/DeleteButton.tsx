"use client";

import { deleteProduct } from "../actions";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${title}" permanently? Its photos and specifications are removed too. This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="border border-[#C08A6A]/50 bg-white px-5 py-2.5 text-[10px] tracking-[0.24em] uppercase text-[#8A5A3C] transition-colors hover:border-[#8A5A3C] hover:bg-[#FBF4EF]"
      >
        Delete Product
      </button>
    </form>
  );
}
