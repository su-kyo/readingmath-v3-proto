/* =====================================================================
   개념 훈련 · 학습 결과 — Phase 7 ① 계기판 어휘 (A안 조합)
   총점 = 별 + 점수(상위 종합). 단계별 행 = 육각 뱃지 + 문항 LED.
   「보기」 = 스텝 결과 스크린창(보조 모니터 · 다이얼 게이지).
   ===================================================================== */
(function () {
  'use strict';

  /* 결과 화면은 항상 다크 계기판 — 테마 토글·저장 테마 적용 없음 (Phase 7 사용자 결정).
     학습 화면으로 돌아가면 rm-theme에 저장된 유저 테마가 그대로 적용된다. */

  /* ---------- 데이터 (개념 훈련 2단계 · 활동까지 한 벌) ----------
     실서비스 구성에 맞춤(2026-10-15): 개념 학습 · STEP 2(수학 「기초 연산」 · 과학 「개념 확인하기」). 과목 = scripts/subject.js
     스텝의 정답·등급은 활동(acts)에서 집계한다.
     ※ 숫자는 shared/step-result.html(step-result.js)의 ACTIVITIES · OPS_RESULTS 와 같게 유지할 것 */
  var SCI = window.RMSubject.id === 'science';
  var STEP2 = SCI ? '개념 확인하기' : '기초 연산';
  var STAGES = [
    { no: 1, name: '개념 학습', acts: SCI
      ? [ { name: '개념 요약하기', correct: 9, total: 12 }, { name: '개념 다지기', correct: 5, total: 6 } ]
      : [ { name: '개념 요약하기', correct: 4, total: 5 },  { name: '개념 다지기', correct: 2, total: 3 } ] },
    { no: 2, name: STEP2, acts: [ SCI ? { name: STEP2, correct: 8, total: 10 } : { name: STEP2, correct: 11, total: 14 } ] }
  ];
  function gradeOf(r) { return r >= 95 ? 's' : r >= 80 ? 'a' : r >= 70 ? 'b' : 'c'; }
  function stepBadge(g) { return 'assets/img/grade/grade-step-' + g.toLowerCase() + '.webp'; }
  function bigBadge(g)  { return 'assets/img/grade/grade-' + g.toLowerCase() + '.webp'; }
  STAGES.forEach(function (s) {
    s.correct = 0; s.total = 0;
    s.acts.forEach(function (a) { s.correct += a.correct; s.total += a.total; });
    s.rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    s.grade = gradeOf(s.rate).toUpperCase();
  });

  /* 개념 훈련에는 타이머 · 제한 시간이 없다 — 소요 시간 · 시간 초과 감점도 없다 (2026-10-15 판단 보드 14) */
  var SCORE = 88;
  var COMMENT =
    '진방울님의 개념 훈련 결과는 100점 만점 중 ' + SCORE + '점입니다.\n' +
    (SCI ? '개념 확인하기는' : '기초 연산은') + ' 탄탄하게 풀었지만, 개념 학습에서 몇 문제를 놓쳤어요.\n' +
    '오답노트를 확인한 뒤 개념 학습을 한 번 더 복습해 보세요.';

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
  function segHTML(correct, total) {
    var s = '';
    for (var i = 0; i < total; i++) s += '<i data-on="' + (i < correct ? 1 : 0) + '"></i>';
    return '<span class="led">' + s + '</span>';
  }
  var rows = document.getElementById('rows');
  var sumCorrect = 0, sumTotal = 0;
  STAGES.forEach(function (s) {
    var rate = s.rate;
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
  var cells = document.querySelectorAll('.tbl .led i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 180 + i * 22);
  });

  /* ---------- 코멘트 ---------- */
  document.getElementById('comment').textContent = COMMENT;

  /* ---------- 「보기」 → 스텝 결과 스크린창 ---------- */
  var stepMon = document.getElementById('stepMon');
  var stepDial = document.getElementById('stepDial');
  var stepActs = document.getElementById('stepActs');
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  function openStepMonitor(stage) {
    var rate = stage.rate;
    document.getElementById('stepMonTtl').textContent = '스텝 결과 — ' + stage.name;
    document.getElementById('stepBadge').src = bigBadge(stage.grade);
    document.getElementById('stepRate').textContent = rate;
    document.getElementById('stepScore').textContent = stage.correct + '/' + stage.total;
    /* 활동별 행 — 스텝 결과 화면과 같은 구성 통으로 */
    stepActs.innerHTML = '';
    stage.acts.forEach(function (a) {
      var pr = a.total ? Math.round((a.correct / a.total) * 100) : 0;
      var row = document.createElement('div');
      row.className = 'mact';
      row.innerHTML =
        '<div class="mact__name">' + DOC + '<span>' + a.name + '</span></div>' +
        segHTML(a.correct, a.total) +
        '<div class="mact__stat"><span>정답</span><b>' + a.correct + '/' + a.total + '</b></div>' +
        '<div class="mact__stat"><span>정답률</span><b>' + pr + '%</b></div>';
      stepActs.appendChild(row);
    });
    stepMon.classList.add('is-open');
    stepMon.setAttribute('aria-hidden', 'false');
    if (SNAP) { stepDial.style.transition = 'none'; stepDial.style.setProperty('--pct', rate); }
    else {
      stepDial.style.setProperty('--pct', 0);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        stepDial.style.setProperty('--pct', rate);
      }); });
    }
    [].forEach.call(stepActs.querySelectorAll('.led i[data-on="1"]'), function (c, i) {
      if (SNAP) c.classList.add('on');
      else setTimeout(function () { c.classList.add('on'); }, 220 + i * 40);
    });
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

})();
