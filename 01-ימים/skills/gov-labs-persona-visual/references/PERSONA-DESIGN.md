# Persona page design — "Industrial spec sheet"

Template: `assets/persona-template.html` (in this skill). To create a persona page, **copy that file, keep its `<style>` block and structure unchanged, and replace every `[placeholder]`** with the persona's content from the reviewed MD card. The HTML comments in the template explain what goes in each slot — remove them in the final page. Add or remove list items as the content needs; do not invent new colors, fonts or components.

The MD card is the only content source. The page is derived from it, never the other way round — see "קבצים נלווים" in `02-תוצרים-וטמפלטים/README.md`.

## Page rules
- Hebrew, `dir="rtl"`, `lang="he"`, `<meta charset="utf-8">` first in `<head>`. Latin/mono labels get `class="mono"` (forces LTR inside RTL).
- Single self-contained HTML file. Only external resource: Google Fonts (IBM Plex Sans Hebrew 400/500/700, IBM Plex Mono 500/600). No scripts.
- Portrait is **embedded as base64** (`data:image/jpeg;base64,…` or `data:image/png;base64,…`) from the image file saved next to the MD card under the same base name (`<שם>.jpg` / `<שם>.png`, max 500KB). The image file stays next to the MD as the source; the HTML must open on its own without it.
- No emoji — icons are inline stroke SVGs (`stroke="currentColor"`, width 2).
- No gradients, no shadows, no colored left-border cards.
- Must work at phone width with no horizontal scroll at 320px and 375px (grids use `repeat(auto-fit, minmax(min(…,100%),1fr))`).

## Tokens
| Token | Value | Use |
|---|---|---|
| `--ground` | `#E7E6E2` | page background (concrete gray) |
| `--panel` | `#FFFFFF` | section panels |
| `--panel-sub` | `#F4F3EF` | empathy-map cells |
| `--ink` | `#1E2124` | text, header band, panel top rule, number tags |
| `--accent` | `#F2C230` | safety yellow — warning bar, insight panel, highlights on dark. **Always dark text on it.** |
| `--muted` / `--muted-dark` | `#5A5E63` / `#B9B7B0` | labels on light / on dark |
| radius | `4px` | everything (tags: 2px) |

## Page structure (top → bottom)
1. **Warning bar** (`.banner`, yellow) — "פרסונה השערתית — מודל עבודה לבדיקת שטח, לא ממצא מחקרי". Mandatory while the persona is a hypothesis.
2. **Dark header** (`.hero`): mono top line `PERSONA SHEET · P-0X · <SIDE>` + `STATUS`; base64 portrait with caption "המחשה לפרסונה השערתית — אינה ממצא מחקרי"; mono eyebrow; `h1` name + nickname in muted; tagline; 2×2 `.meta` grid (STATUS / CREATED / SUB-TEAM / PLANT).
3. **Numbered sections** — each a `.panel` with `.sec-head` → `.num` tag (`01`, `02`…) + `h2`:
   - 01 Demographics as `dl.kv` (label/value rows)
   - 02 JTBD as `ul.checks` (check icon per item)
   - 03 Empathy map: `.empathy` grid of 4 `.cell`s — אומר/SAYS, חושב/THINKS, מרגיש/FEELS, עושה/DOES (match the persona's gender in the Hebrew headings). Quotes use ״…״; the single most telling quote gets `class="key"`.
   - 04 Pain points: `.pains` grid, each item labelled `PAIN-01`…
   - 05 Insight — **only if the MD card contains one**: `.insight` (yellow) + `.tag` "לא מסקנה"; first sentence as `.lead`. No insight in the MD → omit the section entirely and renumber the sections after it. Never write an insight that isn't in the MD.
   - Next: Not-yet-filled sections (assumptions → interview guide, field learning): `.pending` (dashed border, outline `.num`, mono `PENDING ·` prefix).
4. **Footer**: "מידע נוסף" line (from the MD) + mono `P-0X · HYPOTHESIS · NOT A RESEARCH FINDING`.

## Hypothesis marks
Every field keeps the hypothesis marks it has in the MD card (README: "כל שדה מסומן כהשערה כמו ב-MD"). Where the MD marks a field as a hypothesis, uncertain or disputed, append `<span class="hyp">השערה</span>` — or the MD's own wording — right after it. Mirror the MD exactly: don't add marks it doesn't have, don't drop any it has. The banner and status do not replace field-level marks.

## Content rules
- Keep the source wording; don't add facts, stats, quotes or insights that aren't in the MD card.
- The portrait is not a content source — nothing in it goes into the page text.
- When a persona moves from hypothesis to validated: remove the warning bar, change STATUS, and turn `.pending` sections into regular `.panel`s.
