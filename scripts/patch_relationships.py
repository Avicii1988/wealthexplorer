#!/usr/bin/env python3
"""
Extract relationship data from TypeScript extras files and patch celebs.json.
Handles two formats:
  1. mk('id', ..., { relationships object }) — in extraCelebrities.ts
  2. 'id': { ..., relationships: { ... } }   — in extras_01.ts … extras_18.ts
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
CELEBS_JSON = ROOT / 'public' / 'data' / 'celebs.json'
EXTRAS_FILES = [
    ROOT / 'src' / 'data' / 'extraCelebrities.ts',
    *sorted((ROOT / 'src' / 'data').glob('extras_*.ts')),
]

# ── helpers ──────────────────────────────────────────────────────────────────

def js_arr_to_py(s: str) -> list:
    """Convert JS ['a', 'b', ...] string to Python list."""
    s = s.strip()
    if not s.startswith('['):
        return []
    inner = s[1:s.rfind(']')]
    items = re.findall(r"'([^']*)'|\"([^\"]*)\"", inner)
    return [a or b for a, b in items]

def js_str_to_py(s: str) -> str:
    s = s.strip()
    m = re.match(r"""^['"](.*)['"]$""", s, re.DOTALL)
    return m.group(1) if m else s.strip("'\"")

def parse_rel_obj(obj_str: str) -> dict:
    rel = {}
    for field in ('parents', 'exSpouse', 'exPartner', 'siblings', 'children', 'grandchildren'):
        m = re.search(rf'\b{field}\s*:\s*(\[[^\]]*\])', obj_str, re.DOTALL)
        if m:
            vals = js_arr_to_py(m.group(1))
            if vals:
                rel[field] = vals
    for field in ('spouse', 'partner', 'fiancé'):
        m = re.search(rf"""\b{re.escape(field)}\s*:\s*(['"][^'"]*['"])""", obj_str)
        if m:
            val = js_str_to_py(m.group(1))
            if val:
                rel[field] = val
    return rel

REL_KEYS = ('spouse', 'partner', 'parents', 'children', 'siblings',
            'exSpouse', 'exPartner', 'fiancé', 'grandchildren')

def find_brace_blocks(source: str):
    """
    Yield (start, end) of every top-level { } block in source,
    skipping strings and nested braces.
    """
    i = 0
    n = len(source)
    while i < n:
        ch = source[i]
        if ch in ('"', "'"):
            q = ch; i += 1
            while i < n:
                if source[i] == '\\': i += 2; continue
                if source[i] == q: break
                i += 1
        elif ch == '`':
            i += 1
            while i < n and source[i] != '`':
                if source[i] == '\\': i += 1
                i += 1
        elif ch == '{':
            depth = 1; start = i; i += 1
            while i < n and depth > 0:
                c = source[i]
                if c == '{': depth += 1
                elif c == '}': depth -= 1
                elif c in ('"', "'"):
                    q = c; i += 1
                    while i < n:
                        if source[i] == '\\': i += 2; continue
                        if source[i] == q: break
                        i += 1
                i += 1
            yield start, i
            continue
        i += 1

def extract_from_mk_calls(source: str) -> dict:
    """Format 1: mk('id', ..., { spouse: ... }) in extraCelebrities.ts"""
    results = {}
    for m in re.finditer(r'\bmk\(', source):
        call_start = m.end()
        # find matching closing paren
        depth = 1; i = call_start; n = len(source)
        while i < n and depth > 0:
            ch = source[i]
            if ch == '(': depth += 1
            elif ch == ')': depth -= 1
            elif ch in ('"', "'"):
                q = ch; i += 1
                while i < n:
                    if source[i] == '\\': i += 2; continue
                    if source[i] == q: break
                    i += 1
            elif ch == '`':
                i += 1
                while i < n and source[i] != '`':
                    if source[i] == '\\': i += 1
                    i += 1
            i += 1
        call_body = source[call_start:i-1]

        # first arg = id
        id_m = re.match(r"""\s*['"]([^'"]+)['"]""", call_body)
        if not id_m:
            continue
        celeb_id = id_m.group(1)

        # find the last brace block that contains relationship keys
        last_rel_block = None
        for bstart, bend in find_brace_blocks(call_body):
            snippet = call_body[bstart:bend]
            if any(k in snippet for k in REL_KEYS):
                last_rel_block = snippet

        if last_rel_block:
            rel = parse_rel_obj(last_rel_block)
            if rel:
                results[celeb_id] = rel

    return results


def extract_from_record_format(source: str) -> dict:
    """
    Format 2: 'id': { ..., relationships: { ... }, ... }
    Used in extras_01.ts … extras_18.ts
    """
    results = {}
    # Find each entry key: 'some-id': {
    for m in re.finditer(r"""'([^']+)'\s*:\s*\{""", source):
        celeb_id = m.group(1)
        obj_start = m.end() - 1  # points to the opening {
        # find the matching }
        depth = 1; i = obj_start + 1; n = len(source)
        while i < n and depth > 0:
            ch = source[i]
            if ch == '{': depth += 1
            elif ch == '}': depth -= 1
            elif ch in ('"', "'"):
                q = ch; i += 1
                while i < n:
                    if source[i] == '\\': i += 2; continue
                    if source[i] == q: break
                    i += 1
            i += 1
        entry_body = source[obj_start:i]

        # Look for `relationships: { ... }` inside this entry
        rel_m = re.search(r'\brelationships\s*:\s*(\{)', entry_body)
        if not rel_m:
            continue

        # Find the matching } for this inner block
        rs = rel_m.start(1)
        rdepth = 1; ri = rs + 1
        while ri < len(entry_body) and rdepth > 0:
            rc = entry_body[ri]
            if rc == '{': rdepth += 1
            elif rc == '}': rdepth -= 1
            elif rc in ('"', "'"):
                q = rc; ri += 1
                while ri < len(entry_body):
                    if entry_body[ri] == '\\': ri += 2; continue
                    if entry_body[ri] == q: break
                    ri += 1
            ri += 1
        rel_str = entry_body[rs:ri]
        rel = parse_rel_obj(rel_str)
        if rel:
            results[celeb_id] = rel

    return results


def main():
    print(f"Loading {CELEBS_JSON} …")
    with open(CELEBS_JSON, 'r', encoding='utf-8') as f:
        celebs = json.load(f)
    id_map = {c['id']: i for i, c in enumerate(celebs)}

    all_rels: dict = {}
    for path in EXTRAS_FILES:
        if not path.exists():
            print(f"  skip (not found): {path.name}")
            continue
        src = path.read_text(encoding='utf-8')

        if 'mk(' in src:
            rels = extract_from_mk_calls(src)
        else:
            rels = extract_from_record_format(src)

        if rels:
            print(f"  {path.name}: {len(rels)} entries")
        all_rels.update(rels)

    print(f"\nTotal relationship entries: {len(all_rels)}")

    patched = 0
    skipped = []
    for celeb_id, rel in all_rels.items():
        if celeb_id not in id_map:
            skipped.append(celeb_id)
            continue
        celebs[id_map[celeb_id]]['relationships'] = rel
        patched += 1

    print(f"Patched {patched} celebrities")
    if skipped:
        print(f"  Not in celebs.json ({len(skipped)}): {', '.join(skipped[:20])}")

    with open(CELEBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(celebs, f, ensure_ascii=False, separators=(',', ':'))
    print(f"Wrote {CELEBS_JSON}")


if __name__ == '__main__':
    main()
