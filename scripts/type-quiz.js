/* =========================================================================
   유형 훈련 · 10문제 (타이머, 전부 풀고 제출)
   - 즉시 채점 없음: 답만 저장하고 '다음 문제'로 진행
   - 프로그레스 캡: 풀었다(체크)/현재(링)/미풀이(점) + 타이머
   - 마지막까지 다 풀면 하단 '제출하기' 활성화
   ========================================================================= */
(function () {
  var TRAP = '<svg viewBox="0 0 320 200" width="300" xmlns="http://www.w3.org/2000/svg"><polygon points="40,170 220,170 300,40 40,40" fill="#C7D3E6"/></svg>';
  function exText(items) { return { kind: 'text', items: items }; }
  function exSkel(label) { return { kind: 'skel', label: label }; }
  function exShape(svg) { return { kind: 'shape', svg: svg }; }

  var PROBLEMS = [
    { type: 'mc-num', q: '다음은 순물질과 혼합물에 대한 설명이다. 옳은 것을 고르시오.',
      ex: exText(['㉠ 물질마다 성질이 다양하다.', '㉡ 소금물은 혼합물이다.', '㉢ 모든 물질은 순물질이다.', '㉣ 공기는 순물질이다.', '㉤ 증류수는 순물질이다.']), options: 5, answer: 1 },
    { type: 'mc-text', q: '물체를 미는 모습과 당기는 모습 중 무엇인지 고르시오.', ex: exSkel('이미지 (유모차 / 휠체어)'), options: ['미는 모습', '당기는 모습'], answer: 1 },
    { type: 'mc-text', grid: true, q: '다음 도형은 직사각형이 아닙니다. 그 이유로 바른 것을 고르세요.', ex: exShape(TRAP),
      options: ['네 각이 모두 직각이어야 하는데 직각인 각이 하나도 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 한 개밖에 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 두 개밖에 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 세 개 있기 때문입니다.'], answer: 1 },
    { type: 'short-2', q: '마을별 신문 구독 수 그림그래프에서 ㉠, ㉡에 알맞은 수를 구하시오.', ex: exSkel('표 · 마을별 신문 구독 수'), tags: ['㉠', '㉡'], answer: ['10', '1'] },
    { type: 'mc-num', q: '752 − 238 을 바르게 계산한 것은? (① 504  ② 514  ③ 524  ④ 526  ⑤ 534)', ex: null, options: 5, answer: 1 },
    { type: 'mc-text', q: '받아올림이 있는 덧셈에 대한 설명으로 옳은 것을 고르세요.', ex: null, options: ['자리 수가 10을 넘으면 윗자리로 1을 올린다.', '항상 일의 자리부터 빼서 계산한다.', '받아올림은 큰 수에서만 생긴다.'], answer: 0 },
    { type: 'mc-image', q: '다음 중 삼각형인 것을 고르세요.', ex: null, options: [{ img: true }, { img: true }, { img: true }, { img: true }], answer: 2 },
    { type: 'short-1', q: '46 × 3 을 계산하면 얼마입니까?', ex: null, answer: '138' },
    { type: 'fraction', q: '색칠한 부분을 분수로 나타내면 얼마입니까?', ex: null, answer: { num: '3', den: '4' } },
    { type: 'short-2', q: '63 ÷ 9 의 몫(㉠)과 84 ÷ 7 의 몫(㉡)을 각각 구하시오.', ex: null, tags: ['㉠', '㉡'], answer: ['7', '12'] }
  ];

  var TOTAL = PROBLEMS.length;
  var answers = new Array(TOTAL);   // 저장된 답 (채점은 제출 후)
  var idx = 0;
  var elapsed = 0;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var nextBtn = document.getElementById('nextBtn');
  var submitBtn = document.getElementById('submitBtn');
  var opsScroll = document.getElementById('opsScroll');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTime(s) { return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60); }

  /* ---- 풀이 여부 ---- */
  function isAnswered(i) {
    var a = answers[i], p = PROBLEMS[i];
    if (a == null) return false;
    if (p.type === 'short-2') return a[0] !== '' && a[1] !== '';
    if (p.type === 'fraction') return a.num !== '' && a.den !== '';
    if (p.type === 'short-1') return a !== '';
    return true;
  }
  function allAnswered() { for (var i = 0; i < TOTAL; i++) if (!isAnswered(i)) return false; return true; }

  /* ---- 프로그레스 (타이머 + 풀었다/미풀이) ---- */
  function renderProgress() {
    progressEl.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var c = el('span', 'pcirc');
      // 풀었으면 항상 check(마지막 문제 포함) + 현재 항목은 링을 겹쳐 표시
      if (isAnswered(i)) c.classList.add('is-solved');
      if (i === idx) c.classList.add('is-current');
      progressEl.appendChild(c);
    }
    progressEl.appendChild(el('span', 'pcap__count', (idx + 1) + '/' + TOTAL));
  }

  /* ---- 보기 ---- */
  function renderEx(ex) {
    if (!ex) return null;
    var box = el('div', 'ex');
    if (ex.kind === 'text') { var list = el('div', 'ex__list'); ex.items.forEach(function (t) { list.appendChild(el('div', null, t)); }); box.appendChild(list); }
    else if (ex.kind === 'shape') box.appendChild(el('div', 'ex__shape', ex.svg));
    else box.appendChild(el('div', 'ex__skel', ex.label || '이미지'));
    return box;
  }

  /* ---- 문제 렌더 ---- */
  function renderQ() {
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
    renderProgress();
    updateButtons();
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
      if (answers[idx] === i) opt.classList.add('is-selected');
      (function (i, opt) {
        opt.addEventListener('click', function () {
          wrap.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-selected'); });
          opt.classList.add('is-selected'); answers[idx] = i; updateButtons(); renderProgress();
        });
      })(i, opt);
      wrap.appendChild(opt);
    }
    return wrap;
  }

  function makeInput(ph, val) {
    var inp = el('input', 'sinput'); inp.type = 'text'; inp.readOnly = true; inp.inputMode = 'none'; inp.placeholder = ph; if (val) inp.value = val;
    inp.addEventListener('click', function () { openPad(inp); });
    return inp;
  }
  function renderShort(p, n) {
    var row = el('div', 'answer-row');
    var stored = answers[idx];
    for (var i = 0; i < n; i++) {
      var field = el('div', 'sfield');
      if (p.tags) field.appendChild(el('span', 'sfield__tag', p.tags[i]));
      var v = n === 2 ? (stored ? stored[i] : '') : (typeof stored === 'string' ? stored : '');
      field.appendChild(makeInput('답 입력', v)); row.appendChild(field);
    }
    return row;
  }
  function renderFraction(p) {
    var row = el('div', 'answer-row'), fr = el('div', 'fraction'), s = answers[idx] || {};
    fr.appendChild(setDI(makeInput('', s.num), 'num'));
    fr.appendChild(el('div', 'fraction__bar'));
    fr.appendChild(setDI(makeInput('', s.den), 'den'));
    row.appendChild(fr); return row;
  }
  function setDI(inp, k) { inp.dataset.i = k; return inp; }

  function syncAnswer() {
    var p = PROBLEMS[idx], ins = qEl.querySelectorAll('.sinput');
    if (p.type === 'short-1') answers[idx] = ins[0].value.trim();
    else if (p.type === 'short-2') answers[idx] = [ins[0].value.trim(), ins[1].value.trim()];
    else if (p.type === 'fraction') answers[idx] = { num: qEl.querySelector('[data-i="num"]').value.trim(), den: qEl.querySelector('[data-i="den"]').value.trim() };
    updateButtons(); renderProgress();
  }

  /* ---- 버튼 상태 ---- */
  function updateButtons() {
    nextBtn.disabled = !isAnswered(idx);
    nextBtn.hidden = (idx === TOTAL - 1);
    submitBtn.disabled = !allAnswered();
  }
  nextBtn.addEventListener('click', function () { if (isAnswered(idx) && idx < TOTAL - 1) { idx++; renderQ(); } });
  submitBtn.addEventListener('click', function () { if (submitBtn.disabled) return; window.location.href = 'type-result.html'; });

  /* ---- 스크롤 페이드 ---- */
  function updateFade() {
    var wrap = opsScroll.parentElement;
    wrap.classList.toggle('has-more', opsScroll.scrollTop + opsScroll.clientHeight < opsScroll.scrollHeight - 4);
    wrap.classList.toggle('has-more-top', opsScroll.scrollTop > 4);
  }
  opsScroll.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);

  /* ---- 계산기 키패드 ---- */
  var pad = document.getElementById('keypad');
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input) {
    var r = input.getBoundingClientRect(), w = pad.offsetWidth || 244, h = pad.offsetHeight || 340, left, top;
    if (r.right + 14 + w < window.innerWidth - 8) { left = r.right + 14; top = r.top + r.height / 2 - h / 2; }
    else { left = r.left + r.width / 2 - w / 2; top = r.bottom + 10; if (top + h > window.innerHeight - 8) top = r.top - h - 10; }
    left = Math.min(Math.max(left, 8), window.innerWidth - w - 8);
    top = Math.min(Math.max(top, 8), window.innerHeight - h - 8);
    pad.style.left = left + 'px'; pad.style.top = top + 'px';
  }
  function openPad(input) {
    activeInput = input; kpDisplay.textContent = input.value || '0';
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.classList.remove('is-active-input'); });
    input.classList.add('is-active-input'); pad.classList.add('is-open'); positionPad(input);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('.kp-key').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k, v = activeInput.value;
      if (k === 'back') v = v.slice(0, -1); else if (k === 'clear') v = ''; else if (k === 'ok') { closePad(); return; } else v += k;
      activeInput.value = v; kpDisplay.textContent = v || '0'; syncAnswer();
    });
  });
  document.addEventListener('click', function (e) { if (pad.classList.contains('is-open') && !e.target.closest('.sinput')) closePad(); });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });

  /* 라이트/다크 토글 */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { var c = document.documentElement.getAttribute('data-theme'); document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark'); });

  /* 타이머 (경과 시간 카운트업) */
  var hdrTimerSpan = document.getElementById('timer');
  setInterval(function () { elapsed++; if (hdrTimerSpan) hdrTimerSpan.textContent = fmtTime(elapsed); }, 1000);

  renderQ();
})();
