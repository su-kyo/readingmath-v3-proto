/* =====================================================================
   서술형 훈련 · 스텝 결과 — Phase 7 ① 계기판 어휘
   ⚠️ 스텝 결과 = 한 훈련 유형 '안의' 세부 단계 하나 완료 화면.
      서술형 고유: 문제(번)마다 빈칸이 여러 개 → 문제별 행(한 칸이 한 빈칸).
   수학 · 과학 한 벌 — 과목은 rm-subject(scripts/subject.js)로 가른다.
   ===================================================================== */
(function () {
  'use strict';

  /* 결과 화면은 항상 다크 계기판 — 테마 토글·저장 테마 적용 없음 (Phase 7 사용자 결정) */

  /* ---------- 데이터 (과목 분기 = scripts/subject.js 의 RMSubject) ----------
     이 스텝(1단계 기초 기르기 · 문장 완성하기)의 문제별 결과 — total = 그 문제의 빈칸 수(실서비스 「풀이답안 문제수」).
     수학 34205 빈칸 10 · 34206 빈칸 12 / 과학 22544 · 22545 빈칸 4씩 (scripts/essay-basics-data-*.js).
     ※ essay-training-result.js 의 STAGES[1단계].probs 와 같은 숫자를 유지할 것 */
  var S = window.RMSubject;
  var PROBLEMS = S.pick(
    [ { no: 1, correct: 7, total: 10 }, { no: 2, correct: 10, total: 12 } ],
    [ { no: 1, correct: 3, total: 4 },  { no: 2, correct: 3, total: 4 } ]
  );
  /* 학습 진행 현황 (서술형 3단계). state: current | open, grade: S|A|B|C|null
     go = 카드 클릭/시작하기 시 이동할 화면, demo = ?done=1 검수에서 매길 등급 */
  var STEPS = S.pick([
    { name: '기초 기르기', state: 'current', grade: 'B', go: '' },
    { name: '기본 다지기', state: 'open',    grade: null, go: 'essay/drill-math.html', demo: 'a' },
    { name: '실력 키우기', state: 'open',    grade: null, go: 'essay/advanced.html', demo: 's' }
  ], [
    { name: '문장 완성하기',          state: 'current', grade: 'B', go: '' },
    { name: '답안 완성하기',          state: 'open',    grade: null, go: 'essay/drill-sci.html', demo: 'a' },
    { name: '탐구활동 보고서 만들기', state: 'open',    grade: null, go: 'essay/report.html', demo: 'a' }
  ]);
  document.getElementById('title').textContent = STEPS[0].name + ' 완료!';
  document.getElementById('unit').textContent = S.unit.sub;
  var stageCrumb = document.getElementById('stageCrumb');
  if (stageCrumb) stageCrumb.textContent = STEPS[0].name;

  function gradeOf(r) { return RMGrade.of(r); }  /* 기준은 scripts/grade.js 하나 */

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
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>';
  var rows = document.getElementById('rows');
  PROBLEMS.forEach(function (p) {
    var pr = p.total ? Math.round((p.correct / p.total) * 100) : 0;
    var seg = '';
    for (var i = 0; i < p.total; i++) seg += '<i data-on="' + (i < p.correct ? 1 : 0) + '"></i>';
    var row = document.createElement('div');
    row.className = 'rrow';
    row.innerHTML =
      '<div class="rrow__name">' + DOC + '<span>' + p.no + '번 문제</span></div>' +
      '<span class="led">' + seg + '</span>' +
      '<div class="rrow__stat"><span>정답</span><b>' + p.correct + '/' + p.total + '</b></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });
  [].forEach.call(rows.querySelectorAll('.led i[data-on="1"]'), function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 200 + i * 45);
  });

  /* ---------- 학습 진행 현황 (조작 패널 카드) ---------- */
  var stepList = document.getElementById('stepList');

  STEPS.forEach(function (s, i) {
    var card = document.createElement('div');
    var cls = 'step-card';
    if (s.state === 'current') cls += ' is-current';
    if (s.grade) cls += ' is-done';
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
  /* 진행 게이지 「n/전체」는 지웠다 — 아래 단계 목록이 같은 정보를 보여 준다 (2026-10-15 판단 보드 13) */

  /* ---------- 액션 (후속 화면 전 토스트) ---------- */
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }
  var reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.addEventListener('click', function () { window.location.href = S.pick('essay/drill-review-math.html', 'essay/drill-review-sci.html'); });
  // 스텝 카드 클릭 · 시작 모달 · 훈련 결과 버튼은 step-progress.js 가 담당.
})();
