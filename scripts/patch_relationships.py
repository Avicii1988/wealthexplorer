#!/usr/bin/env python3
"""
Extract relationship, gossip, and asset data from TypeScript extras files
and patch celebs.json.

Handles two formats:
  1. mk('id', ..., { relationships }) — in extraCelebrities.ts
  2. 'id': { assets: [...], gossip: [...], relationships: {...} } — in extras_*.ts
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).parent.parent
CELEBS_JSON = ROOT / 'public' / 'data' / 'celebs.json'
EXTRAS_FILES = [
    ROOT / 'src' / 'data' / 'extraCelebrities.ts',
    *sorted((ROOT / 'src' / 'data').glob('extras_*.ts')),
]

# Canonical image per asset type (from extraCelebrities.ts AI map)
TYPE_IMAGE = {
    'jet':          'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&h=600&fit=crop',
    'yacht':        'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=900&h=600&fit=crop',
    'real_estate':  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop',
    'car':          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop',
    'watch':        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&h=600&fit=crop',
    'art':          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop',
    'helicopter':   'https://images.unsplash.com/photo-1569702846516-9b1e3e6b1e79?w=900&h=600&fit=crop',
    'island':       'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&h=600&fit=crop',
    'sports_team':  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&h=600&fit=crop',
    'rocket':       'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=900&h=600&fit=crop',
}

REL_KEYS = ('spouse', 'partner', 'parents', 'children', 'siblings',
            'exSpouse', 'exPartner', 'fiancé', 'grandchildren')

# ── string helpers ────────────────────────────────────────────────────────────

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

# ── brace / bracket scanners ─────────────────────────────────────────────────

def scan_braces(src: str, start: int) -> int:
    """Return index just past matching '}' for '{' at start."""
    depth = 1; i = start + 1; n = len(src)
    while i < n and depth > 0:
        ch = src[i]
        if ch == '{': depth += 1
        elif ch == '}': depth -= 1
        elif ch in ('"', "'"):
            q = ch; i += 1
            while i < n:
                if src[i] == '\\': i += 2; continue
                if src[i] == q: break
                i += 1
        i += 1
    return i

def scan_brackets(src: str, start: int) -> int:
    """Return index just past matching ']' for '[' at start."""
    depth = 1; i = start + 1; n = len(src)
    while i < n and depth > 0:
        ch = src[i]
        if ch == '[': depth += 1
        elif ch == ']': depth -= 1
        elif ch in ('"', "'"):
            q = ch; i += 1
            while i < n:
                if src[i] == '\\': i += 2; continue
                if src[i] == q: break
                i += 1
        i += 1
    return i

# ── relationship parser ───────────────────────────────────────────────────────

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

# ── gossip parser ─────────────────────────────────────────────────────────────

def parse_gossip_array(arr_str: str) -> list:
    items = []
    i = 1; n = len(arr_str)
    while i < n:
        if arr_str[i] == '{':
            end = scan_braces(arr_str, i)
            obj_str = arr_str[i:end]
            item = {}
            for field in ('title', 'summary', 'type', 'date'):
                m = re.search(rf"""\b{field}\s*:\s*(['"])(.*?)\1""", obj_str, re.DOTALL)
                if m:
                    item[field] = m.group(2)
            if item.get('title') and item.get('summary'):
                items.append(item)
            i = end
        else:
            i += 1
    return items

# ── asset parser ──────────────────────────────────────────────────────────────

def parse_asset_obj(obj_str: str, const_map: dict) -> dict:
    """Parse a single asset object, resolving image constants."""
    asset = {}

    for field in ('id', 'type', 'name', 'description'):
        m = re.search(rf"""\b{field}\s*:\s*(['"])(.*?)\1""", obj_str, re.DOTALL)
        if m:
            asset[field] = m.group(2)

    # estimatedValue — numeric
    m = re.search(r'\bestimatedValue\s*:\s*([\d.]+)', obj_str)
    if m:
        asset['estimatedValue'] = float(m.group(1))

    # likes — integer
    m = re.search(r'\blikes\s*:\s*(\d+)', obj_str)
    if m:
        asset['likes'] = int(m.group(1))

    # image — may be a constant name or a quoted URL
    m = re.search(r"""\bimage\s*:\s*(?:(['"])(.*?)\1|([A-Z_]+))""", obj_str, re.DOTALL)
    if m:
        if m.group(2):  # quoted string
            img = m.group(2)
        else:  # constant
            img = const_map.get(m.group(3), '')
        if img:
            asset['image'] = img

    # If still no image, derive from type
    if 'image' not in asset and 'type' in asset:
        asset['image'] = TYPE_IMAGE.get(asset['type'], TYPE_IMAGE['real_estate'])

    return asset

def parse_assets_array(arr_str: str, const_map: dict) -> list:
    assets = []
    i = 1; n = len(arr_str)
    while i < n:
        if arr_str[i] == '{':
            end = scan_braces(arr_str, i)
            obj_str = arr_str[i:end]
            asset = parse_asset_obj(obj_str, const_map)
            if asset.get('id'):
                assets.append(asset)
            i = end
        else:
            i += 1
    return assets

def extract_const_map(source: str) -> dict:
    """Extract const XX = 'url' declarations from the top of a TS file."""
    const_map = {}
    for m in re.finditer(r"""^const\s+([A-Z_]+)\s*=\s*['"]([^'"]+)['"]""", source, re.MULTILINE):
        const_map[m.group(1)] = m.group(2)
    return const_map

# ── Format 1: mk() calls ─────────────────────────────────────────────────────

def extract_from_mk_calls(source: str) -> dict:
    results = {}
    # extraCelebrities.ts derives asset image from AI[type] — same as TYPE_IMAGE
    const_map = extract_const_map(source)

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

        # Extract asset type (5th positional string arg after id, name, cat, nw, nat, prof, bd, bp, g, ht, bio, avatar)
        # mk(id, name, cat, nw, nat, prof, bd, bp, g, ht, bio, avatar, a1t, a1n, a1v, a1d, ...)
        # a1t is the 13th arg (index 12). Let's extract by splitting on commas at depth 0.
        args = []
        depth2 = 0; arg_start = 0; j = 0; cb = call_body
        while j < len(cb):
            ch2 = cb[j]
            if ch2 in ('(', '[', '{'): depth2 += 1
            elif ch2 in (')', ']', '}'): depth2 -= 1
            elif ch2 in ('"', "'"):
                q = ch2; j += 1
                while j < len(cb):
                    if cb[j] == '\\': j += 2; continue
                    if cb[j] == q: break
                    j += 1
            elif ch2 == ',' and depth2 == 0:
                args.append(cb[arg_start:j].strip())
                arg_start = j + 1
            j += 1
        args.append(cb[arg_start:].strip())

        # args[12] = a1t (asset type), args[13] = a1n (name), args[14] = a1v (value), args[15] = a1d (desc)
        entry = {}
        if len(args) >= 16:
            a1t = js_str_to_py(args[12])
            a1n = js_str_to_py(args[13])
            try:
                a1v = float(args[14].strip())
            except ValueError:
                a1v = 0.0
            a1d = js_str_to_py(args[15])
            if a1t and a1n:
                asset = {
                    'id': f'{celeb_id}-1',
                    'type': a1t,
                    'name': a1n,
                    'description': a1d,
                    'estimatedValue': a1v,
                    'image': TYPE_IMAGE.get(a1t, TYPE_IMAGE['real_estate']),
                    'likes': round(a1v * 60 + 800),
                }
                entry['assets'] = [asset]

        # relationship (last brace block with rel keys)
        last_rel = None
        j2 = 0; bn = len(call_body)
        while j2 < bn:
            ch3 = call_body[j2]
            if ch3 in ('"', "'"):
                q = ch3; j2 += 1
                while j2 < bn:
                    if call_body[j2] == '\\': j2 += 2; continue
                    if call_body[j2] == q: break
                    j2 += 1
            elif ch3 == '{':
                end = scan_braces(call_body, j2)
                snippet = call_body[j2:end]
                if any(k in snippet for k in REL_KEYS):
                    last_rel = snippet
                j2 = end
                continue
            j2 += 1

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
    const_map = extract_const_map(source)

    for m in re.finditer(r"""'([^']+)'\s*:\s*\{""", source):
        celeb_id = m.group(1)
        obj_start = m.end() - 1
        obj_end = scan_braces(source, obj_start)
        entry_body = source[obj_start:obj_end]
        entry = {}

        # assets
        assets_m = re.search(r'\bassets\s*:\s*(\[)', entry_body)
        if assets_m:
            gs = assets_m.start(1)
            arr_end = scan_brackets(entry_body, gs)
            arr_str = entry_body[gs:arr_end]
            assets = parse_assets_array(arr_str, const_map)
            if assets:
                entry['assets'] = assets

        # relationships
        rel_m = re.search(r'\brelationships\s*:\s*(\{)', entry_body)
        if rel_m:
            rs = rel_m.start(1)
            rel_end = scan_braces(entry_body, rs)
            rel = parse_rel_obj(entry_body[rs:rel_end])
            if rel:
                entry['relationships'] = rel

        # gossip
        gossip_m = re.search(r'\bgossip\s*:\s*(\[)', entry_body)
        if gossip_m:
            gs = gossip_m.start(1)
            gossip_end = scan_brackets(entry_body, gs)
            gossip = parse_gossip_array(entry_body[gs:gossip_end])
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
        entries = extract_from_mk_calls(src) if 'mk(' in src else extract_from_record_format(src)
        if entries:
            n_a = sum(1 for e in entries.values() if 'assets' in e)
            n_r = sum(1 for e in entries.values() if 'relationships' in e)
            n_g = sum(1 for e in entries.values() if 'gossip' in e)
            print(f"  {path.name}: {len(entries)} entries  assets={n_a}  rel={n_r}  gossip={n_g}")
        for cid, entry in entries.items():
            if cid not in all_data:
                all_data[cid] = {}
            # For assets: merge rather than overwrite — keep mk() asset if it has a
            # non-generic type (helicopter, jet, etc.) and the new entry has a different type.
            if 'assets' in entry and 'assets' in all_data[cid]:
                existing = all_data[cid]['assets']
                incoming = entry['assets']
                existing_types = {a['type'] for a in existing}
                # Add any incoming asset whose type isn't already covered
                extra = [a for a in incoming if a['type'] not in existing_types]
                all_data[cid]['assets'] = existing + extra
                # Update all other keys (gossip, relationships, etc.)
                for k, v in entry.items():
                    if k != 'assets':
                        all_data[cid][k] = v
            else:
                all_data[cid].update(entry)

    print(f"\nTotal entries: {len(all_data)}")

    pa = pr = pg = 0
    skipped = []
    for celeb_id, entry in all_data.items():
        if celeb_id not in id_map:
            skipped.append(celeb_id)
            continue
        idx = id_map[celeb_id]
        if 'assets' in entry:
            celebs[idx]['assets'] = entry['assets']
            pa += 1
        if 'relationships' in entry:
            celebs[idx]['relationships'] = entry['relationships']
            pr += 1
        if 'gossip' in entry:
            celebs[idx]['gossip'] = entry['gossip']
            pg += 1

    # For any remaining celebs that still have assets without images, add images from type
    filled = 0
    for c in celebs:
        for a in c.get('assets', []):
            if not a.get('image') and a.get('type'):
                a['image'] = TYPE_IMAGE.get(a['type'], TYPE_IMAGE['real_estate'])
                filled += 1
            if not a.get('likes') and a.get('estimatedValue'):
                a['likes'] = round(a['estimatedValue'] * 60 + 800)
                filled += 1

    print(f"Patched assets:        {pa}")
    print(f"Patched relationships: {pr}")
    print(f"Patched gossip:        {pg}")
    if filled:
        print(f"Filled image/likes on remaining assets: {filled} fields")
    if skipped:
        print(f"Not in celebs.json ({len(skipped)}): {', '.join(skipped[:20])}")

    with open(CELEBS_JSON, 'w', encoding='utf-8') as f:
        json.dump(celebs, f, ensure_ascii=False, separators=(',', ':'))
    print(f"\nWrote {CELEBS_JSON}")


if __name__ == '__main__':
    main()
