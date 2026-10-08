# Phase 3 verification — Studio v0.23.0-rc.6

Status: complete at a verified implementation checkpoint. No hosted deployment or release certification. Recorded 2026-10-09 Asia/Shanghai.

## Exact source

- Handbook: fd4330863f4cc0812180fbf1de122970a42c7885.
- Starting Studio: 469bdff3dcb4a20ff550830e0eb4ba939288ed5e; starting Engine: 300c9359367d63c364a9e4c802b812cd8624fe66.
- Verified Studio implementation: 6c3f512589804d92187b69f4fbfd342484b18a8a; tree 58a0487be0f08766d5a7c1ad99ddfcf7dbfad031.
- Studio standalone HTML: 1444688 bytes; SHA-256 `3bd64270485d5a2c0c0573759bb5f906f20c9d865f0efa707f6d017871980d2d`. Versioned download and index are byte-identical.
- Engine runtime stays v0.21.0-rc.2, pinned source de4a89a89c1355d8abf0b7b702c1921693ab753d. All 52 vendored module hashes are unchanged. Phase 2 math evidence remains applicable; no new exhaustive mathematics audit is claimed.

## Delivered scope

Teacher-controlled manual and individualized packets; local GradeCam Student By Standard XLSX/CSV import; explicit score scales, missing-score handling, code review, threshold allocation, caps and visible omissions; immutable question snapshots; student, key and study-guide output; A4/Letter and one/two columns; browser printing/Save as PDF; editable Word with native equations/tables and rendered diagrams; downloadable teacher sessions, reopen, separate class/packet deletion, confirmation and undo.

All 331 coded outcomes remain mapped. Existing 502 working 8/7 entries and 891 six-bank entries are retained. Unfinished publisher-source previews cannot be exported. Other-course expansion remains paused. Targeting selects bounded practice, not a mastery diagnosis or GradeCam scanner-certified form.

## Verification

| Check | Result |
|---|---|
| phase3-core.cjs and studio-core.cjs | Passed mappings, scale/zero/missing semantics, duplicate/invalid/formula rejection, caps, deterministic replay, source boundaries and retained draft behavior |
| phase3-browser.cjs | Passed manual/individualized batches, student/key separation, downloads, session reopen, class preservation on invalid import, clear/cancel/undo and 390px viewport |
| phase3-import.cjs | Passed synthetic XLSX, preamble handling, string IDs, formula rejection, escaped user content and no HTTP requests |
| phase3-layout.cjs | 4,440 layouts: 370 tasks × 2 paper sizes × 2 column counts × 3 output modes; zero bounds failures |
| phase2-delivery.cjs | Passed retained overlap flags, distinct methods, response checks and narrow previews |
| phase3-exports.cjs | Four actual DOCX and four browser PDF exports, covering six banks plus equation, transformation and table examples |
| phase3-docx-audit.py | Passed XML structure, 11 indivisible question blocks per file, native equations/table, learner footers and student/key isolation |
| Visual review | All 17 browser PDF pages and 14 rendered Word pages inspected; no blank spillover pages in the final samples |
| Supplied private workbook | 69 students, 57 mapped standards, 3,872 numeric scores and 61 hyphens; independent openpyxl aggregate matched the browser parser |

Node 24.19.0; Chromium 153.0.8010.0; bundled LibreOffice through render_docx.py. Saved screenshots in the Studio verification directory show representative final Word/PDF pages. Machine-readable runtime and export hashes are in phase3-results.json. Private learner names, IDs and score rows are not committed.

## Corrections verified

Resolved Word title-only first pages, footer-height changes after pagination, oversized teacher diagrams, duplicate paragraph spacing properties, native-table conversion, learner footer continuity, detached solution metadata and blank Word spillover pages. Final rc.6 uses an indivisible table block per question, including writing space. Word and browser pagination can differ because Word retains native editable content.

## Remaining acceptance boundary

Physical Windows Chrome/Edge, Microsoft Word, printer output and iPad/iPhone were not tested. Next is a short teacher acceptance check on the intended Windows computer and printer. No hosted deployment was performed. Session files include names and generated answers, omit the raw imported score table, and must be handled as teacher files. There is no automatic browser persistence.
