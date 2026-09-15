#!/usr/bin/env python3
"""
סורק את חומרי-המקור, מזהה קבצים חדשים/שהשתנו/שנמחקו מול סטטוס.md,
וממיר מה שאפשר לטקסט ב-_טקסט/ כדי שסוכן יוכל לקרוא.

תלויות: Python 3 בלבד (stdlib). PDF — דרך pypdf אם מותקן, אחרת הסוכן קורא ישירות.

שימוש:
  python3 skills/scan-sources/scan.py            # סריקה + עדכון סטטוס.md + המרה
  python3 skills/scan-sources/scan.py --dry-run  # רק דיווח, בלי לכתוב
  python3 skills/scan-sources/scan.py --json     # פלט JSON לסוכן
"""
import hashlib, html.parser, json, os, re, subprocess, sys, zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "חומרי-מקור"
TXT = SRC / "_טקסט"
STATUS = SRC / "סטטוס.md"
SKIP_NAMES = {"README.md", "סטטוס.md", ".DS_Store", ".gitkeep"}
COLS = ["קובץ", "hash", "סטטוס", "נוגע ל-", "המלצה / הערות", "עודכן"]

# ---------- המרה לטקסט ----------

def _xml_text(xml: bytes, tag: str, para_tag: str) -> str:
    s = xml.decode("utf-8", "ignore")
    s = re.sub(rf"</{para_tag}>", "\n", s)
    out, buf = [], []
    for m in re.finditer(rf"<{tag}(?:\s[^>]*)?>([^<]*)</{tag}>|(\n)", s):
        if m.group(2):
            out.append("".join(buf)); buf = []
        else:
            buf.append(html.unescape(m.group(1)))
    if buf: out.append("".join(buf))
    return "\n".join(l for l in (x.strip() for x in out) if l)

def conv_pptx(p: Path) -> str:
    with zipfile.ZipFile(p) as z:
        names = z.namelist()
        slides = sorted((n for n in names if re.match(r"ppt/slides/slide\d+\.xml$", n)),
                        key=lambda n: int(re.search(r"(\d+)", n).group(1)))
        out = []
        for n in slides:
            i = re.search(r"(\d+)", n).group(1)
            out.append(f"## שקף {i}\n\n" + _xml_text(z.read(n), "a:t", "a:p"))
            note = f"ppt/notesSlides/notesSlide{i}.xml"
            if note in names:
                t = _xml_text(z.read(note), "a:t", "a:p")
                if t.strip(): out.append(f"### הערות מרצה {i}\n\n{t}")
        return "\n\n".join(out)

def conv_docx(p: Path) -> str:
    with zipfile.ZipFile(p) as z:
        return _xml_text(z.read("word/document.xml"), "w:t", "w:p")

def conv_xlsx(p: Path) -> str:
    with zipfile.ZipFile(p) as z:
        names = z.namelist()
        shared = []
        if "xl/sharedStrings.xml" in names:
            shared = [html.unescape(m) for m in re.findall(r"<t(?:\s[^>]*)?>([^<]*)</t>",
                      z.read("xl/sharedStrings.xml").decode("utf-8", "ignore"))]
        out = []
        for n in sorted(x for x in names if re.match(r"xl/worksheets/sheet\d+\.xml$", x)):
            s = z.read(n).decode("utf-8", "ignore")
            rows = []
            for row in re.findall(r"<row[^>]*>(.*?)</row>", s, re.S):
                cells = []
                for m in re.finditer(r'<c([^>]*)>(.*?)</c>', row, re.S):
                    attrs, body = m.group(1), m.group(2)
                    v = re.search(r"<v>([^<]*)</v>", body)
                    t = re.search(r"<t[^>]*>([^<]*)</t>", body)
                    if 't="s"' in attrs and v: cells.append(shared[int(v.group(1))] if int(v.group(1)) < len(shared) else "")
                    elif t: cells.append(html.unescape(t.group(1)))
                    elif v: cells.append(v.group(1))
                if any(c.strip() for c in cells): rows.append(" | ".join(cells))
            out.append(f"## {n.split('/')[-1]}\n\n" + "\n".join(rows))
        return "\n\n".join(out)

class _HTML(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.t=[]; self.skip=0
    def handle_starttag(self, tag, a):
        if tag in ("script","style"): self.skip+=1
        if tag in ("p","br","div","li","h1","h2","h3","h4","tr"): self.t.append("\n")
    def handle_endtag(self, tag):
        if tag in ("script","style"): self.skip-=1
    def handle_data(self, d):
        if not self.skip: self.t.append(d)

def conv_html(p: Path) -> str:
    h = _HTML(); h.feed(p.read_text("utf-8", "ignore"))
    return re.sub(r"\n{3,}", "\n\n", "".join(h.t)).strip()

def conv_pdf(p: Path) -> str:
    try:
        import pypdf  # type: ignore
        return "\n\n".join((pg.extract_text() or "") for pg in pypdf.PdfReader(str(p)).pages)
    except ImportError:
        raise RuntimeError("PDF: אין pypdf. הסוכן יקרא את הקובץ ישירות (pip install pypdf כדי להמיר)")

def conv_textutil(p: Path) -> str:
    r = subprocess.run(["textutil", "-convert", "txt", "-stdout", str(p)], capture_output=True, text=True)
    if r.returncode: raise RuntimeError("textutil נכשל")
    return r.stdout

CONVERTERS = {
    ".pptx": conv_pptx, ".docx": conv_docx, ".xlsx": conv_xlsx,
    ".html": conv_html, ".htm": conv_html, ".pdf": conv_pdf,
    ".doc": conv_textutil, ".rtf": conv_textutil, ".odt": conv_textutil,
}
PLAIN = {".md", ".txt", ".csv", ".json", ".yaml", ".yml", ".srt", ".vtt"}
IMAGES = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".heic"}

