"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up newsletter subscription
    setEmail("");
  }

  return (
    <section className="flex flex-col items-center justify-center w-full bg-white h-[360px] px-[200px] gap-8">
      <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
        JOIN THE MAISON WORLD
      </span>
      <h2 className="font-cormorant text-[48px] text-[#2C2420] font-normal text-center">
        Elevate Your Inbox
      </h2>
      <p
        className="font-inter text-[14px] text-[#8A8078] text-center w-[480px]"
        style={{ lineHeight: 1.7 }}
      >
        Be the first to discover new collections, exclusive events, and design
        inspiration delivered straight to your inbox.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-row items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="font-inter text-[13px] text-[#2C2420] placeholder-[#B5AFA7] w-[320px] py-[14px] px-6 border border-[#EDE9E3] rounded-l-sm bg-[#FAF8F5] outline-none focus:border-[#C9A962] transition-colors"
          required
        />
        <button
          type="submit"
          className="font-inter text-[13px] text-white bg-[#2C2420] py-[14px] px-8 rounded-r-sm hover:bg-[#3D3530] transition-colors whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>

      <p className="font-inter text-[11px] text-[#B5AFA7]">
        No spam. Unsubscribe at any time.
      </p>
    </section>
  );
}
