#!/usr/bin/env python3
"""Render the searchable skills page and homepage counts from HYDRA's index."""

import argparse
import html
import json
import re
from pathlib import Path

LABELS = {
    "web": (
        "Web Exploitation",
        "XSS, SQLi, SSRF, SSTI, GraphQL and web attack techniques.",
    ),
    "forensics-defense": (
        "Forensics & Defense",
        "Incident response, malware analysis, detection and threat hunting.",
    ),
    "platform": (
        "Platform Attacks",
        "Operating systems, identity, containers and infrastructure.",
    ),
    "binary": ("Binary Exploitation", "Memory safety, heap, ROP and binary analysis."),
    "recon": (
        "Reconnaissance",
        "Subdomains, DNS, source control, JavaScript and attack-surface mapping.",
    ),
    "crypto": (
        "Cryptography",
        "TLS, key management and cryptographic implementation testing.",
    ),
    "mobile": ("Mobile", "Android, iOS and mobile application security."),
    "ai": (
        "AI Security",
        "LLM, prompt injection, agentic and model-supply-chain security.",
    ),
    "other": (
        "Other Security Skills",
        "Additional security engineering and specialist playbooks.",
    ),
    "cve-specialized": (
        "CVE & Specialized Playbooks",
        "CVE-, CWE-, framework- and scenario-specific security guides.",
    ),
}


def matching_div_end(text: str, open_pos: int) -> int:
    token = re.compile(r"</?div\b[^>]*>", re.I)
    depth = 0
    for match in token.finditer(text, open_pos):
        if match.group(0).lower().startswith("</"):
            depth -= 1
            if depth == 0:
                return match.start()
        else:
            depth += 1
    raise ValueError("could not find matching </div>")


def card(name: str, description: str) -> str:
    short = description.strip().strip("'\"`")
    if len(short) >= 280:
        short = short[:277].rsplit(" ", 1)[0] + "…"
    return (
        f'<div class="scard" data-name="{html.escape(name, quote=True)}">'
        f"<b>{html.escape(name)}</b><p>{html.escape(short)}</p></div>"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("index", type=Path, help="path to HYDRA skills/index.json")
    parser.add_argument(
        "--site", type=Path, default=Path(__file__).resolve().parent.parent
    )
    args = parser.parse_args()
    index = json.loads(args.index.read_text(encoding="utf-8"))
    skills = index["skills"]
    total = index["total"]
    if total != len(skills):
        raise SystemExit(f"index total {total} does not match {len(skills)} entries")

    groups = {}
    for item in skills:
        groups.setdefault(item.get("category", "other"), []).append(item)
    unknown = set(groups) - set(LABELS)
    if unknown:
        raise SystemExit("unknown skill categories: " + ", ".join(sorted(unknown)))

    skills_path = args.site / "skills.html"
    text = skills_path.read_text(encoding="utf-8")
    start_marker = '<h3 class="cat-h" data-cat='
    start = text.find(start_marker)
    end = text.find('<p id="noresult"', start)
    if start < 0 or end < 0:
        raise SystemExit("skills.html card-grid markers not found")
    rendered = []
    order = list(LABELS)
    for category in order:
        items = groups.get(category, [])
        if not items:
            continue
        label, _ = LABELS[category]
        rendered.append(
            f'<h3 class="cat-h" data-cat="{category}">{html.escape(label)} '
            f'<i>{len(items)}</i></h3><div class="sgrid">'
        )
        rendered.extend(
            card(item["name"], item.get("description", "")) for item in items
        )
        rendered.append("</div>")
    text = text[:start] + "".join(rendered) + text[end:]
    text = re.sub(r"\b\d+ skill modules\b", f"{total} skill modules", text)
    text = re.sub(r"\b\d+ skills…", f"{total} skills…", text, count=1)
    text = re.sub(
        r'content="Browse all \d+ security skill modules',
        f'content="Browse all {total} security skill modules',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta name="description" content="Browse all \d+ security skill modules',
        f'<meta name="description" content="Browse all {total} security skill modules',
        text,
        count=1,
    )
    skills_path.write_text(text, encoding="utf-8")

    home_path = args.site / "index.html"
    home = home_path.read_text(encoding="utf-8")
    home = re.sub(r"\b979\b", str(total), home)
    marker = '<div class="skill-cats rv">'
    pos = home.find(marker)
    if pos < 0:
        raise SystemExit("homepage skill-cats block not found")
    body_start = pos + len(marker)
    body_end = matching_div_end(home, pos)
    category_cards = []
    for category in order:
        items = groups.get(category, [])
        if not items:
            continue
        label, desc = LABELS[category]
        category_cards.append(
            f'<div class="scat"><b>{html.escape(label)} <i>{len(items)}</i></b>'
            f"<p>{html.escape(desc)}</p></div>"
        )
    home = home[:body_start] + "".join(category_cards) + home[body_end:]
    home_path.write_text(home, encoding="utf-8")

    rendered_page = skills_path.read_text(encoding="utf-8")
    names = re.findall(r'<div class="scard" data-name="([^"]+)">', rendered_page)
    expected_names = [item["name"] for item in skills]
    if (
        len(names) != total
        or len(set(names)) != total
        or set(names) != set(expected_names)
    ):
        raise SystemExit("rendered skill cards do not match skills/index.json")
    if (
        f"{total} skill modules" not in rendered_page
        or f"Search {total} skills" not in rendered_page
    ):
        raise SystemExit("skills page count/placeholder did not update")
    rendered_home = home_path.read_text(encoding="utf-8")
    if f'data-count="{total}"' not in rendered_home:
        raise SystemExit("homepage animated skills count did not update")
    print(f"Rendered {total} skill cards in {len(groups)} categories.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
