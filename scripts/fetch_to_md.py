#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys
import argparse
import base64
import hashlib
import mimetypes
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, NavigableString
from readability import Document
from slugify import slugify
import html2text

from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def make_session():
    s = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=0.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "HEAD"],
    )
    s.mount("http://", HTTPAdapter(max_retries=retries))
    s.mount("https://", HTTPAdapter(max_retries=retries))
    s.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/126.0 Safari/537.36"
            ),
            # Prefer Japanese content when available
            "Accept-Language": "ja-JP,ja;q=0.9,en;q=0.6"
        }
    )
    return s


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def content_hash(data: bytes) -> str:
    return hashlib.sha1(data).hexdigest()


def guess_ext_from_ct_or_url(content_type: str, url_path: str) -> str:
    if content_type:
        ext = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if ext:
            return ext
        if content_type == "image/webp":
            return ".webp"
    path = urlparse(url_path).path
    _, dot, suffix = path.rpartition(".")
    if dot:
        suf = "." + suffix.split("?")[0].split("#")[0]
        if len(suf) <= 6:
            return suf
    return ".bin"


def extract_title_and_article(html: str):
    doc = Document(html)
    title = doc.short_title() or "document"
    article_html = doc.summary(html_partial=True)
    return title, article_html


def preprocess_code_blocks(soup: BeautifulSoup):
    for pre in soup.find_all("pre"):
        code = pre.code
        if code:
            classes = code.get("class") or []
            lang = None
            for c in classes:
                if c.startswith("language-"):
                    lang = c.split("-", 1)[1]
                    break
            code_text = code.get_text("\n")
        else:
            lang = None
            code_text = pre.get_text("\n")
        md = "\n```{lang}\n{code}\n```\n\n".format(
            lang=(lang or ""), code=code_text.strip("\n")
        )
        pre.replace_with(NavigableString(md))


def absolutize_links(soup: BeautifulSoup, base_url: str):
    for a in soup.find_all("a"):
        href = a.get("href")
        if href and not href.lower().startswith("javascript:"):
            a["href"] = urljoin(base_url, href)


def pick_image_src(img):
    for attr in [
        "src",
        "data-src",
        "data-original",
        "data-lazy-src",
        "data-actualsrc",
    ]:
        val = img.get(attr)
        if val:
            return val
    return None


def replace_images_with_local(
    soup: BeautifulSoup,
    base_url: str,
    assets_dir: Path,
    session: requests.Session,
    name_prefix: str,
    md_out_dir: Path,
):
    for img in soup.find_all("img"):
        src = pick_image_src(img)
        alt = img.get("alt") or ""
        if not src:
            img.replace_with(NavigableString(""))
            continue

        if src.startswith("data:"):
            try:
                header, b64 = src.split(",", 1)
                ct = header.split(";")[0].split(":")[1]
                data = base64.b64decode(b64)
                ext = guess_ext_from_ct_or_url(ct, "")
            except Exception:
                data = b""
                ext = ".bin"
        else:
            abs_url = urljoin(base_url, src)
            try:
                r = session.get(abs_url, timeout=20)
                r.raise_for_status()
                data = r.content
                ct = r.headers.get("Content-Type", "")
                ext = guess_ext_from_ct_or_url(ct, abs_url)
            except Exception:
                img.replace_with(NavigableString(""))
                continue

        h = content_hash(data)[:10]
        alt_slug = slugify(alt) if alt else name_prefix
        filename = f"{alt_slug}-{h}{ext}"
        ensure_dir(assets_dir)
        out_path = assets_dir / filename
        if not out_path.exists():
            with open(out_path, "wb") as f:
                f.write(data)

        rel_path = Path(os.path.relpath(out_path, start=md_out_dir)).as_posix()
        md_img = f"![{alt}]({rel_path})"
        img.replace_with(NavigableString(md_img))


def html_to_markdown(html: str) -> str:
    h = html2text.HTML2Text()
    h.body_width = 0
    h.protect_links = True
    h.ignore_images = True  # images already replaced
    h.ignore_emphasis = False
    h.bypass_tables = False
    h.unicode_snob = True
    md = h.handle(html)
    md = re.sub(r"\n{3,}", "\n\n", md).strip() + "\n"
    return md


def main():
    parser = argparse.ArgumentParser(
        description="Fetch a web page, download images, and convert the main content to Markdown."
    )
    parser.add_argument("url", help="Page URL")
    parser.add_argument(
        "--out", "-o", default="docs/officialdocs/getting-started.md", help="Output Markdown path"
    )
    parser.add_argument(
        "--assets-dir", "-a", default="docs/officialdocs/assets", help="Directory to store images/assets"
    )
    parser.add_argument(
        "--title-level", type=int, default=1, help="Top header level for page title (default: 1 => #)"
    )
    args = parser.parse_args()

    url = args.url
    md_out = Path(args.out)
    md_out_dir = md_out.parent.resolve()
    assets_dir = Path(args.assets_dir).resolve()
    ensure_dir(md_out_dir)
    ensure_dir(assets_dir)

    session = make_session()
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        print(f"[ERROR] Failed to fetch URL: {e}", file=sys.stderr)
        sys.exit(1)

    html = resp.text
    title, article_html = extract_title_and_article(html)

    soup = BeautifulSoup(article_html, "lxml")

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    absolutize_links(soup, url)
    preprocess_code_blocks(soup)

    page_slug = slugify(title or "document") or "document"
    replace_images_with_local(soup, url, assets_dir, session, page_slug, md_out_dir)

    top = "#" * max(1, min(args.title_level, 6))
    title_md = f"{top} {title}\n\n"

    body_md = html_to_markdown(str(soup))
    final_md = title_md + body_md

    with open(md_out, "w", encoding="utf-8") as f:
        f.write(final_md)

    print(f"[OK] Markdown saved to: {md_out}")
    print(f"[OK] Assets saved under: {assets_dir}")


if __name__ == "__main__":
    main()
