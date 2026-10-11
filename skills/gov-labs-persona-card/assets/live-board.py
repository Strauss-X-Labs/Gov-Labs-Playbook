#!/usr/bin/env python3
"""לוח חי לסשן תשאול הפרסונה — שרת מקומי קטן, ספריית התקן בלבד.

  python3 live-board.py serve --dir .live [--port 8765]
      מגיש את הלוח בכתובת http://127.0.0.1:<port>/ . הדף קורא את state.json
      שהסוכן כותב, ושולח את תשובות הצוות ל-answers.jsonl.

  python3 live-board.py wait --dir .live --after <N> [--timeout 540]
      ממתין לתשובה שמספרה גדול מ-N, מדפיס אותה כשורת JSON ויוצא.
      אין תשובה עד סוף הזמן — מדפיס TIMEOUT. הסוכן מריץ שוב.

מאזין רק ל-127.0.0.1. שום דבר לא יוצא מהמחשב.
"""
import argparse, json, os, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))


def read_answers(d):
    p = os.path.join(d, "answers.jsonl")
    if not os.path.exists(p):
        return []
    out = []
    with open(p, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    out.append(json.loads(line))
                except ValueError:
                    pass
    return out


def serve(d, port):
    os.makedirs(d, exist_ok=True)
    page = os.path.join(HERE, "live-board.html")

    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def send(self, code, body, ctype):
            if isinstance(body, str):
                body = body.encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", ctype + "; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            path = self.path.split("?")[0]
            if path in ("/", "/index.html"):
                with open(page, "rb") as f:
                    self.send(200, f.read(), "text/html")
            elif path == "/state":
                p = os.path.join(d, "state.json")
                body = "{}"
                if os.path.exists(p):
                    with open(p, encoding="utf-8") as f:
                        body = f.read()
                answers = read_answers(d)
                last = answers[-1]["id"] if answers else 0
                self.send(200, json.dumps({"state_raw": body, "last_answer": last, "page": int(os.path.getmtime(page))}), "application/json")
            elif path.startswith("/out/"):
                # התוצרים של המיזם (כרטיס, תמונה, HTML) — מוגשים מ-תוצרים/ שליד .live
                from urllib.parse import unquote
                import mimetypes
                root = os.path.realpath(os.path.join(d, os.pardir, "תוצרים"))
                f = os.path.realpath(os.path.join(root, unquote(path[5:])))
                if not f.startswith(root + os.sep) or not os.path.isfile(f):
                    return self.send(404, "not found", "text/plain")
                ctype = mimetypes.guess_type(f)[0] or "application/octet-stream"
                with open(f, "rb") as fh:
                    body = fh.read()
                self.send_response(200)
                self.send_header("Content-Type", ctype + ("; charset=utf-8" if ctype.startswith("text/") else ""))
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send(404, "not found", "text/plain")

        def do_POST(self):
            if self.path != "/answer":
                return self.send(404, "not found", "text/plain")
            n = int(self.headers.get("Content-Length") or 0)
            if n > 20000:
                return self.send(413, "too long", "text/plain")
            try:
                data = json.loads(self.rfile.read(n).decode("utf-8"))
            except ValueError:
                return self.send(400, "bad json", "text/plain")
            answers = read_answers(d)
            rec = {
                "id": (answers[-1]["id"] if answers else 0) + 1,
                "time": time.strftime("%H:%M:%S"),
                "who": str(data.get("who", "")).strip()[:60],
                "kind": data.get("kind") if data.get("kind") in ("answer", "skip", "start", "finish") else "answer",
                "text": str(data.get("text", "")).strip(),
                "basis_kind": str(data.get("basis_kind", "")).strip()[:80],
                "basis_text": str(data.get("basis_text", "")).strip()[:500],
                "quadrant": data.get("quadrant") if data.get("quadrant") in ("says", "thinks", "feels", "does") else None,
            }
            with open(os.path.join(d, "answers.jsonl"), "a", encoding="utf-8") as f:
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            self.send(200, json.dumps({"id": rec["id"]}), "application/json")

    for p in range(port, port + 20):
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", p), H)
            break
        except OSError:
            continue
    else:
        sys.exit("no free port")
    print("http://127.0.0.1:%d/" % p, flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


def wait(d, after, timeout):
    end = time.time() + timeout
    while time.time() < end:
        new = [a for a in read_answers(d) if a["id"] > after]
        if new:
            time.sleep(0.3)  # תשובות שנשלחו ממש יחד
            for a in [a for a in read_answers(d) if a["id"] > after]:
                print(json.dumps(a, ensure_ascii=False))
            return
        time.sleep(0.5)
    print("TIMEOUT")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("serve"); s.add_argument("--dir", default=".live"); s.add_argument("--port", type=int, default=8765)
    w = sub.add_parser("wait"); w.add_argument("--dir", default=".live"); w.add_argument("--after", type=int, default=0); w.add_argument("--timeout", type=int, default=540)
    a = ap.parse_args()
    serve(a.dir, a.port) if a.cmd == "serve" else wait(a.dir, a.after, a.timeout)
