import Image from "next/image";

export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <Image
      src="/logo-icon-solid.png"
      alt="The Summit Initiative"
      width={1049}
      height={1049}
      className={`${className} object-contain rounded-md`}
      priority
    />
  );
}
