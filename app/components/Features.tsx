import { AwardIcon, PaletteIcon, LeafIcon, TruckIcon } from "./icons";

const FEATURES = [
  {
    icon: <AwardIcon />,
    title: "Lifetime Quality",
    description: "Every piece is built to last generations with premium materials and expert construction",
  },
  {
    icon: <PaletteIcon />,
    title: "Custom Design",
    description: "Personalize dimensions, finishes, and fabrics to match your unique vision",
  },
  {
    icon: <LeafIcon />,
    title: "Sustainable",
    description: "Responsibly sourced materials and eco-conscious production methods",
  },
  {
    icon: <TruckIcon />,
    title: "White Glove Delivery",
    description: "Professional installation and setup service included with every order",
  },
];

function FeatureCard({ icon, title, description }: (typeof FEATURES)[number]) {
  return (
    <div className="flex flex-col bg-white gap-4 p-7">
      {icon}
      <h3 className="font-instrument text-[20px] italic text-black font-normal">{title}</h3>
      <p className="font-inter text-[14px] text-[#666666] leading-[1.6] font-normal">{description}</p>
    </div>
  );
}

export default function Features() {
  const col1 = FEATURES.slice(0, 2);
  const col2 = FEATURES.slice(2, 4);

  return (
    <section id="features" className="flex flex-col w-full gap-14 bg-[#F5F5F5] p-[120px]">
      <div className="flex flex-col items-center w-full">
        <h2 className="font-instrument text-[44px] italic text-black font-normal">Why Choose Milan</h2>
      </div>
      <div className="flex w-full gap-8">
        <div className="flex flex-col flex-1 gap-8">
          {col1.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
        <div className="flex flex-col flex-1 gap-8">
          {col2.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
}
