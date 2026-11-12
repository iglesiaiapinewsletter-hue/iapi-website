#!/usr/bin/env node
/**
 * Photo intake & auto-sort (scaffold).
 * TODO: implement full pipeline per PROMPT.md:
 * - copy originals to /photos-originals, never modify originals
 * - classify/rename/group, optimize to AVIF/WebP + responsive sizes
 * - strip EXIF/GPS, generate ES/EN alt text, write photos.json
 * - move uncertain/kids-face photos to /photos-needs-review (never publish)
 * - detect duplicates, report summary to console and PROGRESS.md
 */
console.log("Photo pipeline scaffold: implement classification, optimization, privacy gate, and reporting (see PROMPT.md).");
process.exit(0);
