/* =========================================================================
   서술형 훈련 3단계 — 탐구활동 보고서 만들기 (essay-report, 과학 전용)
   · 2열 n행 표 형태 보고서. 셀 안에는 텍스트·이미지·빈칸 등이 들어감.
   · 빈칸을 눌러 답 입력(주관식 키패드 / 객관식 세로보기 드롭다운, 라벨 없음).
     즉답 채점 없음 — 입력값 그대로 들어가고 채워진 칸도 다시 눌러 수정 가능.
   · 모든 빈칸을 채우면 '결과보기' + '보고서 미리보기' 활성화.
   · 미리보기 = 학생 입력대로 완성된 보고서를 보여주고 인쇄/저장 버튼 제공(데모).
   ========================================================================= */
(function () {
  /* 빈칸 슬롯: 이 보고서의 빈칸은 문장형 답 → 전부 객관식(choice).
     (엔진은 주관식 키패드도 지원 — 숫자 답이면 type:'short') */
  var ANSWERS = {
    '1': { type: 'choice', ans: '그대로 유지됩니다.', choices: ['그대로 유지됩니다.', '완전히 변합니다.', '서로 섞여 사라집니다.', '새로운 물질로 바뀝니다.'] },
    '2': { type: 'choice', ans: '변하지 않았기 때문에', choices: ['변하지 않았기 때문에', '완전히 변했기 때문에', '모두 사라졌기 때문에', '새로 생겨났기 때문에'] },
    '3': { type: 'choice', ans: '있습니다.', choices: ['있습니다.', '없습니다.', '어렵습니다.'] },
    '4': { type: 'choice', ans: '유지된', choices: ['유지된', '사라진', '변화된', '섞여 없어진'] }
  };

  // 빈칸 pill — 정답 미리 안 넣음(학생 입력값이 들어감)
  function b(id) {
    return '<span class="blank" data-blank="' + id + '">' +
      '<span class="blank__ans"></span><span class="blank__badge">' + id + '</span></span>';
  }

  /* ── 보고서 데이터 (2열 표) ─────────────────────────────────────── */
  var ROWS = [
    { label: '단원', cell: '<div class="rt-text">1단원 - 힘과 우리 생활</div>' },
    { label: '주제', cell: '<div class="rt-text">오곡밥 재료 섞기 실험을 통한 혼합물의 의미 이해하기</div>' },
    { label: '관찰 목표', cell: '<div class="rt-text">물질들을 섞기 전과 후의 성질(모양, 색깔, 크기)을 비교하여 혼합물의 특징을 알아보기</div>' },
    {
      label: '과정',
      cell:
        '<div class="rt-text">[준비물]\n  - 오곡밥 재료 (찹쌀, 조, 팥, 수수, 검은콩), 빈 그릇, 실험용 장갑, 실험복\n\n' +
        '[실험 방법]\n1. 탐구 과정\n' +
        '① 섞기 전 찹쌀, 조, 팥, 수수, 검은콩이 각각 어떤 성질(모양, 색깔, 크기)을 가졌는지 꼼꼼히 관찰합니다.\n' +
        '② 준비한 다섯 가지 재료를 빈 그릇에 모두 넣고 골고루 섞어 줍니다.\n' +
        '③ 그릇 안에서 서로 섞여 있는 물질들의 상태와 성질을 다시 한번 살펴봅니다.\n' +
        '④ 섞기 전의 성질과 섞인 후의 성질을 서로 비교하며 친구들과 이야기해 봅니다.</div>' +
        '<div class="rt-img"><img src="assets/figma/report-process.png" alt="실험 과정 이미지" /></div>' +
        '<div class="rt-text">2. 관찰 및 측정\n' +
        '① 섞기 전: 검은콩은 크고 검은색이며, 조는 아주 작고 노란색인 것처럼 각 물질은 고유한 모양과 색깔을 가집니다.\n' +
        '② 섞은 후: 여러 재료가 한데 모여 있지만, 검은콩은 여전히 크고 검으며 조는 여전히 작고 노란색입니다.</div>'
    },
    {
      label: '결과 및 정리',
      cell:
        '<div class="rt-text">◎ 탐구 정리\n  - 여러 가지 물질들을 섞어도 혼합물은 각 물질의 모양, 색깔, 크기 등 고유한 성질은 변하지 않습니다.</div>' +
        '<div class="rt-span">① 혼합물은 재료들을 섞기 전과 후에 각 물질이 가진 고유한 성질(맛, 색깔, 모양 등)이 ' + b('1') + '</div>' +
        '<div class="rt-span">② 성질이 ' + b('2') + ' , 알갱이 크기 차이 등을 이용하면 섞여 있는 물질들을 다시 각각의 재료로 나눌 수 ' + b('3') + '</div>' +
        '<div class="rt-span">③ 우리가 먹는 오곡밥, 미역국, 우유 등은 모두 각 재료의 성질이 ' + b('4') + ' 채 섞여 있는 대표적인 혼합물입니다.</div>'
    }
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
  }

  // 입력값을 그대로 빈칸에 넣음 (즉답 채점 없음, 같은 번호 함께)
  function fill(id, value) {
    filled[id] = true; answers[id] = value;
    byId[id].forEach(function (el) {
      el.querySelector('.blank__ans').textContent = value;
      el.classList.add('is-filled');
    });
    refreshDone();
  }

  /* ── 입력 드롭다운(팝오버) ──────────────────────────────────────── */
  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var activeId = null, selEl = null;

  function place(anchor) {
    var r = anchor.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var vw = window.innerWidth, vh = window.innerHeight, gap = 9, pad = 8;
    var cx = r.left + r.width / 2;
    var left = Math.min(Math.max(pad, cx - pw / 2), vw - pw - pad);
    var up = false, top;
    if (r.bottom + gap + ph <= vh - pad) { top = r.bottom + gap; }
    else if (r.top - gap - ph >= pad) { top = r.top - gap - ph; up = true; }
    else { top = r.bottom + gap; }
    top = Math.max(pad, Math.min(top, vh - ph - pad));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
    pop.classList.toggle('qpop--up', up);
    var caretX = Math.min(Math.max(14, cx - left), pw - 14);
    caret.style.left = (caretX - 6) + 'px';
    caret.style.top = up ? (ph - 6) + 'px' : '-6px';
  }

  var PAD_KEYS = [
    ['7', '7'], ['8', '8'], ['9', '9'], ['back', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5H9l-6 7 6 7h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M16 9l-4 4M12 9l4 4"/></svg>'],
    ['4', '4'], ['5', '5'], ['6', '6'], ['clear', 'C'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['-', '−'],
    ['0', '0'], ['.', '.'], ['ok', '확인']
  ];
  var buffer = '';

  function openPop(anchor) {
    var id = anchor.dataset.blank;
    activeId = id;
    if (selEl) selEl.classList.remove('is-sel');
    selEl = anchor; selEl.classList.add('is-sel');

    var slot = ANSWERS[id];
    if (slot.type === 'choice') {
      popBody.innerHTML = '<div class="qpop__opts">' + slot.choices.map(function (c) {
        return '<button class="pop-opt" data-val="' + c + '">' + c + '</button>';
      }).join('') + '</div>';
    } else {
      buffer = answers[id] || '';
      var grid = PAD_KEYS.map(function (k) {
        return '<button class="qpop__key' + (k[0] === 'ok' ? ' qpop__key--ok' : '') + '" data-k="' + k[0] + '">' + k[1] + '</button>';
      }).join('');
      popBody.innerHTML = '<div class="qpop__pad"><div class="qpop__display" id="popDisp">' + (buffer || '0') + '</div>' +
        '<div class="qpop__grid">' + grid + '</div></div>';
    }
    pop.classList.add('is-open');
    place(anchor);
  }

  function closePop() {
    pop.classList.remove('is-open');
    if (selEl) { selEl.classList.remove('is-sel'); selEl = null; }
    activeId = null;
  }

  function submit(value) { var id = activeId; if (id == null) { closePop(); return; } closePop(); fill(id, value); }

  function handleKey(k) {
    if (k === 'back') buffer = buffer.slice(0, -1);
    else if (k === 'clear') buffer = '';
    else if (k === 'ok') { if (buffer !== '') submit(buffer); return; }
    else if (k === '-') buffer = buffer.charAt(0) === '-' ? buffer.slice(1) : '-' + buffer;
    else if (k === '.') { if (buffer.replace('-', '').indexOf('.') < 0) buffer += (buffer === '' || buffer === '-' ? '0.' : '.'); }
    else buffer += k;
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
    var opt = e.target.closest('.pop-opt');
    if (opt) { submit(opt.dataset.val); return; }
    var key = e.target.closest('.qpop__key');
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
    if (pop.classList.contains('is-open')) closePop();
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
      span.textContent = answers[bl.dataset.blank] || '';
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
      '<div class="rp-sub">과학 중등 1-1 · 2단원 생물의 구성과 다양성 · 서술형 훈련</div>';
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
  var toast = document.getElementById('ptoast'), toastT = null;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2000);
  }
  document.getElementById('printBtn').addEventListener('click', function () { showToast('인쇄 기능은 준비 중이에요.'); });
  document.getElementById('dlBtn').addEventListener('click', function () { showToast('저장(다운로드) 기능은 준비 중이에요.'); });
  resultBtn.addEventListener('click', function () { if (resultBtn.disabled) return; showToast('제출되었습니다. 결과 화면은 준비 중이에요.'); });

  refreshDone();

  /* ── 타이머 (카운트업) ──────────────────────────────────────────── */
  var timerEl = document.getElementById('timer');
  var sec = 0;
  setInterval(function () {
    sec++;
    timerEl.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  }, 1000);

  /* ── 라이트/다크 토글 (essay-basics와 동일: 인라인) ─────────────── */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
