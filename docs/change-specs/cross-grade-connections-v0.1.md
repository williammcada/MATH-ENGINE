# Cross-grade connections and differentiation — feature note v0.1

Requested by Will on 2026-10-09. Status: implemented and verified in Milestone 7, Engine 0.27.0-rc.2 / Studio 0.29.0-rc.2. See ../MILESTONE7-VERIFICATION.md. The original requirement and baseline follow for traceability.

## Goal

Systematically analyze every completed grade/course item bank for meaningful cross-grade connections. A teacher working in one grade should be able to find and select harder versions of the same topic from higher-level banks, or easier versions and prerequisites from lower-level banks, without searching each bank separately.

Example requested by Will: if Grade 4 perimeter questions are too easy, suggest an appropriate Grade 5 irregular-quadrilateral perimeter task, preview it, and let the teacher add it to the Grade 4 worksheet. Also support the reverse: suggest a simpler perimeter task from a lower-level bank when students need support. These examples describe desired behavior, not a claim that particular entries have already been linked.

## Required analysis and teacher behavior

- Review all completed banks systematically by mathematical concept, student action, prerequisites, representation, and task complexity. Link actual working item families, retaining their course, grade, lesson, source identity and original outcomes.
- Distinguish a harder/easier version of the same skill from a prerequisite, extension, or merely related topic. Explain the connection and what changes: for example number type, shape complexity, missing versus given sides, number of reasoning steps, or construction demands.
- Do not infer difficulty solely from grade/course labels, keyword matches, or standards-code ordering. Use the project's explicit school-grade/course mapping; textbook course names and school grades are separate metadata. Recommendations should indicate any added prerequisite.
- From a selected topic or item, offer understandable routes to easier and harder related content. Show source grade/course, a short reason for the recommendation, and a question preview. Teachers choose what to add; preserve existing selections and allow mixed-bank worksheets.
- Preserve method-specific and visual tasks, including tasks requiring teacher review. Keep genuinely different mathematical demands distinct while connecting repeated curriculum topics.

## Ownership and completion evidence

Math Engine owns the reusable concept links, task relationships and recommendation metadata. Test and Practice Studio owns the teacher discovery, preview and selection workflow and consumes the Engine mapping.

The final milestone should produce a reviewed cross-bank connection map, document topics with no suitable connections or unresolved links, and verify upward and downward selection through worksheet/key export. Include the perimeter example plus representative topics from across the banks; do not claim comprehensive analysis from isolated demonstrations.

This is a teacher-directed feature. It does not expand the current Grade 5-only GradeCam targeting workflow or imply automated student placement. The implementation specification is milestone7-cross-course-v0.1.md.

## Record baseline

Documentation-only addition against MATH-ENGINE commit 1f55f210da955db46e95333f11c8e796e5ccb2f6 (runtime 0.22.0-rc.2) and Studio commit 2cd97e4ca35591cdc31888f7b00939c31fb30d70 (runtime 0.24.0-rc.2). Consulted handbook AI-START-HERE.md, UNIVERSAL-RULES.md and CONDITIONAL-STANDARDS.md, especially S-02, at fd4330863f4cc0812180fbf1de122970a42c7885. No runtime or HTML changes.
