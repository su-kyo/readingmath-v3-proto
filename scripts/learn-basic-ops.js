/* =========================================================================
   기초 연산 · 문항 엔진 — 수학 기초 연산(concept/basic-ops.html) · 과학 개념 확인하기(concept/check.html)
   유형: 객관식(번호만/텍스트/그림), 주관식(1개/2개/분수), 보기(텍스트/표/그림/도형/없음)
   채점하기 → 즉시 채점(정오답 하이라이트) → 상단 프로그레스 갱신 → 다음 문제
   마지막 문제까지 채점하면 하단 '결과보기'(스텝 결과로) 활성화
   문항 = 화면별 데이터 파일 → window.RMOpsSet { title, next, problems }. 엔진보다 먼저 부른다.
     수학 기초 연산 scripts/concept-basic-ops-data-math.js · 과학 개념 확인하기 scripts/concept-check-data.js
   문항에 img(그림 주소) · lines(문제 아래 ㄱ·ㄴ·ㄷ 같은 줄)를 더 둘 수 있다.
   발문 · 보기 속 $…$ 는 KaTeX 로 그린다(화면이 katex 를 부를 때만).
   ========================================================================= */
(function () {
  var SET = window.RMOpsSet || { problems: [] };
  var PROBLEMS = SET.problems;

  /* 글 속 $…$ 를 KaTeX 로 */
  function texIn(root) {
    if (!window.katex) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [];
    while (w.nextNode()) if (w.currentNode.nodeValue.indexOf('$') >= 0) nodes.push(w.currentNode);
    nodes.forEach(function (n) {
      var parts = n.nodeValue.split('$'); if (parts.length < 3) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (t, i) {
        if (i % 2 === 0) { if (t) frag.appendChild(document.createTextNode(t)); return; }
        var m = document.createElement('span'); window.katex.render(t, m, { throwOnError: false, strict: 'ignore' }); frag.appendChild(m);
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  var TOTAL = PROBLEMS.length;
  var results = new Array(TOTAL);
  var idx = 0, selected = null, graded = false;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var gradeBtn = document.getElementById('gradeBtn');
  var nextStepBtn = document.getElementById('nextStepBtn');
  var guide = window.RMGuide || { set: function () {} };
  var revealPending = false;   // 채점 뒤 오답을 눌러 정답을 열기 전
  var CTA_ICO = { '채점하기': 'grade', '다음 문제': 'next', '다음으로': 'next', '결과보기': 'result' };   // 문구가 바뀌면 아이콘도
  function setCta(t) { gradeBtn.querySelector('span').textContent = t; gradeBtn.querySelector('img').src = 'assets/icons/ico-' + CTA_ICO[t] + '.svg'; }
  /* 콘솔바 안내(RM-PART-07) — 입력 전: 객관식은 「골라」, 칸이 여럿이면 「모든」. 다 채우면 숨긴다. */
  function guideInput() {
    var p = PROBLEMS[idx];
    if (/^mc-/.test(p.type)) { guide.set(selected == null ? '답을 골라 주세요!' : ''); return; }
    var fields = qEl.querySelectorAll('.sinput'), empty = 0;
    fields.forEach(function (x) { if (!x.value.trim()) empty++; });
    guide.set(!empty ? '' : fields.length > 1 ? '모든 답안을 입력해 주세요!' : '답안을 입력해 주세요!');
  }
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
  pad.innerHTML = window.RMKeypad.html();          /* 키 구성 정본 = scripts/keypad.js */
  var kpDisplay = pad.querySelector('.keypad__display');
  var activeInput = null;
  function positionPad(input, reveal) {   /* 자리 = scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위, 입력칸 아래 12px 기본 · 분수 칸은 옆 먼저 */
    if (!window.RMPopPlace.place(pad, input, { reveal: reveal, side: true, sideFirst: !!input.closest('.fraction, .mfrac') })) closePad();
  }
  function openPad(input) {
    activeInput = input;
    kpDisplay.textContent = input.value || '0';
    qEl.querySelectorAll('.sinput').forEach(function (x) { x.classList.remove('is-active-input'); });
    input.classList.add('is-active-input');
    pad.classList.add('is-open'); positionPad(input, true);
  }
  function closePad() { pad.classList.remove('is-open'); if (activeInput) activeInput.classList.remove('is-active-input'); activeInput = null; }
  pad.addEventListener('click', function (e) { e.stopPropagation(); });
  pad.querySelectorAll('[data-k]').forEach(function (key) {
    key.addEventListener('click', function () {
      if (!activeInput) return;
      var k = key.dataset.k;
      if (k === 'ok') { closePad(); return; }
      var v = window.RMKeypad.apply(activeInput.value, k);
      activeInput.value = v; kpDisplay.textContent = v || '0'; checkFilled();
    });
  });
  document.addEventListener('click', function (e) { if (pad.classList.contains('is-open') && !e.target.closest('.sinput')) closePad(); });
  window.addEventListener('resize', function () { if (activeInput) positionPad(activeInput); });
  document.addEventListener('scroll', function () { if (activeInput) positionPad(activeInput); }, true);   // 문제 영역을 스크롤하면 따라가고, 입력칸이 영역 밖으로 나가면 닫는다

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---- 상단 프로그레스 ---- */
  function renderProgress() {
    progressEl.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var c = el('span', 'pcirc');
      if (results[i] === 'correct') c.classList.add('is-correct');
      else if (results[i] === 'wrong') c.classList.add('is-wrong');
      else if (results[i] === 'partial') c.classList.add('is-partial');
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
    if (p.lines) { var ln = el('div', 'q__lines'); p.lines.forEach(function (t) { ln.appendChild(el('div', null, t)); }); qEl.appendChild(ln); }
    if (p.img) { var im = el('img', 'q__img'); im.src = p.img; im.alt = p.imgAlt || ''; qEl.appendChild(im); }
    var exb = renderEx(p.ex); if (exb) qEl.appendChild(exb);
    texIn(qEl);

    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') qEl.appendChild(renderMC(p));
    else if (p.type === 'short-1') qEl.appendChild(renderShort(p, 1));
    else if (p.type === 'short-2') qEl.appendChild(renderShort(p, 2));
    else if (p.type === 'fraction') qEl.appendChild(renderFraction(p));
    if (p.type === 'short-1' || p.type === 'short-2' || p.type === 'fraction') qEl.appendChild(el('div', 'ans-correct'));

    // 콘솔바 CTA 초기화
    gradeBtn.hidden = false;
    gradeBtn.disabled = true;
    setCta('채점하기');
    revealPending = false;

    renderProgress();
    guideInput();
    requestAnimationFrame(updateFade);
  }

  function renderMC(p) {
    var count = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'qopts-grid' : 'qopts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'qopt');
      if (p.type === 'mc-num') { opt.classList.add('qopt--num'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('qopt--img'); opt.appendChild(el('span', 'qopt__img')); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
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
    guideInput();
  }

  /* ---- 채점 / 다음 ---- */
  gradeBtn.addEventListener('click', function () { if (!graded) grade(); else next(); });
  qEl.addEventListener('click', function (e) {
    if (graded && revealPending && e.target.closest('.qopt.is-wrong, .sinput.is-wrong')) reveal();
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
    // 오답 칸은 눌러야 정답이 열리므로 잠그지 않는다(.is-reveal) — 나머지만 잠근다
    qEl.querySelectorAll('.sinput').forEach(function (x) { if (x.classList.contains('is-wrong')) x.classList.add('is-reveal'); else x.disabled = true; });
    closePad();

    // 분수 오답 → 아래에 온전한 분수로 정답 표기('3/4' 사선표기 금지)
    // (주관식 1·2칸은 각 칸 아래에 showFieldAns 로 표기)
    if (!ok && p.type === 'fraction') {
      var ac = qEl.querySelector('.ans-correct');
      if (ac) { ac.innerHTML = '정답 <span class="frac"><span class="frac__n">' + p.answer.num + '</span><span class="frac__d">' + p.answer.den + '</span></span>'; }   // 보이는 건 reveal() 때
    }

    graded = true;
    // 칸이 여럿인 문항에서 일부만 맞으면 「일부」(△) — 채점 · 「다음」 잠금은 오답과 같다
    var some = qEl.querySelectorAll('.sinput.is-correct').length > 0;
    results[idx] = ok ? 'correct' : some ? 'partial' : 'wrong';
    renderProgress();

    if (ok) { guide.set('정답이에요!', 'ok'); settle(); }
    else {
      revealPending = true;
      var rw = qEl.querySelector('.qopts-row, .qopts-grid'); if (rw) rw.classList.add('is-reveal');
      gradeBtn.disabled = true; setCta(idx < TOTAL - 1 ? '다음 문제' : '결과보기');
      guide.set('오답을 눌러 정답을 확인해 보세요!', 'no');
    }
  }

  /* 오답을 눌러야 정답이 열린다(테스트 서버 동작을 받아들임, 2026-10-15). 열기 전에는 「다음」이 꺼져 있다. */
  function reveal() {
    var p = PROBLEMS[idx];
    revealPending = false;
    var row = qEl.querySelector('.qopts-row, .qopts-grid');
    if (row) { row.classList.remove('is-reveal'); var c = row.querySelectorAll('.qopt')[p.answer]; if (c) c.classList.add('is-correct'); }
    qEl.querySelectorAll('.sinput.is-wrong').forEach(function (x) { x.classList.remove('is-reveal'); x.disabled = true; });
    qEl.querySelectorAll('.sfield__ans, .ans-correct').forEach(function (a) { if (a.innerHTML) a.classList.add('show'); });
    guide.set('');
    settle();
  }
  /* 문제가 끝났을 때 CTA — 마지막 문제면 「결과보기」 */
  function settle() {
    if (idx < TOTAL - 1) { setCta('다음 문제'); gradeBtn.disabled = false; }
    else { gradeBtn.hidden = true; nextStepBtn.hidden = false; nextStepBtn.disabled = false; }
  }

  function next() { if (idx < TOTAL - 1) { idx++; renderQ(); } }

  function mark(inp, ok) { inp.classList.add(ok ? 'is-correct' : 'is-wrong'); }
  function norm(s) { return String(s).replace(/\s+/g, '').toLowerCase(); }
  function showFieldAns(input, ans) {
    var field = input.closest('.sfield'); if (!field) return;
    var slot = field.querySelector('.sfield__ans');
    if (slot) slot.innerHTML = '정답 <b>' + ans + '</b>';   // 보이는 건 reveal() 때
  }

  /* 하단 '결과보기' → 스텝 결과 화면 (마지막 문제 채점 시 활성) */
  nextStepBtn.addEventListener('click', function () { if (nextStepBtn.disabled) return; window.location.href = SET.next || 'shared/step-result.html?step=ops'; });

  /* 라이트/다크 토글 */
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
    } else if (p.type === 'short-1') {
      qEl.querySelector('.sinput').value = ok ? p.answer : '0'; checkFilled();
    } else if (p.type === 'short-2') {
      var ins = qEl.querySelectorAll('.sinput');
      ins[0].value = ok ? p.answer[0] : '0'; ins[1].value = ok ? p.answer[1] : '0'; checkFilled();
    } else if (p.type === 'fraction') {
      qEl.querySelector('[data-i="num"]').value = ok ? p.answer.num : '0';
      qEl.querySelector('[data-i="den"]').value = ok ? p.answer.den : '0'; checkFilled();
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
    title: (SET.title || '기초 연산') + ' · 현재 문제',
    actions: [
      { label: '정답 처리', tone: 'ok', run: function () { dbgAnswer(true); } },
      { label: '오답 처리', tone: 'no', run: function () { dbgAnswer(false); } },
      { label: '정답 공개', run: function () { if (revealPending) reveal(); } },
      { label: '전부 풀기', run: dbgSolveAll }
    ]
  });

  renderQ();
})();
