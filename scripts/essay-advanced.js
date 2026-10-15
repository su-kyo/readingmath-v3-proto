/* =========================================================================
   서술형 훈련 — 실력 키우기 (Step3). 기초 기르기(essay-basics)와 동일 폼, 콘텐츠만 심화.
   좌: 문제 / 우: 단계별 풀이 가이드. 빈칸 클릭 → 입력 드롭다운(키패드/보기).
   즉답 채점 없음(입력값 그대로). 모든 빈칸 채우면 '결과보기'(제출) 활성 → 스텝 결과.
   ========================================================================= */
(function () {
  var ANSWERS = {
    '1': { type: 'choice', ans: '상자의 수', choices: ['사과의 수', '상자의 수', '남는 수', '한 상자에 담은 수'] },
    '2': { type: 'short',  ans: '204' },   // 둘째 날 = 156 + 48
    '3': { type: 'short',  ans: '360' },   // 전체 = 156 + 204
    '4': { type: 'short',  ans: '40'  },   // 몫
    '5': { type: 'short',  ans: '0'   }    // 나머지
  };

  function b(id) {
    return '<span class="blank" data-blank="' + id + '">' +
      '<span class="blank__ans"></span>' +
      '<span class="blank__badge">' + id + '</span></span>';
  }
  function given(ans) {
    return '<span class="blank blank--given"><span class="blank__ans">' + ans + '</span></span>';
  }

  var PARAS = [
    // 1. 문제 파악
    '<div class="para">' +
      '<div class="line para__head">이 문제를 어떻게 해결할까요?</div>' +
      '<div class="line">' + given('사과를 한 상자에 9개씩 담아요.') + '</div>' +
      '<div class="line">이 문제는 사과를 담는 데 필요한 ' + b('1') + '와 남는 사과를 구하는 문제예요.</div>' +
    '</div>',

    // 2. 둘째 날 딴 사과
    '<div class="para">' +
      '<div class="line">둘째 날 딴 사과는 첫째 날 156개보다 48개 더 많아요.</div>' +
      '<div class="box"><div class="box__row">156 + 48 = ' + b('2') + ' (개)</div></div>' +
    '</div>',

    // 3. 이틀 동안 딴 사과
    '<div class="para">' +
      '<div class="line">이틀 동안 딴 사과는 모두 몇 개일까요?</div>' +
      '<div class="box"><div class="box__row">156 + ' + b('2') + ' = ' + b('3') + ' (개)</div></div>' +
    '</div>',

    // 4. 나눗셈 (몫·나머지)
    '<div class="para">' +
      '<div class="line">' + b('3') + '개를 한 상자에 9개씩 담으면 몇 상자가 되고 몇 개가 남을까요?</div>' +
      '<div class="box"><div class="box__row">' + b('3') + ' ÷ 9 = ' + b('4') + ' … ' + b('5') + '</div></div>' +
    '</div>',

    // 5. 결론
    '<div class="para">' +
      '<div class="line">따라서 상자는 ' + b('4') + '개 필요하고, 남는 사과는 ' + b('5') + '개예요.</div>' +
    '</div>'
  ];

  var expl = document.getElementById('expl');
  expl.innerHTML = '<div class="expl__doc">' + PARAS.join('') + '</div>';

  // ── 문제 카드 열고 접기 (세로 레이아웃 · 기초 기르기 v2와 동일) ──
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  if (problemHead) problemHead.addEventListener('click', function () {
    if (!problem.classList.contains('is-collapsible')) return;
    problem.classList.toggle('is-collapsed');
  });

  var order = [];
  var byId = {};
  var filled = {};
  expl.querySelectorAll('.blank[data-blank]').forEach(function (el) {
    var id = el.dataset.blank;
    if (!byId[id]) { byId[id] = []; order.push(id); }
    byId[id].push(el);
  });

  var resultBtn = document.getElementById('resultBtn');
  var answers = {};

  function refreshNext() {
    var done = order.every(function (id) { return filled[id]; });
    if (done) { resultBtn.disabled = false; resultBtn.removeAttribute('title'); }
    if (window.RMGuide) window.RMGuide.set(done ? '' : '모든 답안을 입력해 주세요!');   // 콘솔바 안내(RM-PART-07)
  }

  function fill(id, value) {
    filled[id] = true;
    answers[id] = value;
    byId[id].forEach(function (el) {
      el.querySelector('.blank__ans').textContent = value;
      el.classList.add('is-filled');
    });
    refreshNext();
  }

  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var activeId = null;
  var selEl = null;

  function place(anchor, reveal) {   /* 자리 = scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위, 빈칸 아래 12px · 모자라면 위(꼬리도 아래로) */
    var at = window.RMPopPlace.place(pop, anchor, { reveal: reveal });
    if (!at) { closePop(); return; }
    pop.classList.toggle('qpop--up', at.up);
    caret.style.left = (Math.min(Math.max(14, at.caretX), at.width - 14) - 6) + 'px';
    caret.style.top = at.up ? (at.height - 6) + 'px' : '-6px';
  }

  var buffer = '';

  function openPop(anchor) {
    closePop();   // 열린 창(객관식 · 키패드)부터 닫는다
    var id = anchor.dataset.blank;
    activeId = id;
    selEl = anchor; selEl.classList.add('is-sel');

    var slot = ANSWERS[id];
    if (slot.type === 'choice') {   // 객관식 = 공용 빈칸 선지 창(scripts/blank-pop.js) · 채점 없이 고른 값을 그대로 넣는다
      window.RMBlankPop.open(anchor, { choices: slot.choices, onDone: function (v) { fill(id, v); }, onClose: closePop });
      return;
    } else {
      buffer = answers[id] || '';
      popBody.innerHTML = '<div class="qpop__pad">' + window.RMKeypad.html() + '</div>';
      var disp = popBody.querySelector('.keypad__display');
      disp.id = 'popDisp'; disp.textContent = buffer || '0';   /* 키패드 정본 = scripts/keypad.js */
    }

    pop.classList.add('is-open');
    place(anchor, true);
  }

  function closePop() {
    pop.classList.remove('is-open');
    window.RMBlankPop.close();
    if (selEl) { selEl.classList.remove('is-sel'); selEl = null; }
    activeId = null;
  }

  function submit(value) {
    var id = activeId;
    closePop();
    if (id != null) fill(id, value);
  }

  function handleKey(k) {
    if (k === 'ok') { if (buffer !== '') submit(buffer); return; }
    buffer = window.RMKeypad.apply(buffer, k);   /* 값 편집 규칙 = 공용 */
    var d = document.getElementById('popDisp');
    if (d) d.textContent = buffer || '0';
  }

  expl.addEventListener('click', function (e) {
    var el = e.target.closest('.blank');
    if (!el || el.classList.contains('blank--given')) return;
    if (selEl === el) { closePop(); return; }
    openPop(el);
  });

  popBody.addEventListener('click', function (e) {
    var key = e.target.closest('.keypad__key');
    if (key) handleKey(key.dataset.k);
  });

  document.addEventListener('click', function (e) {
    if (!pop.classList.contains('is-open')) return;
    if (e.target.closest('#qpop') || e.target.closest('.blank')) return;
    closePop();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pop.classList.contains('is-open')) closePop();
  });
  // 세로 레이아웃: 스크롤 컨테이너가 .stage-scroll (기존 #expl 자체 스크롤 → 단일 스크롤)
  var scroller = document.querySelector('.stage-scroll');
  if (scroller) scroller.addEventListener('scroll', function () { if (pop.classList.contains('is-open') && selEl) place(selEl); }, true);
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) closePop(); });

  refreshNext();

  // 머리줄 타이머 = scripts/learn-timer.js

  resultBtn.addEventListener('click', function () {
    if (resultBtn.disabled) return;
    window.location.href = 'essay/step-result.html';
  });

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
