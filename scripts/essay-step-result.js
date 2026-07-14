/* =====================================================================
   서술형 훈련 · 스텝 결과 — 데이터 구동 (개념/유형 step-result와 동일 골격)
   ⚠️ 스텝 결과 = 한 훈련 유형 '안의' 세부 단계 하나 완료 화면.
      서술형 고유: 문제(번)마다 빈칸 여러 개 → 문항별 정답 n/m·정답률 행.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 테마 (rm-theme 공유 키) ---------- */
  var root = document.documentElement;
  (function () { var s; try { s = localStorage.getItem('rm-theme'); } catch (e) {} if (s) root.setAttribute('data-theme', s); })();
  var toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('rm-theme', t); } catch (e) {}
  });

  /* ---------- 데이터 ---------- */
  // 이 스텝(기초 기르기)의 문항별 결과 — 문제마다 빈칸 여러 개.
  var PROBLEMS = [
    { no: 1, correct: 3, total: 8 },
    { no: 2, correct: 2, total: 8 },
    { no: 3, correct: 3, total: 8 }
  ];
  // 학습 진행 현황 (서술형 3단계). state: done | current | locked, grade: S|A|B|C|null
  // go = 카드 클릭/시작하기 시 이동할 화면
  var STEPS = [
    { name: '기초 기르기', state: 'current', grade: 'B', go: '' },
    { name: '기본 다지기', state: 'done',    grade: 'A', go: 'essay-drill.html' },
    { name: '실력 키우기', state: 'locked',  grade: null, go: 'essay-advanced.html' }
  ];

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  function badgeSrc(g) { return 'assets/figma/grade-' + g + '.png'; }

  /* ---------- 집계 ---------- */
  var correct = 0, total = 0;
  PROBLEMS.forEach(function (p) { correct += p.correct; total += p.total; });
  var rate = total ? Math.round((correct / total) * 100) : 0;
  var grade = gradeOf(rate);

  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = badgeSrc(grade);
  document.getElementById('summaryBadge').alt = grade.toUpperCase() + '등급';

  /* 정답률 카운트업 + 진행바 (rAF는 이 환경에서 불안정 → setInterval) */
  var rateEl = document.getElementById('rate');
  var barFill = document.getElementById('barFill');
  var TICKS = 22, i = 0;
  var timer = setInterval(function () {
    i++; var k = i / TICKS, eased = 1 - Math.pow(1 - k, 3);
    rateEl.textContent = Math.round(rate * eased);
    if (i >= TICKS) { clearInterval(timer); rateEl.textContent = rate; }
  }, 26);
  setTimeout(function () { barFill.style.width = rate + '%'; }, 60);

  /* ---------- 문항별 결과 행 ---------- */
  var DOC_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  var rows = document.getElementById('rows');
  PROBLEMS.forEach(function (p) {
    var pr = p.total ? Math.round((p.correct / p.total) * 100) : 0;
    var row = document.createElement('div');
    row.className = 'rrow';
    row.innerHTML =
      '<div class="rrow__no">' + DOC_ICON + '<span>' + p.no + '번</span></div>' +
      '<div class="rrow__sep"></div>' +
      '<div class="rrow__stat"><span>정답</span><b>' + p.correct + '/' + p.total + '</b></div>' +
      '<div class="rrow__sep"></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });

  /* ---------- 학습 진행 현황 (개념/유형과 동일: [등급] 대괄호 / 시작하기) ---------- */
  var POINTER = '<svg class="step-card__pointer" viewBox="0 0 27 29" width="23" height="25" fill="none" aria-hidden="true"><path d="M2.5409 8.79388C2.5409 3.94385 7.83197 0.947849 11.9908 3.44311L21.4299 9.10653C25.4691 11.53 25.4691 17.3846 21.4299 19.8081L11.9908 25.4715C7.83197 27.9668 2.5409 24.9708 2.5409 20.1207V8.79388Z" fill="var(--accent)"/></svg>';
  var stepList = document.getElementById('stepList');
  STEPS.forEach(function (s) {
    var card = document.createElement('div');
    var cls = 'step-card';
    if (s.state === 'current') cls += ' is-current';
    if (s.grade) cls += ' is-done';                      // 완료(등급 보유) → 이동
    else if (s.state === 'locked') cls += ' is-open';    // 미학습 → 시작 모달
    card.className = cls;
    if (s.go) card.setAttribute('data-go', s.go);
    var right = s.grade
      ? '<span class="step-card__grade"><span class="rbracket">[</span><img src="' + badgeSrc(s.grade.toLowerCase()) + '" alt="' + s.grade + '" /><span class="rbracket">]</span></span>'
      : '<span class="step-card__start">시작하기 ›</span>';
    card.innerHTML = (s.state === 'current' ? POINTER : '') +
      '<span class="step-card__name">' + s.name + '</span>' + right;
    stepList.appendChild(card);
  });

  /* ---------- 액션 (후속 화면 전 토스트) ---------- */
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }
  var reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.addEventListener('click', function () { window.location.href = 'essay-drill-review.html'; });
  // 스텝 카드 클릭 · 시작 모달 · 훈련 결과 버튼은 step-progress.js 가 담당.
})();
