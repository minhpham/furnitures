import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Create Account — Milan",
  description: "Join Milan and experience luxury living.",
};

const FEATURES = [
  "Early access to new collections",
  "Complimentary design consultations",
  "Exclusive member-only events",
] as const;

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function SignupPage() {
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
        {/* Left — brand panel */}
        <div className="flex-1 bg-black flex flex-col justify-center p-20 gap-6">
          <p
            className="text-xs text-[#AAAAAA] tracking-[2px] uppercase"
            style={{ fontFamily: "Inter" }}
          >
            Join Our Community
          </p>

          <h2
            className="text-[44px] leading-[1.2] text-white"
            style={{ fontFamily: "Instrument Serif", fontStyle: "italic" }}
          >
            Experience Luxury Living
          </h2>

          <p
            className="text-base text-[#CCCCCC] leading-[1.6] max-w-[450px]"
            style={{ fontFamily: "Inter" }}
          >
            Create an account to receive exclusive access to new collections,
            design insights, and personalized consultations with our expert
            team.
          </p>

          <ul className="flex flex-col gap-4 mt-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white">
                <CheckIcon />
                <span className="text-sm" style={{ fontFamily: "Inter" }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form panel */}
        <div className="flex-1 bg-white flex flex-col justify-center p-20">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
