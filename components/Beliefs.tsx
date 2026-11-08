import { BELIEFS, BELIEFS_NOTE } from "@/lib/brand";

export default function Beliefs() {
  return (
    <div>
      <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
        What I believe
      </p>
      <ul className="space-y-4 mb-6">
        {BELIEFS.map((belief) => (
          <li
            key={belief}
            className="border-l-2 border-[#C9713D]/50 pl-5 py-1 text-xl md:text-2xl font-black text-white"
          >
            {belief}
          </li>
        ))}
      </ul>
      <p className="text-white/55 leading-relaxed">{BELIEFS_NOTE}</p>
    </div>
  );
}
