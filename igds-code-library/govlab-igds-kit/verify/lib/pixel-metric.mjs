// Region-aware pixel metric for L2 (plan v3 §5.1). Figma and the browser rasterise glyph edges differently, so one
// whole-image threshold cannot separate rasteriser noise from real defects (measured on Button: correct renders reach
// 3.7% differing pixels in text, a 1px shift gives 2.9%). Therefore:
//   non-text pixels : strict pixelmatch (threshold 0.1, anti-aliased pixels excluded) -> every differing pixel counts
//   text boxes      : both images get the SAME 3x3 box blur before comparing (removes glyph-edge rasterisation noise,
//                     keeps wrong colour / weight / position / content); text geometry + typography are also exact in L1
// Pass limits are not guessed: verify/l2-calibrate results (mutations that must be caught) fix them; see PASS below.
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export const PASS = { restMaxPx: 0.0015, textMaxShare: 0.02 }; // rest: share of non-text pixels; text: share of text-box pixels (blurred)

function blur(png) {
  const { width: W, height: H, data } = png; const out = Buffer.alloc(data.length);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const k = (yy * W + xx) * 4; const al = data[k + 3] / 255; r += data[k] * al; g += data[k + 1] * al; b += data[k + 2] * al; a += data[k + 3]; n++; }
    const k = (y * W + x) * 4; const A = a / n; const f = A > 0 ? 255 / A : 0;
    out[k] = Math.min(255, Math.round((r / n) * f)); out[k + 1] = Math.min(255, Math.round((g / n) * f)); out[k + 2] = Math.min(255, Math.round((b / n) * f)); out[k + 3] = Math.round(A);
  }
  return { width: W, height: H, data: out };
}

// ref, code: PNG objects of identical size; textBoxes: [{x,y,w,h}] in device pixels (relative to the image)
export function compareRegions(ref, code, textBoxes, diffOut) {
  const W = ref.width, H = ref.height;
  const inText = new Uint8Array(W * H);
  for (const b of textBoxes) for (let y = Math.max(0, Math.floor(b.y) - 1); y < Math.min(H, Math.ceil(b.y + b.h) + 1); y++) for (let x = Math.max(0, Math.floor(b.x) - 1); x < Math.min(W, Math.ceil(b.x + b.w) + 1); x++) inText[y * W + x] = 1;
  // non-text: blurred (absorbs edge anti-aliasing of shapes/icons), threshold 0.1, every remaining pixel counts
  const br = blur(ref), bc = blur(code); const d1 = Buffer.alloc(W * H * 4);
  pixelmatch(br.data, bc.data, d1, W, H, { threshold: 0.1, includeAA: true, alpha: 0.2 });
  let rest = 0, restArea = 0;
  for (let i = 0; i < W * H; i++) if (!inText[i]) { restArea++; const k = i * 4; if (d1[k] === 255 && d1[k + 1] === 0 && d1[k + 2] === 0) rest++; }
  // text: per text box, best alignment within ±SHIFT_X / ±SHIFT_Y device px (sub-pixel glyph placement; exact text
  // geometry is L1's job), then blurred comparison; the box's differing share at the best offset counts
  const SHIFT_X = 2, SHIFT_Y = 1;
  const yiq = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
  const px = (img, x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return [255, 255, 255, 0]; const k = (y * W + x) * 4; return [img.data[k], img.data[k + 1], img.data[k + 2], img.data[k + 3]]; };
  const differs = (p, q) => { const a1 = p[3] / 255, a2 = q[3] / 255; const l1 = yiq(p[0], p[1], p[2]) * a1 + 255 * (1 - a1), l2 = yiq(q[0], q[1], q[2]) * a2 + 255 * (1 - a2); const dc = Math.abs(p[0] * a1 - q[0] * a2) + Math.abs(p[1] * a1 - q[1] * a2) + Math.abs(p[2] * a1 - q[2] * a2); return Math.abs(l1 - l2) > 25.5 || dc > 76; };
  let text = 0, textArea = 0;
  for (const b of textBoxes) {
    const x0 = Math.max(0, Math.floor(b.x) - 1), y0 = Math.max(0, Math.floor(b.y) - 1), x1 = Math.min(W, Math.ceil(b.x + b.w) + 1), y1 = Math.min(H, Math.ceil(b.y + b.h) + 1);
    let best = Infinity;
    for (let dy = -SHIFT_Y; dy <= SHIFT_Y; dy++) for (let dx = -SHIFT_X; dx <= SHIFT_X; dx++) {
      let n = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (differs(px(br, x, y), px(bc, x + dx, y + dy))) n++;
      if (n < best) best = n;
    }
    text += best; textArea += (x1 - x0) * (y1 - y0);
  }
  if (diffOut) pixelmatch(ref.data, code.data, diffOut.data, W, H, { threshold: 0.1, includeAA: false, alpha: 0.2 });
  const restShare = restArea ? rest / restArea : 0, textShare = textArea ? text / textArea : 0;
  return { rest, restArea, restShare, text, textArea, textShare, pass: restShare <= PASS.restMaxPx && textShare <= PASS.textMaxShare };
}
