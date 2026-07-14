/* =========================================================================
   과제 센터 · 풀이 화면 (assignment-solve)
   · 15문항(객관식/주관식 혼합) · OMR 답안표(현재/완료/미풀이) · 이전/다음/제출
   · 풀이 화면은 채점하지 않고 답만 수집 → 제출 시 결과 화면으로
   ========================================================================= */
(function () {
  var IC = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3"/></svg>'
  };

  // 산점도 SVG (문항 4용)
  function scatter() {
    var pts = [[1,2],[2,1],[2,3],[3,3],[3,4],[4,5],[4,3],[5,5],[3,2],[5,4]];
    var ax = 40, ay = 20, w = 250, h = 160, step = 46, dots = '';
    pts.forEach(function (p) {
      var cx = ax + p[0] * step * 0.86, cy = ay + h - p[1] * step * 0.62;
      dots += '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="4" fill="#1E1E1E"/>';
    });
    var grid = '';
    for (var i = 1; i <= 5; i++) {
      var gx = ax + i * step * 0.86;
      grid += '<line x1="' + gx + '" y1="' + ay + '" x2="' + gx + '" y2="' + (ay + h) + '" stroke="#E6E6E6"/>';
      var gy = ay + h - i * step * 0.62;
      grid += '<line x1="' + ax + '" y1="' + gy + '" x2="' + (ax + w) + '" y2="' + gy + '" stroke="#E6E6E6"/>';
    }
    return '<svg viewBox="0 0 320 214" xmlns="http://www.w3.org/2000/svg">' + grid +
      '<line x1="' + ax + '" y1="' + ay + '" x2="' + ax + '" y2="' + (ay + h) + '" stroke="#1E1E1E" stroke-width="2"/>' +
      '<line x1="' + ax + '" y1="' + (ay + h) + '" x2="' + (ax + w) + '" y2="' + (ay + h) + '" stroke="#1E1E1E" stroke-width="2"/>' +
      dots +
      '<text x="' + (ax + w) + '" y="' + (ay + h + 16) + '" font-size="11" text-anchor="end" fill="#1E1E1E">음악(점)</text>' +
      '<text x="' + (ax - 6) + '" y="' + (ay - 6) + '" font-size="11" fill="#1E1E1E">미술(점)</text></svg>';
  }

  // ── 15문항 ──
  var Q = [
    { type: 'mc', lvl: '기본', name: '일차부등식의 해 구하기', text: '부등식 3x − 2 > 7 을 만족하는 자연수 x 중에서 가장 작은 수를 구하시오.', opts: ['2', '3', '4', '5', '6'], answer: 2 },
    { type: 'short', lvl: '기본', name: '부등식의 활용 — 개수', text: '한 자루에 800원인 연필을 x자루 사려고 합니다. 5000원으로 살 수 있는 연필은 최대 몇 자루입니까?', unit: '자루', answer: '6' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 2(x − 1) ≤ 3x + 4 의 해로 옳은 것을 고르시오.', opts: ['x ≥ −6', 'x ≤ −6', 'x > −6', 'x < 6', 'x ≥ 6'], answer: 0 },
    { type: 'mc', lvl: '실력', name: '산점도 해석', text: '다음 산점도는 학생 10명의 음악·미술 점수입니다. 미술 점수가 음악 점수보다 높은 학생은 몇 명입니까?', image: scatter, opts: ['2명', '3명', '4명', '5명', '6명'], answer: 2 },
    { type: 'short', lvl: '실력', name: '연립방정식의 해', text: '연립방정식 { x + y = 10, x − y = 2 } 의 해에서 x의 값을 구하시오.', unit: '', answer: '6' },
    { type: 'mc', lvl: '기본', name: '방정식의 해와 미지수', text: 'x = 2, y = 1 이 방정식 ax + y = 7 의 해일 때, 상수 a의 값을 고르시오.', opts: ['1', '2', '3', '4', '5'], answer: 2 },
    { type: 'short', lvl: '심화', name: '부등식의 활용 — 최솟값', text: '연속하는 세 자연수의 합이 60보다 큽니다. 가장 작은 자연수가 될 수 있는 최솟값을 구하시오.', unit: '', answer: '20' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 −2x + 5 < 1 의 해로 옳은 것을 고르시오.', opts: ['x > 2', 'x < 2', 'x ≥ 2', 'x ≤ 2', 'x > −2'], answer: 0 },
    { type: 'short', lvl: '기본', name: '부등식을 만족하는 개수', text: '부등식 x/2 + 1 ≤ 4 를 만족하는 자연수 x는 모두 몇 개입니까?', unit: '개', answer: '6' },
    { type: 'mc', lvl: '심화', name: '연립방정식의 활용', text: '두 자연수의 합이 12이고 차가 4일 때, 두 수 중 큰 수를 고르시오.', opts: ['6', '7', '8', '9', '10'], answer: 2 },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 4 − 3x ≥ −5 의 해로 옳은 것을 고르시오.', opts: ['x ≤ 3', 'x ≥ 3', 'x < 3', 'x > 3', 'x ≤ −3'], answer: 0 },
    { type: 'short', lvl: '실력', name: '부등식의 활용 — 최솟값', text: '사과 x개를 3명이 똑같이 나누면 한 명당 5개보다 많습니다. x의 최솟값을 구하시오.', unit: '', answer: '16' },
    { type: 'mc', lvl: '기본', name: '연립방정식의 해', text: '연립방정식 { 2x + y = 8, y = 2 } 에서 x의 값을 고르시오.', opts: ['1', '2', '3', '4', '5'], answer: 2 },
    { type: 'short', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 5x − 3 ≤ 2x + 9 의 해가 x ≤ a 일 때, 상수 a의 값을 구하시오.', unit: '', answer: '4' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 0.3x − 0.5 > 0.1 의 해로 옳은 것을 고르시오.', opts: ['x > 2', 'x < 2', 'x > 3', 'x ≥ 2', 'x > −2'], answer: 0 }
  ];

  var N = Q.length;
  var answers = new Array(N).fill(null); // 객관식=인덱스, 주관식=문자열
  var cur = 0;
  var openShort = -1; // 답안표에서 키패드가 펼쳐진 주관식 문항 (−1=없음)

  // ── 키패드 공용 (문제 패널 · 답안표 공유) ──
  function keypadHTML() {
    var keys = ['7', '8', '9', 'back', '4', '5', '6', 'clear', '1', '2', '3', 'minus', '0', 'dot'];
    return keys.map(function (k) {
      var fn = (k === 'back' || k === 'clear');
      var label = k === 'back' ? IC.back : k === 'clear' ? 'C' : k === 'minus' ? '−' : k === 'dot' ? '.' : k;
      var span = k === '0' ? ' style="grid-column:span 2"' : '';
      return '<button class="kp' + (fn ? ' kp--fn' : '') + '" data-k="' + k + '"' + span + '>' + label + '</button>';
    }).join('');
  }
  // 키 입력을 현재 값 문자열에 적용 (숫자 최대 6자리)
  function applyKey(v, key) {
    if (key === 'back') v = v.slice(0, -1);
    else if (key === 'clear') v = '';
    else if (key === 'minus') v = (v.charAt(0) === '−') ? v.slice(1) : '−' + v;
    else if (key === 'dot') { if (v.indexOf('.') === -1 && v !== '' && v !== '−') v += '.'; }
    else if (v.replace('−', '').replace('.', '').length < 6) v += key;
    return v;
  }

  var qpanel = document.getElementById('qpanel');
  var omrGrid = document.getElementById('omrGrid');
  var progText = document.getElementById('progText');
  var progBar = document.getElementById('progBar');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var submitBtn = document.getElementById('submitBtn');

  function answered(i) { return answers[i] !== null && answers[i] !== ''; }
  function doneCount() { var c = 0; for (var i = 0; i < N; i++) if (answered(i)) c++; return c; }

  // ── OMR 그리드 ──
  function buildGrid() {
    var h = '';
    for (var i = 0; i < N; i++) h += '<button class="cell" data-i="' + i + '">' + (i + 1) + '</button>';
    omrGrid.innerHTML = h;
  }
  function refreshGrid() {
    Array.prototype.forEach.call(omrGrid.children, function (c, i) {
      c.classList.toggle('is-done', answered(i));
      c.classList.toggle('is-cur', i === cur);
    });
    var d = doneCount();
    progText.textContent = d + '/' + N;
    progBar.style.width = (d / N * 100) + '%';
    submitBtn.disabled = d < N;
  }

  // ── 문제 렌더 ──
  function render() {
    var q = Q[cur];
    var html = '<div class="qmeta"><span class="qmeta__n">문제 ' + (cur + 1) + '</span>' +
      '<span class="qmeta__type">' + q.name + '</span>' +
      '<span class="lvl lvl--' + q.lvl + '">' + q.lvl + '</span></div>' +
      '<h1 class="qtext">' + q.text + '</h1>';

    if (q.image) html += '<div class="qimg">' + q.image() + '</div>';

    if (q.type === 'short') {
      var val = answers[cur] == null ? '' : answers[cur];
      html += '<div class="short"><div class="short__field"><span class="short__val" id="shortVal">' + val + '</span>' +
        (q.unit ? '<span class="short__unit">' + q.unit + '</span>' : '') + '</div>' +
        '<div class="keypad" id="keypad">' + keypadHTML() + '</div></div>';
    } else {
      var many = q.opts.some(function (o) { return o.length > 8; });
      html += '<div class="opts' + (many ? ' opts--col' : '') + '" id="opts">' +
        q.opts.map(function (o, i) {
          var sel = answers[cur] === i ? ' is-sel' : '';
          return '<button class="opt' + sel + '" data-i="' + i + '"><span class="opt__n">' + (i + 1) + '</span>' +
            '<span class="opt__t">' + o + '</span></button>';
        }).join('') + '</div>';
    }

    qpanel.innerHTML = html;
    qpanel.scrollTop = 0;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === N - 1;
    refreshGrid();
  }

  // ── 답 입력 ──
  qpanel.addEventListener('click', function (e) {
    var opt = e.target.closest('.opt');
    if (opt) { answers[cur] = +opt.dataset.i; render(); return; }
    var k = e.target.closest('.kp');
    if (k) {
      var v = applyKey(answers[cur] == null ? '' : String(answers[cur]), k.dataset.k);
      answers[cur] = v === '' ? null : v;
      var el = document.getElementById('shortVal'); if (el) el.textContent = v;
      refreshGrid();
    }
  });

  // ── OMR 이동 ──
  omrGrid.addEventListener('click', function (e) {
    var c = e.target.closest('.cell'); if (!c) return;
    cur = +c.dataset.i; render();
  });

  // ── 답안표 입력 오버레이 (풀이 현황판 / 답안표 토글) ──
  var seg = document.getElementById('seg');
  var sheet = document.getElementById('sheet');
  var sheetBackdrop = document.getElementById('sheetBackdrop');
  var sheetList = document.getElementById('sheetList');
  var checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  function setSeg(which) {
    Array.prototype.forEach.call(seg.children, function (b) { b.classList.toggle('is-active', b.dataset.seg === which); });
  }
  var chevIcon = '<svg class="qrow__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  function renderSheet(preserveScroll) {
    var st = preserveScroll ? sheetList.scrollTop : 0;
    sheetList.innerHTML = Q.map(function (q, i) {
      var done = answered(i), body, pad = '';
      if (q.type === 'short') {
        // 주관식 = 누르면 그 아래로 키패드(계산기) 펼침 (점프 대신 인라인 입력)
        var open = openShort === i;
        var v = answered(i) ? (answers[i] + (q.unit ? (' ' + q.unit) : '')) : '답을 입력해주세요';
        body = '<button class="qrow__short' + (answered(i) ? '' : ' empty') + (open ? ' is-open' : '') + '" data-short="' + i + '">' +
          '<span class="qrow__short__v">' + v + '</span>' + chevIcon + '</button>';
        if (open) {
          var val = answers[i] == null ? '' : answers[i];
          pad = '<div class="qrow__pad" data-pad="' + i + '">' +
            '<div class="short__field"><span class="short__val">' + val + '</span>' +
            (q.unit ? '<span class="short__unit">' + q.unit + '</span>' : '') + '</div>' +
            '<div class="keypad">' + keypadHTML() + '</div></div>';
        }
      } else {
        body = '<div class="qrow__opts">' + q.opts.map(function (o, oi) {
          var on = answers[i] === oi;
          return '<button class="bub' + (on ? ' is-on' : '') + '" data-q="' + i + '" data-o="' + oi + '">' + (on ? checkIcon : (oi + 1)) + '</button>';
        }).join('') + '</div>';
      }
      return '<div class="qrow' + (done ? ' is-done' : '') + '"><span class="qrow__n">' + (i + 1) + '</span>' + body + '</div>' + pad;
    }).join('');
    if (preserveScroll) sheetList.scrollTop = st;
  }
  function openSheet() { openShort = -1; renderSheet(); sheet.classList.add('is-open'); sheetBackdrop.classList.add('is-open'); sheet.setAttribute('aria-hidden', 'false'); setSeg('sheet'); }
  function closeSheet() { sheet.classList.remove('is-open'); sheetBackdrop.classList.remove('is-open'); sheet.setAttribute('aria-hidden', 'true'); setSeg('board'); }

  seg.addEventListener('click', function (e) {
    var b = e.target.closest('.seg__btn'); if (!b) return;
    if (b.dataset.seg === 'sheet') openSheet(); else closeSheet();
  });
  sheetBackdrop.addEventListener('click', closeSheet);
  document.getElementById('sheetClose').addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeSheet(); });

  sheetList.addEventListener('click', function (e) {
    var bub = e.target.closest('.bub');
    if (bub) { answers[+bub.dataset.q] = +bub.dataset.o; renderSheet(true); refreshGrid(); if (+bub.dataset.q === cur) render(); return; }
    // 주관식 인라인 키패드 입력
    var pad = e.target.closest('.qrow__pad');
    if (pad) {
      var k = e.target.closest('.kp'); if (!k) return;
      var i = +pad.dataset.pad;
      var v = applyKey(answers[i] == null ? '' : String(answers[i]), k.dataset.k);
      answers[i] = v === '' ? null : v;
      // 값·행 표시·현황판 갱신 (스크롤 유지, 열림 상태 유지)
      pad.querySelector('.short__val').textContent = v;
      var row = sheetList.querySelector('.qrow__short[data-short="' + i + '"]');
      if (row) {
        row.querySelector('.qrow__short__v').textContent = answered(i) ? (answers[i] + (Q[i].unit ? (' ' + Q[i].unit) : '')) : '답을 입력해주세요';
        row.classList.toggle('empty', !answered(i));
        row.closest('.qrow').classList.toggle('is-done', answered(i));
      }
      refreshGrid();
      if (i === cur) render();
      return;
    }
    // 주관식 행 = 키패드 펼침/접힘 토글
    var sh = e.target.closest('.qrow__short');
    if (sh) {
      var si = +sh.dataset.short;
      openShort = (openShort === si ? -1 : si);
      renderSheet(true);
      if (openShort === si) {
        var p = sheetList.querySelector('.qrow__pad[data-pad="' + si + '"]');
        if (p) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      return;
    }
  });

  // ── 네비게이션 ──
  prevBtn.addEventListener('click', function () { if (cur > 0) { cur--; render(); } });
  nextBtn.addEventListener('click', function () { if (cur < N - 1) { cur++; render(); } });

  // ── 토스트 ──
  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }
  document.getElementById('scratchBtn').addEventListener('click', function () { showToast('연습장은 준비 중이에요.'); });
  submitBtn.addEventListener('click', function () {
    if (submitBtn.disabled) return;
    showToast('제출되었습니다.');
    setTimeout(function () { window.location.href = 'assignment-result.html'; }, 600);
  });

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

  // 초기화
  buildGrid();
  render();
})();
