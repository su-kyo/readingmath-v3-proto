/* =====================================================================
   서술형 훈련 · 스텝 결과 — Phase 7 ① 계기판 어휘
   ⚠️ 스텝 결과 = 한 훈련 유형 '안의' 세부 단계 하나 완료 화면.
      서술형 고유: 문제(번)마다 빈칸이 여러 개 → 문제별 행(한 칸이 한 빈칸).
   ===================================================================== */
(function () {
  'use strict';

  /* 결과 화면은 항상 다크 계기판 — 테마 토글·저장 테마 적용 없음 (Phase 7 사용자 결정) */

  /* ---------- 데이터 ----------
     이 스텝(기초 기르기)의 문제별 결과 — 문제마다 빈칸 8개.
     ※ essay-training-result.js 의 STAGES[기초 기르기].probs 와 같은 숫자를 유지할 것 */
  var PROBLEMS = [
    { no: 1, correct: 6, total: 8 },
    { no: 2, correct: 5, total: 8 },
    { no: 3, correct: 7, total: 8 }
  ];
  /* 학습 진행 현황 (서술형 3단계). state: current | open, grade: S|A|B|C|null
     go = 카드 클릭/시작하기 시 이동할 화면, demo = ?done=1 검수에서 매길 등급 */
  var STEPS = [
    { name: '기초 기르기', state: 'current', grade: 'B', go: '' },
    { name: '기본 다지기', state: 'open',    grade: null, go: 'essay/drill-v2.html', demo: 'a' },
    { name: '실력 키우기', state: 'open',    grade: null, go: 'essay/advanced.html', demo: 's' }
  ];

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }

  /* ---------- 집계 ---------- */
  var correct = 0, total = 0;
  PROBLEMS.forEach(function (p) { correct += p.correct; total += p.total; });
  var rate = total ? Math.round((correct / total) * 100) : 0;
  var grade = gradeOf(rate);

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = 'assets/img/grade/grade-' + grade + '.webp';
  document.getElementById('summaryBadge').alt = grade.toUpperCase() + '등급';

  /* ?snap=1 이면 애니메이션 생략하고 최종 상태로 (검수·스크린샷용) */
  var SNAP = new URLSearchParams(location.search).get('snap') === '1';

  /* 다이얼: 0에서 목표치로 스윕 (--pct는 @property로 등록되어 트랜지션됨) */
  var dial = document.getElementById('rateDial');
  if (SNAP) { dial.style.transition = 'none'; dial.style.setProperty('--pct', rate); }
  else requestAnimationFrame(function () { requestAnimationFrame(function () {
    dial.style.setProperty('--pct', rate);
  }); });

  /* ---------- 문제별 행 — 빈칸 LED 순차 점등 ---------- */
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  var rows = document.getElementById('rows');
  PROBLEMS.forEach(function (p) {
    var pr = p.total ? Math.round((p.correct / p.total) * 100) : 0;
    var seg = '';
    for (var i = 0; i < p.total; i++) seg += '<i data-on="' + (i < p.correct ? 1 : 0) + '"></i>';
    var row = document.createElement('div');
    row.className = 'rrow';
    row.innerHTML =
      '<div class="rrow__name">' + DOC + '<span>' + p.no + '번 문제</span></div>' +
      '<span class="seg">' + seg + '</span>' +
      '<div class="rrow__stat"><span>정답</span><b>' + p.correct + '/' + p.total + '</b></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });
  [].forEach.call(rows.querySelectorAll('.seg i[data-on="1"]'), function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 200 + i * 45);
  });

  /* ---------- 학습 진행 현황 (조작 패널 카드) ---------- */
  var stepList = document.getElementById('stepList');
  var doneCount = 0;
  STEPS.forEach(function (s, i) {
    var card = document.createElement('div');
    var cls = 'step-card';
    if (s.state === 'current') cls += ' is-current';
    if (s.grade) { cls += ' is-done'; doneCount++; }
    else cls += ' is-open';                              // 미학습 → 시작 모달
    card.className = cls;
    if (s.go) card.setAttribute('data-go', s.go);
    if (s.demo) card.setAttribute('data-demo-grade', s.demo);
    var right = s.grade
      ? '<img class="step-card__grade" src="assets/img/grade/grade-step-' + s.grade.toLowerCase() + '.webp" alt="' + s.grade + '" />'
      : '<button class="key">시작하기 ›</button>';
    card.innerHTML =
      '<i class="lamp2"></i>' +
      '<div class="step-card__id"><span class="step-card__no">STEP ' + (i + 1) + '</span>' +
      '<span class="step-card__name">' + s.name + '</span></div>' + right;
    stepList.appendChild(card);
  });
  /* 진행 게이지 — 한 칸이 한 스텝 (?done=1 검수는 step-progress.js가 채운다) */
  var prog = document.getElementById('sideProg');
  var cells = '';
  STEPS.forEach(function (s, i) { cells += '<i' + (i < doneCount ? ' class="on"' : '') + '></i>'; });
  prog.innerHTML = cells + '<b>' + doneCount + '<small>/' + STEPS.length + '</small></b>';

  /* ---------- 액션 (후속 화면 전 토스트) ---------- */
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }
  var reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.addEventListener('click', function () { window.location.href = 'essay/drill-review.html'; });
  // 스텝 카드 클릭 · 시작 모달 · 훈련 결과 버튼은 step-progress.js 가 담당.
})();
