import Image from "next/image";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="Summit Initiative Solutions"
      width={1049}
      height={1049}
      className={`${className} object-contain`}
      priority
    />
  );
}
