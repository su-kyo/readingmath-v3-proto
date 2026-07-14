/* =========================================================================
   서술형 훈련 — 기초 기르기 (essay-basics)
   좌: 문제 / 우: 단계별 풀이 가이드.
   · 빈칸을 누르면 입력 드롭다운(주관식 키패드 / 객관식 보기)이 뜸.
   · 여기서는 즉답 채점 없음 — 입력한 답이 그대로 빈칸에 들어감(오답이어도).
     같은 번호 = 같은 답 → 입력값이 같은 번호 칸에 함께 들어감. 채워진 칸은 다시 눌러 수정 가능.
   · 정답(ANSWERS.ans)은 최종 제출 후 결과 화면에서 한 번에 채점(지금은 미사용).
   · 모든 빈칸을 채우면 하단 '결과보기'(제출) 활성화.
   ========================================================================= */
(function () {
  /* 슬롯 정의: 번호 → { 유형, 정답(채점용), (객관식 보기) }
     같은 번호가 여러 번 나오면 입력값이 같이 들어감 (은근한 힌트)
     · choice = 객관식(세로 1열 보기) · short = 주관식(숫자 키패드, 숫자만) */
  var ANSWERS = {
    '1': { type: 'choice', ans: '봉지의 수',    choices: ['고등어의 수', '봉지의 수', '한 손의 수', '남는 마리 수'] },
    '2': { type: 'choice', ans: '6',          choices: ['4', '5', '6', '8'] },
    '3': { type: 'choice', ans: '고등어의 수',  choices: ['봉지의 수', '고등어의 수', '손의 수', '마리의 수'] },
    '4': { type: 'choice', ans: '2',          choices: ['1', '2', '3', '4'] },
    '5': { type: 'short',  ans: '12' },
    '6': { type: 'choice', ans: '3',          choices: ['2', '3', '4', '6'] },
    '7': { type: 'short',  ans: '4' }
  };

  // 빈칸 pill — id=번호(플레이스홀더). 정답 미리 넣지 않음(학생 입력값이 들어감).
  function b(id) {
    return '<span class="blank" data-blank="' + id + '">' +
      '<span class="blank__ans"></span>' +
      '<span class="blank__badge">' + id + '</span></span>';
  }
  // 예시(주어진 값) — 처음부터 채워진 상태, 상호작용 없음
  function given(ans) {
    return '<span class="blank blank--given"><span class="blank__ans">' + ans + '</span></span>';
  }

  // ── 풀이 가이드 본문 ──────────────────────────────────────────────
  var PARAS = [
    // 1. 문제 파악
    '<div class="para">' +
      '<div class="line para__head">이 문제를 어떻게 해결할까요?</div>' +
      '<div class="line">' + given('고등어 6손을 3마리씩 나눠요.') + '</div>' +
      '<div class="line">이 문제는 고등어를 나누어 담은 ' + b('1') + '를 구하는 문제예요.</div>' +
    '</div>',

    // 2. 계획 세우기
    '<div class="para">' +
      '<div class="line">' + b('1') + '는 고등어 ' + b('2') + '손이 모두 몇 마리인지 구하고,</div>' +
      '<div class="line">한 봉지에 나누어 담은 ' + b('3') + '로 나누어 구할 수 있어요.</div>' +
      '<div class="box"><div class="box__row">' +
        '고등어 ' + b('2') + '손 ÷ 한 봉지에 담은 ' + b('3') + ' = ' + b('1') +
      '</div></div>' +
    '</div>',

    // 3. 6손이 몇 마리인지
    '<div class="para">' +
      '<div class="line">고등어 ' + b('2') + '손은 몇 마리일까요?</div>' +
      '<div class="line">고등어 한 손은 ' + b('4') + '마리이므로 ' + b('2') + '손은 ' + b('4') + '씩 ' + b('2') + '묶음이 있는 것과 같아요.</div>' +
      '<div class="box"><div class="box__row">' +
        b('2') + ' × ' + b('4') + ' = ' + b('5') + '(마리)' +
      '</div></div>' +
    '</div>',

    // 4. 두 가지 곱셈식
    '<div class="para">' +
      '<div class="line">고등어 ' + b('5') + '마리를 한 봉지에 ' + b('6') + '마리씩 담은 ' + b('1') + '를 두 가지 곱셈식으로 나타내요.</div>' +
      '<div class="box">' +
        '<div class="box__row">' + b('6') + ' × ' + b('7') + ' = ' + b('5') + '(마리)</div>' +
        '<div class="box__row">' + b('7') + ' × ' + b('6') + ' = ' + b('5') + '(마리)</div>' +
      '</div>' +
    '</div>',

    // 5. 나눗셈식으로
    '<div class="para">' +
      '<div class="line">곱셈식을 나눗셈식으로 바꾸어 나타내 볼까요?</div>' +
      '<div class="box"><div class="box__row">' +
        b('5') + ' ÷ ' + b('6') + ' = ' + b('7') +
      '</div></div>' +
    '</div>',

    // 6. 결론
    '<div class="para">' +
      '<div class="line">따라서 고등어 ' + b('2') + '손을 한 봉지에 ' + b('6') + '마리씩 담으면 ' + b('7') + '봉지에 나누어 담을 수 있어요.</div>' +
    '</div>'
  ];

  var expl = document.getElementById('expl');
  expl.innerHTML = '<div class="expl__doc">' + PARAS.join('') + '</div>';

  // ── 상태 ──────────────────────────────────────────────────────────
  var order = [];          // 고유 번호의 첫 등장 순서 (권장 풀이 순서)
  var byId = {};           // id → [elements]
  var filled = {};         // id → true(채워짐)
  expl.querySelectorAll('.blank[data-blank]').forEach(function (el) {
    var id = el.dataset.blank;
    if (!byId[id]) { byId[id] = []; order.push(id); }
    byId[id].push(el);
  });

  var resultBtn = document.getElementById('resultBtn');
  var answers = {};   // 학생이 입력한 답 (id → 값) — 최종 제출 시 채점용

  // 전부 채웠는지 확인 → 결과보기(제출) 활성화
  function refreshNext() {
    var done = order.every(function (id) { return filled[id]; });
    if (done) { resultBtn.disabled = false; resultBtn.removeAttribute('title'); }
  }

  // 입력값을 그대로 빈칸에 넣음 (즉답 채점 없음). 같은 번호 칸에 함께 들어감.
  function fill(id, value) {
    filled[id] = true;
    answers[id] = value;
    byId[id].forEach(function (el) {
      el.querySelector('.blank__ans').textContent = value;
      el.classList.add('is-filled');
    });
    refreshNext();
  }

  // ── 빈칸 입력 드롭다운(팝오버) ────────────────────────────────────
  var pop = document.getElementById('qpop');
  var popBody = document.getElementById('qpopBody');
  var caret = pop.querySelector('.qpop__caret');
  var activeId = null;    // 현재 열린 슬롯 번호
  var selEl = null;       // 현재 선택된(주황) 빈칸 엘리먼트

  // 팝오버를 빈칸 근처에 배치 (아래 우선, 공간 부족하면 위로)
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
    top = Math.max(pad, Math.min(top, vh - ph - pad));   // 뷰포트 밖으로 안 나가게 클램프
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
    pop.classList.toggle('qpop--up', up);
    var caretX = Math.min(Math.max(14, cx - left), pw - 14);
    caret.style.left = (caretX - 6) + 'px';
    caret.style.top = up ? (ph - 6) + 'px' : '-6px';
  }

  // 숫자 키패드 (개념 훈련 계산기의 서술형 버전) — 7-9⌫ / 4-6C / 1-3− / 0.확인
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
      buffer = answers[id] || '';   // 이미 입력한 값이 있으면 이어서 수정
      var grid = PAD_KEYS.map(function (k) {
        return '<button class="qpop__key' + (k[0] === 'ok' ? ' qpop__key--ok' : '') +
          '" data-k="' + k[0] + '">' + k[1] + '</button>';
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

  // 입력값을 그대로 넣고 닫기 (채점 없음)
  function submit(value) {
    var id = activeId;
    closePop();
    if (id != null) fill(id, value);
  }

  // 키패드 입력 처리
  function handleKey(k) {
    if (k === 'back') buffer = buffer.slice(0, -1);
    else if (k === 'clear') buffer = '';
    else if (k === 'ok') { if (buffer !== '') submit(buffer); return; }
    else if (k === '-') buffer = buffer.charAt(0) === '-' ? buffer.slice(1) : '-' + buffer;  // 부호 토글
    else if (k === '.') { if (buffer.replace('-', '').indexOf('.') < 0) buffer += (buffer === '' || buffer === '-' ? '0.' : '.'); }
    else buffer += k;
    var d = document.getElementById('popDisp');
    if (d) d.textContent = buffer || '0';
  }

  // 빈칸 클릭 → 드롭다운 열기 (원하는 칸부터, 채워진 칸도 다시 눌러 수정 가능)
  expl.addEventListener('click', function (e) {
    var el = e.target.closest('.blank');
    if (!el || el.classList.contains('blank--given')) return;
    if (selEl === el) { closePop(); return; }   // 같은 칸 다시 누르면 닫기(토글)
    openPop(el);
  });

  // 팝오버 내부 클릭 = 객관식 보기 / 키패드 키
  popBody.addEventListener('click', function (e) {
    var opt = e.target.closest('.pop-opt');
    if (opt) { submit(opt.dataset.val); return; }   // 고른 보기를 그대로 입력 (채점 없음)
    var key = e.target.closest('.qpop__key');
    if (key) handleKey(key.dataset.k);
  });

  // 바깥 클릭 / Esc / 스크롤·리사이즈 → 닫기
  document.addEventListener('click', function (e) {
    if (!pop.classList.contains('is-open')) return;
    if (e.target.closest('#qpop') || e.target.closest('.blank')) return;
    closePop();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pop.classList.contains('is-open')) closePop();
  });
  expl.addEventListener('scroll', function () { if (pop.classList.contains('is-open')) closePop(); }, true);
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) closePop(); });

  refreshNext();

  // ── 타이머 (카운트업) ─────────────────────────────────────────────
  var timerEl = document.getElementById('timer');
  var sec = 0;
  setInterval(function () {
    sec++;
    var m = String(Math.floor(sec / 60)).padStart(2, '0');
    var s = String(sec % 60).padStart(2, '0');
    timerEl.textContent = m + ':' + s;
  }, 1000);

  // 결과보기 → 서술형 스텝 결과
  resultBtn.addEventListener('click', function () {
    if (resultBtn.disabled) return;
    window.location.href = 'essay-step-result.html';
  });

  // 라이트/다크 토글 (헤더 해/달 노브)
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
