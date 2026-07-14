#!/usr/bin/env python3
# =========================================================================
# RMDS 팔레트 생성기 — OKLCH 기반 지각 균일 톤 램프
# -------------------------------------------------------------------------
# 개념: 모든 액센트 색상 가족은 "같은 명도 사다리(L) + 같은 채도 곡선(C)"으로
#       생성된다. 색을 바꾸고 싶으면 HUES의 색상각(h)만 수정하고 재실행.
#       → 결과 hex를 tokens.css primitive에 붙여넣으면 시스템 전체가 연동.
# 사용: python3 tools/palette-gen.py          (표 + 대비 검증 출력)
#       python3 tools/palette-gen.py --html   (tools/palette-preview.html 생성)
# =========================================================================
import sys, math

# ---------- sRGB <-> OKLab/OKLCH ----------
def srgb_to_linear(c):
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def linear_to_srgb(c):
    return 12.92*c if c <= 0.0031308 else 1.055*(c**(1/2.4))-0.055

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))

def rgb_to_oklch(rgb):
    r,g,b = (srgb_to_linear(c) for c in rgb)
    l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b
    m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b
    s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b
    l,m,s = l**(1/3), m**(1/3), s**(1/3)
    L = 0.2104542553*l + 0.7936177850*m - 0.0040720468*s
    a = 1.9779984951*l - 2.4285922050*m + 0.4505937099*s
    bb= 0.0259040371*l + 0.7827717662*m - 0.8086757660*s
    C = math.hypot(a,bb); h = math.degrees(math.atan2(bb,a)) % 360
    return L,C,h

def oklch_to_rgb(L,C,h):
    a = C*math.cos(math.radians(h)); bb = C*math.sin(math.radians(h))
    l = (L + 0.3963377774*a + 0.2158037573*bb)**3
    m = (L - 0.1055613458*a - 0.0638541728*bb)**3
    s = (L - 0.0894841775*a - 1.2914855480*bb)**3
    r = +4.0767416621*l - 3.3077115913*m + 0.2309699292*s
    g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s
    b = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s
    return tuple(linear_to_srgb(c) for c in (r,g,b))

def in_gamut(rgb, eps=0.0005):
    return all(-eps <= c <= 1+eps for c in rgb)

def max_chroma(L,h):
    lo, hi = 0.0, 0.5
    for _ in range(40):
        mid = (lo+hi)/2
        if in_gamut(oklch_to_rgb(L,mid,h)): lo = mid
        else: hi = mid
    return lo

def to_hex(rgb):
    return '#' + ''.join(f'{round(max(0,min(1,c))*255):02X}' for c in rgb)

# ---------- WCAG ----------
def wcag_lum(rgb):
    r,g,b = (srgb_to_linear(c) for c in rgb)
    return 0.2126*r + 0.7152*g + 0.0722*b
def contrast(h1,h2):
    l1,l2 = wcag_lum(hex_to_rgb(h1)), wcag_lum(hex_to_rgb(h2))
    if l1 < l2: l1,l2 = l2,l1
    return (l1+0.05)/(l2+0.05)

# =========================================================================
# 설계 파라미터 (여기만 수정하면 팔레트 전체 재생성)
# =========================================================================
# 명도 사다리 — 모든 액센트 가족 공통 (지각 균일의 핵심)
STEPS = {  # step: (OKLCH L, 목표 C)  — v1.5 vivid 밴드 명도↑(solid 칩이 어두워 물빠져 보임)
    '050': (0.975, 0.026),   # 틴트 배경
    '100': (0.935, 0.072),   # 칩 배경
    '200': (0.865, 0.120),   # 라이트 보더 · 소프트
    '300': (0.798, 0.196),   # 다크 표면 위 텍스트/아이콘 · 뱃지
    '400': (0.732, 0.252),   # VIVID — 정체성(모드탭·CTA·마커·호버)
    '500': (0.598, 0.264),   # CORE — solid 칠 (흰 글자 AA-large ≥3 · 굵은/큰 텍스트 전용)
    '600': (0.478, 0.210),   # pressed · 흰 배경 컬러 텍스트(작은 글자 ≥4.5)
    '700': (0.395, 0.170),   # ink · 딥 프레임 (섹션 static)
    '800': (0.320, 0.140),   # 딥 static · 최심 프레임
    '900': (0.245, 0.095),
}
GAMUT_SAFETY = 0.98   # sRGB 경계 98%까지 (채도 여지 최대한 확보)

