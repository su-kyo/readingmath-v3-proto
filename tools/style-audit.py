#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
style-audit.py — 「사람이 지키는 규칙」을 기계가 잰다 (마감 회차 2026-10-12, Phase 10 지시서 §4-5)

    tools/style-audit.py            # 표를 찍는다
    tools/style-audit.py --strict   # 지켜야 할 줄이 0 이 아니면 종료 코드 1 (커밋 전 검사용)

왜 쓰나
  스타일 정리는 한 번으로 끝나지 않는다. 화면을 하나 고칠 때마다 HTML 안에 CSS 가
  다시 생기거나, 토큰 밖 색이 다시 들어온다. 손으로 세면 반드시 빠뜨리므로 기계가 센다.
  출력은 Phase 10 지시서 §1 의 표와 같은 모양이라 회차끼리 바로 비교할 수 있다.

무엇을 세나 (배포 대상만 — tools · figma-palette · video · docs 제외)
  ■ 지켜야 할 것 (0 이어야 한다)
    HTML 안 <style>             화면 CSS 는 styles/screens/ 에 있다
    HTML 안 <script>            단, <head> 의 테마 초기화(rm-theme) 와 스타일가이드 데모 틀 안은 제외
    토큰 밖 색                   CSS·JS 의 hex/rgb(). 마스크(모양 도구)와 EXCEPT 의 예외는 제외
    정의 없는 변수               var(--x) 인데 어디에도 --x: 가 없는 것. JS 가 넣는 값(JS_VARS)은 제외
    깨진 경로                    CSS url() · HTML href/src 가 가리키는 파일이 없는 것
    캐시 번호 종류               ?v= 는 날짜 하나로 통일한다 (1 이어야 한다)
  ■ 지켜보는 것 (줄면 좋다)
    1단 직접 사용                화면 CSS 가 팔레트 램프를 바로 부르는 횟수 — 2단 역할로 옮길 대상
    화면 간 똑같은 규칙          styles/screens/ 끼리 글자 하나 안 틀리고 같은 규칙
    원시 px 글자 크기            clamp() 반응형 값 포함
    안 쓰는 토큰                 팔레트 램프 스텝은 제외(생성기 출력이라 중간이 비면 안 된다)
