/* =========================================================================
   스텝 결과 (개념 학습 완료) — Phase 7 ① 계기판 어휘 (A안 조합)
   상단 집계 = 다이얼 게이지(정답률) + 판독창(등급·정답),
   활동별 행 = 문항 LED 세그먼트(한 칸이 한 문항, 켜진 칸이 정답).
   ========================================================================= */
(function () {
  // 결과 화면은 항상 다크 계기판 — 테마 토글·강제 없음 (Phase 7 사용자 결정)

  // 개념 학습의 채점 활동 결과 (전체 = 11/14 → 79% → B)
  // ※ concept-training-result.js 의 STAGES[개념 학습].acts 와 같은 숫자를 유지할 것
  var ACTIVITIES = [
    { name: '개념 요약하기', correct: 4, total: 5 },
    { name: '개념 다지기',   correct: 7, total: 9 }
  ];

  var total = 0, correct = 0;
  ACTIVITIES.forEach(function (a) { total += a.total; correct += a.correct; });
  var rate = Math.round((correct / total) * 100);

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  var badgeSrc = 'assets/img/grade/grade-' + gradeOf(rate) + '.webp';

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = badgeSrc;
  // 사이드 패널의 스텝 등급은 행용 육각 뱃지(grade-step-*)를 쓴다
  document.getElementById('sideBadge').src = 'assets/img/grade/grade-step-' + gradeOf(rate) + '.webp';

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
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  var rows = document.getElementById('rows');
  ACTIVITIES.forEach(function (a) {
    var pr = a.total ? Math.round((a.correct / a.total) * 100) : 0;
    var row = document.createElement('div');
    row.className = 'rrow';
    var seg = '';
    for (var i = 0; i < a.total; i++) seg += '<i data-on="' + (i < a.correct ? 1 : 0) + '"></i>';
    row.innerHTML =
      '<div class="rrow__name">' + DOC + '<span>' + a.name + '</span></div>' +
      '<span class="seg">' + seg + '</span>' +
      '<div class="rrow__stat"><span>정답</span><b>' + a.correct + '/' + a.total + '</b></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });
  var cells = rows.querySelectorAll('.seg i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 200 + i * 45);
  });
})();
