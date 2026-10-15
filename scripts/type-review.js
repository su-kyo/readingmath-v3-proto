/* =========================================================================
   유형 훈련 · 해설 보기 (읽기 전용 리뷰)
   - 내가 푼 답 + 정오답 표기, 모든 문제 하단 오답 해설 박스
   - 좌우 화살표 / 다음 문제로 이동, 캡 아이콘으로 오답만 점프
   - 타이머는 pause(정지) 상태로 표시
   ========================================================================= */
(function () {
  /* 문항 · 정답 · 해설은 풀이 화면과 같은 과목별 데이터 — scripts/type-quiz-data-math.js · type-quiz-data-sci.js
     내가 고른 답(picked) = 데이터의 pick(데모 오답), 없으면 정답 */
  var SET = window.RMTypeData[window.RMSubject.id];
  var PROBLEMS = SET.problems.map(function (p) {
    var o = {}; for (var k in p) o[k] = p[k];
    o.picked = ('pick' in p) ? p.pick : p.answer;
    return o;
  });

  /* 제한 시간 — 머리줄 글자가 정본(scripts/learn-timer.js 가 읽는다. 이 스크립트가 먼저 돈다) */
  var limEl = document.querySelector('.lheader__limit');
  if (limEl && SET.limit) limEl.textContent = '/ ' + SET.limit;

  /* 글 속 $…$ → KaTeX. 서버 수식의 기호 글자(△ ∴ ∵ ⊥ ∽)는 KaTeX 명령으로 바꿔 그린다 — type-quiz.js 와 같은 규칙 */
  var SYM = { '△': '\\triangle ', '∴': '\\therefore ', '∵': '\\because ', '⊥': '\\perp ', '∽': '\\backsim ' };
  function tex(s) {
    return String(s).split('$').map(function (part, i) {
      if (i % 2 === 0 || !window.katex) return part;
      return window.katex.renderToString(part.replace(/[△∴∵⊥∽]/g, function (c) { return SYM[c]; }), { throwOnError: false, strict: false });
    }).join('');
  }
  /* 해설 — 한 줄이 한 덩이, { img } 줄은 해설 그림 */
  function expHTML(lines) {
    return lines.map(function (l) {
      return typeof l === 'object' ? '<img class="explain__img" src="' + l.img + '" alt="해설 그림" />' : '<p class="explain__line">' + tex(l) + '</p>';
    }).join('');
  }

  var TOTAL = PROBLEMS.length;
  var idx = 0;

  var progressEl = document.getElementById('progress');
  var qEl = document.getElementById('q');
  var opsScroll = document.getElementById('opsScroll');
  var prevArrow = document.getElementById('prevArrow');
  var nextArrow = document.getElementById('nextArrow');
  var nextBtn = document.getElementById('nextBtn');
  var resultBtn = document.getElementById('resultBtn');
  // 오답은 눌러야 정답이 보인다(테스트 서버 동작을 받아들임, 2026-10-15). 문제마다 한 번 열면 계속 열려 있다.
  var revealed = PROBLEMS.map(function () { return false; });
  function pending() { return !isCorrect(idx) && !revealed[idx]; }

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
  // 헤더 타이머 = 제출 시점(정지) — 값은 HTML, 동작은 scripts/learn-timer.js

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
    if (ex.kind === 'text') { var list = el('div', 'ex__list'); ex.items.forEach(function (t) { list.appendChild(el('div', null, tex(t))); }); box.appendChild(list); }
    else if (ex.kind === 'shape') box.appendChild(el('div', 'ex__shape', ex.svg));
    else box.appendChild(el('div', 'ex__skel', ex.label || '이미지'));
    return box;
  }

  /* ---- 문제 (읽기 전용, 정오답 표기) ---- */
  function renderQ() {
    qEl.innerHTML = '';
    opsScroll.scrollTop = 0;
    var p = PROBLEMS[idx];
    qEl.appendChild(el('div', 'q__text', tex(p.q)));
    if (p.img) { var im = el('img', 'q__img'); im.src = p.img; im.alt = '문제 그림'; qEl.appendChild(im); }
    var exb = renderEx(p.ex); if (exb) qEl.appendChild(exb);

    if (p.type === 'mc-num' || p.type === 'mc-text' || p.type === 'mc-image') qEl.appendChild(renderMC(p));
    else qEl.appendChild(renderShort(p));

    // 오답 해설 박스 (모든 문제)
    var exp = el('div', 'explain');
    exp.appendChild(el('div', 'explain__head', '💡 해설'));
    exp.appendChild(el('div', 'explain__body', expHTML(p.exp)));
    qEl.appendChild(exp);

    qEl.classList.toggle('is-reveal', pending());
    renderProgress();
    updateNav();
    requestAnimationFrame(updateFade);
  }
  qEl.addEventListener('click', function (e) {
    if (pending() && e.target.closest('.qopt.is-wrong, .sinput.is-wrong')) { revealed[idx] = true; renderQ(); }
  });

  function renderMC(p) {
    var count = (p.type === 'mc-image') ? p.options.length : (typeof p.options === 'number' ? p.options : p.options.length);
    var wrap = el('div', (p.grid || p.type === 'mc-image') ? 'qopts-grid' : 'qopts-row');
    for (var i = 0; i < count; i++) {
      var opt = el('button', 'qopt');
      if (p.type === 'mc-num') { opt.classList.add('qopt--num'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); }
      else if (p.type === 'mc-image') { opt.classList.add('qopt--img'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); opt.appendChild(el('span', 'qopt__img')); }
      else { opt.classList.add('qopt--text'); opt.appendChild(el('span', 'qopt__num', String(i + 1))); opt.appendChild(el('span', null, tex(p.options[i]))); }
      if (i === p.answer && !pending()) opt.classList.add('is-correct');
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
        f.appendChild(field(val, correct));
        if (p.unit) f.appendChild(el('span', 'sfield__unit', p.unit));
        row.appendChild(f);
      }
    }
    // 틀린 주관식 → 정답 표시
    var wrap = el('div', 'ans-wrap');
    wrap.appendChild(row);
    if (!isCorrect(idx) && revealed[idx]) {
      var ans = p.type === 'short-2' ? p.answer.join(', ') : p.type === 'fraction' ? fracHTML(p.answer.num, p.answer.den) : p.answer + (p.unit ? ' ' + p.unit : '');
      var ac = el('div', 'ans-correct show', '정답 <b>' + ans + '</b>');
      wrap.appendChild(ac);
    }
    return wrap;
  }
  function field(val, correct) {
    var inp = el('input', 'sinput ' + (correct ? 'is-correct' : 'is-wrong')); inp.type = 'text'; inp.value = val; inp.readOnly = true; inp.tabIndex = -1; return inp;
  }

  /* ---- 이동 ---- */
  function go(i) { if (i >= 0 && i < TOTAL) { idx = i; renderQ(); } }
  function updateNav() {
    prevArrow.disabled = (idx === 0);
    nextArrow.disabled = (idx === TOTAL - 1);
    nextBtn.hidden = (idx === TOTAL - 1);        // 콘솔바 CTA 한 자리 — 마지막 문제에서만 「결과보기」
    if (resultBtn) resultBtn.hidden = !nextBtn.hidden;
    // 콘솔바 안내(RM-PART-07)
    if (window.RMGuide) window.RMGuide.set(pending() ? '오답을 눌러 정답을 확인해 보세요!' : '위쪽 문항 표시나 화살표를 눌러 이동할 수 있어요!', pending() ? 'no' : '');
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
