// Turns text copied from Word, Google Docs, or a web page into clean Markdown, so David can
// paste a finished draft into the editor and keep headings, bold, italics, links, and lists.
import TurndownService from "turndown";

const BOLD_AT_LEAST = 600;

function styleOf(node: unknown): string {
  return (node as HTMLElement).getAttribute?.("style") ?? "";
}

function isBold(style: string): boolean {
  const match = style.match(/font-weight\s*:\s*(bold|bolder|\d+)/i);
  if (!match) return false;
  const value = match[1].toLowerCase();
  return value === "bold" || value === "bolder" || Number(value) >= BOLD_AT_LEAST;
}

function isItalic(style: string): boolean {
  return /font-style\s*:\s*italic/i.test(style);
}

/** Wraps text in Markdown emphasis, keeping surrounding spaces outside the markers. */
function wrap(content: string, marker: string): string {
  const match = content.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match || !match[2]) return content;
  return `${match[1]}${marker}${match[2]}${marker}${match[3]}`;
}

function createService(): TurndownService {
  const service = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
    hr: "---",
  });

  service.remove(["style", "script", "meta", "title", "head"]);

  // Google Docs wraps everything in a <b> that is not actually bold.
  service.addRule("docsWrapper", {
    filter: (node) =>
      node.nodeName === "B" && /^docs-internal-guid/.test((node as HTMLElement).id ?? ""),
    replacement: (content) => content,
  });

  // Google Docs and Word mark bold and italic with inline styles instead of <b> and <i>.
  service.addRule("styledSpan", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const style = styleOf(node);
      return isBold(style) || isItalic(style);
    },
    replacement: (content, node) => {
      const style = styleOf(node);
      let out = content;
      if (isItalic(style)) out = wrap(out, "*");
      if (isBold(style)) out = wrap(out, "**");
      return out;
    },
  });

  // Word writes lists as ordinary paragraphs with the bullet or number typed in as text.
  service.addRule("wordList", {
    filter: (node) => node.nodeName === "P" && /MsoList/i.test((node as HTMLElement).className ?? ""),
    replacement: (_content, node) => {
      const element = (node as HTMLElement).cloneNode(true) as HTMLElement;
      const marker = (
        element.querySelector('span[style*="mso-list:Ignore"]')?.textContent ?? ""
      ).trim();
      element.querySelector('span[style*="mso-list:Ignore"]')?.remove();

      const level = Number(styleOf(node).match(/level(\d+)/i)?.[1] ?? "1");
      const text = service.turndown(element.innerHTML).replace(/\s+/g, " ").trim();
      const bullet = /^\d+[.)]$|^[a-z][.)]$/i.test(marker) ? marker.replace(/\)$/, ".") : "-";
      return `\n${"  ".repeat(Math.max(0, level - 1))}${bullet} ${text}\n`;
    },
  });

  // Pasted images point at the author's computer or a temporary link, so they can't be kept.
  service.addRule("dropImages", { filter: "img", replacement: () => "" });

  return service;
}

export type PasteResult = { markdown: string; droppedImages: number };

export function htmlToMarkdown(html: string): PasteResult {
  const droppedImages = (html.match(/<img\b/gi) ?? []).length;
  const markdown = createService()
    .turndown(html)
    .replace(/ /g, " ")
    .replace(/[​‌‍﻿]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    // Turndown pads list markers with extra spaces ("-   item"); keep them compact.
    .replace(/^(\s*)([-*+]|\d+\.)[ \t]{2,}/gm, "$1$2 ")
    .replace(/\n{3,}/g, "\n\n")
    // Word leaves list items separated by blank lines; tighten them into a single list.
    .replace(/^((?:[-]|\d+\.) .+)\n\n(?=(?:[-]|\d+\.) )/gm, "$1\n")
    .trim();
  return { markdown, droppedImages };
}
