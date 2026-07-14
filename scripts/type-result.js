/* =========================================================================
   유형 스텝 결과 (2차 유형 문제 완료) — 10문항 결과, 타이머 pause 상태
   ========================================================================= */
(function () {
  var RESULTS = [true, true, true, true, false, true, true, false, false, true]; // 5·8·9 오답

  var total = RESULTS.length;
  var correct = RESULTS.filter(Boolean).length;
  var rate = Math.round((correct / total) * 100);
  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  var badge = 'assets/figma/grade-' + gradeOf(rate) + '.png';

  document.getElementById('rate').textContent = rate;
  document.getElementById('score').textContent = correct;
  document.getElementById('total').textContent = '/' + total;
  document.getElementById('summaryBadge').src = badge;
  document.getElementById('sideBadge').src = badge;
  requestAnimationFrame(function () { document.getElementById('barFill').style.width = rate + '%'; });

  var grid = document.getElementById('grid');
  RESULTS.forEach(function (ok, i) {
    var cell = document.createElement('div');
    cell.className = 'rcell ' + (ok ? 'ok' : 'no');
    cell.innerHTML = '<div class="rcell__no">' + (i + 1) + '</div><div class="rcell__hr"></div><div class="rcell__label">' + (ok ? '정답' : '오답') + '</div>';
    grid.appendChild(cell);
  });

  // 해설 보기 → 해설 화면 (이후 작업)
  document.getElementById('reviewBtn').addEventListener('click', function () { window.location.href = 'type-review.html'; });

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { var c = document.documentElement.getAttribute('data-theme'); document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark'); });
})();
