/* ============================================================
   learn-timer.js — 학습 머리줄 타이머 한 벌 (2026-10-15 · 유형 · 서술형)
   ------------------------------------------------------------
   마크업(화면 HTML):
     <div class="lheader__timer" id="hdrTimer"><img …>
       <span class="lheader__time" id="timer">00:00</span><span class="lheader__limit">/ 60:00</span></div>
   · 진행 시간은 1초마다 올라간다. 제한 시간을 넘어도 계속 올라간다(넘으면 .is-over).
   · 제한 시간은 .lheader__limit 의 글자가 정본이다 — 화면마다 다르면 HTML 만 고친다.
   · .is-paused(해설 · 결과 화면)면 세지 않고, 적힌 값으로 넘었는지만 본다.
   · 분은 60을 넘어도 분으로 센다(62:10). 제한 시간과 같은 단위로 읽히게. 모양은 styles/learn-shell.css.
   검수: ?debug=1 이면 패널에 「제한 5초 전」 · 「시간 초과」가 붙는다.
   ============================================================ */
(function () {
  'use strict';
  var box = document.getElementById('hdrTimer');
  var el = document.getElementById('timer');
  if (!box || !el) return;
  var lim = box.querySelector('.lheader__limit');

  function parse(t) {
    return String(t).replace(/[^\d:]/g, '').split(':').reduce(function (a, b) { return a * 60 + (+b || 0); }, 0);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(s) { return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }   // 분은 60을 넘어도 분 — 「62:10 / 60:00」

  var LIMIT = lim ? parse(lim.textContent) : 0;
  var sec = parse(el.textContent);
  function show() {
    el.textContent = fmt(sec);
    box.classList.toggle('is-over', LIMIT > 0 && sec > LIMIT);
  }
  show();
  if (!box.classList.contains('is-paused')) setInterval(function () { sec++; show(); }, 1000);

  window.RMTimer = { set: function (s) { sec = s; show(); }, get: function () { return sec; } };

  if (window.RMDebug && LIMIT) window.RMDebug.register({
    title: '타이머',
    actions: [
      { label: '제한 5초 전', run: function () { window.RMTimer.set(LIMIT - 5); } },
      { label: '시간 초과', tone: 'no', run: function () { window.RMTimer.set(LIMIT + 130); } }
    ]
  });
})();
