/* =========================================================================
   서술형 훈련 — 빈칸 채우기 엔진 (essay-basics-v2)
   1단계 기초 기르기 · 문장 완성하기(essay/basics-math · basics-sci.html)와
   3단계 실력 키우기(essay/advanced.html)가 같이 쓴다 — 셋 다 「풀이 문장 안의 빈칸」을 채우고 제출하는 화면이다.
   콘텐츠 = window.RMEssayFill (scripts/essay-basics-data-math|sci.js · essay-advanced-data-math.js).
   글 · 빈칸 읽기 = scripts/essay-sol.js.

   · 세로 단일 스크롤(문제 위 · 풀이 아래). 문제 카드는 열고 접기 + 스크롤 시 상단 스티키.
     카드 머리의 번호탭으로 문제를 오간다(실서비스 「1 · 2」 탭). 입력은 문제마다 따로 남는다.
   · 빈칸을 누르면 고르기 = 공용 빈칸 선지 창(blank-pop.js) · 숫자 = 서술형 키패드 창(.qpop).
     분수 칸은 분자 · 분모를 따로 넣는다. 여기서는 즉답 채점 없음 — 고른 값 · 입력한 값이 그대로 들어간다.
     채운 칸도 다시 눌러 고칠 수 있다. #{[n-k]} 자리는 그 칸의 값을 따라 보여 준다.
   · 한 문제를 다 채우면 아래 「다음 문제」, 모든 문제를 다 채우면 콘솔바 「결과보기」(제출) 활성화.
   ========================================================================= */
