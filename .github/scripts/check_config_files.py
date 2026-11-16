#!/usr/bin/env python3
"""בדיקת תקינות של קובצי תצורה ב-repo. רץ ב-GitHub Actions על כל PR.

מה נבדק (רק קבצים שבמעקב git):
  1. frontmatter בכל קובץ Markdown שמתחיל ב-`---`: נסגר, YAML תקין, ומכיל מפתחות.
  2. כל SKILL.md: יש frontmatter, יש name ו-description, ו-name זהה לשם התיקייה.
  3. כל קובץ JSON ו-TOML נקרא בלי שגיאה.

הרצה מקומית, מהשורש של ה-repo:
    pip install pyyaml
    python3 .github/scripts/check_config_files.py

קוד יציאה: 0 כשהכול תקין, 1 כשנמצאה לפחות שגיאה אחת.
"""

import json
import os
import re
import subprocess
import sys
import tomllib
from pathlib import Path

import yaml

FRONTMATTER = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(\r?\n|\Z)", re.DOTALL)

errors = []


def report(path, line, message):
    errors.append((path, line, message))
    # שורת annotation: GitHub מציג את השגיאה על הקובץ והשורה בתוך ה-PR.
    if os.environ.get("GITHUB_ACTIONS"):
        clean = message.replace("%", "%25").replace("\r", "").replace("\n", "%0A")
        print(f"::error file={path},line={line}::{clean}")


def tracked_files():
    out = subprocess.run(
        ["git", "ls-files", "-z"], check=True, capture_output=True
    ).stdout
    return [p for p in out.decode("utf-8").split("\0") if p]


def check_markdown(path):
    text = Path(path).read_text(encoding="utf-8")
    is_skill = Path(path).name == "SKILL.md"

    if not text.startswith("---"):
        if is_skill:
            report(path, 1, "SKILL.md בלי frontmatter: הקובץ צריך להתחיל ב-`---`.")
        return

    match = FRONTMATTER.match(text)
    if not match:
        report(path, 1, "ה-frontmatter לא נסגר: חסרה שורת `---` סוגרת.")
        return

    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError as exc:
        mark = getattr(exc, "problem_mark", None)
        # +2: שורה אחת על ה-`---` הפותח, ועוד אחת כי mark.line מתחיל מ-0.
        line = mark.line + 2 if mark else 1
        problem = getattr(exc, "problem", None) or str(exc)
        hint = ""
        if "mapping values are not allowed" in problem:
            hint = (
                " כנראה יש נקודתיים ואחריהן רווח בתוך ערך בלי מירכאות."
                " החליפו את הנקודתיים במקף, או עטפו את כל הערך במירכאות."
            )
        column = f", טור {mark.column + 1}" if mark else ""
        report(path, line, f"YAML לא תקין ב-frontmatter{column}: {problem}.{hint}")
        return

    if not isinstance(data, dict):
        report(path, 2, "ה-frontmatter צריך להיות רשימת מפתחות (`key: value`).")
        return

    if is_skill:
        for key in ("name", "description"):
            value = data.get(key)
            if not isinstance(value, str) or not value.strip():
                report(path, 2, f"ב-SKILL.md חסר `{key}`, או שהוא ריק.")
        folder = Path(path).parent.name
        name = data.get("name")
        if isinstance(name, str) and name != folder:
            report(
                path,
                2,
                f"ה-`name` ({name}) לא זהה לשם התיקייה ({folder}).",
            )


def check_json(path):
    try:
        json.loads(Path(path).read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report(path, exc.lineno, f"JSON לא תקין: {exc.msg} (טור {exc.colno}).")


def check_toml(path):
    try:
        tomllib.loads(Path(path).read_text(encoding="utf-8"))
    except tomllib.TOMLDecodeError as exc:
        report(path, getattr(exc, "lineno", None) or 1, f"TOML לא תקין: {exc}.")


def main():
    checked = {"md": 0, "json": 0, "toml": 0}
    for path in tracked_files():
        if not os.path.isfile(path):
            continue
        suffix = Path(path).suffix.lower()
        if suffix == ".md":
            check_markdown(path)
            checked["md"] += 1
        elif suffix == ".json":
            check_json(path)
            checked["json"] += 1
        elif suffix == ".toml":
            check_toml(path)
            checked["toml"] += 1

    print(
        f"נבדקו {checked['md']} קובצי Markdown, "
        f"{checked['json']} קובצי JSON ו-{checked['toml']} קובצי TOML."
    )
    if errors:
        print(f"\nנמצאו {len(errors)} שגיאות:\n")
        for path, line, message in errors:
            print(f"  {path}:{line}\n    {message}\n")
        return 1
    print("הכול תקין.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
