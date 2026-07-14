/* =========================================================================
   과제 센터 · 홈 (assignment-home) — 리파인
   · 요약(평균점수 링 히어로 + KPI 3) / 진행중 / 미시작 / 완료 리스트를 데이터로 렌더
   · 아이콘 인라인 SVG(currentColor)
   ========================================================================= */
(function () {
  var IC = {
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4zM7 6H4.5a1.5 1.5 0 0 0 0 5H7M17 6h2.5a1.5 1.5 0 0 1 0 5H17"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2zM9 13h6M9 17h4"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.01l-3-3"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7 13.5 15.5l-4-4L2 19M16 7h6v6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  // ── 요약 데이터 ──
  var AVG = 88, SUBMIT = 116, CORRECT = 101;
  var RATE = Math.round(CORRECT / SUBMIT * 100); // 정답률
  var KPIS = [
    { tone: 'indigo', ic: IC.trophy,      k: '완료 과제', v: '10', unit: '개' },
    { tone: 'blue',   ic: IC.doc,         k: '제출 문항', v: String(SUBMIT), unit: '문항' },
    { tone: 'green',  ic: IC.checkCircle, k: '정답 문항', v: String(CORRECT), unit: '문항' }
  ];

  // ── 과제 데이터 ──
  var ACTIVE = [
    { title: '일차부등식의 활용 실생활 문장제 극복 훈련', unit: '2단원 · 일차부등식과 연립방정식', open: '2026.05.20 19:00', pct: 40, done: 6, total: 15 },
    { title: '연립일차방정식의 풀이 — 가감법과 대입법 기본 연습', unit: '2단원 · 일차부등식과 연립방정식', open: '2026.05.20 17:00', pct: 75, done: 9, total: 12 }
  ];

  var PENDING = [
    { title: '유리수의 소수 표현과 순환소수 심화 문제 풀이', unit: '1단원 · 유리수와 순환소수', open: '2026.05.21 18:10', count: 10 },
    { title: '함수의 그래프 기초 훈련', unit: '3단원 · 좌표평면과 그래프', open: '2026.05.21 09:00', count: 8 }
  ];

  var DONE_TOTAL = 10;
  var DONE = [
    { title: '소인수분해 기본 개념 확인 평가', unit: '1단원 · 소인수분해', open: '2026.05.19 18:00', sent: '2026.05.19 19:30', correct: 8, total: 10, score: 80 },
    { title: '최대공약수와 최소공배수의 활용 실전', unit: '1단원 · 소인수분해', open: '2026.05.19 00:00', sent: '2026.05.19 01:20', correct: 7, total: 8, score: 88 },
    { title: '정수와 유리수의 사칙연산 타임어택', unit: '2단원 · 정수와 유리수', open: '2026.05.17 19:00', sent: '2026.05.17 20:00', correct: 9, total: 10, score: 90 }
  ];

  function sep() { return '<span class="sep"></span>'; }
  function metaDate(label, v) { return '<span class="meta">' + IC.calendar + label + ' <b>' + v + '</b></span>'; }

  // ── 요약 렌더: 링 히어로 + KPI 3 ──
  var C = 2 * Math.PI * 34, off = C * (1 - AVG / 100);
  var hero = '<div class="hero">' +
    '<div class="ring"><svg viewBox="0 0 80 80">' +
      '<circle cx="40" cy="40" r="34" fill="none" stroke="#EAEEF6" stroke-width="7"/>' +
      '<circle cx="40" cy="40" r="34" fill="none" style="stroke:var(--s-green)" stroke-width="7" stroke-linecap="round" ' +
        'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
    '</svg><span class="ring__c"><b>' + AVG + '</b></span></div>' +
    '<div class="hero__body"><span class="hero__k">평균 점수</span>' +
    '<span class="hero__v">' + AVG + '<small>점</small></span>' +
    '<span class="hero__sub">' + IC.trend + '정답률 ' + RATE + '%</span></div></div>';
  var kpis = KPIS.map(function (s) {
    return '<div class="kpi"><span class="kpi__ic t-' + s.tone + '">' + s.ic + '</span>' +
      '<span class="kpi__b"><span class="kpi__k">' + s.k + '</span>' +
      '<span class="kpi__v">' + s.v + '<small>' + s.unit + '</small></span></span></div>';
  }).join('');
  document.getElementById('summary').innerHTML = hero + kpis;

  // ── 진행중 ──
  document.getElementById('cntActive').textContent = ACTIVE.length;
  document.getElementById('activeList').innerHTML = ACTIVE.map(function (a) {
    return '<article class="card">' +
      '<div class="card__main"><span class="card__title">' + a.title + '</span>' +
        '<div class="metarow"><span class="unit">' + a.unit + '</span>' + sep() + metaDate('출제', a.open) + '</div>' +
      '</div>' +
      '<div class="prog"><div class="prog__top">' +
        '<span class="prog__k">' + IC.play + '풀이 진행률</span>' +
        '<span class="prog__v">' + a.pct + '%<small>' + a.done + '/' + a.total + '</small></span></div>' +
        '<div class="track"><i style="width:' + a.pct + '%"></i></div></div>' +
      '<button class="btn btn--go" data-go="assignment-solve.html">계속 풀기' + IC.arrow + '</button>' +
    '</article>';
  }).join('');

  // ── 미시작 ──
  document.getElementById('cntPending').textContent = PENDING.length;
  document.getElementById('pendingList').innerHTML = PENDING.map(function (p) {
    return '<article class="card">' +
      '<div class="card__main"><span class="card__title">' + p.title + '</span>' +
        '<div class="metarow"><span class="unit">' + p.unit + '</span>' + sep() + metaDate('출제', p.open) + '</div>' +
      '</div>' +
      '<span class="qcount">' + IC.lock + '<span>문항수</span><b>' + p.count + '문항</b></span>' +
      '<button class="btn btn--do" data-go="assignment-solve.html">과제 풀기' + IC.arrow + '</button>' +
    '</article>';
  }).join('');

  // ── 완료 ──
  document.getElementById('cntDone').textContent = DONE_TOTAL;
  var doneHtml = DONE.map(function (d) {
    return '<article class="card">' +
      '<div class="card__main"><span class="card__title">' + d.title + '</span>' +
        '<div class="metarow"><span class="unit">' + d.unit + '</span>' + sep() + metaDate('출제', d.open) + sep() + metaDate('제출', d.sent) +
          '<span class="meta">· 정답 <b style="color:var(--s-green)">' + d.correct + '</b>/' + d.total + '문항</span>' +
        '</div>' +
      '</div>' +
      '<div class="scoreblk"><div class="scoreblk__col">' +
        '<span class="badge-done">' + IC.check + '제출완료</span>' +
        '<span class="scoreblk__num">' + d.score + '<small>점</small></span></div>' +
        '<button class="btn btn--result" data-go="assignment-result.html">결과 보기</button></div>' +
    '</article>';
  }).join('');
  if (DONE_TOTAL > DONE.length) {
    doneHtml += '<button class="more">완료 과제 ' + DONE_TOTAL + '개 전체 보기</button>';
  }
  document.getElementById('doneList').innerHTML = doneHtml;

  // ── 상호작용 ──
  document.querySelector('.app').addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]'); if (!b) return;
    var go = b.dataset.go;
    if (go === 'assignment-solve.html' || go === 'assignment-result.html') { window.location.href = go; return; }
    b.blur();
  });
  document.querySelectorAll('.mbtn').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.mbtn').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });
})();
