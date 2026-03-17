import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from './ContactForm';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Contact Us — Milan Furniture',
  description:
    'Reach out to the Milan Furniture team. Visit our New York showroom, call us, or send a message. We\'re happy to assist with custom orders, product questions, and more.',
};

// ---------------------------------------------------------------------------
// SVG Social Icons
// ---------------------------------------------------------------------------

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.138-1.868 3.138-4.563 0-2.386-1.715-4.052-4.163-4.052-2.836 0-4.5 2.126-4.5 4.323 0 .856.329 1.772.74 2.273a.3.3 0 0 1 .069.286c-.075.313-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Contact Info Item
// ---------------------------------------------------------------------------

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function ContactItem({ icon, label, children }: ContactItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-[#E5E5E5] text-[#666666]">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-inter text-[11px] font-medium text-[#AAAAAA] tracking-[1px] uppercase">
          {label}
        </span>
        <div className="font-inter text-[14px] text-[#333333] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default function ContactUsPage() {
  return (
    <div className="flex flex-col w-full min-h-full bg-[#F5F5F5] pt-[76px]">
      <Header />

      {/* ------------------------------------------------------------------ */}
      {/* Hero */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-[#F5F5F5] px-6 md:px-[120px] pt-16 pb-14 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
          <p className="font-inter text-[11px] font-medium text-[#AAAAAA] tracking-[2px] uppercase">
            Get in Touch
          </p>
          <h1 className="font-instrument text-[56px] md:text-[72px] italic font-normal text-black leading-none">
            Contact Us
          </h1>
          <p className="font-inter text-[16px] text-[#666666] leading-relaxed max-w-[520px]">
            Whether you&apos;re envisioning a custom piece or simply have a question,
            our team is here to help bring your space to life.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Two-column body: Contact Info + Form */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full px-6 md:px-[120px] py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">

          {/* --------------------------------------------------------------- */}
          {/* Left — Contact Information */}
          {/* --------------------------------------------------------------- */}
          <aside className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-instrument text-[32px] italic font-normal text-black leading-tight">
                Our Studio
              </h2>
              <p className="font-inter text-[14px] text-[#666666] leading-relaxed">
                Visit us at our flagship showroom or reach out through any of
                the channels below. We typically respond within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Address */}
              <ContactItem
                label="Address"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              >
                <span>123 Furniture Lane</span>
                <br />
                <span>Design District, New York, NY 10001</span>
              </ContactItem>

              {/* Phone */}
              <ContactItem
                label="Phone"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              >
                <a href="tel:+15552345678" className="hover:text-black transition-colors">
                  +1 (555) 234-5678
                </a>
              </ContactItem>

              {/* Email */}
              <ContactItem
                label="Email"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              >
                <a href="mailto:hello@furniturestudio.com" className="hover:text-black transition-colors">
                  hello@furniturestudio.com
                </a>
              </ContactItem>

              {/* Hours */}
              <ContactItem
                label="Business Hours"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              >
                <span>Mon – Fri: 9:00 am – 6:00 pm</span>
                <br />
                <span>Saturday: 10:00 am – 4:00 pm</span>
                <br />
                <span className="text-[#AAAAAA]">Sunday: Closed</span>
              </ContactItem>
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-4">
              <span className="font-inter text-[11px] font-medium text-[#AAAAAA] tracking-[1px] uppercase">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-10 h-10 border border-[#E5E5E5] bg-white text-[#666666] hover:text-black hover:border-black transition-colors duration-200"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-10 h-10 border border-[#E5E5E5] bg-white text-[#666666] hover:text-black hover:border-black transition-colors duration-200"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  aria-label="Pinterest"
                  className="flex items-center justify-center w-10 h-10 border border-[#E5E5E5] bg-white text-[#666666] hover:text-black hover:border-black transition-colors duration-200"
                >
                  <PinterestIcon />
                </a>
              </div>
            </div>
          </aside>

          {/* --------------------------------------------------------------- */}
          {/* Right — Contact Form (Client Component) */}
          {/* --------------------------------------------------------------- */}
          <ContactForm />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Map Placeholder */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full px-6 md:px-[120px] pb-16">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-instrument text-[24px] italic font-normal text-black">
              Find Our Showroom
            </h3>
            <a
              href="https://maps.google.com/?q=123+Furniture+Lane,+New+York,+NY+10001"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-[12px] font-medium text-[#666666] tracking-[0.5px] uppercase hover:text-black transition-colors flex items-center gap-1.5"
            >
              <span>Get Directions</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

          {/* Map frame */}
          <div className="relative w-full h-[450px] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d838.2755186496603!2d108.20195196876291!3d15.992605575468106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421b003384c021%3A0x29ad39a26172ad1c!2sMC%E2%80%99s%20rose%20garden!5e1!3m2!1sen!2s!4v1773124178922!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Showroom Location"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
