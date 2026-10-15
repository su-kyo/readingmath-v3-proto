/* ============================================================
   pop-place.js — 빈칸에서 여는 창의 자리 한 벌 (2026-10-15 · 요청 10 「창 위치」)
   ------------------------------------------------------------
   빈칸 선지 창(blank-pop.js) · 떠 있는 키패드(개념 다지기 · 기초 연산 · 유형 풀이) ·
   서술형 키패드 창(.qpop)이 모두 이 계산으로 연다. 화면 JS에 자리 계산을 새로 만들지 않는다.

   규칙:
   · 창은 머리줄(.lheader) 아래 ~ 콘솔바(.bar) 위 영역 안, 그 가장자리에서 8px 안쪽에서만 연다.
     스크롤 영역 위에 붙은 문제 카드(sticky)가 있으면 그 아래부터가 영역이다. 카드 아래가 창보다 작을 때만
     창이 카드 위로 올라간다(빈칸은 카드 아래에 보이고, 머리줄은 넘지 않는다).
   · 빈칸 아래 12px가 기본. 아래가 모자라면 위로 뒤집는다(up = true → 꼬리도 아래로).
   · 위아래 다 모자라면 빈칸을 품은 스크롤 영역을 움직여 빈칸이 보이게 한 뒤 연다(reveal).
   · 스크롤로도 안 되면(문제 영역이 스크롤되지 않는 화면의 큰 키패드) side: true 인 창만 빈칸 옆(오른쪽, 모자라면 왼쪽)에 연다.
   · 분수 칸(sideFirst: true)은 처음부터 옆에 연다 — 위아래로 열면 짝 칸(분자 · 분모)을 덮는다(2026-10-15 사용자 결정).
   · 빈칸이 영역 밖으로 나가면(가운데가 머리줄 위 · 콘솔바 아래) null 을 돌려준다 — 부른 쪽이 닫는다.

   쓰는 법:
     var at = RMPopPlace.place(창, 빈칸, { reveal: true, side: true });   // 열 때만 reveal · side 는 꼬리 없는 창만
     if (!at) 닫기();  else { 창.classList.toggle('is-up', at.up);  꼬리 x = at.caretX }
   ============================================================ */
