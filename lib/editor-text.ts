// Text-editing helpers behind the editor's toolbar buttons. Pure functions: they take the
// text and the current selection and return the new text and selection.

export type Edit = { value: string; start: number; end: number };

/** Wraps the selection in a marker (bold, italic). Applying it again removes it. */
export function wrapSelection(
  value: string,
  start: number,
  end: number,
  marker: string,
  placeholder: string
): Edit {
  const before = value.slice(0, start);
  const after = value.slice(end);

  if (start !== end && before.endsWith(marker) && after.startsWith(marker)) {
    const selected = value.slice(start, end);
    return {
      value: before.slice(0, -marker.length) + selected + after.slice(marker.length),
      start: start - marker.length,
      end: end - marker.length,
    };
  }

  const selected = value.slice(start, end) || placeholder;
  return {
    value: before + marker + selected + marker + after,
    start: start + marker.length,
    end: start + marker.length + selected.length,
  };
}

const ANY_BLOCK_PREFIX = /^(#{1,6} |[-*+] |\d+\. |> )/;

export type LinePrefix = {
  /** What to put at the start of the nth selected line (0-based). */
  prefixFor: (index: number) => string;
  /** Matches the prefix when it is already applied, so applying it again removes it. */
  applied: RegExp;
};

export const HEADING2: LinePrefix = { prefixFor: () => "## ", applied: /^## / };
export const HEADING3: LinePrefix = { prefixFor: () => "### ", applied: /^### / };
export const BULLETS: LinePrefix = { prefixFor: () => "- ", applied: /^[-*+] / };
export const NUMBERS: LinePrefix = { prefixFor: (i) => `${i + 1}. `, applied: /^\d+\. / };
export const QUOTE: LinePrefix = { prefixFor: () => "> ", applied: /^> / };

/** Adds (or removes) a prefix on every line the selection touches. */
export function toggleLinePrefix(value: string, start: number, end: number, kind: LinePrefix): Edit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  // A selection that ends right after a newline shouldn't pull in the next, untouched line.
  const effectiveEnd = end > start && value[end - 1] === "\n" ? end - 1 : end;
  let lineEnd = value.indexOf("\n", effectiveEnd);
  if (lineEnd === -1) lineEnd = value.length;

  const lines = value.slice(lineStart, lineEnd).split("\n");
  const filled = lines.filter((line) => line.trim() !== "");
  const allApplied = filled.length > 0 && filled.every((line) => kind.applied.test(line));

  let counter = 0;
  const changed = lines.map((line) => {
    if (allApplied) return line.replace(kind.applied, "");
    if (line.trim() === "") return line;
    return kind.prefixFor(counter++) + line.replace(ANY_BLOCK_PREFIX, "");
  });

  const block = changed.join("\n");
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: lineStart,
    end: lineStart + block.length,
  };
}

/** Turns the selection into a link and selects the part the author needs to fill in next. */
export function insertLink(value: string, start: number, end: number): Edit {
  const selected = value.slice(start, end);
  const before = value.slice(0, start);
  const after = value.slice(end);

  if (/^https?:\/\/\S+$/i.test(selected)) {
    const text = "link text";
    return {
      value: `${before}[${text}](${selected})${after}`,
      start: start + 1,
      end: start + 1 + text.length,
    };
  }

  const text = selected || "link text";
  const urlStart = start + text.length + 3; // after "[text]("
  return {
    value: `${before}[${text}](https://)${after}`,
    start: urlStart,
    end: urlStart + "https://".length,
  };
}

/** Inserts text at the cursor, replacing any selection, on its own paragraph. */
export function insertBlock(value: string, start: number, end: number, block: string): Edit {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const trail = after === "" || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  const inserted = lead + block + trail;
  return {
    value: before + inserted + after,
    start: before.length + lead.length,
    end: before.length + lead.length + block.length,
  };
}
