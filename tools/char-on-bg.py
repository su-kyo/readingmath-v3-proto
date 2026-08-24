#!/usr/bin/env python3
"""
행성 대표 캐릭터를 홈 화면에 올려 보는 검사 도구 (배포 제외)
=============================================================
새로 만든 캐릭터 이미지가 「그 학기의 수학·과학 홈 배경에서 실제로 눈에 띄는가」를
눈과 숫자로 함께 확인한다. 캐릭터는 학기당 한 명이고 수학·과학이 같은 그림을 쓰므로,
두 화면 모두에서 버텨야 통과다.

쓰는 법
    python3 tools/char-on-bg.py <캐릭터.png> <학기키> [출력폴더]
    python3 tools/char-on-bg.py ~/Desktop/ch.png elem-3-1
    학기키: elem-3-1 … high-1-2 (16종)

만들어 주는 것
    <출력폴더>/<학기키>-누끼.png    마젠타(또는 지정색) 배경을 지운 투명 PNG
    <출력폴더>/<학기키>-검사.png    위=수학 표면, 아래=과학 우주선 안 (실제 좌표·크기)

찍어 주는 숫자 (판정용)
    · 몸 대비    캐릭터 평균 밝기 ↔ 그 자리 배경 평균 밝기의 대비비
                 1.5 미만이면 배경에 녹는다. 2.0 이상이 안전하다.
    · 자체 대비  캐릭터 안에서 가장 밝은 면 ↔ 가장 어두운 면의 대비비
                 3.0 미만이면 어떤 배경에서든 밋밋하다. 5.0 이상이 좋다.
    자체 대비가 넉넉하면 몸 대비가 낮아도 형태가 읽힌다 — 둘을 함께 본다.

전제
    · 캐릭터 원본은 1:1 정사각, 배경이 단색으로 꽉 차 있다(기본값 마젠타 #FF00FF).
      이미 투명 PNG면 --keep 을 붙인다.
    · 오브젝트는 전부 「완료(실물)」 상태로 깔린다. 홀로그램(미완료)일 때는 배경이
      더 밝아지므로, 실물 상태에서 버티면 홀로그램 상태에서도 버틴다.
"""
import os, sys, subprocess, tempfile, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'assets', 'img', 'home')

LAYOUT = {
    'math': (960, 670, [(1, 50.0, 39.4, 49.4), (2, 19.4, 48.4, 35.8), (3, 83.3, 48.9, 34.2),
                        (4, 17.7, 77.8, 32.4), (5, 81.4, 78.1, 31.5), (6, 76.4, 17.4, 22.7)]),
    'sci':  (1280, 670, [(1, 50.0, 40.8, 32.1), (2, 26.6, 56.5, 23.5), (3, 75.0, 54.3, 23.4),
                         (4, 26.1, 78.1, 25.1), (5, 73.5, 80.3, 23.1), (6, 69.6, 17.4, 14.9)]),
}
BGW, BGH = 2520, 1260          # 배경 원본 크기
CW = 1440                      # 검사 이미지 폭
HERO_W, HERO_CY = 0.3125, 0.627  # 캐릭터 칸: 폭 31.25% · 중심 y 62.7% (nav/home.html과 같음)


def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def raw(path, w, h):
    """PNG를 rgba 바이트로 읽는다 (외부 이미지 라이브러리 없이 숫자를 재기 위해)."""
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo',
                        '-pix_fmt', 'rgba', '-s', '%dx%d' % (w, h), '-'],
                       check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return p.stdout


def lum(r, g, b):
    """WCAG 상대 휘도."""
    def f(c):
        c /= 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def cutout(src, out, key_color, keep):
    if keep:
        run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', 'format=rgba', '-frames:v', '1', out])
    else:
        # similarity를 넉넉히 주면 캐릭터 외곽의 마젠타 잔띠까지 지워진다.
        run(['ffmpeg', '-y', '-v', 'error', '-i', src,
             '-vf', 'colorkey=%s:0.32:0.08,format=rgba' % key_color, '-frames:v', '1', out])


