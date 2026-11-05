"""Regenerate the reader's content from the study Markdown and Python files."""

import html
import json
import posixpath
import re
from pathlib import Path
from urllib.parse import unquote

import mistune

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
markdown = mistune.create_markdown(escape=True, plugins=['table', 'strikethrough'])
paths = [ROOT / 'README.md']
topics = sorted(folder for folder in ROOT.iterdir()
                if folder.is_dir() and folder != HERE
                and not folder.name.startswith('.') and (folder / 'README.md').is_file())
for folder in topics:
    paths += sorted((p for p in folder.rglob('*')
                     if p.suffix in ('.md', '.py')
                     and not any(part.startswith('.') or part == '__pycache__'
                                 for part in p.relative_to(folder).parts)),
                    key=lambda p: p.relative_to(ROOT).as_posix().replace('README.md', ''))
known = {p.relative_to(ROOT).as_posix() for p in paths}
pages = []
for path in paths:
    key = path.relative_to(ROOT).as_posix()
    source = path.read_text(encoding='utf-8-sig')
    title_match = re.search(r'^# (.+)', source, re.M) if path.suffix == '.md' else None
    title = title_match.group(1) if title_match else path.name
    content = markdown(source) if path.suffix == '.md' else '<pre><code>' + html.escape(source) + '</code></pre>'

    def link(match):
        target = html.unescape(match.group(1))
        if target.startswith(('https://', 'http://', 'mailto:', '#')):
            return match.group(0)
        dest = posixpath.normpath(posixpath.join(posixpath.dirname(key), unquote(target)))
        if dest in known:
            return 'href="#' + html.escape(dest, quote=True) + '"'
        return match.group(0)

    content = re.sub(r'href="([^"]+)"', link, content)
    group = 'Overview'
    parts = key.split('/')
    if len(parts) > 1:
        group = parts[0]
        if parts[0] == 'c6_Design_Pattern' and len(parts) > 2:
            group = parts[1]
    pages.append(dict(id=key, title=title, group=group, code=path.suffix == '.py', html=content, text=source))
(HERE / 'dist' / 'content.js').write_text('window.STUDY_PAGES = ' + json.dumps(pages, ensure_ascii=True, indent=2).replace('</', '<\\/') + ';\n', encoding='utf-8')
print(f'Built {len(pages)} pages from Markdown notes and Python examples.')
