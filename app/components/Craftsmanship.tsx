const STATS = [
  { number: "25+", label: "Years of Excellence" },
  { number: "200+", label: "Master Artisans" },
  { number: "15", label: "Countries Sourced" },
];

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="flex flex-row w-full bg-white h-[560px]">
      {/* Left image */}
      <div className="w-[720px] h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1756736668537-f8d07f610518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Craftsmanship"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right content */}
      <div className="flex flex-col justify-center flex-1 p-20 gap-8">
        <span className="font-inter text-[11px] tracking-[3px] text-[#C9A962] uppercase">
          OUR PHILOSOPHY
        </span>
        <h2
          className="font-cormorant text-[42px] text-[#2C2420] font-normal"
          style={{ lineHeight: 1.1 }}
        >
          Where Craftsmanship{"\n"}Meets Design
        </h2>
        <p
          className="font-inter text-[14px] text-[#8A8078] w-[460px]"
          style={{ lineHeight: 1.8 }}
        >
          We believe furniture should be more than functional — it should be a
          reflection of your taste and a testament to enduring quality. Our
          artisans spend hundreds of hours perfecting every piece, from the
          first sketch to the final finish.
        </p>

        {/* Stats */}
        <div className="flex flex-row gap-10">
          {STATS.map(({ number, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-cormorant text-[36px] font-light text-[#C9A962]">
                {number}
              </span>
              <span className="font-inter text-[12px] text-[#8A8078]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
