/* =========================================================================
   유형 훈련 · 1차 유형 문제 (타이머, 전부 풀고 제출) — 문항 수는 과목 데이터를 따른다(수학 10 · 과학 5)
   - 즉시 채점 없음: 답만 저장하고 '다음 문제'로 진행
   - 프로그레스 캡: 풀었다(체크)/현재(링)/미풀이(점) + 타이머
   - 마지막까지 다 풀면 하단 '제출하기' 활성화
   ========================================================================= */
(function () {
  /* 문항은 과목별 데이터 파일 — scripts/type-quiz-data-math.js · type-quiz-data-sci.js (과목 = scripts/subject.js) */
  var SET = window.RMTypeData[window.RMSubject.id];
  var PROBLEMS = SET.problems;

  /* 제한 시간 — 머리줄 글자가 정본이다(scripts/learn-timer.js 가 이 글자를 읽는다. 이 스크립트가 먼저 돈다) */
  var limEl = document.querySelector('.lheader__limit');
  if (limEl && SET.limit) limEl.textContent = '/ ' + SET.limit;

  /* 글 속 $…$ → KaTeX. 서버 수식의 기호 글자(△ ∴ ∵ ⊥ ∽)는 KaTeX 명령으로 바꿔 그린다 */
  var SYM = { '△': '\\triangle ', '∴': '\\therefore ', '∵': '\\because ', '⊥': '\\perp ', '∽': '\\backsim ' };
  function tex(s) {
    return String(s).split('$').map(function (part, i) {
      if (i % 2 === 0 || !window.katex) return part;
      return window.katex.renderToString(part.replace(/[△∴∵⊥∽]/g, function (c) { return SYM[c]; }), { throwOnError: false, strict: false });
    }).join('');
  }

  var TOTAL = PROBLEMS.length;
  var answers = new Array(TOTAL);   // 저장된 답 (채점은 제출 후)
  var idx = 0;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var nextBtn = document.getElementById('nextBtn');
  var submitBtn = document.getElementById('submitBtn');
  var opsScroll = document.getElementById('opsScroll');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

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
    if (ex.kind === 'text') { var list = el('div', 'ex__list'); ex.items.forEach(function (t) { list.appendChild(el('div', null, tex(t))); }); box.appendChild(list); }
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
    qEl.appendChild(el('div', 'q__text', tex(p.q)));
    if (p.img) { var im = el('img', 'q__img'); im.src = p.img; im.alt = '문제 그림'; qEl.appendChild(im); }
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
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'qopts-grid' : 'qopts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'qopt');
      if (p.type === 'mc-num') { opt.classList.add('qopt--num'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('qopt--img'); opt.appendChild(el('span', 'qopt__img')); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
      else { opt.classList.add('qopt--text'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); opt.appendChild(el('span', null, tex(p.options[i]))); }
      if (answers[idx] === i) opt.classList.add('is-selected');
      (function (i, opt) {
        opt.addEventListener('click', function () {
          wrap.querySelectorAll('.qopt').forEach(function (o) { o.classList.remove('is-selected'); });
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
      field.appendChild(makeInput('답 입력', v));
      if (p.unit) field.appendChild(el('span', 'sfield__unit', p.unit));
      row.appendChild(field);
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
    var last = idx === TOTAL - 1;
    nextBtn.disabled = !isAnswered(idx);
    nextBtn.hidden = last;
    submitBtn.hidden = !last;          // 콘솔바 CTA 한 자리 — 마지막 문제에서만 「제출하기」
    submitBtn.disabled = !allAnswered();
    guideInput();
  }
  /* 콘솔바 안내(RM-PART-07) — 지금 문제를 안 풀었을 때만. 객관식은 「골라」, 칸이 여럿이면 「모든」. */
  function guideInput() {
    if (!window.RMGuide) return;
    var p = PROBLEMS[idx];
    if (isAnswered(idx)) { window.RMGuide.set(''); return; }
    window.RMGuide.set(/^mc-/.test(p.type) ? '답을 골라 주세요!'
      : p.type === 'short-1' ? '답안을 입력해 주세요!' : '모든 답안을 입력해 주세요!');
  }
  nextBtn.addEventListener('click', function () { if (isAnswered(idx) && idx < TOTAL - 1) { idx++; renderQ(); } });
  submitBtn.addEventListener('click', function () { if (submitBtn.disabled) return; window.location.href = 'type/result.html'; });

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
  pad.innerHTML = window.RMKeypad.html();          /* 키 구성 정본 = scripts/keypad.js */
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input, reveal) {   /* 자리 = scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위, 입력칸 아래 12px 기본 · 분수 칸은 옆 먼저 */
    if (!window.RMPopPlace.place(pad, input, { reveal: reveal, side: true, sideFirst: !!input.closest('.fraction, .mfrac') })) closePad();
  }
  function openPad(input) {
    activeInput = input; kpDisplay.textContent = input.value || '0';
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.classList.remove('is-active-input'); });
    input.classList.add('is-active-input'); pad.classList.add('is-open'); positionPad(input, true);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('[data-k]').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k;
      if (k === 'ok') { closePad(); return; }
      var v = window.RMKeypad.apply(activeInput.value, k);
      activeInput.value = v; kpDisplay.textContent = v || '0'; syncAnswer();
    });
  });
  document.addEventListener('click', function (e) { if (pad.classList.contains('is-open') && !e.target.closest('.sinput')) closePad(); });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });
  document.addEventListener('scroll', function () { if (activeInput) positionPad(activeInput); }, true);   // 문제 영역을 스크롤하면 따라가고, 입력칸이 영역 밖으로 나가면 닫는다

  /* 라이트/다크 토글 */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { var c = document.documentElement.getAttribute('data-theme'); document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark'); });

  /* 머리줄 타이머 = scripts/learn-timer.js */

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  function dbgFill(i, ok) {
    var p = PROBLEMS[i];
    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') {
      var n = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
      answers[i] = ok ? p.answer : (p.answer + 1) % n;
    } else if (p.type === 'short-1') answers[i] = ok ? p.answer : '0';
    else if (p.type === 'short-2') answers[i] = ok ? [p.answer[0], p.answer[1]] : ['0', '0'];
    else if (p.type === 'fraction') answers[i] = ok ? { num: p.answer.num, den: p.answer.den } : { num: '0', den: '0' };
  }
  if (window.RMDebug) window.RMDebug.register({
    title: '유형 훈련 (제출 후 채점)',
    actions: [
      { label: '정답 입력', tone: 'ok', run: function () { dbgFill(idx, true); renderQ(); } },
      { label: '오답 입력', tone: 'no', run: function () { dbgFill(idx, false); renderQ(); } },
      { label: '전부 풀기', run: function () { for (var i = 0; i < TOTAL; i++) dbgFill(i, true); renderQ(); } }
    ]
  });

  renderQ();
})();
