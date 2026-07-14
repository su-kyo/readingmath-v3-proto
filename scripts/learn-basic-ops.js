/* =========================================================================
   기초 연산 · 14문제 엔진
   유형: 객관식(번호만/텍스트/그림), 주관식(1개/2개/분수), 보기(텍스트/표/그림/도형/없음)
   채점하기 → 즉시 채점(정오답 하이라이트) → 상단 프로그레스 갱신 → 다음 문제
   마지막 문제까지 채점하면 하단 '다음으로'(스텝 결과로) 활성화
   ========================================================================= */
(function () {
  var TRAP = '<svg viewBox="0 0 320 200" width="300" xmlns="http://www.w3.org/2000/svg"><polygon points="40,170 220,170 300,40 40,40" fill="#C7D3E6"/></svg>';
  function exText(items) { return { kind: 'text', items: items }; }
  function exSkel(label) { return { kind: 'skel', label: label }; }
  function exShape(svg) { return { kind: 'shape', svg: svg }; }

  var PROBLEMS = [
    { type: 'mc-num', q: '다음은 순물질과 혼합물에 대한 설명이다. 옳은 것을 고르시오.',
      ex: exText(['㉠ 물질마다 성질이 다양하다.', '㉡ 소금물은 혼합물이다.', '㉢ 모든 물질은 순물질이다.', '㉣ 공기는 순물질이다.', '㉤ 증류수는 순물질이다.']),
      options: 5, answer: 1 },
    { type: 'mc-text', q: '다음은 생활 속에서 볼 수 있는 모습입니다. 물체를 미는 모습과 당기는 모습 중 무엇인지 고르시오.',
      ex: exSkel('이미지 (유모차 / 휠체어)'), options: ['미는 모습', '당기는 모습'], answer: 1 },
    { type: 'mc-text', grid: true, q: '다음 도형은 직사각형이 아닙니다. 그 이유로 바른 것을 고르세요.',
      ex: exShape(TRAP),
      options: ['네 각이 모두 직각이어야 하는데 직각인 각이 하나도 없기 때문입니다.',
                '네 각이 모두 직각이어야 하는데 직각인 각이 한 개밖에 없기 때문입니다.',
                '네 각이 모두 직각이어야 하는데 직각인 각이 두 개밖에 없기 때문입니다.',
                '네 각이 모두 직각이어야 하는데 직각인 각이 세 개 있기 때문입니다.'],
      answer: 1 },
    { type: 'short-2', q: '마을별 신문 구독 수를 그림그래프로 나타낸 것입니다. ㉠, ㉡에 알맞은 수를 구하시오.',
      ex: exSkel('표 · 마을별 신문 구독 수'), tags: ['㉠', '㉡'], answer: ['10', '1'] },
    { type: 'mc-num', q: '752 − 238 을 바르게 계산한 것은? (① 504  ② 514  ③ 524  ④ 526  ⑤ 534)',
      ex: null, options: 5, answer: 1 },
    { type: 'mc-text', q: '받아올림이 있는 덧셈에 대한 설명으로 옳은 것을 고르세요.',
      ex: null, options: ['자리 수가 10을 넘으면 윗자리로 1을 올린다.', '항상 일의 자리부터 빼서 계산한다.', '받아올림은 큰 수에서만 생긴다.'],
      answer: 0 },
    { type: 'mc-image', q: '다음 중 삼각형인 것을 고르세요.',
      ex: null, options: [{ img: true }, { img: true }, { img: true }, { img: true }], answer: 2 },
    { type: 'short-1', q: '46 × 3 을 계산하면 얼마입니까?',
      ex: null, answer: '138' },
    { type: 'short-1', q: '그림을 보고 사과가 모두 몇 개인지 수를 써 넣으시오.',
      ex: exSkel('이미지 · 사과 묶음'), answer: '24' },
    { type: 'fraction', q: '색칠한 부분을 분수로 나타내면 얼마입니까?',
      ex: null, answer: { num: '3', den: '4' } },
    { type: 'fraction', q: '조건을 보고 알맞은 분수를 구하시오.',
      ex: exText(['㉠ 전체를 똑같이 8로 나눈다.', '㉡ 그중 5칸을 색칠한다.']), answer: { num: '5', den: '8' } },
    { type: 'mc-num', q: '그림에서 가장 무거운 물건의 번호를 고르세요.',
      ex: exSkel('이미지 · 저울'), options: 4, answer: 2 },
    { type: 'short-2', q: '63 ÷ 9 의 몫(㉠)과 84 ÷ 7 의 몫(㉡)을 각각 구하시오.',
      ex: null, tags: ['㉠', '㉡'], answer: ['7', '12'] },
    { type: 'mc-text', grid: true, q: '나눗셈의 몫과 나머지에 대한 설명으로 옳은 것을 고르세요.',
      ex: null, options: ['나머지는 항상 나누는 수보다 작다.', '나머지는 항상 나누는 수보다 크다.', '몫은 항상 나누어지는 수보다 크다.', '나머지는 0이 될 수 없다.'],
      answer: 0 }
  ];

  var TOTAL = PROBLEMS.length;
  var results = new Array(TOTAL);
  var idx = 0, selected = null, graded = false;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var gradeBtn = document.getElementById('gradeBtn');
  var nextStepBtn = document.getElementById('nextStepBtn');
  var opsScroll = document.getElementById('opsScroll');

  // 위/아래 가려진 콘텐츠 페이드 표시
  function updateFade() {
    var wrap = opsScroll.parentElement;
    wrap.classList.toggle('has-more', opsScroll.scrollTop + opsScroll.clientHeight < opsScroll.scrollHeight - 4);
    wrap.classList.toggle('has-more-top', opsScroll.scrollTop > 4);
  }
  opsScroll.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);

  /* ---- 주관식 숫자 키패드 ---- */
  var pad = document.getElementById('keypad');
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input) {
    var r = input.getBoundingClientRect();
    var w = pad.offsetWidth || 244, h = pad.offsetHeight || 340;
    var left, top;
    if (r.right + 14 + w < window.innerWidth - 8) {           // 우측 우선 (분수 박스 안 가림)
      left = r.right + 14; top = r.top + r.height / 2 - h / 2;
    } else {                                                   // 아래(공간 없으면 위)
      left = r.left + r.width / 2 - w / 2; top = r.bottom + 10;
      if (top + h > window.innerHeight - 8) top = r.top - h - 10;
    }
    left = Math.min(Math.max(left, 8), window.innerWidth - w - 8);
    top = Math.min(Math.max(top, 8), window.innerHeight - h - 8);
    pad.style.left = left + 'px'; pad.style.top = top + 'px';
  }
  function openPad(input) {
    activeInput = input;
    kpDisplay.textContent = input.value || '0';
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.classList.remove('is-active-input'); });
    input.classList.add('is-active-input');
    pad.classList.add('is-open'); positionPad(input);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('.kp-key').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k, v = activeInput.value;
      if (k === 'back') v = v.slice(0, -1);
      else if (k === 'clear') v = '';
      else if (k === 'ok') { closePad(); return; }
      else v += k;
      activeInput.value = v; kpDisplay.textContent = v || '0'; checkFilled();
    });
  });
  document.addEventListener('click', function (e) { if (pad.classList.contains('is-open') && !e.target.closest('.sinput')) closePad(); });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

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
    if (ex.kind === 'text') {
      var list = el('div', 'ex__list');
      ex.items.forEach(function (t) { list.appendChild(el('div', null, t)); });
      box.appendChild(list);
    } else if (ex.kind === 'shape') {
      box.appendChild(el('div', 'ex__shape', ex.svg));
    } else {
      box.appendChild(el('div', 'ex__skel', ex.label || '이미지'));
    }
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
    else if (p.type === 'short-1') qEl.appendChild(renderShort(p, 1));
    else if (p.type === 'short-2') qEl.appendChild(renderShort(p, 2));
    else if (p.type === 'fraction') qEl.appendChild(renderFraction(p));
    if (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction') qEl.appendChild(el('div', 'ans-correct'));

    // 하단 채점 버튼 초기화
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
      else if (p.type === 'mc-image') { opt.classList.add('opt--img'); opt.appendChild(el('span', 'opt__img')); opt.appendChild(el('span', 'opt__num', String(i + 1))); }
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

  function renderShort(p, n) {
    var row = el('div', 'answer-row');
    for (var i = 0; i < n; i++) {
      var field = el('div', 'sfield');
      var line = el('div', 'sfield__row');
      if (p.tags) line.appendChild(el('span', 'sfield__tag', p.tags[i]));
      var inp = el('input', 'sinput'); inp.type = 'text'; inp.readOnly = true; inp.inputMode = 'none'; inp.placeholder = '답 입력'; inp.dataset.i = i;
      inp.addEventListener('click', function () { if (!graded) openPad(this); });
      line.appendChild(inp);
      field.appendChild(line);
      field.appendChild(el('div', 'sfield__ans'));    // 칸별 오답 정답
      row.appendChild(field);
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
    var inputs = qEl.querySelectorAll('.sinput'), all = true;
    inputs.forEach(function (x) { if (!x.value.trim()) all = false; });
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
    } else if (p.type === 'short-1') {
      var v = qEl.querySelector('.sinput'); ok = norm(v.value) === norm(p.answer); mark(v, ok);
      if (!ok) showFieldAns(v, p.answer);
    } else if (p.type === 'short-2') {
      var ins = qEl.querySelectorAll('.sinput');
      var o0 = norm(ins[0].value) === norm(p.answer[0]), o1 = norm(ins[1].value) === norm(p.answer[1]);
      mark(ins[0], o0); mark(ins[1], o1); ok = o0 && o1;
      if (!o0) showFieldAns(ins[0], p.answer[0]);
      if (!o1) showFieldAns(ins[1], p.answer[1]);
    } else if (p.type === 'fraction') {
      var nu = qEl.querySelector('[data-i="num"]'), de = qEl.querySelector('[data-i="den"]');
      var on = norm(nu.value) === norm(p.answer.num), od = norm(de.value) === norm(p.answer.den);
      mark(nu, on); mark(de, od); ok = on && od;
    }
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.disabled = true; });
    closePad();

    // 분수 오답 → 아래에 온전한 분수로 정답 표기('3/4' 사선표기 금지)
    // (주관식 1·2칸은 각 칸 아래에 showFieldAns 로 표기)
    if (!ok && p.type === 'fraction') {
      var ac = qEl.querySelector('.ans-correct');
      if (ac) { ac.innerHTML = '정답 <span class="frac"><span class="frac__n">' + p.answer.num + '</span><span class="frac__d">' + p.answer.den + '</span></span>'; ac.classList.add('show'); }
    }

    graded = true;
    results[idx] = ok ? 'correct' : 'wrong';
    renderProgress();

    if (idx < TOTAL - 1) {
      gradeBtn.classList.add('btn-grade--next');
      gradeBtn.textContent = '다음 문제 →';
    } else {
      gradeBtn.hidden = true;               // 마지막 문제 → 하단 '다음으로'로 진행
      nextStepBtn.disabled = false;
    }
  }

  function next() { if (idx < TOTAL - 1) { idx++; renderQ(); } }

  function mark(inp, ok) { inp.classList.add(ok ? 'is-correct' : 'is-wrong'); }
  function norm(s) { return String(s).replace(/\s+/g, '').toLowerCase(); }
  function showFieldAns(input, ans) {
    var field = input.closest('.sfield'); if (!field) return;
    var slot = field.querySelector('.sfield__ans');
    if (slot) { slot.innerHTML = '정답 <b>' + ans + '</b>'; slot.classList.add('show'); }
  }

  /* 하단 '결과보기' → 스텝 결과 화면 (마지막 문제 채점 시 활성) */
  nextStepBtn.addEventListener('click', function () { if (nextStepBtn.disabled) return; window.location.href = 'step-result.html'; });

  /* 라이트/다크 토글 */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  renderQ();
})();
