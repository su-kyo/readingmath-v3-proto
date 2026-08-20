/* =====================================================================
   개념 훈련 · 학습 결과 — Phase 7 ① 계기판 어휘 (A안 조합)
   총점 = 별 + 점수(상위 종합). 단계별 행 = 육각 뱃지 + 문항 LED.
   「보기」 = 스텝 결과 스크린창(보조 모니터 · 다이얼 게이지).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 테마 (rm-theme 공유 키) ---------- */
  var root = document.documentElement;
  (function () { var s; try { s = localStorage.getItem('rm-theme'); } catch (e) {} if (s) root.setAttribute('data-theme', s); })();
  /* ?theme=dark|light 이 저장된 테마보다 우선 (검수·스크린샷용) */
  (function () { var f = new URLSearchParams(location.search).get('theme'); if (f) root.setAttribute('data-theme', f); })();
  var toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('rm-theme', t); } catch (e) {}
  });

  /* ---------- 데이터 (개념 훈련 3단계) ---------- */
  var STAGES = [
    { no: 1, name: '개념 학습',    grade: 'S', correct: 5,  total: 5 },
    { no: 2, name: '개념 다지기',  grade: 'A', correct: 4,  total: 5 },
    { no: 3, name: '개념 확인하기', grade: 'B', correct: 11, total: 14 }
  ];
  /* 시간 초과 감점(10점) 여부 — 검수 패널에서 토글할 수 있다 */
  var BASE_SCORE = 88, PENALTY = 10;
  var overtime = false;
  var SCORE = BASE_SCORE - (overtime ? PENALTY : 0);
  var COMMENT =
    '진방울님의 개념 훈련 결과는 100점 만점 중 ' + SCORE + '점 입니다.\n' +
    '개념 학습과 다지기는 탄탄하게 이해했지만, 확인하기에서 몇 문제를 놓쳤어요.\n' +
    '오답노트를 확인한 뒤 개념 확인하기를 한 번 더 복습해 보세요.';

  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  function stepBadge(g) { return 'assets/img/grade/grade-step-' + g.toLowerCase() + '.webp'; }
  function bigBadge(g)  { return 'assets/img/grade/grade-' + g.toLowerCase() + '.webp'; }

  /* ---------- 총점 별 + 점수 ---------- */
  document.getElementById('totalStar').src = 'assets/icons/star/star-' + gradeOf(SCORE) + '.svg';
  var scoreEl = document.getElementById('score');
  var sN = 0, sTimer = setInterval(function () {
    sN += Math.max(1, Math.round(SCORE / 22));
    if (sN >= SCORE) { sN = SCORE; clearInterval(sTimer); }
    scoreEl.textContent = sN;
  }, 26);

  /* ---------- 단계별 행 (뱃지 + 문항 LED + 보기) ---------- */
  function segHTML(correct, total) {
    var s = '';
    for (var i = 0; i < total; i++) s += '<i data-on="' + (i < correct ? 1 : 0) + '"></i>';
    return '<span class="seg">' + s + '</span>';
  }
  var rows = document.getElementById('rows');
  var sumCorrect = 0, sumTotal = 0;
  STAGES.forEach(function (s) {
    var rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    sumCorrect += s.correct; sumTotal += s.total;
    var row = document.createElement('div');
    row.className = 'trow trow--data';
    row.innerHTML =
      '<div class="tcell tcell--name"><span class="tnum">' + s.no + '</span><span class="tname">' + s.name + '</span></div>' +
      '<div class="tcell"><img class="tgrade" src="' + stepBadge(s.grade) + '" alt="' + s.grade + '" /></div>' +
      '<div class="tcell">' + segHTML(s.correct, s.total) + '</div>' +
      '<div class="tcell tst">' + s.correct + '<small>/' + s.total + '</small></div>' +
      '<div class="tcell tpc">' + rate + '%</div>' +
      '<div class="tcell"><button class="tview" data-no="' + s.no + '">보기</button></div>';
    rows.appendChild(row);
  });

  /* ---------- 전체 행 ---------- */
  var totalRate = sumTotal ? Math.round((sumCorrect / sumTotal) * 100) : 0;
  document.getElementById('totalRow').innerHTML =
    '<div class="tcell tcell--name"><span class="tname">전체</span></div>' +
    '<div class="tcell"></div>' +
    '<div class="tcell">' + segHTML(sumCorrect, sumTotal) + '</div>' +
    '<div class="tcell tst">' + sumCorrect + '<small>/' + sumTotal + '</small></div>' +
    '<div class="tcell tpc">' + totalRate + '%</div>' +
    '<div class="tcell"></div>';

  /* 문항 LED 순차 점등 */
  var cells = document.querySelectorAll('.tbl .seg i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    setTimeout(function () { c.classList.add('on'); }, 180 + i * 22);
  });

  /* ---------- 코멘트 ---------- */
  document.getElementById('comment').textContent = COMMENT;

  /* ---------- 「보기」 → 스텝 결과 스크린창 ---------- */
  var stepMon = document.getElementById('stepMon');
  var stepDial = document.getElementById('stepDial');
  function openStepMonitor(stage) {
    var rate = stage.total ? Math.round((stage.correct / stage.total) * 100) : 0;
    document.getElementById('stepMonTtl').textContent = '스텝 결과 — ' + stage.name;
    document.getElementById('stepBadge').src = bigBadge(stage.grade);
    document.getElementById('stepRate').textContent = rate;
    document.getElementById('stepScore').textContent = stage.correct + '/' + stage.total;
    stepDial.style.setProperty('--pct', 0);
    stepMon.classList.add('is-open');
    stepMon.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      stepDial.style.setProperty('--pct', rate);
    }); });
  }
  function closeStepMonitor() {
    stepMon.classList.remove('is-open');
    stepMon.setAttribute('aria-hidden', 'true');
  }
  /* ?view=1|2|3 로 열면 그 스텝의 스크린창을 바로 띄움 (검수·스크린샷용) */
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
  var overLamp = document.getElementById('overLamp');
  var commentEl = document.getElementById('comment');
  function setOvertime(on, initial) {
    overtime = on;
    SCORE = BASE_SCORE - (on ? PENALTY : 0);
    // 최초 1회는 점수 카운트업 애니메이션을 살려 둔다(SCORE를 읽어 올라간다)
    if (!initial) { clearInterval(sTimer); scoreEl.textContent = SCORE; }
    document.getElementById('totalStar').src = 'assets/icons/star/star-' + gradeOf(SCORE) + '.svg';
    if (overPill) overPill.hidden = !on;
    if (overLamp) overLamp.style.display = on ? '' : 'none';
    if (commentEl) commentEl.textContent = commentEl.textContent
      .replace(/100점 만점 중 \d+점/, '100점 만점 중 ' + SCORE + '점');
  }
  setOvertime(overtime, true);

  if (window.RMDebug) window.RMDebug.register({
    title: '개념 훈련 결과 · 시간',
    actions: [
      { label: '시간 초과', tone: 'no', run: function () { setOvertime(true); } },
      { label: '제한 시간 내', tone: 'ok', run: function () { setOvertime(false); } }
    ]
  });
})();
