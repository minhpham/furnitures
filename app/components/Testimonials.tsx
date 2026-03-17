import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "The Aria chair completely transformed our living room. The craftsmanship is extraordinary — you can feel the quality in every stitch.",
    name: "Caroline Beaumont",
    role: "Interior Designer, Paris",
  },
  {
    quote:
      "Maison's dining table has become the centrepiece of our home. Guests always comment on its beauty. Worth every penny.",
    name: "James Whitfield",
    role: "Architect, London",
  },
  {
    quote:
      "The attention to detail is remarkable. Each piece feels like it was made specifically for our space. Truly bespoke luxury.",
    name: "Sofia Andersson",
    role: "Homeowner, Stockholm",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="flex flex-col flex-1 bg-[#362E2A] rounded-xl p-8 gap-5">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} color="#C9A962" fill="#C9A962" />
        ))}
      </div>

      {/* Quote */}
      <p
        className="font-cormorant text-[18px] text-[#D4CFC8]"
        style={{ lineHeight: 1.6 }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-full bg-[#4A4440] flex-shrink-0"
          style={{ width: 40, height: 40 }}
        />
        <div className="flex flex-col gap-0.5">
          <span className="font-inter text-[13px] text-[#FAF8F5]">{name}</span>
          <span className="font-inter text-[11px] text-[#8A8078]">{role}</span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="flex flex-col w-full gap-12 bg-[#2C2420] p-20">
      {/* Header */}
      <div className="flex flex-col items-center w-full gap-4">
        <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
          TESTIMONIALS
        </span>
        <h2 className="font-cormorant text-[42px] text-[#FAF8F5] font-normal">
          What Our Clients Say
        </h2>
      </div>

      {/* Cards */}
      <div className="flex flex-row w-full gap-8">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </section>
  );
}