# 색상 가족 — 색상각(h)과 채도 배율만 정의. 나머지는 사다리가 결정.
HUES = {
    'blue':   (257, 1.00),   # 브랜드 · 개념 · 과제
    'cyan':   (220, 1.00),   # 우주 · 등급S
    'teal':   (182, 1.00),   # 유형
    'green':  (142, 1.00),   # 정답 · 자유모드
    'amber':  ( 80, 1.00),   # 주의 · 현재 마커
    'orange': ( 52, 1.00),   # CTA · 과제모드
    'red':    ( 25, 1.00),   # 오답
    'violet': (288, 1.00),   # 서술형 · 시험대비
}

# 뉴트럴 — 다크 존(500~950)은 검증된 우주 네이비 유지, 라이트 존(050~400)은 생성.
# 라이트 존 생성 규칙: hue = 다크 존과 동일(네이비), 채도는 050→500으로 단조증가
# (구 램프의 문제: 200은 파란기·300/400은 무채색 → 재질이 갈라져 보임)
NEUTRAL_DARK = {  # 유지 (사용자 승인 구간)
    '500':'#3A466A','600':'#1F2B49','650':'#121E37','700':'#0F1930',
    '800':'#091328','900':'#060E20','950':'#03060F',
}
NEUTRAL_HUE = 262   # 네이비 언더톤(우주 배경과 한 가족). n-500 실측(268)보다 살짝 블루로
NEUTRAL_LIGHT_STEPS = {  # step: (L, C) — v1.4 채도 상향: 무채색 그레이 탈피, 네이비 결 부여
    '050': (0.970, 0.013),
    '100': (0.942, 0.022),
    '200': (0.878, 0.034),
    '300': (0.755, 0.046),
    '400': (0.525, 0.058),
}

def build_neutral():
    n = {'000': '#FFFFFF'}
    for step,(L,C) in NEUTRAL_LIGHT_STEPS.items():
        c = min(C, max_chroma(L, NEUTRAL_HUE)*GAMUT_SAFETY)
        n[step] = to_hex(oklch_to_rgb(L, c, NEUTRAL_HUE))
    n.update(NEUTRAL_DARK)
    return n

NEUTRAL_OLD = {
    '000':'#FFFFFF','050':'#F2F4F7','100':'#E4E7EC','200':'#C1CBDA',
    '300':'#9DA3B1','400':'#5C6373','500':'#3A466A','600':'#1F2B49',
    '650':'#121E37','700':'#0F1930','800':'#091328','900':'#060E20','950':'#03060F',
}
NEUTRAL = build_neutral()

def build():
    fams = {}
    for name,(h,mult) in HUES.items():
        ramp = {}
        for step,(L,C) in STEPS.items():
            c = min(C*mult, max_chroma(L,h)*GAMUT_SAFETY)
            ramp[step] = to_hex(oklch_to_rgb(L,c,h))
        fams[name] = ramp
    return fams

