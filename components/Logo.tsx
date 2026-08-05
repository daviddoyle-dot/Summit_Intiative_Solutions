export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6 L34 30 H6 L20 6Z" stroke="#C9713D" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 16 L28 30 H12 L20 16Z" fill="#C9713D" />
    </svg>
  );
}
