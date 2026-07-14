/* =====================================================================
   유형 훈련 · 학습 결과 — 세부 단계 전부 완료 후 (스텝 결과와 별개)
   서술형 학습 결과와 동일 골격, 유형(틸/그린) 데이터.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 테마 (rm-theme 공유 키) ---------- */
  var root = document.documentElement;
  (function () { var s; try { s = localStorage.getItem('rm-theme'); } catch (e) {} if (s) root.setAttribute('data-theme', s); })();
  var toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('rm-theme', t); } catch (e) {}
  });

  /* ---------- 데이터 (유형 훈련 4단계) ---------- */
  var STAGES = [
    { no: 1, name: '1차 유형 문제', grade: 'S', correct: 10, total: 10 },
    { no: 2, name: '1차 유사 문제', grade: 'A', correct: 9,  total: 10 },
    { no: 3, name: '2차 유형 문제', grade: 'B', correct: 7,  total: 10 },
    { no: 4, name: '2차 유사 문제', grade: 'A', correct: 8,  total: 10 }
  ];
  var SCORE = 85;
  var COMMENT =
    '진방울님의 유형 훈련 결과는 100점 만점 중 ' + SCORE + '점 입니다.\n' +
    '1차 유형은 완벽했지만, 2차 유형 문제에서 조금 흔들렸어요.\n' +
    '오답노트를 확인한 뒤 2차 유형 문제를 한 번 더 복습해 보세요.';

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  function stepBadge(g) { return 'assets/figma/grade-step-' + g.toLowerCase() + '.png'; }

  /* ---------- 총점 별 + 점수 ---------- */
  document.getElementById('totalStar').src = 'assets/figma/star-' + gradeOf(SCORE) + '.svg';
  var scoreEl = document.getElementById('score');
  var sN = 0, sTimer = setInterval(function () {
    sN += Math.max(1, Math.round(SCORE / 22));
    if (sN >= SCORE) { sN = SCORE; clearInterval(sTimer); }
    scoreEl.textContent = sN;
  }, 26);

  /* ---------- 단계별 표 ---------- */
  var rows = document.getElementById('rows');
  var sumCorrect = 0, sumTotal = 0;
  STAGES.forEach(function (s, idx) {
    var rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    sumCorrect += s.correct; sumTotal += s.total;
    var row = document.createElement('div');
    row.className = 'trow trow--data';
    row.style.marginTop = idx ? '8px' : '0';
    row.innerHTML =
      '<div class="tcell tcell--name"><span class="tnum">' + s.no + '</span><span class="tname">' + s.name + '</span></div>' +
      '<div class="tcell"><img class="tgrade" src="' + stepBadge(s.grade) + '" alt="' + s.grade + '" /></div>' +
      '<div class="tcell tbig">' + s.correct + '</div>' +
      '<div class="tcell tbig">' + s.total + '</div>' +
      '<div class="tcell tcell--rate"><div class="trate__val">' + rate + '%</div><div class="trate__bar"><div class="trate__fill" data-w="' + rate + '" style="width:0%"></div></div></div>' +
      '<div class="tcell"><button class="tview" data-no="' + s.no + '">보기</button></div>';
    rows.appendChild(row);
  });

  /* ---------- 전체 행 ---------- */
  var totalRate = sumTotal ? Math.round((sumCorrect / sumTotal) * 100) : 0;
  document.getElementById('totalRow').innerHTML =
    '<div class="tcell tcell--name"><span class="tname">전체</span></div>' +
    '<div class="tcell"></div>' +
    '<div class="tcell tbig">' + sumCorrect + '</div>' +
    '<div class="tcell tbig">' + sumTotal + '</div>' +
    '<div class="tcell tcell--rate"><div class="trate__val">' + totalRate + '%</div><div class="trate__bar"><div class="trate__fill" data-w="' + totalRate + '" style="width:0%"></div></div></div>' +
    '<div class="tcell"></div>';

  /* 정답률 바 애니메이션 (setTimeout — rAF 불안정 환경 대비) */
  setTimeout(function () {
    [].forEach.call(document.querySelectorAll('.trate__fill'), function (f) { f.style.width = f.getAttribute('data-w') + '%'; });
  }, 80);

  /* ---------- 코멘트 ---------- */
  document.getElementById('comment').textContent = COMMENT;

  /* ---------- 액션 ---------- */
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }
  var noteBtn = document.getElementById('noteBtn');
  if (noteBtn) noteBtn.addEventListener('click', function () { showToast('오답노트 화면은 준비 중이에요'); });
  var homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', function () { window.location.href = 'index.html'; });
  document.addEventListener('click', function (e) {
    var v = e.target.closest && e.target.closest('.tview');
    if (v) showToast(v.getAttribute('data-no') + '단계 해설은 준비 중이에요');
  });
})();
