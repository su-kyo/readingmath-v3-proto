#!/usr/bin/env python3
"""icon-swap.py — 화면 아이콘을 무료 세트 하나로 바꿔 끼운다 (2026-10-16 · Lucide / Tabler 비교 시안용)

    python3 tools/icon-swap.py lucide
    python3 tools/icon-swap.py tabler

한 번 돌리면 작업 폴더가 그 세트로 바뀐다. 같은 폴더에 두 번 돌리지 않는다 — 비교는 갈래를 둘로 나눠서 한다.
후보 SVG는 unpkg에서 받는다(lucide-static 0.460.0 · @tabler/icons 3.19.0 outline, 라이선스 ISC · MIT).

하는 일
  1. 인라인 <svg> — 원본의 고유 조각(INLINE)으로 뜻을 알아내고 그 뜻의 세트 아이콘으로 바꾼다.
     class · width · height · aria 는 그대로, 선 굵기는 원본 값(자리마다 크기에 맞춰 둔 것)을 따른다.
  2. 그림 파일 아이콘(콘솔바 흰 아이콘) — FILES의 파일을 세트 아이콘으로 다시 쓴다.
     요약 아이콘(ico-summary)을 빌려 쓰던 버튼은 문구(LABEL)에 맞는 새 파일로 바꿔 단다.
  3. 「채점하기 ↔ 다음 문제」처럼 문구가 바뀌는 버튼은 아이콘도 같이 바뀌게 한다(setCta).
  4. 서랍 메뉴(gnb-drawer.js MENU)는 경로 한 줄 대신 아이콘 속을 통째로 받게 한다.
  5. 전 화면 ?v= 를 VER 로.

손대지 않는 것(INLINE에 없으면 그대로 남는다)
  정오답 표시 ○ · 진행 점(CSS 그림) · 등급 별 · 해·달 손잡이 · 색 있는 초시계 · 콘솔 장식 · 로고 ·
  시험 타일 상태 배지 · 차트 · 진행 링. 스토리북 견본도 그대로다(세트를 고른 뒤 맞춘다).
"""
import os, re, sys, json, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER_OLD, VER = '20261016-5', '20261016-6'
SKIP = ('tools', 'figma-palette', 'video', 'docs', 'styleguide', '.git', '.claude', 'node_modules')
CDN = {
    'lucide': 'https://unpkg.com/lucide-static@0.460.0/icons/{}.svg',
    'tabler': 'https://unpkg.com/@tabler/icons@3.19.0/icons/outline/{}.svg',
}

# 뜻 → (Lucide 이름, Tabler 이름)
MEAN = {
    'chev-r': ('chevron-right', 'chevron-right'), 'chev-l': ('chevron-left', 'chevron-left'),
    'chev-d': ('chevron-down', 'chevron-down'), 'next': ('arrow-right', 'arrow-right'),
    'x': ('x', 'x'), 'check': ('check', 'check'), 'plus': ('plus', 'plus'),
    'home': ('house', 'home'), 'exit': ('log-out', 'logout'), 'back': ('undo-2', 'arrow-back-up'),
    'scratch': ('notebook-pen', 'notebook'), 'pen': ('pen-line', 'pencil'),
    'summary': ('list', 'list'), 'result': ('chart-column', 'chart-bar'),
    'explain': ('book-open', 'book'), 'send': ('send', 'send'), 'grade': ('clipboard-check', 'clipboard-check'),
    'done': ('circle-check-big', 'circle-check'), 'wrongnote': ('notebook-text', 'notes'),
    'doc': ('file-text', 'file-text'), 'file': ('file', 'file'), 'video': ('circle-play', 'player-play'),
    'textsize': ('type', 'typography'), 'checklist': ('square-check-big', 'square-check'),
    'calendar': ('calendar', 'calendar'), 'print': ('printer', 'printer'), 'download': ('download', 'download'),
    'moon': ('moon', 'moon'), 'sun': ('sun', 'sun'), 'help': ('circle-help', 'help-circle'),
    'siren': ('siren', 'urgent'), 'notice': ('megaphone', 'speakerphone'), 'menu': ('menu', 'menu-2'),
    'reset': ('rotate-ccw', 'rotate'), 'switch': ('rotate-cw', 'rotate-clockwise'), 'info': ('info', 'info-circle'),
    'play': ('play', 'player-play'), 'zap': ('zap', 'bolt'), 'trophy': ('trophy', 'trophy'),
    'check-circle': ('circle-check-big', 'circle-check'), 'trend': ('trending-up', 'trending-up'),
    'lock': ('lock', 'lock'), 'link': ('link', 'link'), 'image': ('image', 'photo'), 'bulb': ('lightbulb', 'bulb'),
    'backspace': ('delete', 'backspace'), 'triangle': ('triangle', 'triangle'), 'globe': ('globe', 'world'),
    'book': ('book', 'book-2'), 'undo': ('undo-2', 'arrow-back-up'), 'redo': ('redo-2', 'arrow-forward-up'),
    'eraser': ('eraser', 'eraser'), 'trash': ('trash-2', 'trash'), 'rocket': ('rocket', 'rocket'),
    'cloud-alert': ('cloud-alert', 'cloud-exclamation'), 'card': ('credit-card', 'credit-card'),
    'bank': ('landmark', 'building-bank'), 'alert-circle': ('circle-alert', 'alert-circle'),
    'external': ('external-link', 'external-link'), 'user': ('user', 'user'), 'history': ('list', 'list'),
}
FILLED = {'play', 'zap'}   # 원본이 칠한 모양이던 것 — 칠을 남긴다

