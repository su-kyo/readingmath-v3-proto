#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
screen-diff.py — 두 촬영본을 화소 단위로 대조한다 (screen-shot.sh 와 세트)

    tools/screen-diff.py <전 폴더> <후 폴더> [--crop 화면이름]

    예)  tools/screen-diff.py /tmp/rm-before /tmp/rm-after
         tools/screen-diff.py /tmp/rm-before /tmp/rm-after --crop essay-advanced

왜 쓰나
  공용 CSS 를 건드리면 어느 화면이 얼마나 바뀌었는지 눈으로는 못 센다.
  Phase 10-③ 에서 이 대조가 실수를 두 번 잡았다 —
   · 여러 줄 규칙을 한 줄만 지워 과제 화면이 백지가 된 것
   · 잘린 출력을 보고 옮겨 적어 라벨 글자가 12→13px 로 커진 것
  둘 다 코드만 봐서는 안 보였고, 숫자로 튀어서 잡혔다.

읽는 법
  0.00%          같다. 부품을 옮겼는데 이 숫자가 나오면 성공이다.
  ~0.2% 이하     여백·아이콘이 1~2px 움직인 정도. 눈금 정리에서는 정상.
  1% 이상        반드시 --crop 으로 잘라서 눈으로 확인할 것.
  nav-* 0.1~2%   행성 배경의 별이 반짝여서 늘 남는 잡음이다. 회귀가 아니다.

필요한 것: Pillow.  없으면 ~/.claude/venv-quartz/bin/python 으로 실행한다.
"""
import sys, os, glob

try:
    from PIL import Image, ImageChops, ImageDraw
except ImportError:
    sys.exit("Pillow 가 필요합니다.  ~/.claude/venv-quartz/bin/python tools/screen-diff.py ... 로 실행하세요.")

THRESHOLD = 18   # 이보다 작은 색 차이는 렌더링 잡음으로 본다


def ratio(a_path, b_path):
    a = Image.open(a_path).convert("RGB")
    b = Image.open(b_path).convert("RGB")
    if a.size != b.size:
        return None, a, b
    d = ImageChops.difference(a, b).convert("L").point(lambda v: 255 if v > THRESHOLD else 0)
    return 100.0 * sum(d.histogram()[255:]) / (a.size[0] * a.size[1]), a, b


def crop_compare(a, b, out):
    """바뀐 영역만 잘라 위아래로 붙인다 — 눈으로 확인할 때."""
    d = ImageChops.difference(a, b).convert("L").point(lambda v: 255 if v > THRESHOLD else 0)
    bb = d.getbbox()
    if bb is None:
        print("  차이 없음 — 자를 영역이 없습니다"); return
    x0, y0, x1, y1 = bb; pad = 24
    box = (max(0, x0 - pad), max(0, y0 - pad), min(a.size[0], x1 + pad), min(a.size[1], y1 + pad))
    ca, cb = a.crop(box), b.crop(box)
    w, h = ca.size
    c = Image.new("RGB", (w, h * 2 + 26), (24, 26, 43))
    c.paste(ca, (0, 0)); c.paste(cb, (0, h + 26))
    ImageDraw.Draw(c).text((8, h + 7), "위 = 전   아래 = 후", fill=(255, 255, 255))
    while c.size[1] > 1600:
        c = c.resize((c.size[0] * 2 // 3, c.size[1] * 2 // 3))
    c.save(out)
    print("  바뀐 영역 %s → %s" % (bb, out))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        sys.exit(__doc__)
    A, B = args[0], args[1]
    only = None
    if "--crop" in sys.argv:
        i = sys.argv.index("--crop")
        only = sys.argv[i + 1] if i + 1 < len(sys.argv) else None

    rows = []
    for f in sorted(glob.glob(os.path.join(A, "*.png"))):
        name = os.path.basename(f)
        g = os.path.join(B, name)
        if not os.path.exists(g):
            rows.append((name[:-4], None, "후 폴더에 없음")); continue
        r, a, b = ratio(f, g)
        if r is None:
            rows.append((name[:-4], None, "크기 다름")); continue
        rows.append((name[:-4], r, None))
        if only and name[:-4] == only:
            crop_compare(a, b, os.path.join(B, "_crop-%s.png" % only))

    changed = [r for r in rows if r[1] is None or r[1] > 0]
    print("%s → %s : %d/%d 화면이 바뀜" % (A, B, len(changed), len(rows)))
    for name, r, note in sorted(changed, key=lambda x: -(x[1] or 999)):
        print("  %-28s %s" % (name, note if r is None else "%.2f%%" % r))
    if not changed:
        print("  (전부 화소 단위로 동일)")


if __name__ == "__main__":
    main()
