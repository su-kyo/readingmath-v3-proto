/* 콘솔바 안내 (RM-PART-07, 2026-10-15)
   테스트 서버에 개발자가 넣은 안내(cockpit-guide)를 디자인 시스템으로 옮긴 것.
   마크업은 화면 HTML 의 콘솔바 오른쪽 그룹, CTA 바로 앞에 있다:
     <p class="guide" role="status" aria-live="polite" hidden><i class="guide__lamp"></i><span class="guide__text"></span></p>
   화면 엔진은 문장과 상태만 넘긴다 — RMGuide.set('정답이에요!', 'ok') · RMGuide.set('') 이면 숨김.
   스타일은 learn-shell.css 의 .guide 가 맡는다(RM-JS-01). */
(function () {
  var el = document.querySelector('.guide');
  var txt = el && el.querySelector('.guide__text');
  function set(text, tone) {
    if (!el) return;
    if (!text) { el.hidden = true; return; }
    txt.textContent = text;
    el.classList.toggle('is-ok', tone === 'ok');
    el.classList.toggle('is-no', tone === 'no');
    el.hidden = false;
  }
  window.RMGuide = { set: set };
})();
