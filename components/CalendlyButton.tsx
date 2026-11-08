import { CALENDLY_URL } from "@/lib/site";

// The one primary call to action on the site: book a conversation with David.
export default function CalendlyButton({
  className = "",
  label = "Pull up a chair",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block text-center bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors ${className}`}
    >
      {label}
    </a>
  );
}
