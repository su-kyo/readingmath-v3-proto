/* =========================================================================
   개념 다지기 · 문항 엔진 (기초 연산 엔진 포크)
   유형이 섞여 있음: 빈칸(인라인 채우기) · 객관식(번호/텍스트) · 주관식(1개/분수)
   빈칸/주관식은 계산기 키패드로 입력. 채점하기 → 즉시 채점 → 다음 문제.
   ========================================================================= */
(function () {
  function exText(items) { return { kind: 'text', items: items }; }
  function exSkel(label) { return { kind: 'skel', label: label }; }

  // 개념 다지기 = 빈칸·객관식·주관식 혼합 (세 자리 수의 뺄셈)
  var PROBLEMS = [
    { type: 'blank',
      q: '752 − 238을 여러 가지 방법으로 계산하려고 합니다. 빈칸에 알맞은 수를 써넣으세요.',
      html:
        '<p class="qstep"><span class="qstep__no">(1)</span> 각 수를 몇백 몇십으로 어림하면 752는 750, 238은 <span class="dblank"></span> 이므로 두 수의 차는 약 <span class="dblank"></span> 입니다.</p>' +
        '<p class="qstep"><span class="qstep__no">(2)</span> 일의 자리부터 계산하면 12 − 8 = <span class="dblank"></span>, 40 − 30 = 10, 700 − 200 = 500 이므로 752 − 238 = <span class="dblank"></span> 입니다.</p>' +
        '<p class="qstep"><span class="qstep__no">(3)</span> 700 − 200 = 500, 52 − 38 = <span class="dblank"></span> 이므로 752 − 238 = <span class="dblank"></span> 입니다.</p>',
      answers: ['240', '510', '4', '514', '14', '514'] },

    { type: 'mc-text',
      q: '752 − 238을 어림셈으로 구할 때 가장 알맞은 식을 고르세요.',
      ex: null, options: ['750 − 240', '760 − 240', '750 − 230'], answer: 0 },

    { type: 'short-1',
      q: '752 − 238 을 계산하면 얼마입니까?',
      ex: null, answer: '514' },

    { type: 'mc-num',
      q: '다음 계산 중 값이 가장 큰 것의 번호를 고르세요.',
      ex: exText(['① 823 − 214', '② 645 − 158', '③ 700 − 236', '④ 512 − 129']),
      options: 4, answer: 0 },

    { type: 'blank',
      q: '세로셈에서 빈칸에 알맞은 수를 써넣으세요. (462 − 247)',
      html:
        '<div class="vsub">' +
        '<span></span><span>4</span><span>6</span><span>2</span>' +
        '<span class="vsub__op">−</span><span>2</span><span>4</span><span>7</span>' +
        '<div class="vsub__line"></div>' +
        '<span></span><span class="dblank"></span><span class="dblank"></span><span class="dblank"></span>' +
        '</div>',
      answers: ['2', '1', '5'] },

    /* 수식 라이브러리(KaTeX) 본보기 — Phase 6-④.
       검증 포인트: ① 온전한 세로 분수 ② 미지수·루트·지수 ③ 수식 '안'에 빈칸을 심고
       공용 키패드로 입력 → 기존 blank 채점이 그대로 동작. */
    { type: 'blank',
      q: '수식의 빈칸에 알맞은 수를 써넣으세요. (수식 렌더 본보기 — 분수·미지수·루트·지수)',
      tex: [
        'x^{2} = \\sqrt{81} + 7 \\quad\\Rightarrow\\quad x = 4',
        '\\dfrac{\\htmlClass{dblank}{?}}{8} + \\dfrac{3}{8} = \\dfrac{5}{8}'
      ],
      answers: ['2'] }
  ];

  var TOTAL = PROBLEMS.length;
  var results = new Array(TOTAL);
  var idx = 0, selected = null, graded = false;

  var qtabs = document.getElementById('qtabs');
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  var problemBody = document.getElementById('problemBody');
  var qEl = document.getElementById('q');
  var gradeBtn = document.getElementById('gradeBtn');
  var nextStepBtn = document.getElementById('nextStepBtn');
  var guide = window.RMGuide || { set: function () {} };
  var revealPending = false;   // 채점 뒤 오답을 눌러 정답을 열기 전
  function setCta(t) { gradeBtn.querySelector('span').textContent = t; }
  /* 콘솔바 안내(RM-PART-07) — 입력 전: 객관식은 「골라」, 칸이 여럿이면 「모든」. 다 채우면 숨긴다. */
  function guideInput() {
    var p = PROBLEMS[idx];
    if (/^mc-/.test(p.type)) { guide.set(selected == null ? '답을 골라 주세요!' : ''); return; }
    var fields = qEl.querySelectorAll('.sinput, .dblank'), empty = 0;
    fields.forEach(function (x) { if (!getV(x).trim()) empty++; });
    guide.set(!empty ? '' : fields.length > 1 ? '모든 답안을 입력해 주세요!' : '답안을 입력해 주세요!');
  }
  var opsScroll = document.getElementById('opsScroll');

  // 문제 카드 열고 접기
  if (problemHead) problemHead.addEventListener('click', function () {
    if (!problem.classList.contains('is-collapsible')) return;
    problem.classList.toggle('is-collapsed');
  });

  function updateFade() {
    var wrap = opsScroll.parentElement;
    wrap.classList.toggle('has-more', opsScroll.scrollTop + opsScroll.clientHeight < opsScroll.scrollHeight - 4);
    wrap.classList.toggle('has-more-top', opsScroll.scrollTop > 4);
  }
  opsScroll.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---- 입력값 접근: input(.sinput)과 span(.dblank) 통합 ---- */
  function getV(node) { return node.tagName === 'INPUT' ? node.value : (node.dataset.val || ''); }
  function setV(node, v) {
    if (node.tagName === 'INPUT') { node.value = v; }
    else { node.dataset.val = v; node.textContent = v; node.classList.toggle('is-filled', !!v); }
  }

  /* ---- 주관식/빈칸 숫자 키패드 ---- */
  var pad = document.getElementById('keypad');
  pad.innerHTML = window.RMKeypad.html();          /* 키 구성 정본 = scripts/keypad.js */
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input, reveal) {   /* 자리 = scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위, 입력칸 아래 12px 기본 · 분수 칸은 옆 먼저 */
    if (!window.RMPopPlace.place(pad, input, { reveal: reveal, side: true, sideFirst: !!input.closest('.fraction, .mfrac') })) closePad();
  }
  function openPad(node) {
    activeInput = node;
    kpDisplay.textContent = getV(node) || '0';
    qEl.querySelectorAll('.sinput, .dblank').forEach(function (x) { x.classList.remove('is-active-input'); });
    node.classList.add('is-active-input');
    pad.classList.add('is-open'); positionPad(node, true);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('[data-k]').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k;
      if (k === 'ok') { closePad(); return; }
      var v = window.RMKeypad.apply(getV(activeInput), k);
      setV(activeInput, v); kpDisplay.textContent = v || '0'; checkFilled();
    });
  });
  document.addEventListener('click', function (e) {
    if (pad.classList.contains('is-open') && !e.target.closest('.sinput') && !e.target.closest('.dblank')) closePad();
  });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });
  document.addEventListener('scroll', function () { if (activeInput) positionPad(activeInput); }, true);   // 문제 영역을 스크롤하면 따라가고, 입력칸이 영역 밖으로 나가면 닫는다

  /* ---- 문제 번호탭 (헤더) — 현재/정답/오답 상태. 정오답은 아이콘(색맹 접근성) ---- */
  var ICO_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
  var ICO_NO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICO_PART = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3l5.5 9.5h-11z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';   // 일부만 맞음 (개발 서버에서 받아옴, 2026-10-15)
  function renderTabs() {
    qtabs.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var cls = 'qtab', label = String(i + 1);
      if (results[i] === 'correct') { cls += ' is-correct'; label = ICO_OK; }
      else if (results[i] === 'wrong') { cls += ' is-wrong'; label = ICO_NO; }
      else if (results[i] === 'partial') { cls += ' is-partial'; label = ICO_PART; }
      else if (i === idx) cls += ' is-active';
      else if (i < idx) cls += ' is-done';
      qtabs.appendChild(el('span', cls, label));
    }
  }

  /* ---- 보기 ---- */
  function renderEx(ex) {
    if (!ex) return null;
    var box = el('div', 'ex');
    if (ex.kind === 'text') { var list = el('div', 'ex__list'); ex.items.forEach(function (t) { list.appendChild(el('div', null, t)); }); box.appendChild(list); }
    else { box.appendChild(el('div', 'ex__skel', ex.label || '이미지')); }
    return box;
  }

  /* ---- 문제 렌더 ---- */
  function renderQ() {
    selected = null; graded = false;
    closePad();
    qEl.innerHTML = '';
    problemBody.innerHTML = '';
    problem.classList.remove('is-collapsed');   // 새 문제 = 문제 카드 열림
    opsScroll.scrollTop = 0;
    var p = PROBLEMS[idx];

    // 문제 카드 본문 = 지시문 + 보기
    problemBody.appendChild(el('div', 'q__text', p.q));
    var exb = renderEx(p.ex); if (exb) problemBody.appendChild(exb);

    // 풀이 영역 = 입력(빈칸/객관식/주관식)
    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') qEl.appendChild(renderMC(p));
    else if (p.type === 'blank') qEl.appendChild(renderBlank(p));
    else if (p.type === 'short-1') qEl.appendChild(renderShort(p, 1));
    else if (p.type === 'short-2') qEl.appendChild(renderShort(p, 2));
    else if (p.type === 'fraction') qEl.appendChild(renderFraction(p));
    if (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction') qEl.appendChild(el('div', 'ans-correct'));

    gradeBtn.hidden = false;
    gradeBtn.disabled = true;
    setCta('채점하기');
    revealPending = false;

    renderTabs();
    guideInput();
    requestAnimationFrame(updateFade);
  }

  function renderMC(p) {
    var count = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'qopts-grid' : 'qopts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'qopt');
      if (p.type === 'mc-num') { opt.classList.add('qopt--num'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('qopt--img'); opt.appendChild(el('span', 'qopt__img')); }
      else { opt.classList.add('qopt--text'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); opt.appendChild(el('span', null, p.options[i])); }
      (function (i, opt) {
        opt.addEventListener('click', function () {
          if (graded) return;
          wrap.querySelectorAll('.qopt').forEach(function (o) { o.classList.remove('is-selected'); });
          opt.classList.add('is-selected'); selected = i;
          gradeBtn.disabled = false;
          guide.set('');
        });
      })(i, opt);
      wrap.appendChild(opt);
    }
    return wrap;
  }

  /* ---- 빈칸(인라인 채우기) ---- */
  function renderBlank(p) {
    var box = el('div', 'qblank', p.html || '');
    if (p.tex && window.katex) {
      box.classList.add('qblank--math');
      p.tex.forEach(function (src) {
        var line = el('div', 'mathline');
        /* trust: \htmlClass 만 허용 — 수식 안에 입력 칸(span.dblank)을 심는 통로 */
        window.katex.render(src, line, { displayMode: true, strict: false,
          trust: function (ctx) { return ctx.command === '\\htmlClass'; } });
        box.appendChild(line);
      });
    }
    box.querySelectorAll('.dblank').forEach(function (b, i) {
      b.dataset.i = i;
      b.addEventListener('click', function () { if (!graded) openPad(this); });
    });
    return box;
  }

  function renderShort(p, n) {
    var row = el('div', 'answer-row');
    for (var i = 0; i < n; i++) {
      var field = el('div', 'sfield');
      if (p.tags) field.appendChild(el('span', 'sfield__tag', p.tags[i]));
      var inp = el('input', 'sinput'); inp.type = 'text'; inp.readOnly = true; inp.inputMode = 'none'; inp.dataset.i = i;
      inp.addEventListener('click', function () { if (!graded) openPad(this); });
      field.appendChild(inp); row.appendChild(field);
    }
    return row;
  }

  function renderFraction(p) {
    var row = el('div', 'answer-row');
    var fr = el('div', 'fraction');
    var num = el('input', 'sinput'); num.type = 'text'; num.readOnly = true; num.inputMode = 'none'; num.dataset.i = 'num';
    var bar = el('div', 'fraction__bar');
    var den = el('input', 'sinput'); den.type = 'text'; den.readOnly = true; den.inputMode = 'none'; den.dataset.i = 'den';
    [num, den].forEach(function (x) { x.addEventListener('click', function () { if (!graded) openPad(this); }); });
    fr.appendChild(num); fr.appendChild(bar); fr.appendChild(den); row.appendChild(fr);
    return row;
  }

  function checkFilled() {
    var fields = qEl.querySelectorAll('.sinput, .dblank'), all = fields.length > 0;
    fields.forEach(function (x) { if (!getV(x).trim()) all = false; });
    gradeBtn.disabled = !all;
    guideInput();
  }

  /* ---- 채점 / 다음 ---- */
  gradeBtn.addEventListener('click', function () { if (!graded) grade(); else next(); });

  /* 채점 후 오답 빈칸 토글: 같은 칸에서 내 답 ↔ 정답 (병렬 표시 아님 · 취소선 없음) */
  qEl.addEventListener('click', function (e) {
    if (!graded) return;
    var w = e.target.closest('.dblank.is-wrong, .qopt.is-wrong, .sinput.is-wrong');
    if (!w) return;
    if (revealPending) { reveal(); return; }
    if (!w.classList.contains('dblank')) return;
    var showAns = w.classList.toggle('show-ans');
    w.textContent = showAns ? w.dataset.ans : w.dataset.my;
    w.title = showAns ? '눌러서 내 답 보기' : '눌러서 정답 보기';
  });

  function grade() {
    var p = PROBLEMS[idx], ok = false;
    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') {
      ok = (selected === p.answer);
      qEl.querySelectorAll('.qopt').forEach(function (o, i) {
        if (i === p.answer && ok) o.classList.add('is-correct');
        if (i === selected && !ok) o.classList.add('is-wrong');
      });
      qEl.querySelector('.qopts-row, .qopts-grid').classList.add('is-graded');
    } else if (p.type === 'blank') {
      ok = true;
      qEl.querySelectorAll('.dblank').forEach(function (b, i) {
        var my = getV(b);
        var good = norm(my) === norm(p.answers[i]);
        b.classList.add(good ? 'is-correct' : 'is-wrong');
        if (!good) {
          ok = false;
          // 정답은 칸 바깥에 병렬 표시하지 않는다. 같은 칸을 눌러 내 답 ↔ 정답 토글.
          b.dataset.my = my; b.dataset.ans = p.answers[i];
          b.title = '눌러서 정답 보기';
        }
      });
    } else if (p.type === 'short-1') {
      var v = qEl.querySelector('.sinput'); ok = norm(v.value) === norm(p.answer); mark(v, ok);
    } else if (p.type === 'short-2') {
      var ins = qEl.querySelectorAll('.sinput');
      var o0 = norm(ins[0].value) === norm(p.answer[0]), o1 = norm(ins[1].value) === norm(p.answer[1]);
      mark(ins[0], o0); mark(ins[1], o1); ok = o0 && o1;
    } else if (p.type === 'fraction') {
      var nu = qEl.querySelector('[data-i="num"]'), de = qEl.querySelector('[data-i="den"]');
      var on = norm(nu.value) === norm(p.answer.num), od = norm(de.value) === norm(p.answer.den);
      mark(nu, on); mark(de, od); ok = on && od;
    }
    // 오답 칸은 눌러야 정답이 열리므로 잠그지 않는다(.is-reveal) — 나머지만 잠근다
    qEl.querySelectorAll('.sinput').forEach(function (x) { if (x.classList.contains('is-wrong')) x.classList.add('is-reveal'); else x.disabled = true; });
    closePad();

    // 주관식 오답 → 정답 표시 (분수는 온전한 분수 형태)
    if (!ok && (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction')) {
      var txt = p.type === 'short-2' ? p.answer.join(', ')
        : p.type === 'fraction' ? '<span class="frac"><span class="frac__n">' + p.answer.num + '</span><span class="frac__d">' + p.answer.den + '</span></span>'
        : p.answer;
      var ac = qEl.querySelector('.ans-correct');
      if (ac) ac.innerHTML = '정답 <b>' + txt + '</b>';   // 보이는 건 reveal() 때
    }

    graded = true;
    // 칸이 여럿인 문항에서 일부만 맞으면 「일부」(△) — 채점 · 「다음」 잠금은 오답과 같다
    var some = qEl.querySelectorAll('.dblank.is-correct, .sinput.is-correct').length > 0;
    results[idx] = ok ? 'correct' : some ? 'partial' : 'wrong';
    renderTabs();

    if (ok) { guide.set('정답이에요!', 'ok'); settle(); }
    else {
      revealPending = true;
      var rw = qEl.querySelector('.qopts-row, .qopts-grid'); if (rw) rw.classList.add('is-reveal');
      gradeBtn.disabled = true; setCta(idx < TOTAL - 1 ? '다음 문제' : '다음으로');
      guide.set('오답을 눌러 정답을 확인해 보세요!', 'no');
    }
  }

  /* 오답을 눌러야 정답이 열린다(테스트 서버 동작을 받아들임, 2026-10-15). 열기 전에는 「다음」이 꺼져 있다. */
  function reveal() {
    var p = PROBLEMS[idx];
    revealPending = false;
    var row = qEl.querySelector('.qopts-row, .qopts-grid');
    if (row) { row.classList.remove('is-reveal'); var c = row.querySelectorAll('.qopt')[p.answer]; if (c) c.classList.add('is-correct'); }
    qEl.querySelectorAll('.dblank.is-wrong').forEach(function (b) { b.classList.add('show-ans'); b.textContent = b.dataset.ans; b.title = '눌러서 내 답 보기'; });
    qEl.querySelectorAll('.sinput.is-wrong').forEach(function (x) { x.classList.remove('is-reveal'); x.disabled = true; });
    var ac = qEl.querySelector('.ans-correct'); if (ac && ac.innerHTML) ac.classList.add('show');
    guide.set('');
    settle();
  }
  /* 문제가 끝났을 때 CTA — 마지막 문제면 「다음 문제」 대신 「다음으로」 */
  function settle() {
    if (idx < TOTAL - 1) { setCta('다음 문제'); gradeBtn.disabled = false; }
    else { gradeBtn.hidden = true; nextStepBtn.hidden = false; nextStepBtn.disabled = false; }
  }

  function next() { if (idx < TOTAL - 1) { idx++; renderQ(); } }
  function mark(inp, ok) { inp.classList.add(ok ? 'is-correct' : 'is-wrong'); }
  function norm(s) { return String(s).replace(/\s+/g, '').toLowerCase(); }

  nextStepBtn.addEventListener('click', function () { if (nextStepBtn.disabled) return; window.location.href = 'concept/organize.html'; });   // 다지기 다음 = 개념 정리

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  function dbgAnswer(ok) {
    if (graded) return;
    var p = PROBLEMS[idx];
    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') {
      var opts = qEl.querySelectorAll('.qopt');
      var pick = ok ? p.answer : (p.answer + 1) % opts.length;
      if (opts[pick]) opts[pick].click();
    } else if (p.type === 'blank') {
      qEl.querySelectorAll('.dblank').forEach(function (b, i) {
        setV(b, ok === true || (ok === 'part' && i === 0) ? p.answers[i] : '0');   // 'part' = 첫 칸만 정답
      });
      checkFilled();
    } else if (p.type === 'short-1') {
      setV(qEl.querySelector('.sinput'), ok ? p.answer : '0'); checkFilled();
    } else if (p.type === 'short-2') {
      var ins = qEl.querySelectorAll('.sinput');
      setV(ins[0], ok ? p.answer[0] : '0'); setV(ins[1], ok ? p.answer[1] : '0'); checkFilled();
    } else if (p.type === 'fraction') {
      setV(qEl.querySelector('[data-i="num"]'), ok ? p.answer.num : '0');
      setV(qEl.querySelector('[data-i="den"]'), ok ? p.answer.den : '0'); checkFilled();
    }
    grade();
  }
  function dbgSolveAll() {
    while (true) {
      if (!graded) dbgAnswer(true);
      if (idx >= TOTAL - 1) break;
      next();
    }
  }
  if (window.RMDebug) window.RMDebug.register({
    title: '개념 다지기 · 현재 문제',
    actions: [
      { label: '정답 처리', tone: 'ok', run: function () { dbgAnswer(true); } },
      { label: '오답 처리', tone: 'no', run: function () { dbgAnswer(false); } },
      { label: '정답 공개', run: function () { if (revealPending) reveal(); } },
      { label: '일부 정답', run: function () { dbgAnswer('part'); } },
      { label: '전부 풀기', run: dbgSolveAll },
      { label: '키패드 열기', run: function () { var f = qEl.querySelector('.sinput, .dblank'); if (f) openPad(f); } }
    ]
  });

  renderQ();
})();
