/* =========================================================================
   유형 스텝 결과 (1차 유형 문제 완료 — 풀이 화면의 콘텐츠가 1차 유형이다, 2026-10-15 사용자 결정) — Phase 7 ① 계기판 어휘
   상단 집계 = 다이얼 게이지(정답률) + 판독창(등급·정답),
   아래 = 문항 판독(한 칸이 한 문항 · 켜진 칸이 정답 · 코랄 링이 오답).
   ========================================================================= */
(function () {
  // 결과 화면은 항상 다크 계기판 — 테마 토글·강제 없음 (Phase 7 사용자 결정)

  // 문항 결과 = 과목별 유형 데이터의 데모 오답(pick)에서 읽는다 — 수학 10문항(5·8·9 오답 → 7/10 → 70% → B) · 과학 5문항(4 오답 → 4/5 → 80% → A)
  // 훈련 결과(type-training-result.js)의 1차 유형 문제 행도 같은 곳에서 읽는다
  var SET = window.RMTypeData[window.RMSubject.id];
  var RESULTS = SET.problems.map(function (p) { return !('pick' in p); });

  // 제한 시간 — 머리줄 글자가 정본(scripts/learn-timer.js 가 읽는다. 이 스크립트가 먼저 돈다)
  var limEl = document.querySelector('.lheader__limit');
  if (limEl && SET.limit) limEl.textContent = '/ ' + SET.limit;

  var total = RESULTS.length;
  var correct = RESULTS.filter(Boolean).length;
  var rate = Math.round((correct / total) * 100);

  function gradeOf(r) { return RMGrade.of(r); }  /* 기준은 scripts/grade.js 하나 */
  var g = gradeOf(rate);

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = 'assets/img/grade/grade-' + g + '.webp';
  // 사이드 패널의 스텝 등급은 행용 육각 뱃지(grade-step-*)를 쓴다
  document.getElementById('sideBadge').src = 'assets/img/grade/grade-step-' + g + '.webp';

  // ?snap=1 이면 애니메이션 생략하고 최종 상태로 (검수·스크린샷용)
  var SNAP = new URLSearchParams(location.search).get('snap') === '1';

  // 다이얼: 0에서 목표치로 스윕 (--pct는 @property로 등록되어 트랜지션됨)
  var dial = document.getElementById('rateDial');
  if (SNAP) { dial.style.transition = 'none'; dial.style.setProperty('--pct', rate); }
  else requestAnimationFrame(function () { requestAnimationFrame(function () {
    dial.style.setProperty('--pct', rate);
  }); });

  // 문항 판독 — 정답 칸 순차 점등
  var grid = document.getElementById('qgrid');
  RESULTS.forEach(function (ok, i) {
    var cell = document.createElement('div');
    cell.className = 'qcell ' + (ok ? 'is-ok' : 'no');
    cell.textContent = i + 1;
    grid.appendChild(cell);
  });
  var oks = grid.querySelectorAll('.qcell.is-ok');
  [].forEach.call(oks, function (c, i) {
    if (SNAP) c.classList.add('ok');
    else setTimeout(function () { c.classList.add('ok'); }, 200 + i * 55);
  });

  // 해설 보기
  var reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.addEventListener('click', function () { window.location.href = 'type/review.html'; });
})();
