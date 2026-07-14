/* =========================================================================
   스텝 결과 (개념 학습 완료) — B3 정보구조: 활동별 행(개념 요약하기 / 개념 다지기)
   개념 훈련 Step1(개념 학습)의 채점 활동 2개를 행으로, 상단은 전체 집계.
   ========================================================================= */
(function () {
  // 개념 학습의 채점 활동 결과 (전체 = 11/14 → 79% → B)
  var ACTIVITIES = [
    { name: '개념 요약하기', correct: 4, total: 5 },
    { name: '개념 다지기',   correct: 7, total: 9 }
  ];

  var total = 0, correct = 0;
  ACTIVITIES.forEach(function (a) { total += a.total; correct += a.correct; });
  var rate = Math.round((correct / total) * 100);

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  var badgeSrc = 'assets/figma/grade-' + gradeOf(rate) + '.png';

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = badgeSrc;
  document.getElementById('sideBadge').src = badgeSrc;
  setTimeout(function () { document.getElementById('barFill').style.width = rate + '%'; }, 60);

  // 활동별 행
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  var rows = document.getElementById('rows');
  ACTIVITIES.forEach(function (a) {
    var pr = a.total ? Math.round((a.correct / a.total) * 100) : 0;
    var row = document.createElement('div');
    row.className = 'rrow';
    row.innerHTML =
      '<div class="rrow__name">' + DOC + '<span>' + a.name + '</span></div>' +
      '<div class="rrow__sep"></div>' +
      '<div class="rrow__stat"><span>정답</span><b>' + a.correct + '/' + a.total + '</b></div>' +
      '<div class="rrow__sep"></div>' +
      '<div class="rrow__stat"><span>정답률</span><b>' + pr + '%</b></div>';
    rows.appendChild(row);
  });

  // 라이트/다크 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });
})();
