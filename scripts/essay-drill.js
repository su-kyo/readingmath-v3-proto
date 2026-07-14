/* =========================================================================
   서술형 훈련 2단계 — 기본 다지기 (essay-drill, 수학·과학 공용 폼)
   한 문제 = ① 문제 끊어읽기(상단 카드, 읽은 뒤 접힘·상주)
            → ② 빈칸 맞추기(해설 끊어읽기 + 즉시 채점)
            → ③ 순서 맞추기(여러 문장 끊어읽기: 읽기전용 문장 + 배치 문장[고정텍스트+슬롯])
            → 다음 문제
   · 배치 문장 = 슬롯을 전부 채우면 채점 → 정답 자리만 잠기고 오답은 튕겨나감.
   ========================================================================= */
(function () {
  /* arrange 문장: {text} = 읽기전용 / {parts:[...], blocks:[...]} = 배치.
     parts 원소: 문자열 = 고정 텍스트, {slot:'정답'} = 채울 슬롯. blocks = 이 문장의 보기(정답+오답, 셔플). */
  var PROBLEMS = [
    {
      statement: [
        '학급 문고에 책이 178권이 있었습니다.',
        '어제까지 29권의 책을 빌려갔고, 오늘은 어제까지 빌린 책 중 17권을 학급 문고에 반납하였습니다.',
        '오후에 책장을 보니 오늘은 35권의 책을 빌려갔습니다.',
        '지금 학급 문고에 남아 있는 책은 몇 권인지 구해 보세요.'
      ],
      image: null,
      chunks: [
        '(남아 있는 책의 수) = (학급 문고의 책의 수) − (어제까지 빌려간 책의 수) + (오늘 반납한 책의 수) − (오늘 빌려간 책의 수) 입니다.',
        '따라서 남아 있는 책의 수는 178 − {b1} + 17 − 35 =',
        '149 + 17 − 35 = {b2} − 35 =',
        '{b3} (권) 입니다.'
      ],
      blanks: {
        b1: { type: 'choice', ans: '29', choices: ['17', '29', '35', '12'] },
        b2: { type: 'short', ans: '166' },
        b3: { type: 'short', ans: '131' }
      },
      arrange: [
        { text: '먼저 남아 있는 책의 수를 구하는 식을 세워 볼까요?' },
        {
          parts: ['(남아 있는 책의 수) =', { slot: '(학급 문고의 책의 수) −' }, { slot: '(어제까지 빌려간 책의 수) +' }, { slot: '(오늘 반납한 책의 수) −' }, { slot: '(오늘 빌려간 책의 수)' }],
          blocks: ['(학급 문고의 책의 수) −', '(어제까지 빌려간 책의 수) +', '(오늘 반납한 책의 수) −', '(오늘 빌려간 책의 수)']
        },
        { text: '이제 각 항에 알맞은 수를 넣어 차례대로 계산하면 됩니다.' },
        {
          parts: ['따라서 남아 있는 책은 모두', { slot: '131권' }, '입니다.'],
          blocks: ['131권', '149권', '166권']
        }
      ]
    },
    {
      statement: [
        '과일 가게에 사과가 240개 있었습니다.',
        '오전에 85개를 팔았고, 낮에는 상자로 60개를 새로 들여왔습니다.',
        '오후에는 사과 47개를 더 팔았습니다.',
        '지금 가게에 남아 있는 사과는 몇 개인지 구해 보세요.'
      ],
      image: null,
      chunks: [
        '(남아 있는 사과 수) = (처음 사과 수) − (오전에 판 사과 수) + (새로 들여온 사과 수) − (오후에 판 사과 수) 입니다.',
        '따라서 남아 있는 사과 수는 240 − {b1} + 60 − 47 =',
        '155 + 60 − 47 = {b2} − 47 =',
        '{b3} (개) 입니다.'
      ],
      blanks: {
        b1: { type: 'choice', ans: '85', choices: ['47', '60', '85', '95'] },
        b2: { type: 'short', ans: '215' },
        b3: { type: 'short', ans: '168' }
      },
      arrange: [
        { text: '남아 있는 사과 수를 구하는 식을 먼저 세워 봅니다.' },
        {
          parts: ['(남아 있는 사과 수) =', { slot: '(처음 사과 수) −' }, { slot: '(오전에 판 사과 수) +' }, { slot: '(새로 들여온 사과 수) −' }, { slot: '(오후에 판 사과 수)' }],
          blocks: ['(처음 사과 수) −', '(오전에 판 사과 수) +', '(새로 들여온 사과 수) −', '(오후에 판 사과 수)']
        },
        { text: '식의 각 항에 수를 넣어 계산해 보겠습니다.' },
        {
          parts: ['따라서 남아 있는 사과는 모두', { slot: '168개' }, '입니다.'],
          blocks: ['168개', '155개', '215개']
        }
      ]
    },
    {
      statement: [
        '주차장에 자동차가 156대 있었습니다.',
        '오전에 48대가 빠져나갔고, 점심때 다시 23대가 들어왔습니다.',
        '오후에는 37대가 더 빠져나갔습니다.',
        '지금 주차장에 남아 있는 자동차는 몇 대인지 구해 보세요.'
      ],
      image: null,
      chunks: [
        '(남아 있는 자동차 수) = (처음 자동차 수) − (오전에 나간 자동차 수) + (점심때 들어온 자동차 수) − (오후에 나간 자동차 수) 입니다.',
        '따라서 남아 있는 자동차 수는 156 − {b1} + 23 − 37 =',
        '108 + 23 − 37 = {b2} − 37 =',
        '{b3} (대) 입니다.'
      ],
      blanks: {
        b1: { type: 'choice', ans: '48', choices: ['23', '37', '48', '52'] },
        b2: { type: 'short', ans: '131' },
        b3: { type: 'short', ans: '94' }
      },
      arrange: [
        { text: '남아 있는 자동차 수를 구하는 식부터 세워 봅니다.' },
        {
          parts: ['(남아 있는 자동차 수) =', { slot: '(처음 자동차 수) −' }, { slot: '(오전에 나간 자동차 수) +' }, { slot: '(점심때 들어온 자동차 수) −' }, { slot: '(오후에 나간 자동차 수)' }],
          blocks: ['(처음 자동차 수) −', '(오전에 나간 자동차 수) +', '(점심때 들어온 자동차 수) −', '(오후에 나간 자동차 수)']
        },
        { text: '각 항에 수를 넣어 차례로 계산합니다.' },
        {
          parts: ['따라서 남아 있는 자동차는 모두', { slot: '94대' }, '입니다.'],
          blocks: ['94대', '108대', '131대']
        }
      ]
    }
  ];
  var N = PROBLEMS.length;

  // ── DOM ──
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  var readBody = document.getElementById('readBody');
  var worksheet = document.getElementById('worksheet');
  var wsLabel = document.getElementById('wsLabel');
  var fillView = document.getElementById('fillView');
  var arrangeView = document.getElementById('arrangeView');
  var sol = document.getElementById('sol');
  var asol = document.getElementById('asol');
  var tray = document.getElementById('tray');
  var poolEl = document.getElementById('pool');
  var stepsQ = document.getElementById('stepsQ');
  var pillFill = document.getElementById('pillFill');
  var pillArrange = document.getElementById('pillArrange');
  var primaryBtn = document.getElementById('primaryBtn');
  var primaryLabel = document.getElementById('primaryLabel');
  var stageAction = document.getElementById('stageAction');

  // 콘텐츠 하단 진입 버튼 = 단계 완료 시에만 노출 (콘솔바 아님)
  function showAction(label) { primaryLabel.textContent = label; stageAction.classList.add('is-ready'); }
  function hideAction() { stageAction.classList.remove('is-ready'); }

  var pi = -1, phase = 'read', P = null;
  var blankMap = {}, chunkEls = [], curChunk = 0;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var toast = document.getElementById('dtoast'), toastT = null;
  function showToast(msg, isErr) {
    toast.textContent = msg; toast.classList.toggle('is-err', !!isErr); toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 1900);
  }
  function blankHTML(id) {
    return '<span class="blank" data-blank="' + id + '"><span class="blank__ans"></span><span class="blank__badge">' + id.replace('b', '') + '</span></span>';
  }
  function chunkHTML(text) {
    var t = text;
    if (P.blanks) Object.keys(P.blanks).forEach(function (id) { t = t.replace('{' + id + '}', blankHTML(id)); });
    return '<span class="chunk">' + t + '<span class="chunk__go">계속 ›</span></span>';
  }

  /* ===================== ① 문제 끊어읽기 (상단 카드) ===================== */
  var readCur = 0;
  function openRead() {
    phase = 'read'; readCur = 0;
    problem.classList.remove('is-collapsible', 'is-collapsed');
    readBody.innerHTML = P.statement.map(chunkHTML).join('') +
      (P.image ? '<div class="problem__img"><img src="' + P.image + '" alt="문제 이미지" /></div>' : '');
    worksheet.hidden = true; tray.hidden = true; fillView.hidden = false; arrangeView.hidden = true;
    renderRead();
  }
  function renderRead() {
    var els = readBody.querySelectorAll('.chunk');
    var last = els.length - 1;
    els.forEach(function (el, i) {
      el.classList.toggle('is-hidden', i > readCur);
      // 마지막 문장까지 탭으로 진행 (별도 '문제 풀기' 버튼 없이 여기서 풀이 시작)
      el.classList.toggle('is-tappable', i === readCur);
      var go = el.querySelector('.chunk__go');
      if (go) go.textContent = (i === last ? '풀이 시작 ›' : '계속 ›');
    });
  }
  readBody.addEventListener('click', function (e) {
    var el = e.target.closest('.chunk.is-tappable'); if (!el) return;
    var els = readBody.querySelectorAll('.chunk');
    if (readCur >= els.length - 1) {
      // 마지막 문장 탭 = 풀이 시작
      els.forEach(function (c) { c.classList.remove('is-hidden', 'is-tappable'); });
      problem.classList.add('is-collapsible', 'is-collapsed');
      startFill();
    } else { readCur++; renderRead(); }
  });
  problemHead.addEventListener('click', function () {
    if (!problem.classList.contains('is-collapsible')) return;
    problem.classList.toggle('is-collapsed');
  });

  /* ===================== ② 빈칸 맞추기 ===================== */
  function startFill() {
    phase = 'fill'; setSteps();
    worksheet.hidden = false; tray.hidden = true;
    fillView.hidden = false; arrangeView.hidden = true;
    wsLabel.textContent = '풀이';
    blankMap = P.blanks || {};
    sol.innerHTML = P.chunks.map(chunkHTML).join('');
    chunkEls = [].slice.call(sol.querySelectorAll('.chunk'));
    curChunk = 0;
    hideAction();
    renderFill();
  }
  function renderFill() {
    chunkEls.forEach(function (el, i) { el.classList.toggle('is-hidden', i > curChunk); el.classList.remove('is-tappable'); });
    sol.querySelectorAll('.blank.is-active').forEach(function (b) { b.classList.remove('is-active'); });
    var active = chunkEls[curChunk];
    var pending = active.querySelector('.blank:not(.is-filled)');
    if (pending) pending.classList.add('is-active');
    else if (curChunk < chunkEls.length - 1) active.classList.add('is-tappable');
  }
  function fillBlank(el, value) {
    el.querySelector('.blank__ans').textContent = value;
    el.classList.remove('is-active', 'is-sel'); el.classList.add('is-filled');
    var active = chunkEls[curChunk];
    if (active.querySelector('.blank:not(.is-filled)')) { renderFill(); return; }
    if (curChunk < chunkEls.length - 1) { curChunk++; renderFill(); }
    else fillComplete();
  }
  function fillComplete() {
    pillFill.classList.remove('is-on'); pillFill.classList.add('is-done');
    showAction('순서 맞추기');
    showToast('빈칸을 모두 맞혔어요! 순서 맞추기로 이동해요.');
  }
  sol.addEventListener('click', function (e) {
    var bl = e.target.closest('.blank.is-active'); if (bl) { openPop(bl); return; }
    var tap = e.target.closest('.chunk.is-tappable');
    if (tap) { if (curChunk < chunkEls.length - 1) { curChunk++; renderFill(); } }
  });

  /* ── 입력 드롭다운 (즉시 채점) ── */
  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var activeId = null, selEl = null, buffer = '';
  function place(anchor) {
    var r = anchor.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight, gap = 9, pad = 8;
    var cx = r.left + r.width / 2;
    var left = Math.min(Math.max(pad, cx - pw / 2), vw - pw - pad);
    var up = false, top;
    if (r.bottom + gap + ph <= vh - pad) top = r.bottom + gap;
    else if (r.top - gap - ph >= pad) { top = r.top - gap - ph; up = true; }
    else top = r.bottom + gap;
    top = Math.max(pad, Math.min(top, vh - ph - pad));
    pop.style.left = Math.round(left) + 'px'; pop.style.top = Math.round(top) + 'px';
    pop.classList.toggle('qpop--up', up);
    var caretX = Math.min(Math.max(14, cx - left), pw - 14);
    caret.style.left = (caretX - 6) + 'px'; caret.style.top = up ? (ph - 6) + 'px' : '-6px';
  }
  var PAD_KEYS = [['7', '7'], ['8', '8'], ['9', '9'], ['back', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5H9l-6 7 6 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M16 9l-4 4M12 9l4 4"/></svg>'], ['4', '4'], ['5', '5'], ['6', '6'], ['clear', 'C'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['-', '−'], ['0', '0'], ['.', '.'], ['ok', '확인']];
  function openPop(anchor) {
    activeId = anchor.dataset.blank;
    if (selEl) selEl.classList.remove('is-sel'); selEl = anchor;
    var slot = blankMap[activeId];
    if (slot.type === 'choice') {
      if (!anchor._dead) anchor._dead = {};
      popBody.innerHTML = '<div class="qpop__opts">' + slot.choices.map(function (c) {
        return '<button class="pop-opt' + (anchor._dead[c] ? ' is-dead' : '') + '" data-val="' + c + '">' + c + '</button>';
      }).join('') + '</div>';
    } else {
      buffer = '';
      var grid = PAD_KEYS.map(function (k) {
        return '<button class="qpop__key' + (k[0] === 'ok' ? ' qpop__key--ok' : '') + '" data-k="' + k[0] + '">' + k[1] + '</button>';
      }).join('');
      popBody.innerHTML = '<div class="qpop__pad"><div class="qpop__display" id="popDisp">0</div><div class="qpop__grid">' + grid + '</div></div>';
    }
    pop.classList.add('is-open'); place(anchor);
  }
  function closePop() { pop.classList.remove('is-open'); activeId = null; }
  function norm(s) { return String(s).replace(/\s+/g, '').trim(); }
  popBody.addEventListener('click', function (e) {
    var opt = e.target.closest('.pop-opt');
    if (opt) {
      var val = opt.dataset.val, ans = blankMap[activeId].ans;
      if (val === ans) { var el = selEl; closePop(); fillBlank(el, val); return; }
      selEl._dead[val] = true;
      opt.classList.remove('is-wrong'); void opt.offsetWidth; opt.classList.add('is-wrong', 'is-dead');
      showToast('오답이에요. 다시 골라 볼까요?', true); return;
    }
    var key = e.target.closest('.qpop__key'); if (key) handleKey(key.dataset.k);
  });
  function handleKey(k) {
    if (k === 'back') buffer = buffer.slice(0, -1);
    else if (k === 'clear') buffer = '';
    else if (k === 'ok') { checkShort(); return; }
    else if (k === '-') buffer = buffer.charAt(0) === '-' ? buffer.slice(1) : '-' + buffer;
    else if (k === '.') { if (buffer.replace('-', '').indexOf('.') < 0) buffer += (buffer === '' || buffer === '-' ? '0.' : '.'); }
    else buffer += k;
    var d = document.getElementById('popDisp'); if (d) d.textContent = buffer || '0';
  }
  function checkShort() {
    if (buffer === '') return;
    if (norm(buffer) === norm(blankMap[activeId].ans)) { var el = selEl; closePop(); fillBlank(el, buffer); return; }
    var d = document.getElementById('popDisp');
    if (d) { d.classList.remove('is-wrong'); void d.offsetWidth; d.classList.add('is-wrong'); }
    showToast('오답이에요. 다시 계산해 볼까요?', true);
  }
  document.addEventListener('click', function (e) {
    if (!pop.classList.contains('is-open')) return;
    if (e.target.closest('#qpop') || e.target.closest('.blank')) return;
    closePop();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('is-open')) closePop(); });
  document.querySelector('.stage-scroll').addEventListener('scroll', function () { if (pop.classList.contains('is-open')) closePop(); }, true);
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) closePop(); });

  /* ===================== ③ 순서 맞추기 (문장 끊어읽기 + 배치) ===================== */
  var aChunks = [], ac = 0;
  var aCorrect = [], aPlaced = [], aLocked = [], aPool = [], aChecking = false;

  function startArrange() {
    phase = 'arrange'; setSteps();
    worksheet.hidden = false; fillView.hidden = true; arrangeView.hidden = false;
    wsLabel.textContent = '풀이 완성하기';
    aChunks = P.arrange;
    // DOM 빌드: 고정텍스트 + 인라인 슬롯
    asol.innerHTML = aChunks.map(function (c, ci) {
      var inner;
      if (c.parts) {
        var si = 0;
        inner = c.parts.map(function (p) {
          if (typeof p === 'string') return p;
          return '<span class="slot is-empty" data-ac="' + ci + '" data-si="' + (si++) + '"></span>';
        }).join(' ');
      } else inner = c.text;
      return '<span class="chunk" data-ac="' + ci + '">' + inner + '<span class="chunk__go">계속 ›</span></span>';
    }).join('');
    ac = 0;
    hideAction();
    enterArrangeChunk();
  }
  function enterArrangeChunk() {
    var els = asol.querySelectorAll('.chunk');
    els.forEach(function (el, i) { el.classList.toggle('is-hidden', i > ac); el.classList.remove('is-tappable'); });
    if (ac >= aChunks.length) { tray.hidden = true; arrangeComplete(); return; }
    var c = aChunks[ac];
    if (c.parts) {
      aCorrect = c.parts.filter(function (p) { return typeof p !== 'string'; }).map(function (p) { return p.slot; });
      aPlaced = aCorrect.map(function () { return null; });
      aLocked = aCorrect.map(function () { return false; });
      aPool = shuffle(c.blocks);
      aChecking = false;
      renderArrangeChunk();
      tray.hidden = false;
    } else {
      asol.querySelector('.chunk[data-ac="' + ac + '"]').classList.add('is-tappable');
      tray.hidden = true;
    }
  }
  function renderArrangeChunk() {
    var slots = asol.querySelectorAll('.slot[data-ac="' + ac + '"]');
    slots.forEach(function (el, si) {
      el.className = 'slot';
      if (aLocked[si]) { el.classList.add('is-locked'); el.innerHTML = aCorrect[si] + '<span class="slot__ck">✓</span>'; }
      else if (aPlaced[si] !== null) { el.classList.add('is-filled'); el.textContent = aPlaced[si]; }
      else { el.classList.add('is-empty'); el.textContent = ''; }
    });
    poolEl.innerHTML = aPool.map(function (b) { return '<button class="block is-in" data-val="' + encodeURIComponent(b) + '">' + b + '</button>'; }).join('');
  }
  function aFirstEmpty() { for (var i = 0; i < aCorrect.length; i++) if (!aLocked[i] && aPlaced[i] === null) return i; return -1; }
  function aAllFilled() { for (var i = 0; i < aCorrect.length; i++) if (!aLocked[i] && aPlaced[i] === null) return false; return true; }

  poolEl.addEventListener('click', function (e) {
    if (aChecking) return;
    var chip = e.target.closest('.block'); if (!chip) return;
    var val = decodeURIComponent(chip.dataset.val);
    var i = aFirstEmpty(); if (i < 0) return;
    aPlaced[i] = val;
    var idx = aPool.indexOf(val); if (idx >= 0) aPool.splice(idx, 1);
    renderArrangeChunk();
    if (aAllFilled()) { aChecking = true; setTimeout(aCheck, 460); }
  });
  asol.addEventListener('click', function (e) {
    var tap = e.target.closest('.chunk.is-tappable');
    if (tap) { ac++; enterArrangeChunk(); return; }
    if (aChecking) return;
    var s = e.target.closest('.slot.is-filled[data-si]');
    if (s && +s.dataset.ac === ac) { var i = +s.dataset.si; aPool.push(aPlaced[i]); aPlaced[i] = null; renderArrangeChunk(); }
  });
  function aCheck() {
    var newLock = [], eject = [];
    aCorrect.forEach(function (c, i) { if (!aLocked[i] && aPlaced[i] !== null) { if (aPlaced[i] === c) newLock.push(i); else eject.push(i); } });
    var slots = asol.querySelectorAll('.slot[data-ac="' + ac + '"]');
    eject.forEach(function (i) { slots[i].classList.remove('is-filled'); slots[i].classList.add('is-wrong'); });
    newLock.forEach(function (i) { slots[i].classList.add('is-locked'); });
    setTimeout(function () {
      newLock.forEach(function (i) { aLocked[i] = true; });
      eject.forEach(function (i) { aPool.push(aPlaced[i]); aPlaced[i] = null; });
      renderArrangeChunk();
      aChecking = false;
      if (aLocked.every(Boolean)) { ac++; setTimeout(enterArrangeChunk, 280); }
      else showToast('정답 자리는 남았어요! 남은 블록을 다시 놓아 볼까요?', true);
    }, 560);
  }
  function arrangeComplete() {
    pillArrange.classList.remove('is-on'); pillArrange.classList.add('is-done');
    showAction(pi < N - 1 ? '다음 문제' : '결과 보기');
    showToast(pi < N - 1 ? '풀이를 완성했어요! 다음 문제로 넘어가요.' : '모든 문제를 완성했어요! 🎉');
  }

  /* ── 진행 표시 / primary ── */
  function setSteps() {
    stepsQ.textContent = '문제 ' + (pi + 1) + ' / ' + N;
    if (phase === 'arrange') { pillFill.className = 'stepbar__i is-done'; pillArrange.className = 'stepbar__i is-on'; }
    else { pillFill.className = 'stepbar__i is-on'; pillArrange.className = 'stepbar__i'; }
  }
  primaryBtn.addEventListener('click', function () {
    if (phase === 'fill') startArrange();
    else if (phase === 'arrange') { if (pi < N - 1) startProblem(pi + 1); else window.location.href = 'essay-step-result.html'; }
  });
  function startProblem(idx) {
    pi = idx; P = PROBLEMS[idx];
    pillFill.className = 'stepbar__i is-on'; pillArrange.className = 'stepbar__i';
    stepsQ.textContent = '문제 ' + (pi + 1) + ' / ' + N;
    hideAction();
    openRead();
  }

  /* ── 타이머 / 토글 ── */
  var timerEl = document.getElementById('timer'), sec = 0;
  setInterval(function () { sec++; timerEl.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }, 1000);
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });

  startProblem(0);
})();
