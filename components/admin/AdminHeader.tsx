import Link from "next/link";
import { logout } from "../../app/admin/login/actions";

export default function AdminHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-[#E4DCCB] bg-white/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-5 sm:gap-10">
          <Link href="/admin" className="block">
            <p className="font-serif text-[19px] tracking-[0.26em] text-[#1F1B16] -mr-[0.26em]">BALZAC</p>
            <p className="text-[9px] tracking-[0.4em] text-[#8A7A5C] -mr-[0.4em]">ADMIN</p>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/admin"
              className="text-[10px] tracking-[0.24em] uppercase text-[#6B6154] transition-colors hover:text-[#1F1B16]"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="text-[10px] tracking-[0.24em] uppercase text-[#6B6154] transition-colors hover:text-[#1F1B16]"
            >
              Products
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden text-[12px] tracking-[0.06em] text-[#6B6154] md:inline">{email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="border border-[#D8CFBB] bg-white px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
