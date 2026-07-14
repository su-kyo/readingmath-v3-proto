/* =========================================================================
   유형 훈련 · 해설 보기 (읽기 전용 리뷰)
   - 내가 푼 답 + 정오답 표기, 모든 문제 하단 오답 해설 박스
   - 좌우 화살표 / 다음 문제로 이동, 캡 아이콘으로 오답만 점프
   - 타이머는 pause(정지) 상태로 표시
   ========================================================================= */
(function () {
  var TRAP = '<svg viewBox="0 0 320 200" width="300" xmlns="http://www.w3.org/2000/svg"><polygon points="40,170 220,170 300,40 40,40" fill="#C7D3E6"/></svg>';
  function exText(items) { return { kind: 'text', items: items }; }
  function exSkel(label) { return { kind: 'skel', label: label }; }
  function exShape(svg) { return { kind: 'shape', svg: svg }; }

  // 문제 + 정답(answer) + 내가 고른 답(picked) + 해설(explain)
  var PROBLEMS = [
    { type: 'mc-num', q: '다음은 순물질과 혼합물에 대한 설명이다. 옳은 것을 고르시오.', ex: exText(['㉠ 물질마다 성질이 다양하다.', '㉡ 소금물은 혼합물이다.', '㉢ 모든 물질은 순물질이다.', '㉣ 공기는 순물질이다.', '㉤ 증류수는 순물질이다.']), options: 5, answer: 1, picked: 1, explain: '소금물은 두 가지 이상의 물질이 섞여 있으므로 혼합물입니다. 순물질은 한 가지 물질로만 이루어져 있습니다.' },
    { type: 'mc-text', q: '물체를 미는 모습과 당기는 모습 중 무엇인지 고르시오.', ex: exSkel('이미지 (유모차 / 휠체어)'), options: ['미는 모습', '당기는 모습'], answer: 1, picked: 1, explain: '휠체어를 뒤에서 잡아 몸 쪽으로 끌어오므로 당기는 모습입니다.' },
    { type: 'mc-text', grid: true, q: '다음 도형은 직사각형이 아닙니다. 그 이유로 바른 것을 고르세요.', ex: exShape(TRAP), options: ['네 각이 모두 직각이어야 하는데 직각인 각이 하나도 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 한 개밖에 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 두 개밖에 없기 때문입니다.', '네 각이 모두 직각이어야 하는데 직각인 각이 세 개 있기 때문입니다.'], answer: 1, picked: 1, explain: '직사각형은 네 각이 모두 직각이어야 합니다. 이 도형은 직각이 한 개뿐이라 직사각형이 아닙니다.' },
    { type: 'short-2', q: '마을별 신문 구독 수 그림그래프에서 ㉠, ㉡에 알맞은 수를 구하시오.', ex: exSkel('표 · 마을별 신문 구독 수'), tags: ['㉠', '㉡'], answer: ['10', '1'], picked: ['10', '1'], explain: '큰 그림은 10부, 작은 그림은 1부를 나타냅니다.' },
    { type: 'mc-num', q: '752 − 238 을 바르게 계산한 것은? (① 504  ② 514  ③ 524  ④ 526  ⑤ 534)', ex: null, options: 5, answer: 1, picked: 3, explain: '일의 자리 12−8=4, 십의 자리에서 받아내림하여 40−30=10, 700−200=500 → 514 입니다.' },
    { type: 'mc-text', q: '받아올림이 있는 덧셈에 대한 설명으로 옳은 것을 고르세요.', ex: null, options: ['자리 수가 10을 넘으면 윗자리로 1을 올린다.', '항상 일의 자리부터 빼서 계산한다.', '받아올림은 큰 수에서만 생긴다.'], answer: 0, picked: 0, explain: '같은 자리의 합이 10이거나 10보다 크면 바로 윗자리로 1을 받아올림합니다.' },
    { type: 'mc-image', q: '다음 중 삼각형인 것을 고르세요.', ex: null, options: [{ img: true }, { img: true }, { img: true }, { img: true }], answer: 2, picked: 2, explain: '세 개의 선분으로 둘러싸인 도형이 삼각형입니다.' },
    { type: 'short-1', q: '46 × 3 을 계산하면 얼마입니까?', ex: null, answer: '138', picked: '120', explain: '46 × 3 = (40×3) + (6×3) = 120 + 18 = 138 입니다.' },
    { type: 'fraction', q: '색칠한 부분을 분수로 나타내면 얼마입니까?', ex: null, answer: { num: '3', den: '4' }, picked: { num: '2', den: '4' }, explain: '전체를 똑같이 4로 나눈 것 중 3칸이 색칠되어 있으므로 <span class="frac frac--sm"><span class="frac__n">3</span><span class="frac__d">4</span></span> 입니다.' },
    { type: 'short-2', q: '63 ÷ 9 의 몫(㉠)과 84 ÷ 7 의 몫(㉡)을 각각 구하시오.', ex: null, tags: ['㉠', '㉡'], answer: ['7', '12'], picked: ['7', '12'], explain: '63 ÷ 9 = 7, 84 ÷ 7 = 12 입니다.' }
  ];

  var TOTAL = PROBLEMS.length;
  var idx = 0;
  var FROZEN_TIME = '12:45';   // 제출 시점 (타이머 정지)

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var opsScroll = document.getElementById('opsScroll');
  var prevArrow = document.getElementById('prevArrow');
  var nextArrow = document.getElementById('nextArrow');
  var nextBtn = document.getElementById('nextBtn');

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  // 온전한 분수 표기(읽기용). '3/4' 사선표기 금지 → 분자↑·가로선·분모↓
  function fracHTML(n, d) { return '<span class="frac"><span class="frac__n">' + n + '</span><span class="frac__d">' + d + '</span></span>'; }

  function isCorrect(i) {
    var p = PROBLEMS[i];
    if (p.type === 'short-2') return p.picked[0] === p.answer[0] && p.picked[1] === p.answer[1];
    if (p.type === 'fraction') return p.picked.num === p.answer.num && p.picked.den === p.answer.den;
    if (p.type === 'short-1') return p.picked === p.answer;
    return p.picked === p.answer;
  }

  /* ---- 캡 (o/x + 오답 점프) ---- */
  // 헤더 타이머 = 제출 시점(정지)
  var hdrTimerSpan = document.getElementById('timer');
  if (hdrTimerSpan) hdrTimerSpan.textContent = FROZEN_TIME;

  function renderProgress() {
    progressEl.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var c = el('span', 'pcirc');
      if (isCorrect(i)) c.classList.add('is-correct'); else c.classList.add('is-wrong');
      if (i === idx) c.classList.add('is-current');
      (function (i) { c.addEventListener('click', function () { idx = i; renderQ(); }); })(i);
      progressEl.appendChild(c);
    }
  }

  function renderEx(ex) {
    if (!ex) return null;
    var box = el('div', 'ex');
    if (ex.kind === 'text') { var list = el('div', 'ex__list'); ex.items.forEach(function (t) { list.appendChild(el('div', null, t)); }); box.appendChild(list); }
    else if (ex.kind === 'shape') box.appendChild(el('div', 'ex__shape', ex.svg));
    else box.appendChild(el('div', 'ex__skel', ex.label || '이미지'));
    return box;
  }

  /* ---- 문제 (읽기 전용, 정오답 표기) ---- */
  function renderQ() {
    qEl.innerHTML = '';
    opsScroll.scrollTop = 0;
    var p = PROBLEMS[idx];
    qEl.appendChild(el('div', 'q__text', p.q));
    var exb = renderEx(p.ex); if (exb) qEl.appendChild(exb);

    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') qEl.appendChild(renderMC(p));
    else qEl.appendChild(renderShort(p));

    // 오답 해설 박스 (모든 문제)
    var exp = el('div', 'explain');
    exp.appendChild(el('div', 'explain__head', '💡 해설'));
    exp.appendChild(el('div', 'explain__body', p.explain));
    qEl.appendChild(exp);

    renderProgress();
    updateNav();
    requestAnimationFrame(updateFade);
  }

  function renderMC(p) {
    var count = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'opts-grid' : 'opts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'opt');
      if (p.type === 'mc-num') { opt.classList.add('opt--num'); opt.appendChild(el('span', 'opt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('opt--img'); opt.appendChild(el('span', 'opt__num', String(i + 1))); opt.appendChild(el('span', 'opt__img')); }
      else { opt.classList.add('opt--text'); opt.appendChild(el('span', 'opt__num', String(i + 1))); opt.appendChild(el('span', null, p.options[i])); }
      if (i === p.answer) opt.classList.add('is-correct');
      if (i === p.picked && p.picked !== p.answer) opt.classList.add('is-wrong');
      wrap.appendChild(opt);
    }
    return wrap;
  }

  function renderShort(p) {
    var row = el('div', 'answer-row');
    if (p.type === 'fraction') {
      var fr = el('div', 'fraction');
      fr.appendChild(field(p.picked.num, p.picked.num === p.answer.num));
      fr.appendChild(el('div', 'fraction__bar'));
      fr.appendChild(field(p.picked.den, p.picked.den === p.answer.den));
      row.appendChild(fr);
    } else {
      var n = p.type === 'short-2' ? 2 : 1;
      for (var i = 0; i < n; i++) {
        var f = el('div', 'sfield');
        if (p.tags) f.appendChild(el('span', 'sfield__tag', p.tags[i]));
        var val = n === 2 ? p.picked[i] : p.picked;
        var correct = n === 2 ? (p.picked[i] === p.answer[i]) : (p.picked === p.answer);
        f.appendChild(field(val, correct)); row.appendChild(f);
      }
    }
    // 틀린 주관식 → 정답 표시
    var wrap = el('div');
    wrap.appendChild(row);
    if (!isCorrect(idx)) {
      var ans = p.type === 'short-2' ? p.answer.join(', ') : p.type === 'fraction' ? fracHTML(p.answer.num, p.answer.den) : p.answer;
      var ac = el('div', 'ans-correct show', '정답 <b>' + ans + '</b>');
      wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.alignItems = 'center';
      wrap.appendChild(ac);
    }
    return wrap;
  }
  function field(val, correct) {
    var inp = el('input', 'sinput ' + (correct ? 'is-correct' : 'is-wrong')); inp.type = 'text'; inp.value = val; inp.disabled = true; return inp;
  }

  /* ---- 이동 ---- */
  function go(i) { if (i >= 0 && i < TOTAL) { idx = i; renderQ(); } }
  function updateNav() {
    prevArrow.disabled = (idx === 0);
    nextArrow.disabled = (idx === TOTAL - 1);
    nextBtn.disabled = (idx === TOTAL - 1);
  }
  prevArrow.addEventListener('click', function () { go(idx - 1); });
  nextArrow.addEventListener('click', function () { go(idx + 1); });
  nextBtn.addEventListener('click', function () { go(idx + 1); });

  function updateFade() {
    var wrap = opsScroll.parentElement;
    wrap.classList.toggle('has-more', opsScroll.scrollTop + opsScroll.clientHeight < opsScroll.scrollHeight - 4);
    wrap.classList.toggle('has-more-top', opsScroll.scrollTop > 4);
  }
  opsScroll.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () { var c = document.documentElement.getAttribute('data-theme'); document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark'); });

  renderQ();
})();
