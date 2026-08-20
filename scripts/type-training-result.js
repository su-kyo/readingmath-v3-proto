/* =====================================================================
   유형 훈련 · 학습 결과 — Phase 7 ① 계기판 어휘
   총점 = 별 + 점수(상위 종합). 단계별 행 = 육각 뱃지 + 문항 LED.
   「보기」 = 스텝 결과 스크린창(보조 모니터 · 다이얼 + 문항 판독).
   ===================================================================== */
(function () {
  'use strict';

  /* 결과 화면은 항상 다크 계기판 — 테마 토글·저장 테마 적용 없음 (Phase 7 사용자 결정).
     학습 화면으로 돌아가면 rm-theme에 저장된 유저 테마가 그대로 적용된다. */

  /* ---------- 데이터 (유형 훈련 4단계 · 문항 결과까지 한 벌) ----------
     스텝의 정답·등급은 results 배열에서 집계한다.
     ※ 3단계(2차 유형 문제)의 results는 type/result.html(type-result.js)과 같은 배열을 유지할 것 */
  var T = true, F = false;
  var STAGES = [
    { no: 1, name: '1차 유형 문제', results: [T,T,T,T,T,T,T,T,T,T] },
    { no: 2, name: '1차 유사 문제', results: [T,T,T,T,T,T,F,T,T,T] },
    { no: 3, name: '2차 유형 문제', results: [T,T,T,T,F,T,T,F,F,T] },
    { no: 4, name: '2차 유사 문제', results: [T,T,F,T,T,F,T,T,T,T] }
  ];
  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  function stepBadge(g) { return 'assets/img/grade/grade-step-' + g.toLowerCase() + '.webp'; }
  function bigBadge(g)  { return 'assets/img/grade/grade-' + g.toLowerCase() + '.webp'; }
  STAGES.forEach(function (s) {
    s.total = s.results.length;
    s.correct = s.results.filter(Boolean).length;
    s.rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    s.grade = gradeOf(s.rate).toUpperCase();
  });

  /* 시간 초과 감점(10점) 여부 — 검수 패널에서 토글할 수 있다 */
  var BASE_SCORE = 85, PENALTY = 10;
  var overtime = false;
  var SCORE = BASE_SCORE - (overtime ? PENALTY : 0);
  var COMMENT =
    '진방울님의 유형 훈련 결과는 100점 만점 중 ' + SCORE + '점 입니다.\n' +
    '1차 유형은 완벽했지만, 2차 유형 문제에서 조금 흔들렸어요.\n' +
    '오답노트를 확인한 뒤 2차 유형 문제를 한 번 더 복습해 보세요.';

  /* ?snap=1 이면 애니메이션 생략하고 최종 상태로 (검수·스크린샷용) */
  var SNAP = new URLSearchParams(location.search).get('snap') === '1';

  /* ---------- 총점 별 + 점수 ---------- */
  document.getElementById('totalStar').src = 'assets/icons/star/star-' + gradeOf(SCORE) + '.svg';
  var scoreEl = document.getElementById('score');
  var sN = 0, sTimer = null;
  if (SNAP) { scoreEl.textContent = SCORE; }
  else sTimer = setInterval(function () {
    sN += Math.max(1, Math.round(SCORE / 22));
    if (sN >= SCORE) { sN = SCORE; clearInterval(sTimer); }
    scoreEl.textContent = sN;
  }, 26);

  /* ---------- 단계별 행 (뱃지 + 문항 LED + 보기) ---------- */
  function segHTML(results) {
    var s = '';
    results.forEach(function (ok) { s += '<i data-on="' + (ok ? 1 : 0) + '"></i>'; });
    return '<span class="seg">' + s + '</span>';
  }
  var rows = document.getElementById('rows');
  var sumCorrect = 0, sumTotal = 0, allResults = [];
  STAGES.forEach(function (s) {
    sumCorrect += s.correct; sumTotal += s.total;
    allResults = allResults.concat(s.results);
    var row = document.createElement('div');
    row.className = 'trow trow--data';
    row.innerHTML =
      '<div class="tcell tcell--name"><span class="tnum">' + s.no + '</span><span class="tname">' + s.name + '</span></div>' +
      '<div class="tcell"><img class="tgrade" src="' + stepBadge(s.grade) + '" alt="' + s.grade + '" /></div>' +
      '<div class="tcell">' + segHTML(s.results) + '</div>' +
      '<div class="tcell tst">' + s.correct + '<small>/' + s.total + '</small></div>' +
      '<div class="tcell tpc">' + s.rate + '%</div>' +
      '<div class="tcell"><button class="tview" data-no="' + s.no + '">보기</button></div>';
    rows.appendChild(row);
  });

  /* ---------- 전체 행 ---------- */
  var totalRate = sumTotal ? Math.round((sumCorrect / sumTotal) * 100) : 0;
  document.getElementById('totalRow').innerHTML =
    '<div class="tcell tcell--name"><span class="tname">전체</span></div>' +
    '<div class="tcell"></div>' +
    '<div class="tcell">' + segHTML(allResults) + '</div>' +
    '<div class="tcell tst">' + sumCorrect + '<small>/' + sumTotal + '</small></div>' +
    '<div class="tcell tpc">' + totalRate + '%</div>' +
    '<div class="tcell"></div>';

  /* 문항 LED 순차 점등 */
  var cells = document.querySelectorAll('.tbl .seg i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 180 + i * 18);
  });

  /* ---------- 코멘트 ---------- */
  document.getElementById('comment').textContent = COMMENT;

  /* ---------- 「보기」 → 스텝 결과 스크린창 ---------- */
  var stepMon = document.getElementById('stepMon');
  var stepDial = document.getElementById('stepDial');
  var stepGrid = document.getElementById('stepGrid');
  function openStepMonitor(stage) {
    document.getElementById('stepMonTtl').textContent = '스텝 결과 — ' + stage.name;
    document.getElementById('stepBadge').src = bigBadge(stage.grade);
    document.getElementById('stepRate').textContent = stage.rate;
    document.getElementById('stepScore').textContent = stage.correct + '/' + stage.total;
    /* 문항 판독 — 스텝 결과 화면과 같은 구성 통으로 */
    stepGrid.innerHTML = '';
    stage.results.forEach(function (ok, i) {
      var cell = document.createElement('div');
      cell.className = 'qcell ' + (ok ? 'is-ok' : 'no');
      cell.textContent = i + 1;
      stepGrid.appendChild(cell);
    });
    stepMon.classList.add('is-open');
    stepMon.setAttribute('aria-hidden', 'false');
    if (SNAP) { stepDial.style.transition = 'none'; stepDial.style.setProperty('--pct', stage.rate); }
    else {
      stepDial.style.setProperty('--pct', 0);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        stepDial.style.setProperty('--pct', stage.rate);
      }); });
    }
    [].forEach.call(stepGrid.querySelectorAll('.qcell.is-ok'), function (c, i) {
      if (SNAP) c.classList.add('ok');
      else setTimeout(function () { c.classList.add('ok'); }, 220 + i * 45);
    });
  }
  function closeStepMonitor() {
    stepMon.classList.remove('is-open');
    stepMon.setAttribute('aria-hidden', 'true');
  }
  /* ?view=1~4 로 열면 그 스텝의 스크린창을 바로 띄움 (검수·스크린샷용) */
  var wantView = +(new URLSearchParams(location.search).get('view') || 0);
  if (wantView) setTimeout(function () {
    var stage = STAGES.filter(function (s) { return s.no === wantView; })[0];
    if (stage) openStepMonitor(stage);
  }, 900);
  document.addEventListener('click', function (e) {
    var v = e.target.closest && e.target.closest('.tview');
    if (v) {
      var no = +v.getAttribute('data-no');
      var stage = STAGES.filter(function (s) { return s.no === no; })[0];
      if (stage) openStepMonitor(stage);
      return;
    }
    if (e.target.closest && e.target.closest('[data-mclose]')) closeStepMonitor();
  });

  /* ---------- 액션 ---------- */
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }
  var noteBtn = document.getElementById('noteBtn');
  if (noteBtn) noteBtn.addEventListener('click', function () { showToast('오답노트 화면은 준비 중이에요'); });
  var homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', function () { window.location.href = 'index.html'; });

  /* ---------- 시간 초과 상태 토글 (검수용) ---------- */
  var overPill = document.getElementById('overPill');
  var commentEl = document.getElementById('comment');
  function setOvertime(on, initial) {
    overtime = on;
    SCORE = BASE_SCORE - (on ? PENALTY : 0);
    // 최초 1회는 점수 카운트업 애니메이션을 살려 둔다(SCORE를 읽어 올라간다)
    if (!initial) { clearInterval(sTimer); scoreEl.textContent = SCORE; }
    document.getElementById('totalStar').src = 'assets/icons/star/star-' + gradeOf(SCORE) + '.svg';
    if (overPill) overPill.hidden = !on;
    if (commentEl) commentEl.textContent = commentEl.textContent
      .replace(/100점 만점 중 \d+점/, '100점 만점 중 ' + SCORE + '점');
  }
  setOvertime(overtime, true);

  if (window.RMDebug) window.RMDebug.register({
    title: '유형 훈련 결과 · 시간',
    actions: [
      { label: '시간 초과', tone: 'no', run: function () { setOvertime(true); } },
      { label: '제한 시간 내', tone: 'ok', run: function () { setOvertime(false); } }
    ]
  });
})();
