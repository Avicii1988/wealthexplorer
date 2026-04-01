#!/usr/bin/env python3
"""
Extract relationship and gossip/controversy data from TypeScript extras files
and patch celebs.json.

Handles two formats:
  1. mk('id', ..., { relationships object }) — in extraCelebrities.ts
  2. 'id': { ..., relationships: {...}, gossip: [...] } — in extras_*.ts
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
CELEBS_JSON = ROOT / 'public' / 'data' / 'celebs.json'
EXTRAS_FILES = [
    ROOT / 'src' / 'data' / 'extraCelebrities.ts',
    *sorted((ROOT / 'src' / 'data').glob('extras_*.ts')),
]

REL_KEYS = ('spouse', 'partner', 'parents', 'children', 'siblings',
            'exSpouse', 'exPartner', 'fiancé', 'grandchildren')

# ── helpers ──────────────────────────────────────────────────────────────────

def js_arr_to_py(s: str) -> list:
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


def scan_braces(source: str, start: int) -> int:
    """Given index of '{', return index just past the matching '}'."""
    depth = 1
    i = start + 1
    n = len(source)
    while i < n and depth > 0:
        ch = source[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        elif ch in ('"', "'"):
            q = ch; i += 1
            while i < n:
                if source[i] == '\\': i += 2; continue
                if source[i] == q: break
                i += 1
        i += 1
    return i


def scan_brackets(source: str, start: int) -> int:
    """Given index of '[', return index just past the matching ']'."""
    depth = 1
    i = start + 1
    n = len(source)
    while i < n and depth > 0:
        ch = source[i]
        if ch == '[': depth += 1
        elif ch == ']': depth -= 1
        elif ch in ('"', "'"):
            q = ch; i += 1
            while i < n:
                if source[i] == '\\': i += 2; continue
                if source[i] == q: break
                i += 1
        i += 1
    return i


def parse_gossip_array(arr_str: str) -> list:
    """
    Parse a JS gossip array string:
    [{ title: '...', summary: '...', type: 'gossip'|'controversy', date: '...' }, ...]
    """
    items = []
    # Find each object block in the array
    i = 1  # skip opening [
    n = len(arr_str)
    while i < n:
        ch = arr_str[i]
        if ch == '{':
            end = scan_braces(arr_str, i)
            obj_str = arr_str[i:end]
            item = {}
            for field in ('title', 'summary', 'type', 'date'):
                # Match field: 'value' or field: "value"  (possibly multi-line for summary)
                m = re.search(
                    rf"""\b{field}\s*:\s*(['"])(.*?)\1""",
                    obj_str, re.DOTALL
                )
                if m:
                    item[field] = m.group(2)
            if item.get('title') and item.get('summary'):
                items.append(item)
            i = end
        else:
            i += 1
    return items


# ── Format 1: mk() calls ─────────────────────────────────────────────────────

def extract_from_mk_calls(source: str) -> dict:
    results = {}
    for m in re.finditer(r'\bmk\(', source):
        call_start = m.end()
        depth = 1; i = call_start; n = len(source)
        while i < n and depth > 0:
            ch = source[i]
            if ch == '(':   depth += 1
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

        id_m = re.match(r"""\s*['"]([^'"]+)['"]""", call_body)
        if not id_m:
            continue
        celeb_id = id_m.group(1)

        # Find last brace block with relationship keys
        last_rel = None
        j = 0
        bn = len(call_body)
        while j < bn:
            ch = call_body[j]
            if ch in ('"', "'"):
                q = ch; j += 1
                while j < bn:
                    if call_body[j] == '\\': j += 2; continue
                    if call_body[j] == q: break
                    j += 1
            elif ch == '{':
                end = scan_braces(call_body, j)
                snippet = call_body[j:end]
                if any(k in snippet for k in REL_KEYS):
                    last_rel = snippet
                j = end
                continue
            j += 1

        entry = {}
        if last_rel:
            rel = parse_rel_obj(last_rel)
            if rel:
                entry['relationships'] = rel
        if entry:
            results[celeb_id] = entry

    return results


# ── Format 2: Record<string, Ext> ────────────────────────────────────────────

def extract_from_record_format(source: str) -> dict:
    results = {}
    for m in re.finditer(r"""'([^']+)'\s*:\s*\{""", source):
        celeb_id = m.group(1)
        obj_start = m.end() - 1
        obj_end = scan_braces(source, obj_start)
        entry_body = source[obj_start:obj_end]

        entry = {}

        # relationships
        rel_m = re.search(r'\brelationships\s*:\s*(\{)', entry_body)
        if rel_m:
            rs = rel_m.start(1)
            rel_end = scan_braces(entry_body, rs)
            rel_str = entry_body[rs:rel_end]
            rel = parse_rel_obj(rel_str)
            if rel:
                entry['relationships'] = rel

        # gossip
        gossip_m = re.search(r'\bgossip\s*:\s*(\[)', entry_body)
        if gossip_m:
            gs = gossip_m.start(1)
            gossip_end = scan_brackets(entry_body, gs)
            arr_str = entry_body[gs:gossip_end]
            gossip = parse_gossip_array(arr_str)
            if gossip:
                entry['gossip'] = gossip

        if entry:
            results[celeb_id] = entry

    return results


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"Loading {CELEBS_JSON} …")
    with open(CELEBS_JSON, 'r', encoding='utf-8') as f:
        celebs = json.load(f)
    id_map = {c['id']: i for i, c in enumerate(celebs)}

    all_data: dict = {}
    for path in EXTRAS_FILES:
        if not path.exists():
            continue
        src = path.read_text(encoding='utf-8')
        if 'mk(' in src:
            entries = extract_from_mk_calls(src)
        else:
            entries = extract_from_record_format(src)
        if entries:
            print(f"  {path.name}: {len(entries)} entries "
                  f"(rel: {sum(1 for e in entries.values() if 'relationships' in e)}, "
                  f"gossip: {sum(1 for e in entries.values() if 'gossip' in e)})")
        # Merge: combine relationships from mk() format with gossip from extras_ files
        for cid, entry in entries.items():
            if cid not in all_data:
                all_data[cid] = {}
            all_data[cid].update(entry)

    print(f"\nTotal entries: {len(all_data)}")
    print(f"  With relationships: {sum(1 for e in all_data.values() if 'relationships' in e)}")
    print(f"  With gossip:        {sum(1 for e in all_data.values() if 'gossip' in e)}")

    patched_rel = patched_gossip = 0
    skipped = []
    for celeb_id, entry in all_data.items():
        if celeb_id not in id_map:
            skipped.append(celeb_id)
            continue
        idx = id_map[celeb_id]
        if 'relationships' in entry:
            celebs[idx]['relationships'] = entry['relationships']
            patched_rel += 1
        if 'gossip' in entry:
            celebs[idx]['gossip'] = entry['gossip']
            patched_gossip += 1

    print(f"\nPatched relationships: {patched_rel}")
    print(f"Patched gossip:        {patched_gossip}")
    if skipped:
        print(f"Not in celebs.json ({len(skipped)}): {', '.join(skipped[:20])}")

    with open(CELEBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(celebs, f, ensure_ascii=False, separators=(',', ':'))
    print(f"\nWrote {CELEBS_JSON}")


if __name__ == '__main__':
    main()
