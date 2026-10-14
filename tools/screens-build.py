#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
screens-build.py — 화면마다 「무엇으로 지어졌나」를 모아 screens.json 을 만든다 (2026-10-14)

    tools/screens-build.py           # styleguide/data/screens.json 을 새로 쓴다

왜 쓰나
  디자인 QA 때 「이 화면이 틀어졌다」고 하면 개발자는 바로 「무슨 부품·토큰·규칙으로 만든 화면인데?」를 묻는다.
  그 답을 화면마다 미리 묶어 둔다. 스토리북 「화면 지도」 장이 이 파일을 그린다.
  손으로 쓰면 화면이 바뀔 때마다 어긋나므로 이 도구가 만든다. usage.json(부품 사용)을 먼저 새로 만들 것.

모으는 것
  화면마다 — 제목 · 계열 · 테마(고정/전환) · 부르는 CSS·JS · 쓰는 부품(스토리북 카드 기준) ·
  화면 CSS 가 많이 부르는 토큰 · 이 화면에 특히 걸리는 규칙 번호
"""
import collections, glob, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = 'styleguide/data/screens.json'
SKIP = ('tools/', 'figma-palette/', 'video/', 'styleguide/', 'docs/', 'generated/')
FAMILY_KO = {'nav': '행성 탐색', 'concept': '개념', 'type': '유형', 'essay': '서술형', 'assignment': '과제',
             'exam': '시험대비', 'util': '유틸', 'shared': '공용 결과', '.': '목차'}

usage = json.load(open('styleguide/usage.json', encoding='utf-8'))['usage']

# 스토리북 부품 카드 — <div class="sg-item" data-uses="a, b"> <h3>이름</h3> 와 그 카드가 속한 장·절
PARTS = []
for f in sorted(glob.glob('styleguide/*.html')):
    s = open(f, encoding='utf-8').read()
    page = re.sub(r'\s*—.*$', '', re.search(r'<title>(.*?)</title>', s).group(1)).strip()
    for sec in re.finditer(r'<section class="sg-sec" id="([\w-]+)">(.*?)</section>', s, flags=re.S):
        h2 = re.search(r'<h2>(.*?)<small', sec.group(2), flags=re.S)
        group = '%s › %s' % (page, re.sub(r'<[^>]+>', '', h2.group(1)).strip()) if h2 else page
        for m in re.finditer(r'<div class="sg-item"[^>]*data-uses="([^"]+)"[^>]*>\s*<div class="sg-item__hd"><h3>(.*?)</h3>', sec.group(2), flags=re.S):
            PARTS.append({'name': re.sub(r'<[^>]+>', '', m.group(2)).strip(), 'group': group, 'classes': [c.strip() for c in m.group(1).split(',')],
                          'doc': '%s#%s' % (f, sec.group(1))})

# 화면에 특히 걸리는 규칙 — (조건, 규칙 번호). 조건은 화면 정보 dict 를 받는다.
uses = lambda *cls: (lambda p: any(c in p['_classes'] for c in cls))
loads = lambda *names: (lambda p: any(n in p['css'] + p['js'] for n in names))
RULE_MAP = [
    (loads('styles/learn-shell.css'), ['RM-SURF-05', 'RM-FILL-06', 'RM-PART-05']),
    (uses('opt', 'qopt'), ['RM-SURF-02', 'RM-SURF-04', 'RM-FILL-05']),
    (uses('ex__list', 'ex'), ['RM-SURF-04']),
    (uses('explain', 'expl'), ['RM-SURF-03']),
    (uses('toolbtn--primary'), ['RM-FILL-02']),
    (uses('btn-grade'), ['RM-FILL-02']),
    (uses('blank', 'rblank', 'sblank'), ['RM-SURF-01']),
    (loads('styles/keypad.css'), ['RM-PART-01', 'RM-PART-03']),
    (loads('styles/monitor.css'), ['RM-PART-02']),
    (loads('styles/scratchpad.css'), ['RM-PART-01']),
    (loads('styles/result.css'), ['RM-PART-03']),
    (loads('styles/util.css'), ['RM-UTIL-01', 'RM-UTIL-02', 'RM-UTIL-03', 'RM-UTIL-04', 'RM-UTIL-05']),
    (uses('u-sk', 'u-state'), ['RM-UTIL-06']),
    (uses('dummy-img', 'qopt__img', 'ex__skel', 'sopt__img', 'sblank__thumb'), ['RM-ASSET-03']),
    (lambda p: p['path'] == 'nav/home.html', ['RM-ASSET-04', 'RM-FILL-08']),
    (loads('styles/gnb.css'), ['RM-FILL-02', 'RM-PART-03']),
    (loads('scripts/vendor/katex'), ['RM-PART-04']),
]

TOKEN = re.compile(r'var\(\s*(--[\w-]+)')
SCALE = re.compile(r'--(fs|sp|r|bw|depth|z|fw|lh|font|t)-')
screens = []
for f in sorted(glob.glob('**/*.html', recursive=True)):
    if f.startswith(SKIP): continue
    s = open(f, encoding='utf-8').read()
    h = re.search(r'<html[^>]*>', s).group(0)
    sec = (re.search(r'data-section="(\w+)"', h) or [None, None])[1]
    th = (re.search(r'data-theme="(\w+)"', h) or [None, 'dark'])[1]
    toggles = bool(re.search(r'theme-toggle|themeToggle|rm-theme', s))
    css = ['styles/' + c for c in re.findall(r'styles/([^"?]+\.css)', s)]
    js = ['scripts/' + c for c in re.findall(r'scripts/([^"?]+\.js)', s)]
    fam = os.path.dirname(f) or '.'
    classes = {c for c, m in usage.items() if f in m}
    parts = [{'name': p['name'], 'group': p['group'], 'doc': p['doc']} for p in PARTS if any(c in classes for c in p['classes'])]
    # 화면 CSS 가 없는 화면(유틸 4장)은 계열 파일이 그 역할을 한다
    own = [c for c in css if c.startswith('styles/screens/')] or [c for c in css if c not in ('styles/tokens.css', 'styles/base.css', 'styles/components.css', 'styles/gnb.css')][-1:]
    cnt = collections.Counter()
    for c in own:
        t = re.sub(r'/\*.*?\*/', '', open(c, encoding='utf-8').read(), flags=re.S)
        cnt.update(n for n in TOKEN.findall(t) if not SCALE.match(n))
    info = {
        'path': f, 'title': re.sub(r'\s*—.*$', '', re.search(r'<title>(.*?)</title>', s).group(1)).strip(),
        'family': fam, 'familyKo': FAMILY_KO.get(fam, fam), 'section': sec,
        'theme': 'light+dark' if toggles else th, 'css': css, 'js': js, '_classes': classes,
    }
    rules = []
    for cond, ids in RULE_MAP:
        if cond(info): rules += [i for i in ids if i not in rules]
    info.update({'parts': parts, 'tokensFrom': own, 'tokens': [{'name': n, 'count': c} for n, c in cnt.most_common(12)], 'rules': rules})
    del info['_classes']
    screens.append(info)

data = {
    '_읽는 법': '화면마다 무엇으로 지어졌나. tools/screens-build.py 가 만든다(손으로 고치지 않는다). '
              'parts = 스토리북 부품 카드(doc 으로 간다) · tokens = 화면 CSS 가 많이 부르는 색·역할 토큰(눈금 제외) · '
              'rules = 이 화면에 특히 걸리는 규칙(전 화면 공통 규칙은 뺐다 — styleguide/data/rules.json).',
    '_만든 도구': 'tools/screens-build.py',
    'count': len(screens),
    'screens': screens,
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('%d 화면 → %s' % (len(screens), OUT))
