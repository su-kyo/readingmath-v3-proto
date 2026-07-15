/* =========================================================================
   서술형 훈련 3단계(과학) — 탐구활동 보고서 · 해설 보기(채점)
   essay-report 화면 재사용(리뷰 모드). 학생이 채운 보고서를 채점해 보여준다.
   · 빈칸 = 정오답 표시. 오답은 클릭 → 내 답 ↔ 정답 토글.
   · '추천 보고서' 버튼 → 정답(모범 답안)으로 채워진 보고서 미리보기 모달.
   상호작용 = 채점 열람 + 오답 토글 + 추천 보고서뿐(입력 없음).
   ========================================================================= */
(function () {
  /* 빈칸 채점 데이터 = essay-report ANSWERS + 학생 답(my) */
  var ANSWERS = {
    '1': { ans: '그대로 유지됩니다.', my: '그대로 유지됩니다.' },
    '2': { ans: '변하지 않았기 때문에', my: '완전히 변했기 때문에' },   // 오답
    '3': { ans: '있습니다.', my: '있습니다.' },
    '4': { ans: '유지된', my: '유지된' }
  };

  function norm(s) { return String(s).replace(/\s+/g, '').trim(); }

  // 채점 빈칸 — 정답=초록, 오답=빨강(클릭 토글)
  function b(id) {
    var a = ANSWERS[id], ok = norm(a.my) === norm(a.ans);
    if (ok) {
      return '<span class="rblank is-correct"><span class="rblank__val">' + a.my + '</span></span>';
    }
    return '<span class="rblank is-wrong" data-blank="' + id + '" data-my="' + a.my + '" data-ans="' + a.ans + '">' +
      '<span class="rblank__val">' + a.my + '</span></span>';
  }

  /* ── 보고서 데이터 (essay-report와 동일 콘텐츠) ──────────────────── */
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

  // 오답 있으면 안내문 노출
  var hint = document.getElementById('reviewHint');
  if (hint) hint.style.display = report.querySelector('.rblank.is-wrong') ? '' : 'none';

  // 오답 토글 — 같은 칸 안에서 내 답(빨강) ↔ 정답(초록) 교체 (병렬 표시 아님)
  report.addEventListener('click', function (e) {
    var w = e.target.closest('.rblank.is-wrong'); if (!w) return;
    var showAns = w.classList.toggle('show-ans');
    w.querySelector('.rblank__val').textContent = showAns ? w.dataset.ans : w.dataset.my;
  });

  /* ── 추천 보고서 모달 (정답으로 채워진 모범 보고서) ─────────────── */
  var pmodal = document.getElementById('pmodal');
  var pPaper = document.getElementById('pmodalPaper');

  function buildRecommend() {
    // ROWS를 정답으로 다시 렌더 (fillin 스타일)
    function ansSpan(id) { return '<span class="fillin">' + ANSWERS[id].ans + '</span>'; }
    var rows = ROWS.map(function (r) {
      return '<div class="rp-label">' + r.label + '</div><div class="rp-cell">' + r.cell + '</div>';
    }).join('');
    var table = document.createElement('div');
    table.className = 'rp-table';
    table.innerHTML = rows;
    // 채점용 .rblank 마크업을 정답 텍스트로 치환
    table.querySelectorAll('.rblank').forEach(function (bl) {
      var span = document.createElement('span'); span.className = 'fillin';
      // data-blank(오답)이면 그 id, 아니면 순서상 id를 못 쓰므로 val에서 정답 복원
      var id = bl.dataset.blank;
      span.textContent = id ? ANSWERS[id].ans : bl.querySelector('.rblank__val').textContent;
      bl.replaceWith(span);
    });
    var img = table.querySelector('.rt-img'); if (img) img.className = 'rp-img';
    table.querySelectorAll('.rt-cell').forEach(function (c) { var i = c.querySelector('.rt-img'); if (i) i.className = 'rp-img'; });
    pPaper.innerHTML = '<div class="rp-title">추천 보고서 (모범 답안)</div>' +
      '<div class="rp-sub">과학 중등 1-1 · 2단원 생물의 구성과 다양성 · 서술형 훈련</div>';
    pPaper.appendChild(table);
  }

  function openRecommend() { buildRecommend(); pmodal.classList.add('is-open'); pmodal.setAttribute('aria-hidden', 'false'); }
  function closeRecommend() { pmodal.classList.remove('is-open'); pmodal.setAttribute('aria-hidden', 'true'); }
  document.getElementById('recommendBtn').addEventListener('click', openRecommend);
  pmodal.querySelectorAll('[data-pclose]').forEach(function (el) { el.addEventListener('click', closeRecommend); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pmodal.classList.contains('is-open')) closeRecommend(); });

  // 인쇄/저장 데모 토스트
  var toast = document.getElementById('ptoast'), toastT = null;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2000); }
  var printBtn = document.getElementById('printBtn'); if (printBtn) printBtn.addEventListener('click', function () { showToast('인쇄 기능은 준비 중이에요.'); });
  var dlBtn = document.getElementById('dlBtn'); if (dlBtn) dlBtn.addEventListener('click', function () { showToast('저장(다운로드) 기능은 준비 중이에요.'); });

  // 결과로 돌아가기
  document.getElementById('resultBtn').addEventListener('click', function () { window.location.href = 'essay-step-result.html'; });

  // 타이머 pause(정지값), 테마 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