"""
import os, re, sys, glob, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SKIP = ('tools/', 'figma-palette/', 'video/', 'docs/', 'generated/', 'node_modules/')

# 색 검사에서 빼는 것 — 이유를 같이 적는다. 스토리북 「패턴 › 남긴 예외」와 같은 목록이다.
EXCEPT = {
    'scripts/debug-panel.js': '검수 패널 — 일부러 앱과 안 어울리게 칠한 도구. 배포본에서는 안 보인다',
    'scripts/gnb-drawer.js:svg': '서랍 로고(5색 브랜드 마크)와 마스크 안 흑백',
    'scripts/learn-basic-ops.js:svg': '문제 속 도형 그림(사다리꼴) — 콘텐츠다',
    'scripts/type-quiz.js:svg': '문제 속 도형 그림(사다리꼴) — 콘텐츠다',
    'scripts/type-review.js:svg': '문제 속 도형 그림(사다리꼴) — 콘텐츠다',
    'styles/screens/concept-learn.css:gradient': '더미 이미지 자리 — 사진이 들어올 자리를 메운 그림',
}
# JS 가 style 로 심는 변수 — 정의가 CSS 에 없는 게 정상이다 (스토리북 「패턴 › JS가 넣는 변수」)
# 안 써도 남기는 토큰 — 상태색 매트릭스(4역할 × 5변형)의 빈칸을 만들지 않는다
KEEP = {'--warn-vivid'}
JS_VARS = {'--caret-x', '--d', '--delay', '--hero-w', '--hl', '--m', '--o', '--pct', '--seg'}
PALETTE = r'(?:n|blue|cyan|teal|green|amber|orange|red|violet)-\d+'


def files(ext):
    out = []
    for p in glob.glob('**/*' + ext, recursive=True):
        if p.startswith(SKIP) or '/vendor/' in p: continue
        out.append(p)
    return sorted(out)


def strip_comments(t, js=False):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    if js: t = re.sub(r'(?m)^\s*//.*$', '', t)
    return t


HTML, CSS, JS = files('.html'), files('.css'), files('.js')
rows = []


def row(group, name, value, note=''):
    rows.append((group, name, value, note))


# ── HTML 안 CSS · JS ─────────────────────────────────────────────────────
style_lines = script_lines = 0; script_where = []
for f in HTML:
    s = open(f, encoding='utf-8').read(); head_end = s.find('</head>')
    for m in re.finditer(r'<style[^>]*>(.*?)</style>', s, flags=re.S):
        before = s[:m.start()]
        if before.count('<template') > before.count('</template>'): continue
        style_lines += m.group(1).strip().count('\n') + (1 if m.group(1).strip() else 0)
    for m in re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, flags=re.S):
        before = s[:m.start()]
        if before.count('<template') > before.count('</template>'): continue
        if m.start() < head_end and 'rm-theme' in m.group(1): continue
        n = m.group(1).strip().count('\n') + 1; script_lines += n; script_where.append(f)
row('지킬 것', 'HTML 안 <style> 줄', style_lines)
row('지킬 것', 'HTML 안 <script> 줄', script_lines, ', '.join(script_where[:4]))

# ── 토큰 밖 색 ──────────────────────────────────────────────────────────
COLOR = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)')
leaks = collections.Counter()
for f in CSS + JS:
    if f == 'styles/tokens.css' or f in EXCEPT: continue
    t = strip_comments(open(f, encoding='utf-8').read(), js=f.endswith('.js'))
    if f + ':svg' in EXCEPT:
        t = re.sub(r'<svg.*?</svg>', '', t, flags=re.S)
    for m in re.finditer(r'([\w-]+)\s*:\s*([^;{}]*)', t):
        if 'mask' in m.group(1): continue
        val = m.group(2)
        if f + ':gradient' in EXCEPT and 'gradient' in val: continue
        n = len(COLOR.findall(val))
        if n: leaks[f] += n
    for m in re.finditer(r'(?:fill|stroke|stop-color)=\\?["\'](#[0-9a-fA-F]{3,8})', t):
        leaks[f] += 1
for f in HTML:   # HTML 의 style="" 속성 안 색도 센다 (데모 틀 포함 — 문서도 규칙을 지킨다)
    for m in re.finditer(r'style="([^"]*)"', open(f, encoding='utf-8').read()):
        n = len(COLOR.findall(m.group(1)))
        if n: leaks[f] += n
row('지킬 것', '토큰 밖 색', sum(leaks.values()), ', '.join('%s %d' % (k, v) for k, v in leaks.most_common(4)))

# ── 정의 없는 변수 ───────────────────────────────────────────────────────
defined = set()
for f in CSS + JS + HTML:
    defined |= set(re.findall(r'(--[\w-]+)\s*:', open(f, encoding='utf-8').read()))
undefined = set()
for f in CSS + JS + HTML:
    t = strip_comments(open(f, encoding='utf-8').read(), js=f.endswith('.js'))
    for n in re.findall(r'var\(\s*(--[\w-]+)\s*[,)]', t):
        if n not in defined and n not in JS_VARS: undefined.add(n)
row('지킬 것', '정의 없는 변수', len(undefined), ' '.join(sorted(undefined)[:6]))

# ── 깨진 경로 ───────────────────────────────────────────────────────────
broken = []
for f in CSS:
    t = strip_comments(open(f, encoding='utf-8').read())
    for u in re.findall(r'url\(\s*["\']?([^"\')]+)', t):
        if u.startswith(('http', 'data:', '#')): continue
        if not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f), u.split('?')[0]))): broken.append(f + ' → ' + u)
for f in HTML:
    s = open(f, encoding='utf-8').read()
    base = '..' if re.search(r'<base href="\.\./"', s) else ''
    for u in re.findall(r'(?:href|src)="([^"#]+)"', s):
        if u.startswith(('http', 'data:', 'mailto', 'javascript')) or "'" in u or '+' in u: continue
        if not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f), base, u.split('?')[0]))): broken.append(f + ' → ' + u)
row('지킬 것', '깨진 경로', len(broken), ', '.join(broken[:3]))

# ── 캐시 번호 ───────────────────────────────────────────────────────────
vers = collections.Counter()
for f in HTML: vers.update(re.findall(r'(?:href|src)="(?:styles|scripts|styleguide)/[^"?]+\?v=([\w-]+)"', open(f, encoding='utf-8').read()))
row('지킬 것', '캐시 번호 종류(1 이어야)', len(vers), ' '.join(sorted(vers)))

# ── 지켜보는 것 ─────────────────────────────────────────────────────────
prim = 0
for f in CSS:
    if f == 'styles/tokens.css' or f.startswith('styleguide/'): continue
    prim += len(re.findall(r'var\(--' + PALETTE + r'\)', strip_comments(open(f, encoding='utf-8').read())))
row('지켜볼 것', '1단(팔레트) 직접 사용', prim, '2단 역할로 옮길 대상')

rules = collections.defaultdict(set)
for f in glob.glob('styles/screens/*.css'):
    t = strip_comments(open(f, encoding='utf-8').read())
    for sel, body in re.findall(r'([^{}@]+)\{([^{}]*)\}', t):
        rules[(re.sub(r'\s+', ' ', sel.strip()), re.sub(r'\s+', '', body))].add(f)
dup = sum(len(v) - 1 for v in rules.values() if len(v) > 1)
row('지켜볼 것', '화면 간 똑같은 규칙(복사본)', dup, '킵 화면 쌍·이름만 같은 다른 부품 포함')

allcss = ''.join(strip_comments(open(f, encoding='utf-8').read()) for f in CSS if f != 'styles/tokens.css')
fs = re.findall(r'font-size\s*:\s*([^;}\n]+)', allcss)
row('지켜볼 것', '원시 px 글자 크기', sum(1 for v in fs if re.search(r'\d+(\.\d+)?px', v) and 'var(' not in v), '대부분 clamp() 반응형')

tok = open('styles/tokens.css', encoding='utf-8').read()
uses = set()
for f in CSS + JS + HTML:
    uses |= set(re.findall(r'var\(\s*(--[\w-]+)', open(f, encoding='utf-8').read()))
unused = [d for d in dict.fromkeys(re.findall(r'(--[\w-]+)\s*:', tok))
          if d not in uses and d not in KEEP and not re.match(r'--' + PALETTE + r'$', d) and not d.startswith(('--white-a', '--black-a'))]
row('지켜볼 것', '안 쓰는 토큰(램프 제외)', len(unused), ' '.join(unused))

# ── 출력 ────────────────────────────────────────────────────────────────
w = max(len(r[1]) for r in rows)
group = None; bad = 0
for g, name, val, note in rows:
    if g != group:
        print('\n■ ' + g); group = g
    flag = ''
    if g == '지킬 것':
        ok = (val == 1) if name.startswith('캐시') else (val == 0)
        flag = '  ✓' if ok else '  ✗'; bad += (not ok)
    print('  %-*s %6s%s%s' % (w, name, val, flag, ('   ' + note) if note and val else ''))
print()
if '--strict' in sys.argv and bad:
    sys.exit(1)
