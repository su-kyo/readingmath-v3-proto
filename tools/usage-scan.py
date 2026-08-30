#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
usage-scan.py — 부품(클래스)이 어느 화면에 쓰이는지 세어 스토리북에 넘긴다

    tools/usage-scan.py            # styleguide/usage.json 을 새로 쓴다
    tools/usage-scan.py --print    # 파일을 안 쓰고 화면에만 찍는다

왜 쓰나
  스토리북에 부품을 늘어놓기만 하면 「이걸 고치면 어디가 영향받나」를 알 수 없다.
  이 숫자가 없으면 유지보수가 안 된다 (Phase 10 지시서 §4-4 「지킬 것 3」).
  손으로 적으면 반드시 어긋나므로 기계가 센다.

무엇을 세나
  배포 대상 HTML(tools · figma-palette · video · styleguide 제외)의 **마크업**에서
  class 속성에 그 이름이 실제로 붙어 있는 화면을 센다.
  JS 가 만들어 붙이는 마크업도 놓치지 않도록 scripts/*.js 의 문자열까지 훑고,
  그렇게 찾은 것은 화면 이름 뒤에 (JS) 를 붙여 구분한다.

  정의(CSS)가 아니라 사용(마크업)을 센다 — 정의가 어디 있는지는
  rule-compare.py 가 본다. 둘은 다른 질문이다.
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = ('tools', 'figma-palette', 'video', 'styleguide', '.git', 'docs')
OUT = os.path.join(ROOT, 'styleguide', 'usage.json')

CLASS_ATTR = re.compile(r'class\s*=\s*"([^"]*)"')
CLASS_IN_JS = re.compile(r'''class\s*=\s*\\?["']([^"'\\]*)|classList\.(?:add|toggle|remove)\(\s*['"]([^'"]+)''')


def screens():
    out = []
    for p in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
        rel = os.path.relpath(p, ROOT)
        if rel.split(os.sep)[0] in SKIP_DIRS:
            continue
        out.append(rel)
    return sorted(out)


def classes_in_html(path):
    src = open(path, encoding='utf-8').read()
    # <style> 안은 정의라서 뺀다. 우리는 마크업에 붙은 것만 센다.
    src = re.sub(r'<style[^>]*>.*?</style>', '', src, flags=re.S)
    found = set()
    for m in CLASS_ATTR.finditer(src):
        found.update(m.group(1).split())
    return found


def classes_in_js():
    """스크립트 파일 → 그 파일을 부르는 화면들 → 그 화면에 (JS) 로 붙는 클래스"""
    table = {}
    for p in glob.glob(os.path.join(ROOT, 'scripts', '**', '*.js'), recursive=True):
        src = open(p, encoding='utf-8', errors='ignore').read()
        found = set()
        for m in CLASS_IN_JS.finditer(src):
            for g in m.groups():
                if g:
                    found.update(g.split())
        table[os.path.relpath(p, ROOT).replace(os.sep, '/')] = found
    return table


def main():
    js_table = classes_in_js()
    usage = {}          # class -> {screen: 'markup' | 'js'}
    for rel in screens():
        path = os.path.join(ROOT, rel)
        key = rel.replace(os.sep, '/')
        src = open(path, encoding='utf-8').read()
        for cls in classes_in_html(path):
            usage.setdefault(cls, {})[key] = 'markup'
        # 이 화면이 부르는 스크립트가 붙이는 클래스
        for js, found in js_table.items():
            if js in src:
                for cls in found:
                    usage.setdefault(cls, {}).setdefault(key, 'js')

    data = {
        '_읽는 법': 'class 이름 → {화면 경로: markup|js}. markup 은 HTML 에 직접, js 는 스크립트가 붙인다.',
        '_만든 도구': 'tools/usage-scan.py',
        '_화면 수': len(screens()),
        'usage': {k: dict(sorted(v.items())) for k, v in sorted(usage.items())},
    }
    if '--print' in sys.argv:
        top = sorted(usage.items(), key=lambda kv: -len(kv[1]))[:30]
        for k, v in top:
            print(f'{len(v):3d}  {k}')
        return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f'{len(usage)}개 클래스 / {len(screens())}화면 → {os.path.relpath(OUT, ROOT)}')


if __name__ == '__main__':
    main()
