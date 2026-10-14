#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rules-build.py — 규칙 색인(정본)에서 rules.json 과 CLAUDE.md 의 색인 구간을 만든다 (2026-10-14)

    tools/rules-build.py            # styleguide/data/rules.json · CLAUDE.md 색인 구간을 새로 쓴다
    tools/rules-build.py --check    # 쓰지 않고 어긋남만 찍는다 (style-audit.py 도 이 검사를 부른다)

왜 쓰나
  규칙은 세 곳에 있어야 한다 — 스토리북(사람이 읽는다) · CLAUDE.md(세션이 읽는다) · 검사 도구(기계가 잰다).
  세 곳을 손으로 맞추면 반드시 어긋난다. 그래서 정본을 styleguide/rules.html 하나로 두고,
  나머지는 여기서 만들거나 대조한다.

정본의 모양
  <article class="sg-rulecard" id="RM-영역-번호" data-check="style-audit,eye" data-since="YYYY-MM-DD">
    <h3>제목</h3> <p class="sg-rulecard__do">지킬 것</p>
    <dl><dt>근거</dt><dd>…</dd><dt>검사</dt><dd>…</dd><dt>예외</dt><dd>…</dd></dl>
  </article>

대조하는 것
  · 번호가 겹치지 않는가, 카드에 빈 칸이 없는가
  · CLAUDE.md 색인 구간이 정본과 같은가 (다르면 이 도구를 다시 돌리라고 알린다)
  · data-check 에 style-audit 가 있는 규칙은 style-audit.py 에 그 번호가 적혀 있는가
  · 저장소 어디서든 인용한 번호(RM-XXX-NN)가 정본에 있는가 — 없는 번호를 부르면 죽은 인용이다
