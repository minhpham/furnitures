import { cookies } from "next/headers";
import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { UserMenu, type UserData } from "./UserMenu";
import CartIcon from "./CartIcon";

const NAV_LINKS = [
  { label: "Collections", href: "/", active: true },
  { label: "Living", href: "#collections" },
  { label: "Dining", href: "#collections" },
  { label: "Bedroom", href: "#collections" },
  { label: "Outdoor", href: "#" },
  { label: "Sale", href: "#", gold: true },
];

export default async function Header() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("userData")?.value;

  let user: UserData | null = null;
  if (raw) {
    try {
      user = JSON.parse(raw) as UserData;
    } catch {
      // malformed cookie — treat as logged out
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-20 px-20 bg-[#FAF8F5]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span
          className="font-cormorant text-[26px] font-semibold text-[#2C2420]"
        >
          MAISON
        </span>
        <span
          className="font-cormorant text-[26px] font-semibold text-[#C9A962]"
        >
          .
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-10">
        {NAV_LINKS.map(({ label, href, active, gold }) => (
          <a
            key={label}
            href={href}
            className={`font-inter text-[13px] tracking-wider transition-colors ${
              gold
                ? "text-[#C9A962]"
                : active
                ? "text-[#2C2420]"
                : "text-[#2C2420] hover:text-[#C9A962]"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Icons + Auth */}
      <div className="flex items-center gap-5">
        <Search size={20} color="#2C2420" className="cursor-pointer hover:opacity-70 transition-opacity" />
        {user ? (
          <UserMenu user={user} />
        ) : (
          <User size={20} color="#2C2420" className="cursor-pointer hover:opacity-70 transition-opacity" />
        )}
        <CartIcon />
        {!user && (
          <div className="flex items-center gap-4 ml-2">
            <Link
              href="/login"
              className="font-inter text-[13px] text-[#2C2420] hover:text-[#C9A962] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="font-inter text-[13px] text-[#2C2420] hover:text-[#C9A962] transition-colors border border-[#2C2420] px-4 py-1.5 hover:border-[#C9A962] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
