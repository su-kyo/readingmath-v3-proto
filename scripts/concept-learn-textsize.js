/* ============================================================
   concept-learn-textsize.js — 개념 학습 콘솔바 「글자」 버튼 (2026-10-15 · 요청서 요청 12 · B안 확정)
   ------------------------------------------------------------
   지문 글자 크기 3단계: 기본 100% · 크게 115% · 더 크게 130%. 지문(.article)만 커진다.
   행간(2.1)과 분수 줄 여백은 em 이라 저절로 따라오고, 그림 번호 알약은 'rm:textsize' 이벤트로 다시 잰다.
   고른 단계는 다음 개념 학습에도 남는다(localStorage 'rm-text-size').

   버튼을 누르면 위에 파란 말풍선 [가− · 점 셋 · 가+]. 점을 누르면 그 단계로 바로 간다.
   (A 순환 · C 슬라이더 시안은 2026-10-15 B안으로 정하며 걷었다)

   JS 는 단계 번호(data-step · data-tsize)와 열림(.is-open)만 바꾼다. 모양은 concept-learn.css 의 .tsize
   ============================================================ */
(function () {
  'use strict';

  var LABELS = ['기본', '크게', '더 크게'], KEY = 'rm-text-size';
  var box = document.getElementById('tsize');
  var article = document.querySelector('.article');
  if (!box || !article) return;
  var btn = box.querySelector('.tsize__btn'), pop = box.querySelector('.tsize__pop');

  var step = 0;
  try { step = Math.min(2, Math.max(0, parseInt(localStorage.getItem(KEY), 10) || 0)); } catch (e) {}

  function set(n) {
    step = Math.min(2, Math.max(0, n));
    box.dataset.step = step;
    article.dataset.tsize = step;
    btn.setAttribute('aria-label', '글자 크기 · ' + LABELS[step]);
    try { localStorage.setItem(KEY, step); } catch (e) {}
    [].forEach.call(pop.querySelectorAll('[data-step]'), function (d) { d.classList.toggle('is-on', +d.dataset.step === step); });
    pop.querySelector('[data-act="-"]').disabled = step === 0;
    pop.querySelector('[data-act="+"]').disabled = step === 2;
    article.dispatchEvent(new CustomEvent('rm:textsize', { detail: step }));
  }

  pop.innerHTML = '<button type="button" class="tsize__step" data-act="-" aria-label="작게">가<small>−</small></button>' +
    '<span class="tsize__dots">' + LABELS.map(function (l, i) {
      return '<button type="button" class="tsize__dot" data-step="' + i + '" aria-label="' + l + '"></button>';
    }).join('') + '</span>' +
    '<button type="button" class="tsize__step tsize__step--lg" data-act="+" aria-label="크게">가<small>+</small></button>';

  function open(on) {
    box.classList.toggle('is-open', on);
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    open(!box.classList.contains('is-open'));
  });
  pop.addEventListener('click', function (e) {
    e.stopPropagation();
    var t = e.target.closest('[data-act], .tsize__dot');
    if (!t) return;
    if (t.dataset.act) set(step + (t.dataset.act === '+' ? 1 : -1));
    else set(+t.dataset.step);
  });
  document.addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });

  set(step);
})();
