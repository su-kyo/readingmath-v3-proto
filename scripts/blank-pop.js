/* ============================================================
   blank-pop.js — 빈칸 선지 창 한 벌 (2026-10-15 · 개념 · 서술형 통일)
   ------------------------------------------------------------
   빈칸을 누르면 뜨는 「선지 고르기」 창의 마크업 · 열림 위치 · 채점 동작의 단일 소스.
   모양은 styles/components.css 의 .bpop 이 정한다. 화면은 열기만 한다.

   쓰는 법:
     RMBlankPop.open(빈칸요소, {
       choices: ['성질', '무게', { tex: '\\dfrac{1}{2}', val: '1/2' }],   // 글자 또는 수식(KaTeX) · { html, val } 글+수식 · { img, val } 그림
       answer:  '성질',            // 있으면 채점한다. 없으면 고른 값을 바로 넘기고 닫는다
       onPick:  function (val, ok) {},   // 누른 순간 (채점할 때만) — 빈칸 흔들기 · 토스트 등
       onDone:  function (val) {},       // 정답 0.5초 뒤 닫히고 나서 / 채점 없음이면 바로
       onClose: function () {}           // 어떻게 닫히든 닫힐 때마다
     });
     RMBlankPop.close();  RMBlankPop.isOpen();  RMBlankPop.anchor();

   동작 규칙 (두 계열 공통):
   · 자리는 scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위 영역의 가장자리 8px 안. 빈칸 아래 12px,
     모자라면 위로 뒤집고(.is-up), 둘 다 모자라면 문제 영역을 스크롤한 뒤 연다. 꼬리는 빈칸 가운데(--bpop-caret-x).
   · 오답 → .is-wrong 0.5초(흔들림) → .is-dead (그 빈칸에서는 다시 열어도 비활성 그대로)
   · 정답 → .is-correct 0.5초 → 닫고 onDone. 그 0.5초 동안은 다른 선지를 못 누른다
   · 바깥을 누르거나 Esc → 닫힘. 빈칸 자신을 누르는 것은 화면이 정한다(토글 등)
   · 빈칸이 움직이면(스크롤 · 창 크기 · 위 칸이 접힘) 따라간다. 빈칸이 영역 밖으로 나가면 닫는다
   ============================================================ */
(function () {
  'use strict';

  var GAP = 12, CARET_MIN = 22, HOLD = 500;
  var el, opts, cur = null, cfg = {}, busy = false, timers = [], pending = null, raf = 0, last = '';

  function build() {
    el = document.createElement('div');
    el.className = 'bpop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', '빈칸 선지');
    el.innerHTML = '<span class="bpop__caret"></span><div class="bpop__opts" role="listbox"></div>';
    opts = el.querySelector('.bpop__opts');
    document.body.appendChild(el);
    opts.addEventListener('click', onPick);
  }

  function later(fn) { timers.push(setTimeout(fn, HOLD)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; busy = false; }

  function render() {
    var dead = cur._bpopDead || (cur._bpopDead = {});
    opts.innerHTML = '';
    cfg.choices.forEach(function (c) {
      var val = typeof c === 'object' ? (c.val != null ? c.val : c.tex) : String(c);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bpop__opt' + (dead[val] ? ' is-dead' : '');
      b.setAttribute('role', 'option');
      b.dataset.val = val;
      b.innerHTML = '<span class="bpop__mark"></span><span class="bpop__txt"></span>';
      var txt = b.lastChild;
      if (typeof c === 'object' && c.tex && window.katex) window.katex.render(c.tex, txt, { throwOnError: false });
      else if (typeof c === 'object' && c.html) txt.innerHTML = c.html;   // 글 + 수식이 섞인 선지(서술형) — 부른 쪽이 만든 마크업
      else if (typeof c === 'object' && c.img) {   // 그림 선지(서술형)
        var im = document.createElement('img'); im.alt = c.label || '선지 그림';
        // 그림이 늦게 들어오면 창이 길어진다 — 들어온 뒤 자리를 다시 잡는다(모자라면 스크롤까지)
        im.addEventListener('load', function () { if (cur) place(true); });
        im.src = c.img; txt.appendChild(im);
      }
      else txt.textContent = typeof c === 'object' ? (c.label || val) : val;
      opts.appendChild(b);
    });
  }

  /* 자리 = scripts/pop-place.js (머리줄 아래 ~ 콘솔바 위, 가장자리 8px 안 · 아래 12px 기본 · 모자라면 위 · 둘 다 모자라면 스크롤) */
  function place(reveal) {
    if (!cur) return;
    var at = window.RMPopPlace.place(el, cur, { gap: GAP, reveal: reveal });
    if (!at) { close(); return; }                                // 빈칸이 영역 밖으로 나갔다
    el.classList.toggle('is-up', at.up);
    el.style.setProperty('--bpop-caret-x', Math.round(Math.min(Math.max(CARET_MIN, at.caretX), at.width - CARET_MIN)) + 'px');
  }

  function open(anchor, o) {
    if (!el) build();
    if (cur) close();
    cur = anchor; cfg = o || {};
    render();
    place(true);
    if (!cur) return;
    el.classList.add('is-open');
    last = ''; follow();
  }

  /* 열려 있는 동안 빈칸 자리를 매 프레임 본다 — 스크롤 · 창 크기 · 위쪽 칸이 접히며 밀리는 것까지 */
  function follow() {
    if (!cur) return;
    var r = cur.getBoundingClientRect();
    var key = Math.round(r.left) + ',' + Math.round(r.top) + ',' + window.innerWidth + ',' + window.innerHeight + ',' + el.offsetHeight;   // 창 높이가 바뀌어도 다시 잡는다
    if (key !== last) { last = key; place(); }
    raf = requestAnimationFrame(follow);
  }

  function close() {
    if (!el || !cur) return;
    clearTimers();
    cancelAnimationFrame(raf);
    el.classList.remove('is-open');
    var fn = cfg.onClose, done = pending; cur = null; pending = null;
    if (fn) fn();
    if (done) done();   // 정답 0.5초 사이에 닫혀도(바깥 누름 등) 채우기는 끝낸다
  }

  function onPick(e) {
    var b = e.target.closest('.bpop__opt');
    if (!b || busy || b.classList.contains('is-dead')) return;
    var val = b.dataset.val, c = cfg, anchor = cur;
    if (c.answer == null) { close(); if (c.onDone) c.onDone(val); return; }   // 채점 없음 — 고른 값을 그대로
    var ok = val === String(c.answer);
    if (c.onPick) c.onPick(val, ok);
    if (!ok) {
      anchor._bpopDead[val] = true;
      b.classList.remove('is-wrong'); void b.offsetWidth; b.classList.add('is-wrong');
      later(function () { b.classList.remove('is-wrong'); b.classList.add('is-dead'); });
      return;
    }
    busy = true;
    b.classList.add('is-correct');
    pending = function () { if (c.onDone) c.onDone(val); };
    later(close);
  }

  /* 바깥 누름 · Esc */
  document.addEventListener('click', function (e) {
    if (!cur || el.contains(e.target) || cur.contains(e.target)) return;
    close();
  }, true);   // 먼저 닫는다 — 그 누름이 다시 여는 동작이면(개념의 「지문 누르기」) 화면이 곧바로 다시 연다
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  window.RMBlankPop = {
    open: open,
    close: close,
    isOpen: function () { return !!cur; },
    anchor: function () { return cur; }
  };
})();
