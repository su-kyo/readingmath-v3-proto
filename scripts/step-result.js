/* =========================================================================
   스텝 결과 (개념 학습 완료) — Phase 7 ① 계기판 어휘 (A안 조합)
   상단 집계 = 다이얼 게이지(정답률) + 판독창(등급·정답),
   활동별 행 = 문항 LED 세그먼트(한 칸이 한 문항, 켜진 칸이 정답).
   ========================================================================= */
(function () {
  // ?theme=dark|light 로 열면 그 테마로 시작 (검수·스크린샷용 — phase7-brief 관례)
  var forceTheme = new URLSearchParams(location.search).get('theme');
  if (forceTheme) document.documentElement.setAttribute('data-theme', forceTheme);

  // 개념 학습의 채점 활동 결과 (전체 = 11/14 → 79% → B)
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
  document.getElementById('sideBadge').src = badgeSrc;

  // 다이얼: 0에서 목표치로 스윕 (--pct는 @property로 등록되어 트랜지션됨)
  var dial = document.getElementById('rateDial');
  requestAnimationFrame(function () { requestAnimationFrame(function () {
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
    setTimeout(function () { c.classList.add('on'); }, 200 + i * 45);
  });

  // 라이트/다크 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });
})();
