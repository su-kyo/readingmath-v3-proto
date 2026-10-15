/* =========================================================================
   서술형 훈련 3단계(과학) — 탐구활동 보고서 · 해설 보기(채점)
   essay-report 화면 재사용(리뷰 모드). 학생이 채운 보고서를 채점해 보여준다.
   · 빈칸 = 정오답 표시. 오답은 클릭 → 내 답 ↔ 정답 토글.
   · '추천 보고서' 버튼 → 정답(모범 답안)으로 채워진 보고서 미리보기 모달.
   상호작용 = 채점 열람 + 오답 토글 + 추천 보고서뿐(입력 없음).
   ========================================================================= */
/* =========================================================================
   서술형 훈련 3단계(과학) — 탐구활동 보고서 · 해설 보기(채점)
   콘텐츠 = 보고서 화면과 같은 window.RMEssayReport (scripts/essay-report-data-sci.js) + 데모 학생 답(my).
   essay-report 화면 재사용(리뷰 모드). 학생이 채운 보고서를 채점해 보여준다.
   · 빈칸 = 정오답 표시. 오답은 클릭 → 내 답 ↔ 정답 토글.
   · '추천 보고서' 버튼 → 정답(모범 답안)으로 채워진 보고서 미리보기 모달.
   상호작용 = 채점 열람 + 오답 토글 + 추천 보고서뿐(입력 없음).
   ========================================================================= */
(function () {
  var D = window.RMEssayReport, E = window.RMEssay, R = D.report;
  function myOf(f) { var m = R.my || {}; return m[f.id] != null ? m[f.id] : f.answer; }
  function enc(v) { return encodeURIComponent(v); }

  // 채점 빈칸 — 정답=초록, 오답=빨강(클릭 토글)
  function graded(f) {
    var my = myOf(f);
    if (my === f.answer) return '<span class="rblank is-correct" data-ans="' + enc(f.answer) + '"><span class="rblank__val">' + E.value(my) + '</span></span>';
    return '<span class="rblank is-wrong" data-my="' + enc(my) + '" data-ans="' + enc(f.answer) + '">' +
      '<span class="rblank__val">' + E.value(my) + '</span></span>';
  }

  /* ── 보고서 데이터 (essay-report와 동일 콘텐츠) ──────────────────── */
  var ROWS = [
    { label: '단원', cell: '<div class="rt-text">' + E.esc(R.unit) + '</div>' },
    { label: '주제', cell: '<div class="rt-text">' + E.inline(R.q) + '</div>' },
    { label: '관찰 목표', cell: '<div class="rt-text">' + E.inline(R.opt) + '</div>' },
    { label: '과정', cell: E.reportCell(R, R.process).html },
    { label: '결과 및 정리', cell: E.reportCell(R, R.result, { blank: graded }).html }
  ];

  var report = document.getElementById('report');
  report.innerHTML = ROWS.map(function (r) {
    return '<div class="rt-label">' + r.label + '</div><div class="rt-cell">' + r.cell + '</div>';
  }).join('');

  // 오답 있으면 콘솔바 안내(RM-PART-07)
  if (window.RMGuide) window.RMGuide.set(report.querySelector('.rblank.is-wrong') ? '오답을 눌러 정답을 확인해 보세요!' : '', 'no');

  // 오답 토글 — 같은 칸 안에서 내 답(빨강) ↔ 정답(초록) 교체 (병렬 표시 아님)
  report.addEventListener('click', function (e) {
    var w = e.target.closest('.rblank.is-wrong'); if (!w) return;
    var showAns = w.classList.toggle('show-ans');
    w.querySelector('.rblank__val').innerHTML = E.value(decodeURIComponent(showAns ? w.dataset.ans : w.dataset.my));
  });

  /* ── 추천 보고서 모달 (정답으로 채워진 모범 보고서) ─────────────── */
  var pmodal = document.getElementById('pmodal');
  var pPaper = document.getElementById('pmodalPaper');

  function buildRecommend() {
    // 보고서를 정답(모범 답안)으로 다시 그린다 (fillin 스타일)
    var table = document.createElement('div');
    table.className = 'rp-table';
    table.innerHTML = ROWS.map(function (r) {
      return '<div class="rp-label">' + r.label + '</div><div class="rp-cell">' + r.cell + '</div>';
    }).join('');
    table.querySelectorAll('.rblank').forEach(function (bl) {
      var span = document.createElement('span'); span.className = 'fillin';
      span.innerHTML = E.value(decodeURIComponent(bl.dataset.ans));
      bl.replaceWith(span);
    });
    pPaper.innerHTML = '<div class="rp-title">추천 보고서 (모범 답안)</div>' +
      '<div class="rp-sub">' + D.sub + '</div>';
    pPaper.appendChild(table);
  }

  function openRecommend() { buildRecommend(); pmodal.classList.add('is-open'); pmodal.setAttribute('aria-hidden', 'false'); }
  function closeRecommend() { pmodal.classList.remove('is-open'); pmodal.setAttribute('aria-hidden', 'true'); }
  document.getElementById('recommendBtn').addEventListener('click', openRecommend);
  pmodal.querySelectorAll('[data-pclose]').forEach(function (el) { el.addEventListener('click', closeRecommend); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pmodal.classList.contains('is-open')) closeRecommend(); });

  // 인쇄/저장 데모 토스트
  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2000); }
  var printBtn = document.getElementById('printBtn'); if (printBtn) printBtn.addEventListener('click', function () { showToast('인쇄 기능은 준비 중이에요.'); });
  var dlBtn = document.getElementById('dlBtn'); if (dlBtn) dlBtn.addEventListener('click', function () { showToast('저장(다운로드) 기능은 준비 중이에요.'); });

  // 결과로 돌아가기
  document.getElementById('resultBtn').addEventListener('click', function () { window.location.href = D.next; });

  // 타이머 pause(정지값), 테마 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });
})();
