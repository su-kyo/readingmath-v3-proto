/* =========================================================================
   스텝 결과 (개념 학습 완료) — Phase 7 ① 계기판 어휘 (A안 조합)
   상단 집계 = 다이얼 게이지(정답률) + 판독창(등급·정답),
   활동별 행 = 문항 LED 세그먼트(한 칸이 한 문항, 켜진 칸이 정답).
   ========================================================================= */
(function () {
  // 결과 화면은 항상 다크 계기판 — 테마 토글·강제 없음 (Phase 7 사용자 결정)

  // 과목 = scripts/subject.js (머리줄 앞 세 칸 · 소단원 제목은 data-crumb 로 채운다)
  var SCI = window.RMSubject.id === 'science';

  // 개념 학습의 채점 활동 결과 — total 은 과목별 실제 채점 단위 수, 정답 수는 데모
  //   요약은 빈칸마다 채점, 다지기는 문제마다 채점(정답 · 일부 정답 · 오답 — learn-drill.js)
  //   수학: 요약 빈칸 5(34562 4칸 + 34574 1칸) · 다지기 3문제(34576 · 34575 · 34612) → 6/8 → 75% → B
  //   과학: 요약 빈칸 12(22384) · 다지기 6문제(22389~22394) → 14/18 → 78% → B
  // ※ concept-training-result.js 의 STAGES[개념 학습].acts 와 같은 숫자를 유지할 것
  var ACTIVITIES = SCI ? [
    { name: '개념 요약하기', correct: 9, total: 12 },
    { name: '개념 다지기',   correct: 5, total: 6 }
  ] : [
    { name: '개념 요약하기', correct: 4, total: 5 },
    { name: '개념 다지기',   correct: 2, total: 3 }
  ];

  // STEP 2 결과(?step=ops · ?step=check) — 행 막대 대신 문항 번호 타일 (2026-10-15 판단 보드 7 · 유형 스텝 결과와 같은 문법)
  // STEP 2 는 과목을 따른다: 수학 「기초 연산」 14문항(11/14) · 과학 「개념 확인하기」 10문항(8/10, training 978 · concept/check.html)
  // ※ concept-training-result.js 의 STAGES[STEP 2] 와 같은 숫자를 유지할 것
  var STEP = new URLSearchParams(location.search).get('step');
  var OPS = STEP === 'ops' || STEP === 'check';
  var STEP2 = SCI ? '개념 확인하기' : '기초 연산';
  var OPS_RESULTS = SCI ? [true, true, true, false, true, true, true, false, true, true]
    : [true, true, false, true, true, true, false, true, true, true, true, false, true, true];

  var total = 0, correct = 0;
  if (OPS) { total = OPS_RESULTS.length; correct = OPS_RESULTS.filter(Boolean).length; }
  else ACTIVITIES.forEach(function (a) { total += a.total; correct += a.correct; });
  var rate = Math.round((correct / total) * 100);

  function gradeOf(r) { return RMGrade.of(r); }  /* 기준은 scripts/grade.js 하나 */
  var badgeSrc = 'assets/img/grade/grade-' + gradeOf(rate) + '.webp';

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = badgeSrc;
  // 사이드 패널의 스텝 등급은 행용 육각 뱃지(grade-step-*)를 쓴다
  document.getElementById('sideBadge').src = 'assets/img/grade/grade-step-' + gradeOf(rate) + '.webp';

  // STEP 2 카드 — 과목에 맞는 이름 · 주소
  var opsCard = document.getElementById('opsCard');
  opsCard.querySelector('.step-card__name').textContent = STEP2;
  opsCard.dataset.go = SCI ? 'concept/check.html' : 'concept/basic-ops.html';

  if (OPS) {
    document.getElementById('stepTitle').textContent = STEP2 + ' 완료!';
    document.getElementById('stepCrumb').textContent = STEP2;
    document.getElementById('rows').hidden = true;
    // 사이드: 개념 학습은 완료(등급은 위 ACTIVITIES 로 셈), STEP 2 가 지금 단계
    var learnCard = document.querySelector('.step-card.is-current');
    learnCard.classList.remove('is-current');
    var lc = 0, lt = 0; ACTIVITIES.forEach(function (a) { lc += a.correct; lt += a.total; });
    document.getElementById('sideBadge').src = 'assets/img/grade/grade-step-' + gradeOf(Math.round((lc / lt) * 100)) + '.webp';
    opsCard.classList.remove('is-open'); opsCard.classList.add('is-current', 'is-done');
    var key = opsCard.querySelector('.key'); if (key) key.remove();
    var img = document.createElement('img');
    img.className = 'step-card__grade'; img.alt = '등급';
    img.src = 'assets/img/grade/grade-step-' + gradeOf(rate) + '.webp';
    opsCard.appendChild(img);
    var grid = document.getElementById('qgrid');
    grid.hidden = false;
    OPS_RESULTS.forEach(function (ok, i) {
      var cell = document.createElement('div');
      cell.className = 'qcell ' + (ok ? 'is-ok' : 'no');
      cell.textContent = i + 1;
      grid.appendChild(cell);
    });
  }

  // 검수용 ?done=1(전 스텝 완료) 처리는 공용 step-progress.js 가 담당한다

  // ?snap=1 이면 애니메이션 생략하고 최종 상태로 (검수·스크린샷용)
  var SNAP = new URLSearchParams(location.search).get('snap') === '1';

  // 다이얼: 0에서 목표치로 스윕 (--pct는 @property로 등록되어 트랜지션됨)
  var dial = document.getElementById('rateDial');
  if (SNAP) { dial.style.transition = 'none'; dial.style.setProperty('--pct', rate); }
  else requestAnimationFrame(function () { requestAnimationFrame(function () {
    dial.style.setProperty('--pct', rate);
  }); });

  // 활동별 행 — 문항 LED 순차 점등
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>';
  var rows = document.getElementById('rows');
  ACTIVITIES.forEach(function (a) {
    var pr = a.total ? Math.round((a.correct / a.total) * 100) : 0;
    var row = document.createElement('div');
    row.className = 'rrow';
    var seg = '';
    for (var i = 0; i < a.total; i++) seg += '<i data-on="' + (i < a.correct ? 1 : 0) + '"></i>';
    row.innerHTML =
      '<div class="rrow__name">' + DOC + '<span>' + a.name + '</span></div>' +
      '<span class="led">' + seg + '</span>' +
      '<div class="rrow__stat"><span>정답</span><b>' + a.correct + '/' + a.total + '</b></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });
  var cells = OPS ? document.querySelectorAll('#qgrid .qcell.is-ok') : rows.querySelectorAll('.led i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    var on = OPS ? 'ok' : 'on';
    if (SNAP) c.classList.add(on);
    else setTimeout(function () { c.classList.add(on); }, 200 + i * 45);
  });
})();
