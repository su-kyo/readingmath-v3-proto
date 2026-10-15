/* =========================================================================
   서술형 훈련 3단계 — 탐구활동 보고서 만들기 (essay-report, 과학 전용)
   · 2열 n행 표 형태 보고서. 셀 안에는 텍스트·이미지·빈칸 등이 들어감.
   · 빈칸을 눌러 답 입력(주관식 키패드 / 객관식 세로보기 드롭다운, 라벨 없음).
     즉답 채점 없음 — 입력값 그대로 들어가고 채워진 칸도 다시 눌러 수정 가능.
   · 모든 빈칸을 채우면 '결과보기' + '보고서 미리보기' 활성화.
   · 미리보기 = 학생 입력대로 완성된 보고서를 보여주고 인쇄/저장 버튼 제공(데모).
   ========================================================================= */
/* =========================================================================
   서술형 훈련 3단계 — 탐구활동 보고서 만들기 (essay-report, 과학 전용)
   콘텐츠 = window.RMEssayReport (scripts/essay-report-data-sci.js) · 글 · 빈칸 읽기 = scripts/essay-sol.js.
   · 2열 n행 표 형태 보고서. 셀 안에는 텍스트·이미지·표·빈칸 등이 들어감.
   · 빈칸을 눌러 답 입력(주관식 키패드 / 고르기 = 공용 빈칸 선지 창).
     즉답 채점 없음 — 입력값 그대로 들어가고 채워진 칸도 다시 눌러 수정 가능.
   · 모든 빈칸을 채우면 '결과보기' + '보고서 미리보기' 활성화.
   · 미리보기 = 학생 입력대로 완성된 보고서를 보여주고 인쇄/저장 버튼 제공(데모).
   ========================================================================= */
