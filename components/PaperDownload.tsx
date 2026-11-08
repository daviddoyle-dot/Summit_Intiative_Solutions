import fs from "node:fs";
import path from "node:path";
import PaperDownloadForm from "./PaperDownloadForm";

const PDF_PATH = "/three-rings.pdf";

// The Three Rings paper offer. Shows the download link only once the PDF is in /public.
export default function PaperDownload({ id }: { id?: string }) {
  const pdfAvailable = fs.existsSync(path.join(process.cwd(), "public", PDF_PATH));
  return (
    <div id={id} className="rounded-2xl border border-[#C9713D]/30 bg-[#141b2c] p-8 md:p-10">
      <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
        Free paper
      </p>
      <h2 className="text-2xl md:text-3xl font-black mb-3">
        The Three Rings of Organizational Effectiveness
      </h2>
      <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
        The framework I used to run organizations of 18,000 people, written for business. Free.
      </p>
      <PaperDownloadForm pdfUrl={pdfAvailable ? PDF_PATH : null} />
    </div>
  );
}
