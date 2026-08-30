#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rule-compare.py — 클래스 하나가 어느 화면에 어떻게 정의돼 있는지 나란히 뽑는다

    tools/rule-compare.py <클래스이름> [클래스이름 ...]      전문 보기
    tools/rule-compare.py --count                            부품별 복붙/고유 집계

    예)  tools/rule-compare.py toolbtn
         tools/rule-compare.py bar bar__mid bar__tray
         tools/rule-compare.py --count

왜 쓰나
  부품을 공용으로 끌어올리기 전에 **정말 같은 것인지** 먼저 봐야 한다.
  Phase 10-③ 에서 확인된 것: 같은 이름이 붙어 있다고 같은 물건이 아니다.
   · 셸 계열(콘솔바·버튼·배경·게이지) → 진짜 복붙. 합치면 된다.
   · 본문 계열(.opt·.card·.qtab)     → 화면마다 다른 디자인. 합치면 화면이 바뀐다.
   · .seg                            → 다섯 화면이 서로 다른 것에 같은 이름을 쓴다.
  --count 가 그 셋을 숫자로 갈라 준다(완전 동일 vs 화면 고유).

⚠ 출력이 길면 잘린다. **잘린 규칙을 짐작해서 옮겨 적지 말 것** —
  Phase 10-③ 에서 그렇게 하다 다섯 화면의 라벨 크기를 바꿔 놓았다.
  옮길 때는 원문 파일을 열어 끝까지 읽고 그대로 복사한다.
"""
import sys, os, re, glob, collections

SKIP_DIRS = {"tools", "figma-palette", "video", ".git", "assets", "generated", "docs", "node_modules"}


def sources(include_styles=True):
    out = []
    if include_styles:
        for p in sorted(glob.glob("styles/*.css")):
            out.append((p, open(p, encoding="utf-8").read()))
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and d != "styles"]
        for f in sorted(files):
            if not f.endswith(".html"):
                continue
            p = os.path.join(root, f).lstrip("./")
            s = open(p, encoding="utf-8").read()
            css = "".join(m.group(1) for m in re.finditer(r"<style[^>]*>(.*?)</style>", s, re.S))
            if css:
                out.append((p, css))
    return out


def rules_of(css, base):
    """`.base` 로 시작하는 규칙을 중괄호 짝을 세어 통째로 잘라 낸다.
       (한 줄만 지우면 CSS 가 깨진다 — Phase 10-③ 에서 겪었다)"""
    sel = re.compile(r"^[ \t]*(?:/\*[^\n]*\*/[ \t]*\n[ \t]*)?\.%s(?:[a-zA-Z0-9_-]*)\b[^{\n]*\{"
                     % re.escape(base), re.M)
    out, i = [], 0
    while True:
        m = sel.search(css, i)
        if not m:
            break
        j = css.index("{", m.end() - 1)
        depth, k = 0, j
        while k < len(css):
            if css[k] == "{":
                depth += 1
            elif css[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        out.append(css[m.start():k + 1])
        i = k + 1
    return out


def show(bases):
    for p, css in sources():
        hits = []
        for b in bases:
            hits += rules_of(css, b)
        if not hits:
            continue
        print("\n===== %s  (%d규칙)" % (p, len(hits)))
        for r in hits:
            print("   " + " ".join(r.split()))


def count():
    fams = ["bar", "toolbtn", "content", "screen", "toast", "dial", "opt", "card",
            "problem", "blank", "worksheet", "qtab", "chip", "sec-label", "seg",
            "stage-scroll", "qtext", "lheader", "breadcrumb", "nav-ico", "win"]
    srcs = sources(include_styles=False)      # 화면 인라인만 센다
    print("%-16s %6s %8s %10s %10s  %s" % ("부품", "화면", "총규칙", "완전동일", "화면고유", "성격"))
    for base in fams:
        per = {}
        for p, css in srcs:
            r = [" ".join(x.split()) for x in rules_of(css, base)]
            if r:
                per[p] = r
        if len(per) < 2:
            continue
        cnt = collections.Counter()
        for rs in per.values():
            for r in set(rs):
                cnt[r] += 1
        total = sum(len(v) for v in per.values())
        dup = sum(c for r, c in cnt.items() if c >= 2)
        uniq = sum(1 for r, c in cnt.items() if c == 1)
        kind = "순수 복붙 — 합칠 것" if uniq == 0 else \
               ("대부분 다른 물건 — 이름을 갈 것" if uniq > dup else "섞여 있음 — 하나씩 볼 것")
        print("%-16s %6d %8d %10d %10d  %s" % ("." + base, len(per), total, dup, uniq, kind))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    if sys.argv[1] == "--count":
        count()
    else:
        show(sys.argv[1:])
