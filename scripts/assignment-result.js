/* =========================================================================
   과제 센터 · 결과 화면 (assignment-result)
   · 요약(점수/정답·오답·미입력) + 문항별 채점표를 데이터로 렌더
   · 데모: 15문항 중 12정답 / 3오답 / 0미입력 → 80점
   ========================================================================= */
(function () {
  var ICO = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>'
  };

  // 채점 결과: r === true 정답 / false 오답 / null 미입력 — 문항은 scripts/assignment-data.js 한 벌
  var ROWS = RMAssign.Q.map(function (q) { return { name: q.name, lvl: q.lvl, text: q.text, r: RMAssign.isCorrect(q) }; });

  var N = ROWS.length;
  var correct = ROWS.filter(function (x) { return x.r === true; }).length;
  var wrong = ROWS.filter(function (x) { return x.r === false; }).length;
  var none = ROWS.filter(function (x) { return x.r === null; }).length;
  var score = Math.round(correct / N * 100);

  // 요약
  document.getElementById('scoreN').textContent = score;
  document.getElementById('cCorrect').innerHTML = correct + ' <small>/ ' + N + '</small>';
  document.getElementById('cWrong').innerHTML = wrong + ' <small>문항</small>';
  document.getElementById('cNone').innerHTML = none + ' <small>문항</small>';

  // 채점표
  function gradeCell(r) {
    if (r === true) return '<span class="grade grade--o"><span class="grade__ic">' + ICO.check + '</span>정답</span>';
    if (r === false) return '<span class="grade grade--x"><span class="grade__ic">' + ICO.x + '</span>오답</span>';
    return '<span class="grade grade--none">미입력</span>';
  }
  var head = '<div class="trow trow--head"><span class="tc-center">문항</span><span>유형명</span>' +
    '<span class="tc-center">난이도</span><span>발문</span><span class="tc-center">채점 결과</span></div>';
  var body = ROWS.map(function (q, i) {
    return '<div class="trow" data-q="' + i + '" title="이 문제 해설 보기"><span class="tc-num">' + (i + 1) + '</span>' +
      '<span class="tc-name">' + q.name + '</span>' +
      '<span class="lv lv--' + q.lvl + '">' + q.lvl + '</span>' +
      '<span class="tc-text">' + q.text + '</span>' +
      gradeCell(q.r) + '</div>';
  }).join('');
  document.getElementById('rtable').innerHTML = head + body;

  // 채점표 행 클릭 → 해당 문항 해설로 이동
  document.getElementById('rtable').addEventListener('click', function (e) {
    var row = e.target.closest('.trow[data-q]'); if (!row) return;
    window.location.href = 'assignment/explain.html?q=' + row.dataset.q;
  });

  // ── 하단 버튼 ──
  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }
  document.getElementById('homeBtn').addEventListener('click', function () { window.location.href = 'assignment/home.html'; });
  document.getElementById('applyBtn').addEventListener('click', function () {
    // 시험 대비 홈으로 이동하며, 방금 과제와 연계된 유형 칩을 강조하도록 신호 전달
    showToast('시험 대비에 반영되었습니다.');
    setTimeout(function () { window.location.href = 'exam/home.html?linked=1'; }, 650);
  });
  document.getElementById('explainBtn').addEventListener('click', function () { window.location.href = 'assignment/explain.html'; });

  // ── 라이트/다크 토글 (localStorage 'rm-theme-choice'로 화면 간 유지) ──
  function applyTheme(t, save) {
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    if (save) { try { localStorage.setItem('rm-theme-choice', t); } catch (e) {} }
  }
  var savedTheme = 'light';
  try { savedTheme = localStorage.getItem('rm-theme-choice') === 'dark' ? 'dark' : 'light'; } catch (e) {}
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
})();
