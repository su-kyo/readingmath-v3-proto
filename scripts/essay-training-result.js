/* =====================================================================
   서술형 훈련 · 학습 결과 — Phase 7 ① 계기판 어휘
   총점 = 별 + 점수(상위 종합). 단계별 행 = 육각 뱃지 + 빈칸 LED.
   「보기」 = 스텝 결과 스크린창(보조 모니터 · 다이얼 + 문제별 행).
   ===================================================================== */
(function () {
  'use strict';

  /* 결과 화면은 항상 다크 계기판 — 테마 토글·저장 테마 적용 없음 (Phase 7 사용자 결정).
     학습 화면은 테마를 기억하지 않고 늘 라이트로 시작한다(2026-10-16 사용자 결정). */

  /* ---------- 데이터 (서술형 훈련 3단계 · 문제까지 한 벌 · 과목 분기 = scripts/subject.js) ----------
     서술형은 문제마다 빈칸이 여러 개다. total = 그 문제의 빈칸 수(실서비스 「풀이답안 문제수」). 스텝의 정답·등급은 probs에서 집계한다.
     수학: 기초 기르기 2문항(빈칸 10 · 12) · 기본 다지기 3문항(8 · 8 · 8) · 실력 키우기 3문항(6 · 6 · 4)
     과학: 문장 완성하기 2문항(4 · 4) · 답안 완성하기 2문항(5 · 6) · 탐구활동 보고서 1편(7)
     ※ 1단계 probs는 essay/step-result.html(essay-step-result.js)과 같은 숫자를 유지할 것.
       2 · 3단계 정답 수는 해설 화면의 데모 학생 답(essay-drill-data-*.js · essay-report-data-sci.js 의 my)과 맞춘다. */
  var S = window.RMSubject;
  var STAGES = S.pick([
    { no: 1, name: '기초 기르기', probs: [ { no: 1, correct: 7, total: 10 },
                                           { no: 2, correct: 10, total: 12 } ] },
    { no: 2, name: '기본 다지기', probs: [ { no: 1, correct: 6, total: 8 },
                                           { no: 2, correct: 8, total: 8 },
                                           { no: 3, correct: 7, total: 8 } ] },
    { no: 3, name: '실력 키우기', probs: [ { no: 1, correct: 6, total: 6 },
                                           { no: 2, correct: 6, total: 6 },
                                           { no: 3, correct: 3, total: 4 } ] }
  ], [
    { no: 1, name: '문장 완성하기',          probs: [ { no: 1, correct: 3, total: 4 },
                                                      { no: 2, correct: 3, total: 4 } ] },
    { no: 2, name: '답안 완성하기',          probs: [ { no: 1, correct: 3, total: 5 },
                                                      { no: 2, correct: 6, total: 6 } ] },
    { no: 3, name: '탐구활동 보고서 만들기', probs: [ { no: 1, correct: 6, total: 7 } ] }
  ]);
  function gradeOf(r) { return RMGrade.of(r); }  /* 기준은 scripts/grade.js 하나 */
  function stepBadge(g) { return 'assets/img/grade/grade-step-' + g.toLowerCase() + '.webp'; }
  function bigBadge(g)  { return 'assets/img/grade/grade-' + g.toLowerCase() + '.webp'; }
  STAGES.forEach(function (s) {
    s.correct = 0; s.total = 0;
    s.probs.forEach(function (p) { s.correct += p.correct; s.total += p.total; });
    s.rate = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    s.grade = gradeOf(s.rate).toUpperCase();
  });

  /* 시간 초과 감점(10점) 여부 — 검수 패널에서 토글할 수 있다 */
  var BASE_SCORE = 82, PENALTY = 10;
  var overtime = false;
  var SCORE = BASE_SCORE - (overtime ? PENALTY : 0);
  var COMMENT =
    '진방울님의 서술형 훈련 결과는 100점 만점 중 ' + SCORE + '점입니다.\n' +
    S.pick('실력 키우기는 거의 완벽했지만, 기초 기르기에서 계산 과정과 서술의 정확성이 흔들렸어요.\n' +
           '오답노트를 확인한 뒤 기초 기르기를 한 번 더 복습해 보세요.',
           '탐구활동 보고서는 안정적이었지만, 문장 완성하기에서 알맞은 말을 고르는 정확성이 흔들렸어요.\n' +
           '오답노트를 확인한 뒤 문장 완성하기를 한 번 더 복습해 보세요.');

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

  /* ---------- 단계별 행 (뱃지 + 빈칸 LED + 보기) ---------- */
  function segHTML(correct, total) {
    var s = '';
    for (var i = 0; i < total; i++) s += '<i data-on="' + (i < correct ? 1 : 0) + '"></i>';
    return '<span class="led">' + s + '</span>';
  }
  var rows = document.getElementById('rows');
  var sumCorrect = 0, sumTotal = 0;
  STAGES.forEach(function (s) {
    sumCorrect += s.correct; sumTotal += s.total;
    var row = document.createElement('div');
    row.className = 'trow trow--data';
    row.innerHTML =
      '<div class="tcell tcell--name"><span class="tnum">' + s.no + '</span><span class="tname">' + s.name + '</span></div>' +
      '<div class="tcell"><img class="tgrade" src="' + stepBadge(s.grade) + '" alt="' + s.grade + '" /></div>' +
      '<div class="tcell">' + segHTML(s.correct, s.total) + '</div>' +
      '<div class="tcell tst">' + s.correct + '<small>/' + s.total + '</small></div>' +
      '<div class="tcell tpc">' + s.rate + '%</div>' +
      '<div class="tcell"><button class="tview" data-no="' + s.no + '">보기</button></div>';
    rows.appendChild(row);
  });

  /* ---------- 전체 행 (빈칸 전체는 뭉개져서 비워 둔다 — 수치로 읽는다) ---------- */
  var totalRate = sumTotal ? Math.round((sumCorrect / sumTotal) * 100) : 0;
  document.getElementById('totalRow').innerHTML =
    '<div class="tcell tcell--name"><span class="tname">전체</span></div>' +
    '<div class="tcell"></div>' +
    '<div class="tcell"></div>' +
    '<div class="tcell tst">' + sumCorrect + '<small>/' + sumTotal + '</small></div>' +
    '<div class="tcell tpc">' + totalRate + '%</div>' +
    '<div class="tcell"></div>';

  /* 빈칸 LED 순차 점등 */
  var cells = document.querySelectorAll('.tbl .led i[data-on="1"]');
  [].forEach.call(cells, function (c, i) {
    if (SNAP) c.classList.add('on');
    else setTimeout(function () { c.classList.add('on'); }, 180 + i * 14);
  });

  /* ---------- 코멘트 ---------- */
  document.getElementById('comment').textContent = COMMENT;

  /* ---------- 「보기」 → 스텝 결과 스크린창 ---------- */
  var stepMon = document.getElementById('stepMon');
  var stepDial = document.getElementById('stepDial');
  var stepActs = document.getElementById('stepActs');
  var DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  function openStepMonitor(stage) {
    document.getElementById('stepMonTtl').textContent = '스텝 결과 — ' + stage.name;
    document.getElementById('stepBadge').src = bigBadge(stage.grade);
    document.getElementById('stepRate').textContent = stage.rate;
    document.getElementById('stepScore').textContent = stage.correct + '/' + stage.total;
    /* 문제별 행 — 스텝 결과 화면과 같은 구성 통으로 */
    stepActs.innerHTML = '';
    stage.probs.forEach(function (p) {
      var pr = p.total ? Math.round((p.correct / p.total) * 100) : 0;
      var row = document.createElement('div');
      row.className = 'mact';
      row.innerHTML =
        '<div class="mact__name">' + DOC + '<span>' + p.no + '번 문제</span></div>' +
        segHTML(p.correct, p.total) +
        '<div class="mact__stat"><span>정답</span><b>' + p.correct + '/' + p.total + '</b></div>' +
        '<div class="mact__stat"><span>정답률</span><b>' + pr + '%</b></div>';
      stepActs.appendChild(row);
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
    [].forEach.call(stepActs.querySelectorAll('.led i[data-on="1"]'), function (c, i) {
      if (SNAP) c.classList.add('on');
      else setTimeout(function () { c.classList.add('on'); }, 220 + i * 34);
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
  if (homeBtn) homeBtn.addEventListener('click', function () { window.location.href = window.RMSubject ? RMSubject.home() : 'nav/home.html'; });

  /* ---------- 시간 초과 상태 토글 (검수용) ---------- */
  var overPill = document.getElementById('overPill');
  var inPill = document.getElementById('inPill');
  var durVal = document.getElementById('durVal');
  var commentEl = document.getElementById('comment');
  function setOvertime(on, initial) {
    overtime = on;
    SCORE = BASE_SCORE - (on ? PENALTY : 0);
    // 최초 1회는 점수 카운트업 애니메이션을 살려 둔다(SCORE를 읽어 올라간다)
    if (!initial) { clearInterval(sTimer); scoreEl.textContent = SCORE; }
    document.getElementById('totalStar').src = 'assets/icons/star/star-' + gradeOf(SCORE) + '.svg';
    if (overPill) overPill.hidden = !on;
    if (inPill) inPill.hidden = on;
    // 소요 시간도 상태에 맞춘다 — 감점이면 제한(60:00)보다 길게
    if (durVal) durVal.textContent = on ? durVal.dataset.over : durVal.dataset.in;
    if (commentEl) commentEl.textContent = commentEl.textContent
      .replace(/100점 만점 중 \d+점/, '100점 만점 중 ' + SCORE + '점');
  }
  setOvertime(overtime, true);

  if (window.RMDebug) window.RMDebug.register({
    title: '서술형 훈련 결과 · 시간',
    actions: [
      { label: '시간 초과', tone: 'no', run: function () { setOvertime(true); } },
      { label: '제한 시간 내', tone: 'ok', run: function () { setOvertime(false); } }
    ]
  });
})();