(function () {
  var D = window.RMEssayReport, E = window.RMEssay, R = D.report;
  var proc = E.reportCell(R, R.process), res = E.reportCell(R, R.result);
  var ANSWERS = res.fields;   // 칸 id('1-1' …) → { type, choices, answer }

  /* ── 보고서 (2열 표) ─────────────────────────────────────── */
  var ROWS = [
    { label: '단원', cell: '<div class="rt-text">' + E.esc(R.unit) + '</div>' },
    { label: '주제', cell: '<div class="rt-text">' + E.inline(R.q) + '</div>' },
    { label: '관찰 목표', cell: '<div class="rt-text">' + E.inline(R.opt) + '</div>' },
    { label: '과정', cell: proc.html },
    { label: '결과 및 정리', cell: res.html }
  ];

  var report = document.getElementById('report');
  report.innerHTML = ROWS.map(function (r) {
    return '<div class="rt-label">' + r.label + '</div><div class="rt-cell">' + r.cell + '</div>';
  }).join('');

  /* ── 빈칸 상태 ──────────────────────────────────────────────────── */
  var order = [], byId = {}, filled = {}, answers = {};
  report.querySelectorAll('.blank[data-blank]').forEach(function (el) {
    var id = el.dataset.blank;
    if (!byId[id]) { byId[id] = []; order.push(id); }
    byId[id].push(el);
  });

  var previewBtn = document.getElementById('previewBtn');
  var resultBtn = document.getElementById('resultBtn');

  function refreshDone() {
    var done = order.every(function (id) { return filled[id]; });
    [previewBtn, resultBtn].forEach(function (btn) {
      btn.disabled = !done;
      if (done) btn.removeAttribute('title');
    });
    if (window.RMGuide) window.RMGuide.set(done ? '' : '모든 답안을 입력해 주세요!');   // 콘솔바 안내(RM-PART-07)
  }

  // 입력값을 그대로 빈칸에 넣음 (즉답 채점 없음, 같은 번호 함께)
  function fill(id, value) {
    filled[id] = true; answers[id] = value;
    byId[id].forEach(function (el) { E.setVal(el, value); });
    refreshDone();
  }

  /* ── 입력 드롭다운(팝오버) ──────────────────────────────────────── */
  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var activeId = null, selEl = null;

  function place(anchor, reveal) {   /* 자리 = scripts/pop-place.js — 머리줄 아래 ~ 콘솔바 위, 빈칸 아래 12px · 모자라면 위(꼬리도 아래로) */
    var at = window.RMPopPlace.place(pop, anchor, { reveal: reveal });
    if (!at) { closePop(); return; }
    pop.classList.toggle('qpop--up', at.up);
    caret.style.left = (Math.min(Math.max(14, at.caretX), at.width - 14) - 6) + 'px';
    caret.style.top = at.up ? (at.height - 6) + 'px' : '-6px';
  }

  var buffer = '';

  function openPop(anchor) {
    closePop();   // 열린 창(객관식 · 키패드)부터 닫는다
    var id = anchor.dataset.blank;
    activeId = id;
    selEl = anchor; selEl.classList.add('is-sel');

    var slot = ANSWERS[id];
    if (slot.type === 'choice') {   // 객관식 = 공용 빈칸 선지 창(scripts/blank-pop.js) · 채점 없이 고른 값을 그대로 넣는다
      window.RMBlankPop.open(anchor, { choices: slot.choices.map(E.choice), onDone: function (v) { fill(id, v); }, onClose: closePop });
      return;
    } else {
      buffer = answers[id] || '';
      popBody.innerHTML = '<div class="qpop__pad">' + window.RMKeypad.html() + '</div>';
      var disp = popBody.querySelector('.keypad__display');
      disp.id = 'popDisp'; disp.textContent = buffer || '0';   /* 키패드 정본 = scripts/keypad.js */
    }
    pop.classList.add('is-open');
    place(anchor, true);
  }

  function closePop() {
    pop.classList.remove('is-open');
    window.RMBlankPop.close();
    if (selEl) { selEl.classList.remove('is-sel'); selEl = null; }
    activeId = null;
  }

  function submit(value) { var id = activeId; if (id == null) { closePop(); return; } closePop(); fill(id, value); }

  function handleKey(k) {
    if (k === 'ok') { if (buffer !== '') submit(buffer); return; }
    buffer = window.RMKeypad.apply(buffer, k);   /* 값 편집 규칙 = 공용 */
    var d = document.getElementById('popDisp');
    if (d) d.textContent = buffer || '0';
  }

  report.addEventListener('click', function (e) {
    var el = e.target.closest('.blank');
    if (!el) return;
    if (selEl === el) { closePop(); return; }
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
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (pmodal.classList.contains('is-open')) { closePreview(); return; }
    if (pop.classList.contains('is-open')) closePop();
  });
  document.querySelector('.report-wrap').addEventListener('scroll', function () {
    if (pop.classList.contains('is-open') && selEl) place(selEl);   // 따라가고, 빈칸이 영역 밖으로 나가면 닫는다
  }, true);
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) closePop(); });

  /* ── 보고서 미리보기 모달 ───────────────────────────────────────── */
  var pmodal = document.getElementById('pmodal');
  var pPaper = document.getElementById('pmodalPaper');

  // 학생 입력대로 완성된 보고서 렌더 (빈칸 → 입력값 텍스트)
  function buildPreview() {
    var clone = report.cloneNode(true);
    clone.querySelectorAll('.blank').forEach(function (bl) {
      var span = document.createElement('span');
      span.className = 'fillin';
      span.innerHTML = E.value(answers[bl.dataset.blank] || '');
      bl.replaceWith(span);
    });
    var table = document.createElement('div');
    table.className = 'rp-table';
    [].slice.call(clone.children).forEach(function (ch) {
      if (ch.classList.contains('rt-label')) ch.className = 'rp-label';
      else if (ch.classList.contains('rt-cell')) {
        ch.className = 'rp-cell';
        var img = ch.querySelector('.rt-img'); if (img) img.className = 'rp-img';
      }
      table.appendChild(ch);
    });
    pPaper.innerHTML = '<div class="rp-title">탐구활동 보고서</div>' +
      '<div class="rp-sub">' + D.sub + '</div>';
    pPaper.appendChild(table);
  }

  function openPreview() {
    if (previewBtn.disabled) return;
    buildPreview();
    pmodal.classList.add('is-open');
    pmodal.setAttribute('aria-hidden', 'false');
  }
  function closePreview() {
    pmodal.classList.remove('is-open');
    pmodal.setAttribute('aria-hidden', 'true');
  }
  previewBtn.addEventListener('click', openPreview);
  pmodal.querySelectorAll('[data-pclose]').forEach(function (el) { el.addEventListener('click', closePreview); });

  // 인쇄/저장 = 데모(버튼만) — 토스트로 안내
  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2000);
  }
  document.getElementById('printBtn').addEventListener('click', function () { showToast('인쇄 기능은 준비 중이에요.'); });
  document.getElementById('dlBtn').addEventListener('click', function () { showToast('저장(다운로드) 기능은 준비 중이에요.'); });
  resultBtn.addEventListener('click', function () { if (resultBtn.disabled) return; window.location.href = D.next; });

  refreshDone();

  /* 머리줄 타이머 = scripts/learn-timer.js */

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  function dbgFill(ok) {
    closePop();
    order.forEach(function (id, i) {
      var f = ANSWERS[id], v = f.answer;
      if (!ok && i % 2 === 0) v = f.choices.filter(function (c) { return c !== f.answer; })[0] || v;   // 섞기 = 홀수째 칸만 틀리게
      fill(id, v);
    });
  }
  if (window.RMDebug) window.RMDebug.register({
    title: '탐구활동 보고서',
    actions: [
      { label: '전부 정답', tone: 'ok', run: function () { dbgFill(true); } },
      { label: '정오답 섞기', tone: 'no', run: function () { dbgFill(false); } },
      { label: '미리보기', run: function () { openPreview(); } }
    ]
  });

  /* ── 라이트/다크 토글 (essay-basics와 동일: 인라인) ─────────────── */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
