// Post the Meme, Win the Feed — entrypoint.
// The entry itself is a post on X: this program only hands the gate the
// address of that post. It reads POST.json from the repository root and
// writes an identical copy into the output directory, where the sealed
// scorer reads it and resolves the post through FxTwitter's public read.
// Nothing this program writes about the post is scored; the post's own
// likes, reposts and quotes decide the places.
//
// Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const sourcePath = join(repoRoot, "POST.json");
const targetPath = join(outDir, "POST.json");

// The placeholder address in POST.json is refused by the gate (valid 0);
// swap it for the real post address before submitting.
const raw = readFileSync(sourcePath, "utf8");
const parsed: unknown = JSON.parse(raw);
if (typeof parsed !== "object" || parsed === null) {
  console.error("POST.json must be a JSON object");
  process.exit(1);
}
const url = (parsed as { url?: unknown }).url;
if (typeof url !== "string" || url.length === 0) {
  console.error("POST.json must name the post with a string url field");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, raw, "utf8");
console.log(`POST.json copied to ${targetPath}`);