def convert(rel: Path) -> tuple[str, str]:
    """מחזיר (מצב, נתיב טקסט או הודעה)."""
    src, ext = SRC / rel, rel.suffix.lower()
    dst = TXT / rel.with_suffix(rel.suffix + ".md")
    if ext in PLAIN:
        return "מקור-טקסטואלי", str(rel)
    if ext in IMAGES:
        return "תמונה", "צפה בקובץ ישירות"
    fn = CONVERTERS.get(ext)
    if not fn:
        return "לא-נתמך", f"אין ממיר ל-{ext}; קרא ידנית"
    try:
        text = fn(src)
    except Exception as e:
        return "המרה-נכשלה", str(e)
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(f"<!-- הומר אוטומטית מ-{rel} · אל תערוך -->\n\n# {rel.name}\n\n{text}\n", "utf-8")
    return "הומר", str(dst.relative_to(ROOT))

# ---------- סטטוס ----------

def sha(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""): h.update(chunk)
    return h.hexdigest()[:10]

def read_status() -> dict[str, dict]:
    rows = {}
    if not STATUS.exists(): return rows
    for line in STATUS.read_text("utf-8").splitlines():
        if not line.startswith("|") or set(line.replace("|", "").strip()) <= {"-", " ", ":"}: continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != len(COLS) or cells[0] == COLS[0]: continue
        key = cells[0].strip("`")
        rows[key] = dict(zip(COLS, cells))
    return rows

def write_status(rows: dict[str, dict]):
    head = ["# סטטוס חומרי מקור", "",
            "מתוחזק על ידי `skills/scan-sources/scan.py` (העמודות `קובץ`, `hash`, `עודכן`) ועל ידי הסוכן/בן אדם (השאר).",
            "אל תערוך את עמודת ה-hash ידנית.", "",
            "**סטטוסים:** `חדש` → `נבחן` → `שולב` / `לא רלוונטי`. קובץ שהשתנה אחרי בחינה: `השתנה`. קובץ שנעלם: `נמחק`.", "",
            "| " + " | ".join(COLS) + " |", "|" + "---|" * len(COLS)]
    body = ["| " + " | ".join([f"`{k}`"] + [rows[k][c] for c in COLS[1:]]) + " |" for k in sorted(rows)]
    STATUS.write_text("\n".join(head + body) + "\n", "utf-8")

def main():
    dry, as_json = "--dry-run" in sys.argv, "--json" in sys.argv
    if not SRC.exists():
        sys.exit(f"לא נמצאה תיקיית {SRC}")
    today = date.today().isoformat()
    rows = read_status()
    on_disk = {}
    for p in sorted(SRC.rglob("*")):
        if not p.is_file() or p.name in SKIP_NAMES or p.name.startswith("."): continue
        if TXT in p.parents: continue
        on_disk[str(p.relative_to(SRC))] = sha(p)

    report = {"חדש": [], "השתנה": [], "נמחק": [], "ללא-שינוי": [], "המרות": {}}
    for rel, h in on_disk.items():
        if rel not in rows:
            rows[rel] = dict(zip(COLS, [rel, h, "חדש", "", "", today]))
            report["חדש"].append(rel)
        elif rows[rel]["hash"] != h:
            rows[rel].update({"hash": h, "סטטוס": "השתנה", "עודכן": today})
            report["השתנה"].append(rel)
        else:
            report["ללא-שינוי"].append(rel)
    for rel in list(rows):
        if rel not in on_disk and rows[rel]["סטטוס"] != "נמחק":
            rows[rel].update({"סטטוס": "נמחק", "עודכן": today})
            report["נמחק"].append(rel)

    if not dry:
        # ניקוי המרות יתומות — הטקסט של קובץ שכבר לא קיים
        if TXT.exists():
            for t in TXT.rglob("*.md"):
                if str(t.relative_to(TXT))[:-3] not in on_disk: t.unlink()
        for rel in report["חדש"] + report["השתנה"]:
            report["המרות"][rel] = convert(Path(rel))
        write_status(rows)

    if as_json:
        print(json.dumps(report, ensure_ascii=False, indent=2)); return
    print(f"סריקה של {SRC.relative_to(ROOT)} — {today}{' (dry-run)' if dry else ''}\n")
    for k in ("חדש", "השתנה", "נמחק"):
        if report[k]:
            print(f"{k} ({len(report[k])}):")
            for rel in report[k]:
                conv = report["המרות"].get(rel)
                print(f"  - {rel}" + (f"  →  {conv[0]}: {conv[1]}" if conv else ""))
            print()
    print(f"ללא שינוי: {len(report['ללא-שינוי'])}")
    todo = [k for k, r in rows.items() if r["סטטוס"] in ("חדש", "השתנה")]
    if todo: print(f"\nממתינים לבחינה: {len(todo)} — ראה {STATUS.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