# 원본 <svg> 안의 고유 조각 → 뜻. 위에서부터 먼저 맞는 것.
INLINE = [
    ('d="M9 6l6 6-6 6"', 'chev-r'), ('d="M9 5l7 7-7 7"', 'chev-r'),
    ('d="M15 6l-6 6 6 6"', 'chev-l'), ('d="M15 5l-7 7 7 7"', 'chev-l'), ('d="M6 9l6 6 6-6"', 'chev-d'),
    ('M12 20h9M16.5 3.5', 'scratch'),                       # 과제 콘솔바 「연습장」
    ('<path d="M12 20h9"/><path d="M16.5 3.5', 'pen'),      # 개념 정리 안내의 펜
    ('M9 17V9M15 17v-5M3 21h18', 'result'), ('M8 14v3M12 10v7M16 12v5', 'result'),
    ('rx="2.5"/><path d="M8 2.5v4', 'calendar'), ('M8 2v4M16 2v4M3 10h18', 'calendar'), ('M7 3v4M17 3v4M4 9h16', 'calendar'),
    ('M3 10.5 12 3l9 7.5', 'home'), ('M4 11.5 12 4l8 7.5', 'home'), ('M3 11l9-8 9 8', 'home'),
    ('d="M20 6 9 17l-5-5"', 'check'), ('M5 12.5l4.5 4.5L19 7', 'check'), ('M5 13l4 4L19 7', 'check'), ('M3.5 8.4l3 3 6-6.6', 'check'),
    ('M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15', 'explain'),
    ('M22 2 11 13M22 2l-7 20-4-9-9-4z', 'send'),
    ('M2 2l10 10M12 2L2 12', 'x'), ('M6 6l12 12M18 6L6 18', 'x'), ('M7 7l10 10M17 7L7 17', 'x'), ('M3 3l10 10M13 3L3 13', 'x'),
    ('M9 11l3 3L22 4', 'checklist'),
    ('M4 6h16M4 12h16M4 18h10', 'summary'),
    ('M5 12h14M13 6l6 6-6 6', 'next'),
    ('M6 9V2h12v7', 'print'),
    ('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'download'), ('M12 4v11M7 11l5 5 5-5M5 20h14', 'download'),
    ('M21 12.8A9 9 0 1 1 11.2 3', 'moon'), ('M12 2v2.4M12 19.6V22', 'sun'),
    ('M9.5 9a2.5 2.5 0 1 1 3.5 2.3', 'help'), ('mask id="rmgh"', 'help'),
    ('M6 20h12M8 20v-5a4 4 0 0 1 8 0v5', 'siren'), ('M11.4327 11.4335C11.4327', 'siren'),
    ('M12 3l9 16H3z', 'siren'), ('M12 9v4M12 17h.01M10.3 4.3', 'siren'),   # 오류 신고 = 사이렌(콘솔바와 같게)
    ('M4 9v6h3l7 4V5L7 9H4z', 'notice'), ('M2.33301 11.6667V16.3334', 'notice'),
    ('M4 7h16M4 12h16M4 17h16', 'menu'), ('M24.0001 17.0001V19.0001', 'menu'),
    ('M3 12a9 9 0 1 0 3-6.7', 'reset'), ('M21 12a9 9 0 1 1-3-6.7', 'switch'),
    ('<path d="M12 11v5"/><circle cx="12" cy="7.8"', 'info'), ('M12 11v5M12 8h.01', 'info'),
    ('d="M8 5v14l11-7z"', 'play'), ('M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z', 'zap'),
    ('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5', 'exit'), ('M15 4h3a2 2 0 0 1 2 2v12', 'exit'),
    ('M8 21h8M12 17v4M7 4h10v4', 'trophy'),
    ('M14 3v4a1 1 0 0 0 1 1h4M17 21H7', 'doc'), ('rx="2"/><path d="M8 8h8M8 12h8M8 16h5"', 'doc'),
    ('M22 11.1V12a10 10 0 1 1-5.9-9.1', 'check-circle'), ('M22 7 13.5 15.5l-4-4L2 19', 'trend'),
    ('M8 11V7a4 4 0 0 1 8 0v4', 'lock'), ('M8 11V8a4 4 0 0 1 8 0v3', 'lock'),
    ('M9 14 4 9l5-5M4 9h11a5 5', 'back'), ('M9 15l6-6M10.5 6.5l1-1', 'link'),
    ('<path d="M4 18l5-5 4 4 3-3 4 4"', 'image'), ('<path d="M21 16l-5-5-9 9"', 'image'),
    ('M9 18h6M10 21h4M12 3a6 6', 'bulb'), ('M21 5H9L3 12l6 7h12', 'backspace'), ('M21 4H8l-6 8 6 8h13', 'backspace'),
    ('M8 3l5.5 9.5h-11z', 'triangle'), ('M12 3a15 15 0 0 1 0 18', 'globe'),
    ('M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20', 'book'), ('M12 5v14M5 12h14', 'plus'),
    ('M8 4L3.5 8.5 8 13', 'undo'), ('M12 4l4.5 4.5L12 13', 'redo'),
    ('M97 319c-9.4 9.4-9.4 24.6 0 33.9', 'eraser'), ('M170.5 51.6L151.5 80h145', 'trash'),
    ('M4.5 15.5c-1.5 1.3-2 5.5-2 5.5', 'rocket'), ('M7 18a4 4 0 0 1-.4-8', 'cloud-alert'),
    ('<path d="M3 10.5h18"', 'card'), ('M4 10h16M4 10l8-6 8 6', 'bank'), ('M12 7.5v5.5M12 16.5h.01', 'alert-circle'),
    ('M14 5h5v5M19 5l-8 8', 'external'), ('d="M14 3v5h5"', 'file'),
]

# 콘솔바 흰 아이콘 파일 → 뜻 (img 로 부르므로 색을 파일에 박는다)
FILES = {
    'ico-exit': 'exit', 'ico-siren': 'siren', 'ico-note': 'scratch', 'ico-note-edit': 'scratch',
    'ico-play': 'video', 'ico-summary': 'summary', 'ico-text': 'textsize',
    # 새 파일 — 요약 아이콘을 빌려 쓰던 버튼에 단다
    'ico-grade': 'grade', 'ico-next': 'next', 'ico-result': 'result', 'ico-back': 'back', 'ico-done': 'done',
    'ico-send': 'send', 'ico-explain': 'explain', 'ico-home': 'home', 'ico-wrongnote': 'wrongnote', 'ico-doc': 'doc',
}
# 버튼 문구 → 파일 (ico-summary · ico-note 를 빌려 쓰던 것)
LABEL = {
    '채점하기': 'grade', '다음 문제': 'next', '다음으로': 'next', '결과보기': 'result', '결과로 돌아가기': 'back',
    '다 읽었어요': 'done', '제출하기': 'send', '해설 보기': 'explain', '홈으로': 'home',
    '오답노트 확인하기': 'wrongnote', '보고서 미리보기': 'doc', '추천 보고서': 'doc',
}
DRAWER = {'마이페이지': 'user', '학습 기록': 'history', '월간 보고서': 'calendar', '오답 노트': 'wrongnote',
          '진단 평가': 'grade', '이용권 결제': 'card', '이용 가이드': 'help'}

_cache = {}
def inner(key, which):
    name = MEAN[key][0 if which == 'lucide' else 1]
    if name not in _cache:
        t = urllib.request.urlopen(CDN[which].format(name), timeout=30).read().decode()
        t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
        body = re.search(r'<svg\b[^>]*>(.*)</svg>', t, re.S).group(1)
        body = body.replace('<path stroke="none" d="M0 0h24v24H0z" fill="none"/>', '')
        _cache[name] = re.sub(r'\s+', ' ', body).replace('> <', '><').strip()
    return _cache[name]

def new_svg(old, key, which):
    root = re.match(r'<svg\b([^>]*)>', old).group(1)
    keep = []
    for a in ('class', 'id', 'width', 'height', 'aria-hidden', 'aria-label', 'role'):
        m = re.search(r'\s%s="([^"]*)"' % a, root)
        if m: keep.append('%s="%s"' % (a, m.group(1)))
    sw = re.search(r'stroke-width="([\d.]+)"', old)
    sw = sw.group(1) if sw else '2'
    fill = 'currentColor' if key in FILLED else 'none'
    head = ' '.join(keep + ['viewBox="0 0 24 24"', 'fill="%s"' % fill, 'stroke="currentColor"',
                            'stroke-width="%s"' % sw, 'stroke-linecap="round"', 'stroke-linejoin="round"'])
    return '<svg %s>%s</svg>' % (head, inner(key, which))

def files():
    for r, ds, fs in os.walk(ROOT):
        rel = os.path.relpath(r, ROOT)
        top = rel.split(os.sep)[0]
        if top in SKIP or top.startswith('.wt') or 'vendor' in rel.split(os.sep): ds[:] = []; continue
        for f in fs:
            if f.endswith(('.html', '.js')): yield os.path.join(r, f)

def main(which):
    count, left = {}, {}
    for p in files():
        s0 = s = open(p, encoding='utf-8').read()
        def sub(m):
            old = m.group(0)
            for frag, key in INLINE:
                if frag in old:
                    count[key] = count.get(key, 0) + 1
                    return new_svg(old, key, which)
            left[os.path.relpath(p, ROOT)] = left.get(os.path.relpath(p, ROOT), 0) + 1
            return old
        s = re.sub(r'<svg\b[\s\S]*?</svg>', sub, s)
        # 요약 · 노트 아이콘을 빌려 쓰던 버튼 → 문구에 맞는 파일
        for lab, key in LABEL.items():
            s = re.sub(r'(<img src="assets/icons/)ico-(?:summary|note)(\.svg" alt="" /><span>%s<)' % re.escape(lab),
                       r'\1ico-%s\2' % key, s)
        s = s.replace('?v=' + VER_OLD, '?v=' + VER)
        if s != s0: open(p, 'w', encoding='utf-8').write(s)

    # 문구가 바뀌는 CTA — 아이콘도 같이 (그림 주소만 바꾼다, RM-JS-01)
    for js in ('scripts/learn-basic-ops.js', 'scripts/learn-drill.js'):
        p = os.path.join(ROOT, js); s = open(p, encoding='utf-8').read()
        a = "function setCta(t) { gradeBtn.querySelector('span').textContent = t; }"
        b = ("var CTA_ICO = { '채점하기': 'grade', '다음 문제': 'next', '다음으로': 'next', '결과보기': 'result' };   // 문구가 바뀌면 아이콘도\n"
             "  function setCta(t) { gradeBtn.querySelector('span').textContent = t; gradeBtn.querySelector('img').src = 'assets/icons/ico-' + CTA_ICO[t] + '.svg'; }")
        assert s.count(a) == 1, js
        open(p, 'w', encoding='utf-8').write(s.replace(a, b))

    # 서랍 메뉴 — 경로 한 줄 대신 아이콘 속을 통째로
    p = os.path.join(ROOT, 'scripts/gnb-drawer.js'); s = open(p, encoding='utf-8').read()
    a = '<path d="\'+m[1]+\'"/></svg>'
    assert s.count(a) == 1
    s = s.replace(a, "'+m[1]+'</svg>")
    for lab, key in DRAWER.items():
        s, n = re.subn(r"(\['%s',')[^']*(')" % re.escape(lab), lambda m: m.group(1) + inner(key, which) + m.group(2), s)
        assert n == 1, lab
        count[key] = count.get(key, 0) + 1
    open(p, 'w', encoding='utf-8').write(s)

    # 흰 아이콘 파일
    for f, key in FILES.items():
        body = inner(key, which)
        fill = 'white' if key in FILLED else 'none'
        svg = ('<svg width="24" height="24" viewBox="0 0 24 24" fill="%s" stroke="white" stroke-width="2" '
               'stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">%s</svg>\n') % (fill, body)
        open(os.path.join(ROOT, 'assets/icons', f + '.svg'), 'w', encoding='utf-8').write(svg)

    print(which, '— 바꾼 인라인/서랍 아이콘', sum(count.values()), json.dumps(count, ensure_ascii=False))
    print('그대로 둔 인라인 svg', sum(left.values()), json.dumps(left, ensure_ascii=False))

if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in CDN: sys.exit(__doc__)
    main(sys.argv[1])
