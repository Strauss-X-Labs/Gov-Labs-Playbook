# -*- coding: utf-8 -*-
# שימוש: python3 canva-template.py canva-template.pptx <תצוגה-מקדימה.html>   (דורש python-pptx)
# תבנית לוח Lean Canvas לייבוא ל-Canva: שקף אחד 16:9, כותרת לכל קובייה "N. שם", תיבת "סטטוס:" בכל קובייה,
# תיבת Draft 0, אזור Friendly Tips, תיבת גרסה. לפי 02-תוצרים-וטמפלטים/לוח-Lean-Canvas.md § הלוח ב-Canva + הפריסה.
import sys, html
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.dml import MSO_LINE
from pptx.oxml.ns import qn

OUT_PPTX, OUT_HTML = sys.argv[1], sys.argv[2]
W, H = 13.333, 7.5
NAVY, PLUM, AMBER, AMBER_SOFT, TEAL, GRAY, SOFT, WHITE, MUTED = "242840", "362B48", "FDB415", "FFF6DC", "39A28F", "D9D9D9", "F4F5F7", "FFFFFF", "6B7280"
FONT = "Calibri"

# --- גיאומטריה (אינץ', מקור בפינה השמאלית העליונה) ---
M = 0.3; GAP = 0.1
CAN_R = W - M                # קצה ימין של הקנבס
CAN_W = 9.7
CAN_L = CAN_R - CAN_W
TOP = 1.05; MID = 5.8; BOT = H - M   # שורות
COL_W = (CAN_W - 4 * GAP) / 5
def col(i):  # i=0 העמודה הימנית
    return CAN_R - (i + 1) * COL_W - i * GAP
ROW_H = MID - GAP - TOP      # גובה האזור העליון
HALF = (ROW_H - GAP) / 2
SIDE_L, SIDE_W = M, CAN_L - GAP - M

boxes = []  # (key, title, x, y, w, h, fill, sub) ; sub = label של תת-אזור בתחתית, או None
def add(key, title, x, y, w, h, fill=WHITE, sub=None, subs=None):
    boxes.append(dict(key=key, title=title, x=x, y=y, w=w, h=h, fill=fill, sub=sub, subs=subs))

add("1", "1. הלקוחות", col(0), TOP, COL_W, ROW_H, AMBER_SOFT, sub="מאמצים ראשונים")
add("7", "7. מפתחות להצלחה", col(1), TOP, COL_W, HALF, subs=("יתרון יחסי", "תנאי הכרחי"))
add("8", "8. הטמעה / פריסה", col(1), TOP + HALF + GAP, COL_W, HALF)
add("5", "5. הצעת ערך ייחודית", col(2), TOP, COL_W, HALF, AMBER_SOFT, sub="High Level Concept")
add("3", "3. איך תיראה הצלחה?", col(2), TOP + HALF + GAP, COL_W, HALF)
add("6", "6. הפתרון", col(3), TOP, COL_W, HALF)
add("4", "4. יעדים מדידים", col(3), TOP + HALF + GAP, COL_W, HALF)
add("2", "2. הבעיות", col(4), TOP, COL_W, HALF, AMBER_SOFT, sub="אלטרנטיבות קיימות")
add("9", "9. שותפים בפרויקט", col(4), TOP + HALF + GAP, COL_W, HALF)
BW = (CAN_W - GAP) / 2
add("10", "10. תמורה וערך לארגון / למדינה", CAN_R - BW, MID, BW, BOT - MID)
add("11", "11. תשומות / משאבים", CAN_L, MID, BW, BOT - MID)

# --- PPTX ---
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(W), Inches(H)
slide = prs.slides.add_slide(prs.slide_layouts[6])

def rgb(h): return RGBColor.from_string(h)
def para_rtl(p, align=PP_ALIGN.RIGHT):
    p.alignment = align
    p._pPr.set("rtl", "1")
def run_style(r, size, bold=False, color=NAVY):
    r.font.name = FONT; r.font.size = Pt(size); r.font.bold = bold; r.font.color.rgb = rgb(color)
    rPr = r._r.get_or_add_rPr()
    for tag in ("a:latin", "a:cs"):
        el = rPr.find(qn(tag))
        if el is None:
            el = rPr.makeelement(qn(tag), {}); rPr.append(el)
        el.set("typeface", FONT)
