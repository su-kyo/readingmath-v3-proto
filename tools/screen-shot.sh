#!/bin/bash
# =============================================================================
# screen-shot.sh — 배포 대상 전 화면을 헤드리스 크롬으로 한 번에 촬영한다
# -----------------------------------------------------------------------------
# 쓰는 곳: 공용 CSS·부품을 건드리기 전/후를 화소 단위로 대조할 때 (Phase 10-③에서
#          제 실수를 두 번 잡아낸 방식이다. screen-diff.py 와 세트로 쓴다)
#
#   tools/screen-shot.sh <출력폴더> [포트]
#
#   예)  tools/screen-shot.sh /tmp/rm-before
#        ...코드 수정...
#        tools/screen-shot.sh /tmp/rm-after
#        tools/screen-diff.py /tmp/rm-before /tmp/rm-after
#
# 주의
#  · 미리보기 서버(rm-static, 8020)가 떠 있어야 한다. Bash 로 서버를 띄우지 않는다.
#  · 헤드리스 크롬은 **캐시가 없다.** 그래서 ?v= 를 안 올려도 최신 CSS 로 찍힌다 —
#    반대로 브라우저에서는 옛 CSS 가 보일 수 있으니 헷갈리지 말 것.
#  · 대기 12초는 게이지·행성 애니메이션이 끝나기를 기다리는 값이다. 줄이면 같은
#    코드로 찍어도 결과가 달라져 대조가 무의미해진다.
#  · 행성 계열(nav/*)은 별이 계속 반짝여서 0.1~2% 잡음이 늘 남는다. 그건 회귀가 아니다.
# =============================================================================
set -u
OUT="${1:?출력 폴더를 지정하세요 — 예: tools/screen-shot.sh /tmp/rm-before}"
PORT="${2:-8020}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

[ -x "$CHROME" ] || { echo "크롬을 못 찾았습니다: $CHROME"; exit 1; }
curl -sf -o /dev/null "http://localhost:$PORT/index.html" || {
  echo "미리보기 서버가 안 떠 있습니다 (포트 $PORT). .claude/launch.json 의 rm-static 을 켜세요."; exit 1; }

mkdir -p "$OUT"

# 배포 대상 화면만 (tools · figma-palette · video 제외). 화면이 늘면 자동으로 따라온다.
# styleguide/ 는 배포에 포함되지만 여기서는 뺀다 — 이 촬영은 「서비스 화면이 안 바뀌었나」를
# 보는 대조이고, 문서가 섞이면 앞 회차와 장 수가 달라져 비교가 흐려진다.
PAGES=$(cd "$ROOT" && find . -name "*.html" \
          -not -path "./tools/*" -not -path "./figma-palette/*" -not -path "./video/*" \
          -not -path "./styleguide/*" \
          | sed 's|^\./||; s|\.html$||' | sort)

n=0
for p in $PAGES; do
  name=$(echo "$p" | tr '/' '-')
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1280,800 --virtual-time-budget=12000 \
    --screenshot="$OUT/$name.png" "http://localhost:$PORT/$p.html" >/dev/null 2>&1
  n=$((n+1))
done
echo "$n 화면 → $OUT"