def report(fams):
    steps = list(STEPS.keys())
    print('=== RMDS 생성 팔레트 ===')
    print(f"{'':8}" + ''.join(f'{s:>9}' for s in steps))
    for name,ramp in fams.items():
        print(f'{name:8}' + ''.join(f'{ramp[s]:>9}' for s in steps))
    print()
    print('=== 대비 검증 (WCAG) — 목표: ①흰글자on500 ≥4.5 ②600on흰 ≥4.5 ③700on흰 ≥7 ④300on n-800 ≥4.5 ⑤400on n-900 ≥3(모드탭) ===')
    n800, n900 = NEUTRAL['800'], NEUTRAL['900']
    for name,ramp in fams.items():
        c1 = contrast('#FFFFFF', ramp['500'])
        c2 = contrast(ramp['600'], '#FFFFFF')
        c3 = contrast(ramp['700'], '#FFFFFF')
        c4 = contrast(ramp['300'], n800)
        c5 = contrast(ramp['400'], n900)
        flag = lambda v,t: ('OK ' if v>=t else '!! ')
        print(f'{name:8} ①{flag(c1,4.5)}{c1:4.1f}  ②{flag(c2,4.5)}{c2:4.1f}  ③{flag(c3,7)}{c3:4.1f}  ④{flag(c4,4.5)}{c4:4.1f}  ⑤{flag(c5,3)}{c5:4.1f}')
    print()
    print('=== 뉴트럴 진단: OLD(측정) vs NEW(생성) — L/C/h ===')
    for step in NEUTRAL:
        old = NEUTRAL_OLD.get(step); new = NEUTRAL[step]
        oL,oC,oh = rgb_to_oklch(hex_to_rgb(old))
        nL,nC,nh = rgb_to_oklch(hex_to_rgb(new))
        mark = '(유지)' if old == new else '  →  '
        print(f'n-{step}: {old} L{oL:.3f} C{oC:.3f} h{oh:5.0f} {mark} {new} L{nL:.3f} C{nC:.3f} h{nh:5.0f}')
    print('뉴트럴 검증: n-400 on 흰 %.1f (≥4.5) · n-300 on n-800 %.1f (≥4.5) · n-200 border on 흰 %.2f' % (
        contrast(NEUTRAL['400'], '#FFFFFF'), contrast(NEUTRAL['300'], NEUTRAL['800']), contrast(NEUTRAL['200'], '#FFFFFF')))
    print()
    print('=== 기존 500 vs 신규 500 (명도 정규화 확인) ===')
    OLD = {'blue':'#0B57BD','teal':'#00A99A','green':'#58CC02','red':'#FF404C','violet':'#7777FF','orange':'#FF7F00','amber':'#FFC148','cyan':'#05C5EC'}
    for name,old in OLD.items():
        oL = rgb_to_oklch(hex_to_rgb(old))[0]
        new = fams[name]['500']; nL = rgb_to_oklch(hex_to_rgb(new))[0]
        print(f'{name:8} old {old} (L{oL:.2f}) → new {new} (L{nL:.2f})')