def rect(x, y, w, h, fill, line=NAVY, lw=1.0, dash=None, rounded=False):
    shp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    if rounded: shp.adjustments[0] = 0.04
    shp.shadow.inherit = False
    shp.fill.solid(); shp.fill.fore_color.rgb = rgb(fill)
    if line: shp.line.color.rgb = rgb(line); shp.line.width = Pt(lw)
    else: shp.line.fill.background()
    if dash: shp.line.dash_style = dash
    shp.text_frame.text = ""
    return shp
def text(x, y, w, h, s, size=11, bold=False, color=NAVY, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.TOP, name=None):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0.05); tf.margin_top = tf.margin_bottom = Inches(0.02)
    p = tf.paragraphs[0]; para_rtl(p, align); r = p.add_run(); r.text = s; run_style(r, size, bold, color)
    if name: tb.name = name
    return tb
def dashed_line(x1, y, x2):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y), Inches(x2), Inches(y))
    c.line.color.rgb = rgb(GRAY); c.line.width = Pt(1); c.line.dash_style = MSO_LINE.DASH
    return c

# רקע
bg = rect(0, 0, W, H, WHITE, line=None)
# כותרת
text(CAN_R - 6.2, M, 6.2, 0.5, "Lean Canvas — [שם המיזם]", 22, True, PLUM, anchor=MSO_ANCHOR.MIDDLE, name="title")
text(CAN_R - 6.2, M + 0.46, 6.2, 0.28, "✓ מבוסס · ~ הנחה · ? פער · ⚡ סתירה · פתק אחד = בולט אחד · בפתרון: ← בעיה N", 9.5, False, MUTED, name="legend")
vb = rect(CAN_L, M + 0.06, 2.3, 0.42, SOFT, line=GRAY, rounded=True)
text(CAN_L, M + 0.06, 2.3, 0.42, "גרסה: טיוטה — בעבודה", 11, True, NAVY, anchor=MSO_ANCHOR.MIDDLE, name="version")

# קוביות
for b in boxes:
    rect(b["x"], b["y"], b["w"], b["h"], b["fill"], line=NAVY, lw=1.25)
    text(b["x"] + 0.75, b["y"] + 0.04, b["w"] - 0.8, 0.32, b["title"], 12, True, NAVY, name="title-" + b["key"])
    text(b["x"] + 0.03, b["y"] + 0.06, 0.72, 0.26, "סטטוס:", 9, False, MUTED, align=PP_ALIGN.LEFT, name="status-" + b["key"])
    if b["sub"]:
        sh = 1.05 if b["key"] == "1" else 0.85
        yy = b["y"] + b["h"] - sh
        dashed_line(b["x"] + 0.08, yy, b["x"] + b["w"] - 0.08)
        text(b["x"] + 0.05, yy + 0.03, b["w"] - 0.1, 0.26, b["sub"], 9.5, True, MUTED, name="sub-" + b["key"])
    if b["subs"]:
        half = (b["h"] - 0.42) / 2
        y1 = b["y"] + 0.4
        text(b["x"] + 0.05, y1, b["w"] - 0.1, 0.26, b["subs"][0], 9.5, True, MUTED, name="sub-7a")
        dashed_line(b["x"] + 0.08, y1 + half, b["x"] + b["w"] - 0.08)
        text(b["x"] + 0.05, y1 + half + 0.03, b["w"] - 0.1, 0.26, b["subs"][1], 9.5, True, MUTED, name="sub-7b")

# פאנל צד: Draft 0 ו-Friendly Tips
D0_H = 2.3
rect(SIDE_L, TOP, SIDE_W, D0_H, SOFT, line=GRAY, lw=1.0, rounded=True)
text(SIDE_L + 0.05, TOP + 0.05, SIDE_W - 0.1, 0.3, "Draft 0", 12, True, PLUM, name="draft0-title")
text(SIDE_L + 0.05, TOP + 0.38, SIDE_W - 0.1, D0_H - 0.45, "מצע לדיון לקוביות 1, 2, 5. הסוכן כותב לכאן.", 9.5, False, MUTED, name="draft0")
rect(SIDE_L, TOP + D0_H + GAP, SIDE_W, BOT - (TOP + D0_H + GAP), SOFT, line=GRAY, lw=1.0, rounded=True)
text(SIDE_L + 0.05, TOP + D0_H + GAP + 0.05, SIDE_W - 0.1, 0.3, "Friendly Tips", 12, True, PLUM, name="tips-title")
text(SIDE_L + 0.05, TOP + D0_H + GAP + 0.38, SIDE_W - 0.1, 0.5, "פתק לכל טיפ מהמליאה.", 9.5, False, MUTED, name="tips")

prs.save(OUT_PPTX)

