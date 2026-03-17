import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Milan",
  description: "Sign in to your Milan account.",
};

const ROOM_IMAGE =
  "https://images.unsplash.com/photo-1680416124536-22b16c411402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-[120px] py-6">
        <Link href="/">
          <span
            className="text-[28px] text-black"
            style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
          >
            MILAN
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-[#666666] hover:text-black transition-colors"
          style={{ fontFamily: "Inter" }}
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main split */}
      <main className="flex flex-1" style={{ minHeight: 700 }}>
        {/* Left — form panel */}
        <div className="flex-1 bg-white flex flex-col justify-center p-20">
          <LoginForm />
        </div>

        {/* Right — image panel */}
        <div
          className="flex-1 relative flex flex-col justify-end p-20"
          style={{
            backgroundImage: `url(${ROOM_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Quote */}
          <div className="relative flex flex-col gap-4">
            <blockquote
              className="text-[24px] leading-[1.4] text-white max-w-[450px]"
              style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
            >
              &ldquo;Milan pieces have transformed our home into a sanctuary
              of elegance and comfort.&rdquo;
            </blockquote>
            <p className="text-sm text-[#CCCCCC]" style={{ fontFamily: "Inter" }}>
              — Sarah Chen, Interior Designer
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
