#!/usr/bin/env python3
"""
Sanitise and append a batch of celebrity mk() entries to extraCelebrities.ts.
Usage: python3 scripts/add-batch.py < batch.txt
       OR: python3 scripts/add-batch.py "  mk(...),"
"""
import sys, re, unicodedata

REPLACEMENTS = {
    '\u2019': "'", '\u2018': "'", '\u201c': '"', '\u201d': '"',
    '\u2013': '-', '\u2014': '--', '\u00e6': 'ae', '\u00c6': 'AE',
    '\u00f8': 'o', '\u00d8': 'O', '\u00e5': 'a', '\u00c5': 'A',
    '\u00df': 'ss', '\u0131': 'i', '\u0130': 'I',
    'e\u0301': 'e', 'a\u0301': 'a', 'o\u0301': 'o', 'u\u0301': 'u',
}
LATIN_MAP = str.maketrans(
    'aaaaaeeeeiiiioooouuuuyyccnszzzrlde'
    'AAAAAEEEEIIIIOOOOUUUUYYCCNSZZZRLDE'
    '\u0131\u0130\u015f\u015e\u011f\u011e\u00e7\u00c7\u00f6\u00d6\u00fc\u00dc'
    '\u0107\u010d\u0142\u0141\u0159\u0158\u011b\u011a\u0151\u0150\u0171\u0170'
    '\u0111\u0110\u015b\u017a\u017c\u017e\u017b',
    'aaaaaeeeeiiiioooouuuuyyccnszzzrlde'
    'AAAAAEEEEIIIIOOOOUUUUYYCCNSZZZRLDE'
    'iISsGgCcOoUuCcLlRrEeOoUuDdSzzZZ',
)

def sanitise(text: str) -> str:
    for bad, good in REPLACEMENTS.items():
        text = text.replace(bad, good)
    text = text.translate(LATIN_MAP)
    def replace_non_ascii(m):
        ch = m.group(0)
        norm = unicodedata.normalize('NFD', ch)
        base = ''.join(c for c in norm if unicodedata.category(c) != 'Mn')
        return base if base.isascii() else ''
    text = re.sub(r'[^\x00-\x7F]', replace_non_ascii, text)
    return text

def fix_apostrophes(line: str) -> str:
    """Escape unescaped apostrophes inside single-quoted TS string literals."""
    result = []
    i = 0
    n = len(line)
    while i < n:
        ch = line[i]
        if ch == "'":
            result.append(ch)
            i += 1
            while i < n:
                c2 = line[i]
                if c2 == '\\':
                    result.append(c2); i += 1
                    if i < n: result.append(line[i]); i += 1
                elif c2 == "'":
                    nxt = line[i+1] if i+1 < n else ''
                    if nxt in (',', ')', ''):
                        result.append(c2); i += 1; break
                    else:
                        result.append("\\'"); i += 1
                else:
                    result.append(c2); i += 1
        else:
            result.append(ch); i += 1
    return ''.join(result)

def process_batch(raw: str) -> str:
    lines = []
    for line in raw.split('\n'):
        line = sanitise(line)
        if line.lstrip().startswith("mk('"):
            line = fix_apostrophes(line)
        lines.append(line)
    return '\n'.join(lines)

if __name__ == '__main__':
    batch = sys.stdin.read() if len(sys.argv) == 1 else '\n'.join(sys.argv[1:])
    print(process_batch(batch))
