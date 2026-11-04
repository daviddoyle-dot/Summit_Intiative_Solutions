import Image from "next/image";

// Decorative brand mark pinned to the top right of a page, in the band between
// the fixed nav and the page heading. The parent page wrapper must be `relative`.
export default function PageLogo() {
  return (
    <div className="absolute top-[82px] inset-x-0 pointer-events-none" aria-hidden="true">
      <div className="max-w-6xl mx-auto px-6 flex justify-end">
        <Image
          src="/logo-mark-tight.png"
          alt=""
          width={850}
          height={434}
          className="w-28 md:w-40 h-auto opacity-90"
        />
      </div>
    </div>
  );
}
