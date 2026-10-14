#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tokens-build.py — styles/tokens.css 에서 개발자용 tokens.json 을 만든다 (2026-10-14)

    tools/tokens-build.py           # styleguide/data/tokens.json 을 새로 쓴다
    tools/tokens-build.py --print   # 쓰지 않고 요약만 찍는다

왜 쓰나
  개발자와 그의 AI 는 CSS 의 var() 사슬을 따라가며 「다크에서 이 색이 뭐지」를 계산하지 않는다.
  그래서 사슬을 미리 다 풀어 둔다 — 역할 토큰마다 라이트·다크 값, 계열 7벌의 값, 원본 팔레트 이름.
  손으로 옮겨 적으면 tokens.css 와 어긋나므로 이 도구가 만든다(규칙 색인 「개발자 파일」).

형식
  W3C Design Tokens(DTCG) — $type · $value · $description. 테마·계열별 값은 표준에 자리가 없어
  $extensions.rm 에 싣는다: { css, light, dark, sections{계열:{light,dark}} }. 각 값은 {ref, value}.
  ref = 이 값이 가리키는 1단 토큰 이름, value = 최종 계산값(hex 또는 rgba).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'styles', 'tokens.css')
OUT = os.path.join(ROOT, 'styleguide', 'data', 'tokens.json')
SECTIONS = ['concept', 'type', 'essay', 'exam', 'assign', 'util', 'space']
SECTION_KO = {'concept': '개념', 'type': '유형', 'essay': '서술형', 'exam': '시험대비', 'assign': '과제', 'util': '유틸', 'space': '행성 탐색(A층)'}
FAMILY = r'(n|blue|cyan|teal|green|amber|orange|red|violet|gold)'

src = open(SRC, encoding='utf-8').read()


def blocks():
    """선택자 → [(이름, 값, 설명)] — 줄 끝 주석을 설명으로 쓴다."""
    out = {}
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', src):
        sel = re.sub(r'/\*.*?\*/', '', m.group(1), flags=re.S).strip()
        decls = []
        body = m.group(2)
        for dm in re.finditer(r'(--[\w-]+)\s*:\s*((?:[^;"]|"[^"]*")+);([ \t]*/\*(.*?)\*/)?', body, flags=re.S):
            val = re.sub(r'\s+', ' ', dm.group(2)).strip()
            note = re.sub(r'\s+', ' ', dm.group(4) or '').strip()
            decls.append((dm.group(1), val, note))
        out[sel] = decls
    return out


B = blocks()
ROOTB = B[':root']; LIGHT = B[':root[data-theme="light"]']; NOTLIGHT = B[':root:not([data-theme="light"])']


def env(theme, section):
    e = {n: v for n, v, _ in ROOTB}
    for n, v, _ in (LIGHT if theme == 'light' else NOTLIGHT): e[n] = v
    for n, v, _ in B.get(':root[data-section="%s"]' % section, []): e[n] = v
    return e


def hexrgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)] + [1.0]


def parse_color(v):
    v = v.strip()
    if v.startswith('#'): return hexrgb(v)
    m = re.fullmatch(r'rgba?\(([^)]*)\)', v)
    if m:
        p = [float(x) for x in re.split(r'[\s,/]+', m.group(1).strip()) if x]
        return p[:3] + [p[3] if len(p) > 3 else 1.0]
    if v == 'transparent': return [0, 0, 0, 0.0]
    return None


def fmt(c):
    if c is None: return None
    r, g, b, a = c
    if a >= 0.999: return '#%02X%02X%02X' % (round(r), round(g), round(b))
    return 'rgba(%d, %d, %d, %s)' % (round(r), round(g), round(b), ('%.3f' % a).rstrip('0').rstrip('.'))


def resolve(v, e, depth=0):
    """값 → (마지막으로 가리킨 1단 토큰, 계산된 색 또는 원문)"""
    v = v.strip(); ref = None
    m = re.fullmatch(r'var\((--[\w-]+)\)', v)
    if m and depth < 12 and m.group(1) in e:
        name = m.group(1)
        r, val = resolve(e[name], e, depth + 1)
        if re.fullmatch(r'--%s-\d+' % FAMILY, name) or name.startswith(('--white-a', '--black-a', '--asset-', '--art-')):
            return name, val
        return r, val
    m = re.fullmatch(r'color-mix\(in srgb,\s*(.+?)\s+(\d+(?:\.\d+)?)%,\s*(.+)\)', v)
    if m:
        r1, a = resolve(m.group(1), e, depth + 1); r2, b = resolve(m.group(3), e, depth + 1)
        ca, cb = parse_color(a or ''), parse_color(b or '')
        if ca and cb:
            p = float(m.group(2)) / 100
            # 미리 곱한 알파로 섞는다(CSS color-mix 규칙)
            al = ca[3] * p + cb[3] * (1 - p)
            if al == 0: return r1, fmt([0, 0, 0, 0])
            mix = [(ca[i] * ca[3] * p + cb[i] * cb[3] * (1 - p)) / al for i in range(3)]
            return r1, fmt(mix + [al])
        return r1, v
    c = parse_color(v)
    return ref, fmt(c) if c else v