(function () {
  var D = window.RMEssayFill, E = window.RMEssay;
  var N = D.problems.length;
  var PS = D.problems.map(function (p) { return E.parse(p); });

  var expl = document.getElementById('expl');
  var readBody = document.getElementById('readBody');
  var qtabs = document.getElementById('qtabs');
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  var resultBtn = document.getElementById('resultBtn');
  var stageAction = document.getElementById('stageAction');
  var primaryBtn = document.getElementById('primaryBtn');
  var scroller = document.querySelector('.stage-scroll');

  /* ── 풀이 문단 묶기 ──
     빈칸이 없고 「…요.」「…요?」로 끝나는 줄 = 단계 소제목(굵게) → 새 문단을 연다.
     그림만 있는 줄은 그림 줄. 그 밖의 줄은 앞 문단에 이어 붙는다. */
  function isHead(line) {
    var hasBlank = line.some(function (c) { return c.some(function (t) { return t.t === 'blank'; }); });
    if (hasBlank) return false;
    var last = line[line.length - 1], tail = '';
    for (var i = last.length - 1; i >= 0 && !tail; i--) if (last[i].t === 'html') tail = last[i].h.replace(/<[^>]+>/g, '').trim();
    return /요[.?]$/.test(tail);
  }
  function lineHTML(line, P) {
    var flat = [];
    line.forEach(function (c, i) { if (i) flat.push({ t: 'html', h: '<br>' }); flat = flat.concat(c); });
    var onlyImg = flat.every(function (t) { return t.t === 'img' || (t.t === 'html' && !t.h.replace(/<br>|\s|&nbsp;|​/g, '')); });
    return '<div class="line' + (onlyImg ? ' line--img' : '') + (isHead(line) ? ' para__head' : '') + '">' + E.html(flat, P) + '</div>';
  }
  function docHTML(P) {
    var paras = [], cur = null;
    P.lines.forEach(function (line) {
      if (!cur || isHead(line)) { cur = []; paras.push(cur); }
      cur.push(lineHTML(line, P));
    });
    return paras.map(function (p) { return '<div class="para">' + p.join('') + '</div>'; }).join('');
  }

  expl.innerHTML = PS.map(function (P, i) {
    return '<div class="expl__doc" data-p="' + i + '"' + (i ? ' hidden' : '') + '>' + docHTML(P) + '</div>';
  }).join('');
  var docs = [].slice.call(expl.querySelectorAll('.expl__doc'));

  /* ── 상태 ── 칸 하나 = 빈칸 요소 하나(분수는 분자 · 분모 둘) */
  var pi = 0;
  var answers = PS.map(function () { return {}; });   // 문제별: 'id' 또는 'id|n' · 'id|d' → 값
  function keyOf(el) { return el.dataset.blank + (el.dataset.part ? '|' + el.dataset.part : ''); }
  function inputs(i) { return [].slice.call(docs[i].querySelectorAll('.blank[data-blank]')); }
  function isDone(i) { return inputs(i).every(function (el) { return answers[i][keyOf(el)] != null; }); }

  function renderTabs() {
    var html = '';
    for (var i = 0; i < N; i++) {
      var cls = 'qtab' + (i === pi ? ' is-active' : (isDone(i) ? ' is-done' : ''));
      html += '<button type="button" class="' + cls + '" data-i="' + i + '" aria-label="' + (i + 1) + '번 문제">' + (i + 1) + '</button>';
    }
    qtabs.innerHTML = html;
  }
  function renderProblem() {
    var st = E.statement(D.problems[pi]);
    readBody.innerHTML = '<div class="qtext">' + st.text.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</div>' +
      (st.media.length ? '<div class="qref">' + st.media.join('') + '</div>' : '');
  }
  function refresh() {
    renderTabs();
    var all = true; for (var i = 0; i < N; i++) if (!isDone(i)) all = false;
    resultBtn.disabled = !all;
    if (all) resultBtn.removeAttribute('title'); else resultBtn.title = '모든 빈칸을 채우면 활성화돼요';
    var showNext = isDone(pi) && pi < N - 1;
    stageAction.classList.toggle('is-ready', showNext);
    if (window.RMGuide) window.RMGuide.set(all ? '' : '모든 답안을 입력해 주세요!');   // 콘솔바 안내(RM-PART-07)
  }
  function go(i) {
    closePop();
    pi = i;
    docs.forEach(function (d, j) { d.hidden = j !== i; });
    renderProblem();
    refresh();
    if (scroller) scroller.scrollTop = 0;
  }

  /* 칸에 값 넣기 — 같은 칸을 다시 보여 주는 자리(#{[n-k]})도 따라 바뀐다 */
  function fill(el, value) {
    var i = +el.closest('.expl__doc').dataset.p;
    answers[i][keyOf(el)] = value;
    E.setVal(el, value);
    var id = el.dataset.blank, ev = value;
    if (el.dataset.part) {   // 분수 — 분자 · 분모가 다 있어야 다시 보여 준다
      var a = answers[i];
      ev = (a[id + '|n'] != null && a[id + '|d'] != null) ? [a[id + '|n'], a[id + '|d']] : null;
    }
    if (ev != null) E.syncEcho(docs[i], id, ev);
    refresh();
  }

  /* ── 빈칸 입력 창 ── */
  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var selEl = null, buffer = '';

  function place(anchor, reveal) {   /* 자리 = scripts/pop-place.js — 분수 칸은 처음부터 옆(짝 칸을 덮지 않게) */
    var at = window.RMPopPlace.place(pop, anchor, { reveal: reveal, side: true, sideFirst: !!anchor.closest('.efrac') });
    if (!at) { closePop(); return; }
    pop.classList.toggle('qpop--up', at.up);
    pop.classList.toggle('qpop--side', !!at.side);
    caret.style.left = (Math.min(Math.max(14, at.caretX), at.width - 14) - 6) + 'px';
    caret.style.top = at.up ? (at.height - 6) + 'px' : '-6px';
  }
  function fieldOf(el) { return PS[+el.closest('.expl__doc').dataset.p].fields[el.dataset.blank]; }

  function openPop(anchor) {
    closePop();   // 열린 창(고르기 · 키패드)부터 닫는다
    selEl = anchor; selEl.classList.add('is-sel');
    var f = fieldOf(anchor);
    if (f.type === 'choice') {   // 고르기 = 공용 빈칸 선지 창 · 채점 없이 고른 값을 그대로 넣는다
      window.RMBlankPop.open(anchor, { choices: f.choices.map(E.choice), onDone: function (v) { fill(anchor, v); }, onClose: closePop });
      return;
    }
    var i = +anchor.closest('.expl__doc').dataset.p;
    buffer = answers[i][keyOf(anchor)] || '';   // 이미 넣은 값이 있으면 이어서 고친다
    popBody.innerHTML = '<div class="qpop__pad">' + window.RMKeypad.html() + '</div>';
    var disp = popBody.querySelector('.keypad__display');
    disp.id = 'popDisp'; disp.textContent = buffer || '0';   /* 키패드 정본 = scripts/keypad.js */
    pop.classList.add('is-open');
    place(anchor, true);
  }
  function closePop() {
    pop.classList.remove('is-open');
    window.RMBlankPop.close();
    if (selEl) { selEl.classList.remove('is-sel'); selEl = null; }
  }
  function handleKey(k) {
    if (k === 'ok') { if (buffer !== '' && selEl) { var el = selEl, v = buffer; closePop(); fill(el, v); } return; }
    buffer = window.RMKeypad.apply(buffer, k);   /* 값 편집 규칙 = 공용 */
    var d = document.getElementById('popDisp');
    if (d) d.textContent = buffer || '0';
  }

  expl.addEventListener('click', function (e) {
    var el = e.target.closest('.blank[data-blank]');
    if (!el) return;
    if (selEl === el) { closePop(); return; }   // 같은 칸 다시 누르면 닫기(토글)
    openPop(el);
  });
  popBody.addEventListener('click', function (e) {
    var key = e.target.closest('.keypad__key');
    if (key) handleKey(key.dataset.k);
  });
  document.addEventListener('click', function (e) {
    if (!pop.classList.contains('is-open')) return;
    if (e.target.closest('#qpop') || e.target.closest('.blank')) return;
    closePop();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('is-open')) closePop(); });
  if (scroller) scroller.addEventListener('scroll', function () { if (pop.classList.contains('is-open') && selEl) place(selEl); }, true);
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) closePop(); });

  /* ── 문제 카드 · 번호탭 · 다음 문제 ── */
  if (problemHead) problemHead.addEventListener('click', function (e) {
    var t = e.target.closest('.qtab');
    if (t) { e.stopPropagation(); if (+t.dataset.i !== pi) go(+t.dataset.i); return; }
    if (!problem.classList.contains('is-collapsible')) return;
    problem.classList.toggle('is-collapsed');
  });
  primaryBtn.addEventListener('click', function () { if (pi < N - 1) go(pi + 1); });

  // 머리줄 타이머 = scripts/learn-timer.js
  resultBtn.addEventListener('click', function () {
    if (resultBtn.disabled) return;
    window.location.href = D.next;
  });

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  function answerOf(el, ok) {
    var f = fieldOf(el);
    if (f.type === 'choice') {
      if (ok) return f.answer;
      for (var i = 0; i < f.choices.length; i++) if (f.choices[i] !== f.answer) return f.choices[i];
      return f.answer;
    }
    if (!ok) return '0';
    var a = f.answer;
    return Array.isArray(a) ? (el.dataset.part === 'd' ? a[1] : a[0]) : a;
  }
  function dbgFill(ok, all) {
    closePop();
    (all ? docs.map(function (d, i) { return i; }) : [pi]).forEach(function (i) {
      inputs(i).forEach(function (el, j) { fill(el, answerOf(el, ok || j % 2 === 1)); });   // 섞기 = 짝수째 칸만 틀리게
    });
  }
  if (window.RMDebug) window.RMDebug.register({
    title: D.title + ' (세로)',
    actions: [
      { label: '이 문제 정답', tone: 'ok', run: function () { dbgFill(true, false); } },
      { label: '전부 정답', tone: 'ok', run: function () { dbgFill(true, true); } },
      { label: '정오답 섞기', tone: 'no', run: function () { dbgFill(false, true); } },
      { label: '다음 문제', run: function () { go((pi + 1) % N); } }
    ]
  });

  // 라이트/다크 토글 (헤더 해/달 노브)
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });

  go(0);
})();