(function () {
  'use strict';

  var EDGE = 8, GAP = 12, SLACK = 1;   // SLACK = 스크롤 반올림(소수 픽셀) 여유

  /* 영역 = 머리줄 아래 ~ 콘솔바 위. 빈칸을 품은 스크롤 영역 위쪽에 붙은 칸(position: sticky — 서술형 문제 카드)이
     있으면 그 아래부터다 — 그 뒤로 숨은 빈칸은 「영역 밖」이다 */
  function area(anchor) {
    var hd = document.querySelector('.lheader'), bar = document.querySelector('.bar');
    var top = hd ? hd.getBoundingClientRect().bottom : 0;
    var sc = anchor && scroller(anchor);
    if (sc) {
      var st = sc.getBoundingClientRect().top;
      [].forEach.call(sc.children, function (c) {
        if (c.contains(anchor) || getComputedStyle(c).position !== 'sticky') return;
        var cr = c.getBoundingClientRect();
        if (cr.height && cr.top <= st + 1) top = Math.max(top, cr.bottom);
      });
    }
    return { top: top, head: hd ? hd.getBoundingClientRect().bottom : 0, bottom: bar ? bar.getBoundingClientRect().top : window.innerHeight };
  }

  function scroller(node) {
    for (var p = node.parentElement; p && p !== document.body; p = p.parentElement) {
      var oy = getComputedStyle(p).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight + 1) return p;
    }
    return null;
  }

  /* 빈칸을 d 만큼 올렸을 때(d<0 이면 내렸을 때) 창이 들어가는 d 구간 중 0에 가장 가까운 값.
     [min, max] = 스크롤로 실제 움직일 수 있는 범위 — 끝에 닿아 못 움직이면 다른 쪽을 본다 */
  function nearest(lo, hi, min, max) {
    lo = Math.max(lo, min); hi = Math.min(hi, max);
    return lo > hi ? null : (lo > 0 ? lo : (hi < 0 ? hi : 0));
  }

  function reveal(anchor, h, gap) {
    var sc = scroller(anchor);
    if (!sc) return;
    var a = area(anchor), r = anchor.getBoundingClientRect(), lo = a.top + EDGE, hi = a.bottom - EDGE;
    var min = -sc.scrollTop, max = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
    var d = nearest(r.bottom + gap + h - hi, r.top - lo, min, max);                // 아래로 열 수 있게
    if (d === null) d = nearest(r.bottom - hi, r.top - gap - h - lo, min, max);   // 위로 열 수 있게
    if (d === null) d = Math.max(min, Math.min(max, r.top - lo));                  // 어느 쪽도 안 된다 — 빈칸을 맨 위로
    sc.scrollTop += d;
  }

  function place(pop, anchor, o) {
    o = o || {};
    var gap = o.gap != null ? o.gap : GAP;
    var w = pop.offsetWidth, h = pop.offsetHeight;
    var a = area(anchor), r = anchor.getBoundingClientRect(), lo = a.top + EDGE, hi = a.bottom - EDGE;
    if (o.sideFirst) {                                                  // 분수 칸 — 위아래로 열면 짝 칸(분자 · 분모)을 덮는다
      var sx = r.right + gap + w <= window.innerWidth - EDGE ? r.right + gap : (r.left - gap - w >= EDGE ? r.left - gap - w : null);
      var smid = r.top + r.height / 2;
      if (sx !== null && smid >= a.top && smid <= a.bottom) {
        pop.style.left = Math.round(sx) + 'px';
        pop.style.top = Math.round(Math.max(lo, Math.min(smid - h / 2, hi - h))) + 'px';
        return { up: false, side: true, caretX: 0, width: w, height: h };
      }
    }
    var fitsDown = r.top >= lo - SLACK && r.bottom + gap + h <= hi + SLACK;
    var fitsUp = r.bottom <= hi + SLACK && r.top - gap - h >= lo - SLACK;
    if (o.reveal && !fitsDown && !fitsUp) {
      reveal(anchor, h, gap);
      a = area(anchor); r = anchor.getBoundingClientRect(); lo = a.top + EDGE; hi = a.bottom - EDGE;
      fitsDown = r.top >= lo - SLACK && r.bottom + gap + h <= hi + SLACK;
      fitsUp = r.bottom <= hi + SLACK && r.top - gap - h >= lo - SLACK;
    }
    var mid = r.top + r.height / 2;
    if (mid < a.top || mid > a.bottom) return null;                     // 빈칸이 영역 밖
    if (!fitsDown && !fitsUp && a.head + EDGE < lo && r.top - gap - h >= a.head + EDGE) {
      lo = a.head + EDGE; fitsUp = true;                                // 문제 카드 아래가 창보다 작다 — 창만 카드 위로(머리줄은 넘지 않는다)
    }
    var vw = window.innerWidth, cx = r.left + r.width / 2, top, left;
    if (!fitsDown && !fitsUp && o.side) {                               // 스크롤로도 안 된다 — 꼬리 없는 창(키패드)만 옆에 연다
      left = r.right + gap + w <= vw - EDGE ? r.right + gap : r.left - gap - w;
      top = Math.max(lo, Math.min(mid - h / 2, hi - h));
      pop.style.left = Math.round(Math.max(EDGE, left)) + 'px';
      pop.style.top = Math.round(top) + 'px';
      return { up: false, side: true, caretX: 0, width: w, height: h };
    }
    var up = !fitsDown && (fitsUp || r.top - lo > hi - r.bottom);       // 둘 다 안 되면 넓은 쪽
    top = up ? r.top - gap - h : r.bottom + gap;
    top = Math.max(lo, Math.min(top, hi - h));
    left = Math.max(EDGE, Math.min(cx - w / 2, vw - w - EDGE));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
    return { up: up, caretX: cx - left, width: w, height: h };
  }

  window.RMPopPlace = { place: place, area: area, EDGE: EDGE, GAP: GAP };
})();
