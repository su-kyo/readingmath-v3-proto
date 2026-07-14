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
      answers: ['2', '1', '5'] }
  ];

  var TOTAL = PROBLEMS.length;
  var results = new Array(TOTAL);
  var idx = 0, selected = null, graded = false;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var gradeBtn = document.getElementById('gradeBtn');
  var nextStepBtn = document.getElementById('nextStepBtn');
  var opsScroll = document.getElementById('opsScroll');

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
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input) {
    var r = input.getBoundingClientRect();
    var w = pad.offsetWidth || 244, h = pad.offsetHeight || 340;
    var left, top;
    if (r.right + 14 + w < window.innerWidth - 8) { left = r.right + 14; top = r.top + r.height / 2 - h / 2; }
    else { left = r.left + r.width / 2 - w / 2; top = r.bottom + 10; if (top + h > window.innerHeight - 8) top = r.top - h - 10; }
    left = Math.min(Math.max(left, 8), window.innerWidth - w - 8);
    top = Math.min(Math.max(top, 8), window.innerHeight - h - 8);
    pad.style.left = left + 'px'; pad.style.top = top + 'px';
  }
  function openPad(node) {
    activeInput = node;
    kpDisplay.textContent = getV(node) || '0';
    qEl.querySelectorAll('.sinput, .dblank').forEach(function (x) { x.classList.remove('is-active-input'); });
    node.classList.add('is-active-input');
    pad.classList.add('is-open'); positionPad(node);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('.kp-key').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k, v = getV(activeInput);
      if (k === 'back') v = v.slice(0, -1);
      else if (k === 'clear') v = '';
      else if (k === 'ok') { closePad(); return; }
      else v += k;
      setV(activeInput, v); kpDisplay.textContent = v || '0'; checkFilled();
    });
  });
  document.addEventListener('click', function (e) {
    if (pad.classList.contains('is-open') && !e.target.closest('.sinput') && !e.target.closest('.dblank')) closePad();
  });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });

  /* ---- 상단 프로그레스 ---- */
  function renderProgress() {
    progressEl.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var c = el('span', 'pcirc');
      if (results[i] === 'correct') c.classList.add('is-correct');
      else if (results[i] === 'wrong') c.classList.add('is-wrong');
      else if (i === idx) c.classList.add('is-current');
      progressEl.appendChild(c);
    }
    progressEl.appendChild(el('span', 'pcap__count', (idx + 1) + '/' + TOTAL));
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
    opsScroll.scrollTop = 0;
    var p = PROBLEMS[idx];

    qEl.appendChild(el('div', 'q__text', p.q));
    var exb = renderEx(p.ex); if (exb) qEl.appendChild(exb);

    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') qEl.appendChild(renderMC(p));
    else if (p.type === 'blank') qEl.appendChild(renderBlank(p));
    else if (p.type === 'short-1') qEl.appendChild(renderShort(p, 1));
    else if (p.type === 'short-2') qEl.appendChild(renderShort(p, 2));
    else if (p.type === 'fraction') qEl.appendChild(renderFraction(p));
    if (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction') qEl.appendChild(el('div', 'ans-correct'));

    gradeBtn.hidden = false;
    gradeBtn.disabled = true;
    gradeBtn.classList.remove('btn-grade--next');
    gradeBtn.textContent = '채점하기';

    renderProgress();
    requestAnimationFrame(updateFade);
  }

  function renderMC(p) {
    var count = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'opts-grid' : 'opts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'opt');
      if (p.type === 'mc-num') { opt.classList.add('opt--num'); opt.appendChild(el('span', 'opt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('opt--img'); opt.appendChild(el('span', 'opt__img')); }
      else { opt.classList.add('opt--text'); opt.appendChild(el('span', 'opt__num', String(i + 1))); opt.appendChild(el('span', null, p.options[i])); }
      (function (i, opt) {
        opt.addEventListener('click', function () {
          if (graded) return;
          wrap.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-selected'); });
          opt.classList.add('is-selected'); selected = i;
          gradeBtn.disabled = false;
        });
      })(i, opt);
      wrap.appendChild(opt);
    }
    return wrap;
  }

  /* ---- 빈칸(인라인 채우기) ---- */
  function renderBlank(p) {
    var box = el('div', 'qblank', p.html);
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
  }

  /* ---- 채점 / 다음 ---- */
  gradeBtn.addEventListener('click', function () { if (!graded) grade(); else next(); });

  function grade() {
    var p = PROBLEMS[idx], ok = false;
    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') {
      ok = (selected === p.answer);
      qEl.querySelectorAll('.opt').forEach(function (o, i) {
        if (i === p.answer) o.classList.add('is-correct');
        if (i === selected && selected !== p.answer) o.classList.add('is-wrong');
      });
      qEl.querySelector('.opts-row, .opts-grid').classList.add('is-graded');
    } else if (p.type === 'blank') {
      ok = true;
      qEl.querySelectorAll('.dblank').forEach(function (b, i) {
        var good = norm(getV(b)) === norm(p.answers[i]);
        b.classList.add(good ? 'is-correct' : 'is-wrong');
        if (!good) { ok = false; var c = el('span', 'dblank-correct', p.answers[i]); if (b.parentNode) b.parentNode.insertBefore(c, b.nextSibling); }
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
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.disabled = true; });
    closePad();

    // 주관식 오답 → 정답 표시 (분수는 온전한 분수 형태)
    if (!ok && (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction')) {
      var txt = p.type === 'short-2' ? p.answer.join(', ')
        : p.type === 'fraction' ? '<span class="frac"><span class="frac__n">' + p.answer.num + '</span><span class="frac__d">' + p.answer.den + '</span></span>'
        : p.answer;
      var ac = qEl.querySelector('.ans-correct');
      if (ac) { ac.innerHTML = '정답 <b>' + txt + '</b>'; ac.classList.add('show'); }
    }

    graded = true;
    results[idx] = ok ? 'correct' : 'wrong';
    renderProgress();

    if (idx < TOTAL - 1) { gradeBtn.classList.add('btn-grade--next'); gradeBtn.textContent = '다음 문제 →'; }
    else { gradeBtn.hidden = true; nextStepBtn.disabled = false; }
  }

  function next() { if (idx < TOTAL - 1) { idx++; renderQ(); } }
  function mark(inp, ok) { inp.classList.add(ok ? 'is-correct' : 'is-wrong'); }
  function norm(s) { return String(s).replace(/\s+/g, '').toLowerCase(); }

  nextStepBtn.addEventListener('click', function () { if (nextStepBtn.disabled) return; /* → 개념 정리하기 / 스텝 결과 (추후) */ });

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  renderQ();
})();
