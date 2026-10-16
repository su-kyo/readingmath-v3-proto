/* =========================================================================
   과제 센터 · 홈 (assignment-home) — 리파인
   · 요약(평균점수 링 히어로 + KPI 3) / 진행중 / 미시작 / 완료 리스트를 데이터로 렌더
   · 아이콘 인라인 SVG(currentColor)
   ========================================================================= */
(function () {
  var IC = {
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>'
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
      '<circle cx="40" cy="40" r="34" fill="none" class="ring__track" stroke-width="7"/>' +
      '<circle cx="40" cy="40" r="34" fill="none" class="ring__val" stroke-width="7" stroke-linecap="round" ' +
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
      '<button class="btn btn--go" data-go="assignment/solve.html">계속 풀기' + IC.arrow + '</button>' +
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
      '<button class="btn btn--do" data-go="assignment/solve.html">과제 풀기' + IC.arrow + '</button>' +
    '</article>';
  }).join('');

  // ── 완료 ──
  document.getElementById('cntDone').textContent = DONE_TOTAL;
  var doneHtml = DONE.map(function (d) {
    return '<article class="card">' +
      '<div class="card__main"><span class="card__title">' + d.title + '</span>' +
        '<div class="metarow"><span class="unit">' + d.unit + '</span>' + sep() + metaDate('출제', d.open) + sep() + metaDate('제출', d.sent) +
          '<span class="meta">· 정답 <b class="meta__ok">' + d.correct + '</b>/' + d.total + '문항</span>' +
        '</div>' +
      '</div>' +
      '<div class="scoreblk"><div class="scoreblk__col">' +
        '<span class="badge-done">' + IC.check + '제출완료</span>' +
        '<span class="scoreblk__num">' + d.score + '<small>점</small></span></div>' +
        '<button class="btn btn--result" data-go="assignment/result.html">결과 보기</button></div>' +
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
    if (go === 'assignment/solve.html' || go === 'assignment/result.html') { window.location.href = go; return; }
    b.blur();
  });
  document.querySelectorAll('.mbtn').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.mbtn').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });
})();