"""
import html, json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'styleguide', 'rules.html')
OUT = os.path.join(ROOT, 'styleguide', 'data', 'rules.json')
CLAUDE = os.path.join(ROOT, 'CLAUDE.md')
AUDIT = os.path.join(ROOT, 'tools', 'style-audit.py')
MARK_A, MARK_B = '<!-- rules:start (tools/rules-build.py 가 쓴다 — 손으로 고치지 않는다) -->', '<!-- rules:end -->'
ID = re.compile(r'RM-[A-Z]+-\d{2}')
TOOLS = {
    'style-audit': 'tools/style-audit.py', 'color-audit': 'tools/color-audit.html', 'cta-check': 'tools/cta-check.html',
    'screen-diff': 'tools/screen-shot.sh + tools/screen-diff.py', 'usage-scan': 'tools/usage-scan.py',
    'hook': '.gitignore + 커밋 전 검사 훅', 'eye': '눈 검수',
}


def text(frag):
    """HTML 조각 → 읽는 글. <code> 는 `백틱`으로 남겨 AI 가 이름을 알아보게 한다."""
    frag = re.sub(r'<code>(.*?)</code>', lambda m: '`' + m.group(1) + '`', frag, flags=re.S)
    frag = re.sub(r'<[^>]+>', '', frag)
    return re.sub(r'\s+', ' ', html.unescape(frag)).strip()


def parse():
    src = open(SRC, encoding='utf-8').read()
    areas = {}
    for sec_id, h2 in re.findall(r'<section class="sg-sec" id="([A-Z]+)">\s*<h2>(.*?)<small', src, flags=re.S):
        areas[sec_id] = text(h2)
    rules = []
    for m in re.finditer(r'<article class="sg-rulecard" id="(RM-[A-Z]+-\d{2})"([^>]*)>(.*?)</article>', src, flags=re.S):
        rid, attrs, body = m.groups()
        a = dict(re.findall(r'data-([\w-]+)="([^"]*)"', attrs))
        dl = dict((text(k), text(v)) for k, v in re.findall(r'<dt>(.*?)</dt>\s*<dd>(.*?)</dd>', body, flags=re.S))
        do = re.search(r'<p class="sg-rulecard__do">(.*?)</p>', body, flags=re.S)
        h3 = re.search(r'<h3>(.*?)</h3>', body, flags=re.S)
        checks = [c.strip() for c in a.get('check', '').split(',') if c.strip()]
        rules.append({
            'id': rid,
            'area': rid.split('-')[1],
            'title': text(h3.group(1)) if h3 else '',
            'rule': text(do.group(1)) if do else '',
            'why': dl.get('근거', ''),
            'check': {'by': checks, 'tools': [TOOLS.get(c, c) for c in checks], 'how': dl.get('검사', ''),
                      'machine': any(c != 'eye' for c in checks)},
            'except': dl.get('예외', ''),
            'since': a.get('since', ''),
            'deprecated': a.get('deprecated', '') == '1',
            'doc': 'styleguide/rules.html#' + rid,
        })
    return areas, rules


def claude_block(areas, rules):
    lines = [MARK_A, '', '규칙 색인 — 정본은 스토리북 `styleguide/rules.html`(근거·검사·예외는 거기). 인용은 번호로 한다.', '']
    for area, name in areas.items():
        rs = [r for r in rules if r['area'] == area]
        if not rs: continue
        lines.append('- **%s** %s' % (area, name))
        for r in rs:
            lines.append('  - `%s` %s%s' % (r['id'], r['title'], '' if r['check']['machine'] else ' (눈)'))
    lines += ['', MARK_B]
    return '\n'.join(lines)


def check():
    """어긋남 목록(문자열)을 돌려준다. 비어 있으면 통과."""
    probs = []
    areas, rules = parse()
    ids = [r['id'] for r in rules]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup: probs.append('겹친 번호 ' + ' '.join(dup))
    for r in rules:
        for k in ('title', 'rule', 'why', 'except'):
            if not r[k]: probs.append('%s 빈 칸(%s)' % (r['id'], k))
        if not r['check']['by']: probs.append('%s 검사 방법 없음' % r['id'])
    # CLAUDE.md 색인 구간
    cl = open(CLAUDE, encoding='utf-8').read()
    if MARK_A not in cl or MARK_B not in cl:
        probs.append('CLAUDE.md 에 색인 구간 없음 — rules-build.py 를 돌릴 것')
    else:
        cur = cl[cl.index(MARK_A):cl.index(MARK_B) + len(MARK_B)]
        if cur != claude_block(areas, rules): probs.append('CLAUDE.md 색인이 정본과 다름 — rules-build.py 를 돌릴 것')
    # style-audit 가 잰다고 적은 규칙은 style-audit.py 에 번호가 있어야 한다
    au = open(AUDIT, encoding='utf-8').read()
    for r in rules:
        if 'style-audit' in r['check']['by']:
            short = r['id'].rsplit('-', 1)
            # '[RM-COL-01·02]' 처럼 묶어 적은 것도 인정한다
            if r['id'] not in au and not re.search(re.escape(short[0]) + r'-\d{2}(?:·\d{2})*·' + short[1], au):
                probs.append('%s 를 style-audit.py 가 인용하지 않음' % r['id'])
    # 죽은 인용 — 저장소 어디서든 부른 번호가 정본에 있어야 한다
    known = set(ids)
    for f in glob.glob(os.path.join(ROOT, '**', '*'), recursive=True):
        rel = os.path.relpath(f, ROOT)
        if not os.path.isfile(f) or rel.startswith(('.git', 'styleguide/data', 'generated', 'video', 'figma-palette')): continue
        if not rel.endswith(('.html', '.css', '.js', '.py', '.md')): continue
        t = open(f, encoding='utf-8', errors='ignore').read()
        for m in re.finditer(r'RM-([A-Z]+)-(\d{2})((?:·\d{2})*)', t):
            for n in [m.group(2)] + re.findall(r'\d{2}', m.group(3)):
                rid = 'RM-%s-%s' % (m.group(1), n)
                if rid not in known: probs.append('죽은 인용 %s (%s)' % (rid, rel))
    return sorted(set(probs))


def build():
    areas, rules = parse()
    data = {
        '_읽는 법': '규칙 색인. 정본은 styleguide/rules.html — 이 파일은 tools/rules-build.py 가 만든다(손으로 고치지 않는다). '
                  'check.machine=true 면 도구가 숫자로 잡고, false 면 화면을 보고 판단한다.',
        '_만든 도구': 'tools/rules-build.py',
        'areas': areas,
        'count': len(rules),
        'rules': rules,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    cl = open(CLAUDE, encoding='utf-8').read()
    block = claude_block(areas, rules)
    if MARK_A in cl and MARK_B in cl:
        cl = cl[:cl.index(MARK_A)] + block + cl[cl.index(MARK_B) + len(MARK_B):]
    else:
        cl = cl.rstrip('\n') + '\n\n## 규칙 색인 (2026-10-14)\n\n' + block + '\n'
    open(CLAUDE, 'w', encoding='utf-8').write(cl)
    print('%d 규칙 · %d 영역 → %s · CLAUDE.md 색인' % (len(rules), len(areas), os.path.relpath(OUT, ROOT)))


if __name__ == '__main__':
    if '--check' in sys.argv:
        p = check()
        print('\n'.join(p) if p else '어긋남 없음')
        sys.exit(1 if p else 0)
    build()
    p = check()
    if p: print('남은 어긋남:\n  ' + '\n  '.join(p))