def html(fams):
    steps = list(STEPS.keys())
    rows = ''
    for name,ramp in fams.items():
        cells = ''.join(
            f'<div class="sw" style="background:{ramp[s]}"><b>{s}</b><span>{ramp[s]}</span></div>'
            for s in steps)
        rows += f'<div class="fam"><h3>{name}</h3><div class="ramp">{cells}</div></div>'
    ncells = ''.join(
        f'<div class="sw" style="background:{v}"><b>{k}</b><span>{v}</span></div>'
        for k,v in NEUTRAL.items())
    ocells = ''.join(
        f'<div class="sw" style="background:{v}"><b>{k}</b><span>{v}</span></div>'
        for k,v in NEUTRAL_OLD.items())
    # 라이트 표면 적층 시뮬레이션 (거터→카드→인셋→보더→텍스트 위계)
    N = NEUTRAL
    nsim = f'''
    <div style="background:{N['100']};border-radius:16px;padding:18px;display:flex;gap:14px">
      <div style="flex:1;background:{N['000']};border:1px solid {N['200']};border-radius:14px;padding:16px">
        <div style="color:{N['650']};font-weight:800;margin-bottom:6px">카드 (n-000) 위 잉크 n-650</div>
        <div style="color:{N['500']};font-size:14px;margin-bottom:4px">muted 텍스트 n-500</div>
        <div style="color:{N['400']};font-size:13px;margin-bottom:10px">meta 텍스트 n-400</div>
        <div style="background:{N['050']};border-radius:10px;padding:10px;color:{N['400']};font-size:13px">인셋 n-050 · 보더 n-200</div>
      </div>
      <div style="flex:1;background:{N['800']};border-radius:14px;padding:16px">
        <div style="color:#F2F4F9;font-weight:800;margin-bottom:6px">다크 카드 (n-800)</div>
        <div style="color:{N['300']};font-size:14px;margin-bottom:10px">muted 텍스트 n-300</div>
        <div style="background:{N['600']};border-radius:10px;padding:10px;color:{N['300']};font-size:13px">인터랙티브 n-600</div>
      </div>
    </div>'''
    # 실사용 시뮬레이션: 다크/라이트 카드 위 각 테마
    sims = ''
    for name in ('blue','teal','violet','orange','green','red'):
        r = fams[name]
        sims += f'''
    <div class="sim light">
      <span class="chip" style="background:{r['050']};color:{r['700']}">tint chip</span>
      <button style="background:{r['500']};color:#fff">버튼 500</button>
      <b style="color:{r['600']}">텍스트 600</b>
      <b style="color:{r['700']}">잉크 700</b>
      <span class="fr" style="border-color:{r['800']}">frame 800</span>
    </div>
    <div class="sim dark">
      <span class="chip" style="background:rgba(255,255,255,.06);color:{r['300']}">on-dark 300</span>
      <button style="background:{r['500']};color:#fff">버튼 500</button>
      <b style="color:{r['400']}">모드탭 400</b>
      <b style="color:{r['300']}">강조 300</b>
    </div>'''
    doc = f'''<!DOCTYPE html><html><head><meta charset="utf8"><title>RMDS palette preview</title><style>
    body{{font-family:Pretendard,system-ui,sans-serif;background:#E4E7EC;margin:0;padding:28px;}}
    h2{{margin:26px 0 10px}} h3{{margin:14px 0 6px;text-transform:uppercase;font-size:13px;letter-spacing:.06em;color:#3A466A}}
    .ramp{{display:flex;gap:4px}}
    .sw{{flex:1;height:64px;border-radius:10px;display:flex;flex-direction:column;justify-content:flex-end;padding:6px 8px;color:#fff;font-size:10px}}
    .sw b{{font-size:11px}} .sw span{{opacity:.85}}
    .sw:nth-child(-n+4){{color:#0F1930}}
    .sims{{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}}
    .sim{{border-radius:14px;padding:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}}
    .sim.light{{background:#fff;border:1px solid rgba(20,32,58,.1)}}
    .sim.dark{{background:#091328}}
    .sim button{{border:0;border-radius:10px;padding:9px 16px;font-weight:800;font-size:14px}}
    .chip{{padding:4px 10px;border-radius:999px;font-weight:800;font-size:12px}}
    .fr{{border:4px solid;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:700;color:#0F1930}}
    </style></head><body>
    <h2 style="margin-top:0">NEUTRAL — NEW (라이트 존 생성)</h2><div class="ramp">{ncells}</div>
    <h3>OLD (비교용)</h3><div class="ramp" style="opacity:.9">{ocells}</div>
    <h2>뉴트럴 실사용 (라이트/다크 표면 적층)</h2>{nsim}
    <h2>실사용 시뮬레이션</h2><div class="sims">{sims}</div>
    <h2>ACCENT RAMPS (생성)</h2>{rows}
    </body></html>'''
    with open('tools/palette-preview.html','w') as f: f.write(doc)
    print('written: tools/palette-preview.html')

if __name__ == '__main__':
    fams = build()
    report(fams)
    if '--html' in sys.argv: html(fams)
