const PUBLICATIONS = ["Architectural Digest", "Elle Decor", "Wallpaper*", "Dezeen", "Monocle"];

export default function TrustBar() {
  return (
    <div className="flex flex-row items-center justify-between w-full h-[100px] px-[120px] bg-white border-t border-b border-[#EDE9E3]">
      <span className="font-inter text-[10px] tracking-[3px] text-[#B5AFA7] uppercase whitespace-nowrap">
        AS FEATURED IN
      </span>
      {PUBLICATIONS.map((pub) => (
        <span key={pub} className="font-cormorant text-[20px] text-[#C4BDB4]">
          {pub}
        </span>
      ))}
    </div>
  );
}