# --- תצוגה מקדימה ב-HTML, אותה גיאומטריה (100px לאינץ') ---
S = 100
def div(x, y, w, h, style, inner=""):
    return f'<div style="position:absolute;left:{x*S:.0f}px;top:{y*S:.0f}px;width:{w*S:.0f}px;height:{h*S:.0f}px;{style}">{inner}</div>'
parts = [div(CAN_R - 6.2, M, 6.2, 0.5, f"font:700 22pt Calibri;color:#{PLUM};direction:rtl;display:flex;align-items:center", "Lean Canvas — [שם המיזם]"),
         div(CAN_R - 6.2, M + 0.46, 6.2, 0.28, f"font:9.5pt Calibri;color:#{MUTED};direction:rtl", "✓ מבוסס · ~ הנחה · ? פער · ⚡ סתירה · פתק אחד = בולט אחד · בפתרון: ← בעיה N"),
         div(CAN_L, M + 0.06, 2.3, 0.42, f"border:1px solid #{GRAY};border-radius:6px;background:#{SOFT};font:700 11pt Calibri;color:#{NAVY};direction:rtl;display:flex;align-items:center;justify-content:center", "גרסה: טיוטה — בעבודה")]
for b in boxes:
    inner = div(0.75, 0.04, b["w"] - 0.8, 0.32, f"font:700 12pt Calibri;color:#{NAVY};direction:rtl;text-align:right", html.escape(b["title"]))
    inner += div(0.03, 0.06, 0.72, 0.26, f"font:9pt Calibri;color:#{MUTED};direction:rtl;text-align:left", "סטטוס:")
    if b["sub"]:
        sh = 1.05 if b["key"] == "1" else 0.85; yy = b["h"] - sh
        inner += div(0.08, yy, b["w"] - 0.16, 0.01, f"border-top:1px dashed #{GRAY}")
        inner += div(0.05, yy + 0.03, b["w"] - 0.1, 0.26, f"font:700 9.5pt Calibri;color:#{MUTED};direction:rtl;text-align:right", b["sub"])
    if b["subs"]:
        half = (b["h"] - 0.42) / 2; y1 = 0.4
        inner += div(0.05, y1, b["w"] - 0.1, 0.26, f"font:700 9.5pt Calibri;color:#{MUTED};direction:rtl;text-align:right", b["subs"][0])
        inner += div(0.08, y1 + half, b["w"] - 0.16, 0.01, f"border-top:1px dashed #{GRAY}")
        inner += div(0.05, y1 + half + 0.03, b["w"] - 0.1, 0.26, f"font:700 9.5pt Calibri;color:#{MUTED};direction:rtl;text-align:right", b["subs"][1])
    parts.append(div(b["x"], b["y"], b["w"], b["h"], f"border:1.5px solid #{NAVY};background:#{b['fill']};box-sizing:border-box", inner))
parts.append(div(SIDE_L, TOP, SIDE_W, D0_H, f"border:1px solid #{GRAY};border-radius:6px;background:#{SOFT};box-sizing:border-box",
    div(0.05, 0.05, SIDE_W - 0.1, 0.3, f"font:700 12pt Calibri;color:#{PLUM};direction:rtl;text-align:right", "Draft 0") +
    div(0.05, 0.38, SIDE_W - 0.1, 1, f"font:9.5pt Calibri;color:#{MUTED};direction:rtl;text-align:right", "מצע לדיון לקוביות 1, 2, 5. הסוכן כותב לכאן.")))
parts.append(div(SIDE_L, TOP + D0_H + GAP, SIDE_W, BOT - (TOP + D0_H + GAP), f"border:1px solid #{GRAY};border-radius:6px;background:#{SOFT};box-sizing:border-box",
    div(0.05, 0.05, SIDE_W - 0.1, 0.3, f"font:700 12pt Calibri;color:#{PLUM};direction:rtl;text-align:right", "Friendly Tips") +
    div(0.05, 0.38, SIDE_W - 0.1, 0.5, f"font:9.5pt Calibri;color:#{MUTED};direction:rtl;text-align:right", "פתק לכל טיפ מהמליאה.")))
open(OUT_HTML, "w", encoding="utf-8").write(f'<!doctype html><html lang="he"><meta charset="utf-8"><body style="margin:0;background:#888"><div style="position:relative;width:{W*S:.0f}px;height:{H*S:.0f}px;background:#fff;margin:0 auto;overflow:hidden">{"".join(parts)}</div></body></html>')
print("ok", len(boxes), "cubes")
