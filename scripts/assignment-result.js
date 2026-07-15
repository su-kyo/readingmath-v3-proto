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

  // 채점 결과: r === true 정답 / false 오답 / null 미입력
  var ROWS = [
    { name: '일차부등식의 해 구하기', lvl: '기본', text: '부등식 3x − 2 > 7 을 만족하는 자연수 x 중에서 가장 작은 수를 구하시오.', r: true },
    { name: '부등식의 활용 — 개수', lvl: '기본', text: '한 자루에 800원인 연필을 x자루 사려고 합니다. 5000원으로 살 수 있는 연필은 최대 몇 자루입니까?', r: true },
    { name: '일차부등식의 해', lvl: '실력', text: '일차부등식 2(x − 1) ≤ 3x + 4 의 해로 옳은 것을 고르시오.', r: true },
    { name: '산점도 해석', lvl: '실력', text: '다음 산점도는 학생 10명의 음악·미술 점수입니다. 미술 점수가 음악 점수보다 높은 학생은 몇 명입니까?', r: false },
    { name: '연립방정식의 해', lvl: '실력', text: '연립방정식 { x + y = 10, x − y = 2 } 의 해에서 x의 값을 구하시오.', r: true },
    { name: '방정식의 해와 미지수', lvl: '기본', text: 'x = 2, y = 1 이 방정식 ax + y = 7 의 해일 때, 상수 a의 값을 고르시오.', r: true },
    { name: '부등식의 활용 — 최솟값', lvl: '심화', text: '연속하는 세 자연수의 합이 60보다 큽니다. 가장 작은 자연수가 될 수 있는 최솟값을 구하시오.', r: false },
    { name: '일차부등식의 해', lvl: '실력', text: '일차부등식 −2x + 5 < 1 의 해로 옳은 것을 고르시오.', r: true },
    { name: '부등식을 만족하는 개수', lvl: '기본', text: '부등식 x/2 + 1 ≤ 4 를 만족하는 자연수 x는 모두 몇 개입니까?', r: true },
    { name: '연립방정식의 활용', lvl: '심화', text: '두 자연수의 합이 12이고 차가 4일 때, 두 수 중 큰 수를 고르시오.', r: false },
    { name: '일차부등식의 해', lvl: '실력', text: '일차부등식 4 − 3x ≥ −5 의 해로 옳은 것을 고르시오.', r: true },
    { name: '부등식의 활용 — 최솟값', lvl: '실력', text: '사과 x개를 3명이 똑같이 나누면 한 명당 5개보다 많습니다. x의 최솟값을 구하시오.', r: true },
    { name: '연립방정식의 해', lvl: '기본', text: '연립방정식 { 2x + y = 8, y = 2 } 에서 x의 값을 고르시오.', r: true },
    { name: '일차부등식의 해', lvl: '실력', text: '일차부등식 5x − 3 ≤ 2x + 9 의 해가 x ≤ a 일 때, 상수 a의 값을 구하시오.', r: true },
    { name: '일차부등식의 해', lvl: '실력', text: '일차부등식 0.3x − 0.5 > 0.1 의 해로 옳은 것을 고르시오.', r: true }
  ];

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
    return '<span class="grade" style="color:var(--faint)">미입력</span>';
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
    window.location.href = 'assignment-explain.html?q=' + row.dataset.q;
  });

  // ── 하단 버튼 ──
  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }
  document.getElementById('homeBtn').addEventListener('click', function () { window.location.href = 'assignment-home.html'; });
  document.getElementById('applyBtn').addEventListener('click', function () {
    // 시험 대비 홈으로 이동하며, 방금 과제와 연계된 유형 칩을 강조하도록 신호 전달
    showToast('시험 대비에 반영되었습니다.');
    setTimeout(function () { window.location.href = 'exam-home.html?linked=1'; }, 650);
  });
  document.getElementById('explainBtn').addEventListener('click', function () { window.location.href = 'assignment-explain.html'; });

  // ── 라이트/다크 토글 (localStorage 'rm-theme'로 화면 간 유지) ──
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem('rm-theme', t); } catch (e) {}
  }
  var savedTheme = 'light';
  try { savedTheme = localStorage.getItem('rm-theme') === 'dark' ? 'dark' : 'light'; } catch (e) {}
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
