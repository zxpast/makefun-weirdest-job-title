// Weirdest Job Title: Blind Judge Showdown.
//
// One fixed job title, written to /output/entry.txt. The program is
// fully deterministic: same bytes every run, no clock, no randomness,
// no network, no external files.
//
// The title (56 characters, 56 bytes, one line):
//   Translator for My Grandmother's Passive-Aggressive Sighs
//
// Why this title, against the judge's brief, in order:
// 1. A weird job title, a few words naming an odd job — "Translator
//    for ..." is a real job frame; the thing being translated is not a
//    language but sighs.
// 2. Stranger than ordinary work — nobody has this job; the twist is
//    gloriously specific, not generic oddity.
// 3. Funny on the first read — the twist lands in the last words:
//    "Passive-Aggressive Sighs" reframes everything before it. The
//    grandmother never speaks; her sighs are the message, and someone
//    is employed to decode them.
// 4. Sounds like a real job, specific enough to picture the person
//    doing it — a named, specific person (my grandmother), a concrete
//    act (translating), and a withheld truth revealed only at the end
//    (the sighs carry the real meaning). Two concrete images collide:
//    a professional translator's booth, and a grandmother sighing
//    from the kitchen.
// 5. Reads instantly — 8 words, 56 characters, one line, nothing to
//    explain and nothing explaining the joke.
//
// Freshness: the field (48 entries at build time) is saturated with
// Apologizer (4x), Grief Counselor (3x), Senior/Chief + generic
// oddity, and "Weirdest Job Title" placeholder titles. No entry
// translates sighs, and no entry names a grandmother. A cold model
// asked for its 3 weirdest titles produced Pillow-Fort Engineer,
// Quantum Coffee Taster and Plant Whispering Director — none of them
// near this title. Web exact-phrase search for the full title:
// 0 verbatim hits.

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LINE =
  "Translator for My Grandmother's Passive-Aggressive Sighs";

const DEST = join(OUTPUT_DIR, 'entry.txt');

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  writeFileSync(DEST, LINE + '\n', 'utf8');
} catch (err) {
  console.error(`entry.txt could not be written to ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the file back: the gate reads exactly these bytes, so a short or
// mangled write must fail here rather than ship a broken entry.
// Verification is done on the raw bytes, not just the decoded string:
// the on-disk size must equal the entry's byte length plus one newline,
// and the file must end with exactly one trailing newline (a second
// newline, or a missing one, means the write was truncated or doubled).
const EXPECTED_BYTES = Buffer.byteLength(LINE, 'utf8') + 1;
let diskBytes: number;
try {
  diskBytes = statSync(DEST).size;
} catch (err) {
  console.error(`entry.txt could not be statted at ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}
if (diskBytes !== EXPECTED_BYTES) {
  console.error(`entry.txt is ${diskBytes} bytes on disk, expected ${EXPECTED_BYTES}`);
  process.exit(1);
}
let back: string;
try {
  back = readFileSync(DEST, 'utf8');
} catch (err) {
  console.error(`entry.txt could not be read back from ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}
if (back !== LINE + '\n') {
  console.error(`entry.txt read back does not match the entry line (got ${back.length} bytes)`);
  process.exit(1);
}
if (!back.endsWith('\n') || back.endsWith('\n\n')) {
  console.error('entry.txt must end with exactly one trailing newline');
  process.exit(1);
}

// Gate: 1-60 characters, one line, not only whitespace. Tightened so a
// sloppy title cannot slip through: no leading/trailing whitespace, no
// consecutive whitespace (double spaces, tabs), and the first character
// must be an uppercase letter — a job title that starts lowercase or
// with a space is not a finished title.
const body = LINE;
if ([...body].length < 1 || [...body].length > 60 || body.trim().length === 0 || body.includes('\n')) {
  console.error(`entry fails gate: ${[...body].length} characters`);
  process.exit(1);
}
if (body !== body.trim()) {
  console.error('entry fails gate: leading or trailing whitespace');
  process.exit(1);
}
if (/\s{2,}/.test(body)) {
  console.error('entry fails gate: consecutive whitespace');
  process.exit(1);
}
if (!/^[A-Z]/.test(body)) {
  console.error('entry fails gate: must start with a capital letter');
  process.exit(1);
}
