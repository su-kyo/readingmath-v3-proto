#!/usr/bin/env python3
"""
행성 자료 뽑기 — 캐릭터 생성에 첨부할 참고 이미지 (배포 제외)
==============================================================
그림 생성 모델에게 「이 행성에 어울리는 캐릭터를 그려 달라」고 할 때 함께 줄
자료를 만든다. 배경 파일만 던지면 그 행성이 어떤 화면인지 전달되지 않는다 —
실제 좌표대로 오브젝트를 얹은 화면 조합이 있어야 한다.

쓰는 법
    python3 tools/planet-ref.py <학기키> [출력폴더]
    python3 tools/planet-ref.py mid-1-2 ~/Desktop/행성자료
    학기키: elem-3-1 … high-1-2 (16종)

만들어 주는 것
    1_수학_행성표면.png    그 행성 표면 (수학 홈의 실제 조합)
    2_과학_우주선안.png    같은 행성을 우주선 안에서 (과학 홈)
    3_오브젝트6종.png      보상 오브젝트 6개 — 맞춰야 할 그림체
    4_지금캐릭터.png       (있는 학기만) 현재 캐릭터가 선 모습

캐릭터는 학기당 한 명이고 수학·과학이 같은 그림을 쓴다. 그래서 1과 2를 함께 준다.
"""
import os, sys, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'assets', 'img', 'home')
LAYOUT = {
    'math': (960, 670, [(1, 50.0, 39.4, 49.4), (2, 19.4, 48.4, 35.8), (3, 83.3, 48.9, 34.2),
                        (4, 17.7, 77.8, 32.4), (5, 81.4, 78.1, 31.5), (6, 76.4, 17.4, 22.7)]),
    'sci':  (1280, 670, [(1, 50.0, 40.8, 32.1), (2, 26.6, 56.5, 23.5), (3, 75.0, 54.3, 23.4),
                         (4, 26.1, 78.1, 25.1), (5, 73.5, 80.3, 23.1), (6, 69.6, 17.4, 14.9)]),
}
BGW, BGH, CW = 2520, 1260, 1440
# 캐릭터 칸 폭 — 과목마다 다르다(nav/home.html의 LAYOUT.hero와 같은 값).
# 실외(수학)는 오브젝트가 크고 실내(과학)는 작아서, 같은 폭이면 과학에서 캐릭터만 커 보인다.
HERO_W = {'math': 0.3125, 'sci': 0.25}


def run(c):
    subprocess.run(c, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def screen(key, out, with_char=False):
    subj = 'sci' if key.startswith('sci-') else 'math'
    rw, rh, objs = LAYOUT[subj]
    ch = round(CW * rh / rw)
    d = os.path.join(SRC, key)
    tmp = tempfile.mkdtemp()

    def png(n):
        p = os.path.join(tmp, n + '.png')
        run(['dwebp', '-quiet', os.path.join(d, n + '.webp'), '-o', p])
        return p

    s = max(CW / BGW, ch / BGH)
    sw, sh = round(BGW * s), round(BGH * s)
    ins = ['-i', png('bg')]
    fc = ['[0:v]scale=%d:%d,crop=%d:%d:%d:%d[base]'
          % (sw, sh, CW, ch, (sw - CW) // 2, max(0, round((sh - ch) * 0.46)))]
    cur, idx = 'base', 1
    for n, cx, cy, w in objs:
        box = round(w / 100 * CW)
        ins += ['-i', png('obj-%d' % n)]
        fc.append('[%d:v]scale=%d:%d,format=rgba[o%d]' % (idx, box, box, idx))
        fc.append('[%s][o%d]overlay=%d:%d[s%d]'
                  % (cur, idx, round(cx / 100 * CW - box / 2), round(cy / 100 * ch - box / 2), idx))
        cur = 's%d' % idx
        idx += 1
    if with_char:
        cp = os.path.join(d, 'character.webp')
        if not os.path.exists(cp):
            return False
        box = round(HERO_W[subj] * CW)
        ins += ['-i', png('character')]
        fc.append('[%d:v]scale=%d:%d,format=rgba[c]' % (idx, box, box))
        fc.append('[%s][c]overlay=%d:%d[o]' % (cur, round(0.5 * CW - box / 2), round(0.627 * ch - box / 2)))
        cur = 'o'
    run(['ffmpeg', '-y', '-v', 'error'] + ins +
        ['-filter_complex', ';'.join(fc), '-map', '[%s]' % cur, '-frames:v', '1', out])
    run(['sips', '-Z', '1600', out, '--out', out])
    return True


def strip(key, out):
    d = os.path.join(SRC, key)
    tmp = tempfile.mkdtemp()
    ins, fc = [], ['color=c=0xF2F4F8:s=3000x500[bg]']
    cur = 'bg'
    for i in range(1, 7):
        p = os.path.join(tmp, 'o%d.png' % i)
        run(['dwebp', '-quiet', os.path.join(d, 'obj-%d.webp' % i), '-o', p])
        ins += ['-i', p]
        fc.append('[%d:v]scale=500:500[s%d]' % (i - 1, i))
        fc.append('[%s][s%d]overlay=%d:0[c%d]' % (cur, i, (i - 1) * 500, i))
        cur = 'c%d' % i
    run(['ffmpeg', '-y', '-v', 'error'] + ins +
        ['-filter_complex', ';'.join(fc), '-map', '[%s]' % cur, '-frames:v', '1', out])
    run(['sips', '-Z', '1600', out, '--out', out])


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    sem = sys.argv[1]
    out = os.path.expanduser(sys.argv[2]) if len(sys.argv) > 2 else '.'
    if not os.path.isdir(os.path.join(SRC, 'math-' + sem)):
        sys.exit('없는 학기: %s' % sem)
    os.makedirs(out, exist_ok=True)
    screen('math-' + sem, os.path.join(out, '1_수학_행성표면.png'));  print('  ✓ 1_수학_행성표면.png')
    screen('sci-' + sem,  os.path.join(out, '2_과학_우주선안.png'));  print('  ✓ 2_과학_우주선안.png')
    strip('math-' + sem,  os.path.join(out, '3_오브젝트6종.png'));    print('  ✓ 3_오브젝트6종.png')
    if screen('math-' + sem, os.path.join(out, '4_지금캐릭터.png'), True):
        print('  ✓ 4_지금캐릭터.png')
    else:
        p = os.path.join(out, '4_지금캐릭터.png')
        if os.path.exists(p): os.remove(p)
        print('  · 현재 캐릭터 없음 (26학기 중 하나)')


if __name__ == '__main__':
    main()
