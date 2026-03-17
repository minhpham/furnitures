import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const SHOP_LINKS = ["Living Room", "Dining Room", "Bedroom", "Outdoor", "Accessories"];
const COMPANY_LINKS = ["Our Story", "Artisans", "Sustainability", "Press", "Careers"];
const SUPPORT_LINKS = ["Contact Us", "FAQs", "Shipping", "Returns", "Care Guide"];

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-inter text-[12px] font-semibold text-[#FAF8F5] tracking-wider uppercase">
        {title}
      </span>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="font-inter text-[13px] text-[#8A8078] hover:text-[#FAF8F5] transition-colors"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="flex flex-col w-full gap-12 bg-[#2C2420] py-[60px] px-20">
      {/* Top row */}
      <div className="flex flex-row items-start justify-between w-full">
        {/* Brand */}
        <div className="flex flex-col gap-4 w-[300px]">
          <div className="flex items-center gap-1">
            <span className="font-cormorant text-[24px] font-semibold text-[#FAF8F5]">
              MAISON
            </span>
            <span className="font-cormorant text-[24px] font-semibold text-[#C9A962]">
              .
            </span>
          </div>
          <p className="font-inter text-[13px] text-[#8A8078] w-[280px]" style={{ lineHeight: 1.7 }}>
            Crafting timeless luxury furniture for discerning spaces since 1987.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Instagram size={18} color="#8A8078" className="cursor-pointer hover:text-[#FAF8F5] transition-colors" />
            <Facebook size={18} color="#8A8078" className="cursor-pointer hover:text-[#FAF8F5] transition-colors" />
            <Twitter size={18} color="#8A8078" className="cursor-pointer hover:text-[#FAF8F5] transition-colors" />
            <Linkedin size={18} color="#8A8078" className="cursor-pointer hover:text-[#FAF8F5] transition-colors" />
          </div>
        </div>

        {/* Nav columns */}
        <div className="flex flex-row gap-15">
          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between w-full pt-6 border-t border-[#3D3530]">
        <p className="font-inter text-[11px] text-[#6E6660]">
          © 2026 Maison. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="font-inter text-[11px] text-[#6E6660] hover:text-[#FAF8F5] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="font-inter text-[11px] text-[#6E6660] hover:text-[#FAF8F5] transition-colors">
            Terms of Service
          </a>
          <a href="#" className="font-inter text-[11px] text-[#6E6660] hover:text-[#FAF8F5] transition-colors">
            Cookie Preferences
          </a>
        </div>
      </div>
    </footer>
  );
}