def build(sem, subject, char, out):
    key = ('sci-' if subject == 'sci' else 'math-') + sem
    rw, rh, objs = LAYOUT[subject]
    ch = round(CW * rh / rw)
    d = os.path.join(SRC, key)
    if not os.path.isdir(d):
        sys.exit('없는 학기: %s' % key)
    tmp = tempfile.mkdtemp()

    def png(n):
        p = os.path.join(tmp, n + '.png')
        run(['dwebp', '-quiet', os.path.join(d, n + '.webp'), '-o', p])
        return p

    s = max(CW / BGW, ch / BGH)
    sw, sh = round(BGW * s), round(BGH * s)
    ox, oy = (sw - CW) // 2, max(0, round((sh - ch) * 0.46))

    ins = ['-i', png('bg')]
    fc = ['[0:v]scale=%d:%d,crop=%d:%d:%d:%d[base]' % (sw, sh, CW, ch, ox, oy)]
    cur, idx = 'base', 1
    for n, cx, cy, w in objs:
        box = round(w / 100 * CW)
        ins += ['-i', png('obj-%d' % n)]
        fc.append('[%d:v]scale=%d:%d,format=rgba[o%d]' % (idx, box, box, idx))
        fc.append('[%s][o%d]overlay=%d:%d[s%d]'
                  % (cur, idx, round(cx / 100 * CW - box / 2), round(cy / 100 * ch - box / 2), idx))
        cur = 's%d' % idx
        idx += 1

    # 캐릭터 없는 판(대비 측정용)과 캐릭터 올린 판을 함께 뽑는다
    bare = os.path.join(tmp, 'bare.png')
    run(['ffmpeg', '-y', '-v', 'error'] + ins + ['-filter_complex', ';'.join(fc),
         '-map', '[%s]' % cur, '-frames:v', '1', bare])

    box = round(HERO_W * CW)
    hx, hy = round(0.5 * CW - box / 2), round(HERO_CY * ch - box / 2)
    run(['ffmpeg', '-y', '-v', 'error', '-i', bare, '-i', char,
         '-filter_complex', '[1:v]scale=%d:%d,format=rgba[c];[0:v][c]overlay=%d:%d' % (box, box, hx, hy),
         '-frames:v', '1', out])
    return bare, (CW, ch), (hx, hy, box)


def measure(bare, size, spot, char):
    """몸 대비와 자체 대비를 잰다."""
    w, h = size
    hx, hy, box = spot
    bg = raw(bare, w, h)
    cd = raw(char, box, box)

    # 캐릭터 실루엣 픽셀의 휘도
    ls = []
    bgls = []
    for y in range(0, box, 3):
        for x in range(0, box, 3):
            i = (y * box + x) * 4
            if cd[i + 3] < 140:
                continue
            ls.append(lum(cd[i], cd[i + 1], cd[i + 2]))
            bx, by = hx + x, hy + y
            if 0 <= bx < w and 0 <= by < h:
                j = (by * w + bx) * 4
                bgls.append(lum(bg[j], bg[j + 1], bg[j + 2]))
    if not ls:
        sys.exit('캐릭터 픽셀을 못 찾았습니다 — 누끼가 전부 지워졌는지 확인하세요.')
    ls.sort()
    body = sum(ls) / len(ls)
    back = sum(bgls) / len(bgls) if bgls else 0
    dark = ls[int(len(ls) * 0.05)]
    light = ls[int(len(ls) * 0.95)]
    return ratio(body, back), ratio(light, dark), len(ls)


def verdict(body, self_):
    if body >= 2.0 and self_ >= 5.0: return '여유'
    if body >= 1.5 and self_ >= 3.0: return '통과'
    if body >= 1.5 or self_ >= 5.0:  return '경계'
    return '묻힘'


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src = os.path.expanduser(sys.argv[1])
    sem = sys.argv[2]
    out_dir = os.path.expanduser(sys.argv[3]) if len(sys.argv) > 3 else os.path.dirname(src) or '.'
    keep = '--keep' in sys.argv
    key_color = '0xFF00FF'
    for a in sys.argv:
        if a.startswith('--key='):
            key_color = a.split('=', 1)[1]
    os.makedirs(out_dir, exist_ok=True)

    cut = os.path.join(out_dir, '%s-누끼.png' % sem)
    cutout(src, cut, key_color, keep)
    print('누끼 → %s' % cut)

    tmp = tempfile.mkdtemp()
    panes, results = [], []
    for subj, label in (('math', '수학 · 행성 표면'), ('sci', '과학 · 우주선 안')):
        p = os.path.join(tmp, subj + '.png')
        bare, size, spot = build(sem, subj, cut, p)
        body, self_, n = measure(bare, size, spot, cut)
        results.append((label, body, self_))
        panes.append(p)

    check = os.path.join(out_dir, '%s-검사.png' % sem)
    run(['ffmpeg', '-y', '-v', 'error', '-i', panes[0], '-i', panes[1],
         '-filter_complex', '[0:v][1:v]vstack=inputs=2', '-frames:v', '1', check])
    print('검사 → %s' % check)

    print('\n  화면              몸 대비   자체 대비   판정')
    print('  ' + '-' * 46)
    worst = '여유'
    order = {'여유': 0, '통과': 1, '경계': 2, '묻힘': 3}
    for label, body, self_ in results:
        v = verdict(body, self_)
        if order[v] > order[worst]:
            worst = v
        print('  %-16s  %5.2f     %5.2f      %s' % (label, body, self_, v))
    print('  ' + '-' * 46)
    print('  최종 = 더 나쁜 쪽:  %s' % worst)
    print('\n  기준 — 몸 대비 1.5 미만이면 배경에 녹는다(2.0 이상 안전).')
    print('         자체 대비 3.0 미만이면 어떤 배경에서도 밋밋하다(5.0 이상 좋다).')
    print('         「경계」·「묻힘」이면 눈으로 검사 이미지를 보고 고칠 곳을 정한다.')


if __name__ == '__main__':
    main()
