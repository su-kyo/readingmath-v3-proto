/* =========================================================================
   서술형 훈련 2단계 — 기본 다지기 · 해설 보기(채점)
   essay-drill 화면 재사용(리뷰 모드). 학생이 이미 푼 답을 채점해 보여준다.
   · 빈칸 맞추기 = 정오답 표시. 오답은 클릭 → 내 답 ↔ 정답 토글.
   · 순서 맞추기 = 블록 모음(트레이) 없이 빈칸에 이미 배치됨. 정답 자리는 정답 디자인,
     오답 자리는 오답 상태(부분정답은 정답으로). 오답 클릭 → 내 답 ↔ 정답 토글.
   상호작용 = 채점 결과 열람 + 오답 토글뿐(입력·키패드·트레이 없음).
   ========================================================================= */
(function () {
  /* 문제 데이터 = essay-drill 과 동형 + 학생이 낸 답(my). ans=정답, my=학생 답.
     arrange.parts 의 {slot:'정답'} 순서대로 myPlaced 원소가 학생이 배치한 값. */
  var PROBLEMS = [
    {
      statement: [
        '학급 문고에 책이 178권이 있었습니다.',
        '어제까지 29권의 책을 빌려갔고, 오늘은 어제까지 빌린 책 중 17권을 학급 문고에 반납하였습니다.',
        '오후에 책장을 보니 오늘은 35권의 책을 빌려갔습니다.',
        '지금 학급 문고에 남아 있는 책은 몇 권인지 구해 보세요.'
      ],
      chunks: [
        '(남아 있는 책의 수) = (학급 문고의 책의 수) − (어제까지 빌려간 책의 수) + (오늘 반납한 책의 수) − (오늘 빌려간 책의 수) 입니다.',
        '따라서 남아 있는 책의 수는 178 − {b1} + 17 − 35 =',
        '149 + 17 − 35 = {b2} − 35 =',
        '{b3} (권) 입니다.'
      ],
      blanks: {
        b1: { ans: '29', my: '17' },   // 오답
        b2: { ans: '166', my: '166' },
        b3: { ans: '131', my: '131' }
      },
      arrange: [
        { text: '먼저 남아 있는 책의 수를 구하는 식을 세워 볼까요?' },
        {
          parts: ['(남아 있는 책의 수) =', { slot: '(학급 문고의 책의 수) −' }, { slot: '(어제까지 빌려간 책의 수) +' }, { slot: '(오늘 반납한 책의 수) −' }, { slot: '(오늘 빌려간 책의 수)' }],
          myPlaced: ['(학급 문고의 책의 수) −', '(어제까지 빌려간 책의 수) +', '(오늘 반납한 책의 수) −', '(오늘 빌려간 책의 수)']
        },
        { text: '이제 각 항에 알맞은 수를 넣어 차례대로 계산하면 됩니다.' },
        {
          parts: ['따라서 남아 있는 책은 모두', { slot: '131권' }, '입니다.'],
          myPlaced: ['149권']   // 오답
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
      chunks: [
        '(남아 있는 사과 수) = (처음 사과 수) − (오전에 판 사과 수) + (새로 들여온 사과 수) − (오후에 판 사과 수) 입니다.',
        '따라서 남아 있는 사과 수는 240 − {b1} + 60 − 47 =',
        '155 + 60 − 47 = {b2} − 47 =',
        '{b3} (개) 입니다.'
      ],
      blanks: {
        b1: { ans: '85', my: '85' },
        b2: { ans: '215', my: '215' },
        b3: { ans: '168', my: '168' }
      },
      arrange: [
        { text: '남아 있는 사과 수를 구하는 식을 먼저 세워 봅니다.' },
        {
          parts: ['(남아 있는 사과 수) =', { slot: '(처음 사과 수) −' }, { slot: '(오전에 판 사과 수) +' }, { slot: '(새로 들여온 사과 수) −' }, { slot: '(오후에 판 사과 수)' }],
          myPlaced: ['(처음 사과 수) −', '(오전에 판 사과 수) +', '(새로 들여온 사과 수) −', '(오후에 판 사과 수)']
        },
        { text: '식의 각 항에 수를 넣어 계산해 보겠습니다.' },
        {
          parts: ['따라서 남아 있는 사과는 모두', { slot: '168개' }, '입니다.'],
          myPlaced: ['168개']
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
      chunks: [
        '(남아 있는 자동차 수) = (처음 자동차 수) − (오전에 나간 자동차 수) + (점심때 들어온 자동차 수) − (오후에 나간 자동차 수) 입니다.',
        '따라서 남아 있는 자동차 수는 156 − {b1} + 23 − 37 =',
        '108 + 23 − 37 = {b2} − 37 =',
        '{b3} (대) 입니다.'
      ],
      blanks: {
        b1: { ans: '48', my: '52' },   // 오답
        b2: { ans: '131', my: '131' },
        b3: { ans: '94', my: '94' }
      },
      arrange: [
        { text: '남아 있는 자동차 수를 구하는 식부터 세워 봅니다.' },
        {
          parts: ['(남아 있는 자동차 수) =', { slot: '(처음 자동차 수) −' }, { slot: '(오전에 나간 자동차 수) +' }, { slot: '(점심때 들어온 자동차 수) −' }, { slot: '(오후에 나간 자동차 수)' }],
          myPlaced: ['(처음 자동차 수) −', '(오전에 나간 자동차 수) +', '(점심때 들어온 자동차 수) −', '(오후에 나간 자동차 수)']
        },
        { text: '각 항에 수를 넣어 차례로 계산합니다.' },
        {
          parts: ['따라서 남아 있는 자동차는 모두', { slot: '94대' }, '입니다.'],
          myPlaced: ['94대']
        }
      ]
    }
  ];
  var N = PROBLEMS.length;

  // ── DOM ──
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  var readBody = document.getElementById('readBody');
  var fillDoc = document.getElementById('fillDoc');
  var arrangeDoc = document.getElementById('arrangeDoc');
  var reviewHint = document.getElementById('reviewHint');
  var stepsQ = document.getElementById('stepsQ');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var pi = -1, P = null;

  function norm(s) { return String(s).replace(/\s+/g, '').trim(); }

  /* 빈칸(채점) 마크업 — 정답이면 초록, 오답이면 빨강(클릭 토글) */
  function blankHTML(id) {
    var b = P.blanks[id];
    var ok = norm(b.my) === norm(b.ans);
    if (ok) {
      return '<span class="rblank is-correct"><span class="rblank__val">' + b.my + '</span></span>';
    }
    return '<span class="rblank is-wrong" data-my="' + b.my + '" data-ans="' + b.ans + '">' +
      '<span class="rblank__val">' + b.my + '</span>' +
      '<span class="rblank__note">정답 <b>' + b.ans + '</b></span></span>';
  }
  function chunkHTML(text) {
    var t = text;
    Object.keys(P.blanks).forEach(function (id) { t = t.replace('{' + id + '}', blankHTML(id)); });
    return '<span class="rline">' + t + '</span>';
  }

  /* 순서 맞추기 슬롯(채점) — 이미 배치된 상태. 정답이면 초록(잠금), 오답이면 빨강(클릭 토글) */
  function slotHTML(correct, my) {
    var ok = norm(my) === norm(correct);
    if (ok) {
      return '<span class="rslot is-correct">' + my + '<span class="rslot__ck">✓</span></span>';
    }
    return '<span class="rslot is-wrong" data-my="' + encodeURIComponent(my) + '" data-ans="' + encodeURIComponent(correct) + '">' +
      '<span class="rslot__val">' + my + '</span>' +
      '<span class="rslot__note">정답 <b>' + correct + '</b></span></span>';
  }

  function render() {
    stepsQ.textContent = '문제 ' + (pi + 1) + ' / ' + N;

    // 문제 카드 (읽기전용, 접기 가능 · 기본 접힘)
    readBody.innerHTML = P.statement.map(function (s) { return '<span class="rline rline--q">' + s + '</span>'; }).join('');

    // ① 빈칸 맞추기 채점
    fillDoc.innerHTML = P.chunks.map(chunkHTML).join('');

    // ② 순서 맞추기 채점
    arrangeDoc.innerHTML = P.arrange.map(function (c) {
      if (c.parts) {
        var si = 0;
        var inner = c.parts.map(function (p) {
          if (typeof p === 'string') return p;
          return slotHTML(p.slot, c.myPlaced[si++]);
        }).join(' ');
        return '<span class="rline">' + inner + '</span>';
      }
      return '<span class="rline rline--muted">' + c.text + '</span>';
    }).join('');

    // 오답이 하나라도 있으면 안내문 노출
    var hasWrong = !!(fillDoc.querySelector('.is-wrong') || arrangeDoc.querySelector('.is-wrong'));
    reviewHint.style.display = hasWrong ? '' : 'none';

    prevBtn.disabled = pi <= 0;
    nextBtn.disabled = pi >= N - 1;
  }

  /* 오답 토글 (빈칸·슬롯 공용): 내 답 ↔ 정답 */
  function wireToggle(root) {
    root.addEventListener('click', function (e) {
      var w = e.target.closest('.rblank.is-wrong, .rslot.is-wrong');
      if (!w) return;
      w.classList.toggle('show-ans');
    });
  }
  wireToggle(fillDoc);
  wireToggle(arrangeDoc);

  // 문제 카드 접기
  problemHead.addEventListener('click', function () { problem.classList.toggle('is-collapsed'); });

  prevBtn.addEventListener('click', function () { if (pi > 0) { pi--; P = PROBLEMS[pi]; render(); } });
  nextBtn.addEventListener('click', function () { if (pi < N - 1) { pi++; P = PROBLEMS[pi]; render(); } });

  var resultBtn = document.getElementById('resultBtn');
  if (resultBtn) resultBtn.addEventListener('click', function () { window.location.href = 'essay-step-result.html'; });

  // 타이머 = pause 상태(해설 화면). 정지된 값 그대로 표시.
  // 테마 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });

  pi = 0; P = PROBLEMS[0];
  problem.classList.add('is-collapsed');
  render();
})();