def kind(name, val):
    if name.startswith(('--fs-', '--sp-', '--r-', '--bw-', '--depth-')): return 'dimension'
    if name.startswith('--fw-'): return 'fontWeight'
    if name.startswith('--font-'): return 'fontFamily'
    if name.startswith('--z-'): return 'number'
    if name.startswith('--lh-'): return 'number'
    if name.startswith('--t-'): return 'transition'
    if 'url(' in val: return 'image'
    if name == '--tracking': return 'dimension'
    if name.startswith('--shadow') or name == '--primary-ring' and False: return 'shadow'
    return 'color'


def group_of(name):
    if re.fullmatch(r'--%s-\d+' % FAMILY, name): return 'primitive'
    if name.startswith(('--white-a', '--black-a')): return 'primitive'
    if name.startswith(('--asset-', '--art-')): return 'asset'
    if name.startswith('--th-'): return 'theme'
    if name.startswith(('--fs-', '--sp-', '--r-', '--bw-', '--depth-', '--z-', '--fw-', '--lh-', '--font-', '--t-', '--tracking')): return 'scale'
    return 'semantic'


def path_of(name):
    n = name[2:]
    m = re.fullmatch(r'%s-(\d+)' % FAMILY, n)
    if m: return ['color', m.group(1), m.group(2)]
    m = re.fullmatch(r'(white|black)-a(\d+)', n)
    if m: return ['color', 'alpha', n]
    m = re.fullmatch(r'(fs|sp|r|bw|depth|z|fw|lh|font|t)-(.+)', n)
    if m: return [m.group(1), m.group(2)]
    return [n]


def alias(val):
    m = re.fullmatch(r'var\((--[\w-]+)\)', val.strip())
    if not m: return None
    tgt = m.group(1); g = group_of(tgt)
    return '{%s}' % '.'.join([g] + path_of(tgt))


def put(tree, path, leaf):
    for p in path[:-1]: tree = tree.setdefault(p, {})
    tree[path[-1]] = leaf


def build():
    out = {
        '$description': '리딩수학과학 디자인 토큰 — styles/tokens.css 에서 tools/tokens-build.py 가 만든다(손으로 고치지 않는다). '
                        '형식은 W3C DTCG. 테마(light/dark)·계열(data-section)별 최종값은 $extensions.rm 에 있다. '
                        '기본 테마는 다크, 라이트는 :root[data-theme="light"]. 화면은 2단(semantic)·3단(theme)부터 쓴다 — 규칙 RM-COL-05.',
        '$extensions': {'rm': {'source': 'styles/tokens.css', 'rules': 'styleguide/data/rules.json',
                               'sections': SECTION_KO, 'defaultTheme': 'dark',
                               'layers': {'primitive': '1단 · 색 원본 — 실제 값은 여기에만',
                                          'semantic': '2단 · 전역 역할 — 라이트/다크가 뒤집히는 유일한 층',
                                          'theme': '3단 · 계열 슬롯(--th-*) — data-section 으로 값만 교체',
                                          'asset': '에셋 연동색 — 그림의 실제 색과 이어 붙는 값(램프 밖)',
                                          'scale': '치수 눈금 — 값으로 이름한다(--sp-16 = 16px)'}}},
    }
    light_names = {n for n, _, _ in LIGHT}
    seen = set()
    for name, val, note in ROOTB:
        if name in seen: continue
        seen.add(name)
        g = group_of(name); k = kind(name, val)
        leaf = {'$type': k}
        a = alias(val)
        if k == 'color' or k == 'image':
            d_ref, d_val = resolve('var(%s)' % name, env('dark', 'concept'))
            leaf['$value'] = a or d_val
        elif k == 'dimension':
            leaf['$value'] = val
        elif k in ('fontWeight', 'number'):
            leaf['$value'] = float(val) if '.' in val else int(val)
        elif k == 'fontFamily':
            leaf['$value'] = [f.strip().strip('"') for f in val.split(',')]
        else:
            leaf['$value'] = val
        if note: leaf['$description'] = note
        ext = {'css': name}
        if g in ('semantic', 'asset') and k == 'color':
            for t in ('light', 'dark'):
                r, v = resolve('var(%s)' % name, env(t, 'concept'))
                ext[t] = {'ref': r, 'value': v}
            ext['flipsWithTheme'] = ext['light']['value'] != ext['dark']['value']
            ext['setInLight'] = name in light_names
        if g == 'theme' or (g == 'semantic' and k == 'color' and any(
                resolve('var(%s)' % name, env('light', s))[1] != resolve('var(%s)' % name, env('light', 'concept'))[1] for s in SECTIONS)):
            ext['sections'] = {}
            for s in SECTIONS:
                ext['sections'][s] = {t: dict(zip(('ref', 'value'), resolve('var(%s)' % name, env(t, s)))) for t in ('light', 'dark')}
        leaf['$extensions'] = {'rm': ext}
        put(out.setdefault(g, {}), path_of(name), leaf)
    return out


if __name__ == '__main__':
    data = build()
    n = sum(1 for _ in re.finditer(r'"\$type"', json.dumps(data)))
    if '--print' in sys.argv:
        print(n, '토큰 ·', ', '.join('%s %d' % (g, json.dumps(data.get(g, {})).count('"$type"')) for g in ('primitive', 'semantic', 'theme', 'asset', 'scale')))
        sys.exit()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('%d 토큰 → %s' % (n, os.path.relpath(OUT, ROOT)))
