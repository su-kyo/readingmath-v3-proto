/* =========================================================================
   서술형 훈련 2단계 — 기본 다지기(수학) · 답안 완성하기(과학) · 해설 보기(채점)
   essay/drill-review-math.html · drill-review-sci.html 이 같이 쓴다.
   콘텐츠 = 2단계 화면과 같은 window.RMEssayDrill (scripts/essay-drill-data-math|sci.js) + 데모 학생 답(my).
   essay-drill-v2 화면 재사용(리뷰 모드). 학생이 이미 푼 답을 채점해 보여준다.
   · 빈칸 맞추기 = 정오답 표시. 오답은 클릭 → 내 답 ↔ 정답 토글.
   · 순서 맞추기 = 블록 모음(트레이) 없이 빈칸에 이미 배치됨. 정답 자리는 정답 디자인,
     오답 자리는 오답 상태(부분정답은 정답으로). 오답 클릭 → 내 답 ↔ 정답 토글.
   상호작용 = 채점 결과 열람 + 오답 토글뿐(입력·키패드·트레이 없음).
   ========================================================================= */
(function () {
  var D = window.RMEssayDrill, E = window.RMEssay;
  var N = D.problems.length;
  var pi = -1, P = null, phase = 'fill';   // phase = 'fill' | 'arrange' — 푼 순서대로 한 번에 한 단계만 보여준다

  /* 데모 학생 답 — my 에 적힌 칸만 오답, 나머지는 정답 */
  function myOf(p, f) { var m = p.my || {}; return m[f.id] != null ? m[f.id] : f.answer; }
  function enc(v) { return encodeURIComponent(v); }
  /* 빈칸(채점) 마크업 — 정답이면 초록, 오답이면 빨강(클릭 토글) */
  function gradedBlank(p) {
    return function (f) {
      var my = myOf(p, f);
      if (my === f.answer) return '<span class="rblank is-correct"><span class="rblank__val">' + E.value(my) + '</span></span>';
      return '<span class="rblank is-wrong" data-my="' + enc(my) + '" data-ans="' + enc(f.answer) + '">' +
        '<span class="rblank__val">' + E.value(my) + '</span></span>';
    };
  }
  /* 순서 맞추기 슬롯(채점) — 이미 배치된 상태. 정답이면 초록(잠금), 오답이면 빨강(클릭 토글) */
  function slotHTML(correct, my) {
    if (my === correct) return '<span class="rslot is-correct"><span class="rslot__val">' + E.value(my) + '</span></span>';   // 정답 표시는 코너 원형 뱃지(::after)
    return '<span class="rslot is-wrong" data-my="' + enc(my) + '" data-ans="' + enc(correct) + '">' +
      '<span class="rslot__val">' + E.value(my) + '</span></span>';
  }
  function load(i) {
    pi = i;
    var p = D.problems[i];
    P = E.drill(p, { blank: gradedBlank(p) });
    P.src = p;
  }
  function segHTML(seg) { return seg && seg.media != null ? '<span class="rline rline--img">' + seg.media + '</span>' : seg; }

  // ── DOM ──
  var problem = document.getElementById('problem');
  var problemHead = document.getElementById('problemHead');
  var readBody = document.getElementById('readBody');
  var fillDoc = document.getElementById('fillDoc');
  var arrangeDoc = document.getElementById('arrangeDoc');
  var qtabs = document.getElementById('qtabs');
  var pillFill = document.getElementById('pillFill');
  var pillArrange = document.getElementById('pillArrange');
  var wsLabel = document.getElementById('wsLabel');
  var primaryBtn = document.getElementById('primaryBtn');
  var primaryLabel = document.getElementById('primaryLabel');

  /* 문제 번호탭 (헤더) — 누르면 그 문제 해설로 이동 */
  function renderTabs() {
    var html = '';
    for (var i = 0; i < N; i++) {
      var cls = 'qtab' + (i === pi ? ' is-active' : (i < pi ? ' is-done' : ''));
      html += '<span class="' + cls + '" data-i="' + i + '">' + (i + 1) + '</span>';
    }
    qtabs.innerHTML = html;
  }
  /* 단계 스텝바 — 지금 보고 있는 해설이 어느 단계인지 */
  function setSteps() {
    if (phase === 'arrange') { pillFill.className = 'stepbar__i is-done'; pillArrange.className = 'stepbar__i is-on'; }
    else { pillFill.className = 'stepbar__i is-on'; pillArrange.className = 'stepbar__i'; }
  }

  function render() {
    renderTabs();
    setSteps();

    // 문제 카드 (읽기전용, 접기 가능 · 기본 접힘)
    readBody.innerHTML = P.statement.map(function (para) {
      var txt = para.filter(function (x) { return x.media == null; }), med = para.filter(function (x) { return x.media != null; });
      return (txt.length ? '<span class="rline rline--q">' + txt.join(' ') + '</span>' : '') + med.map(segHTML).join('');
    }).join('');

    // ① 빈칸 맞추기 채점
    fillDoc.innerHTML = P.chunks.map(function (line) {
      var txt = [], out = '';
      line.forEach(function (seg) {
        if (seg.media != null) { if (txt.length) out += '<span class="rline">' + txt.join(' ') + '</span>'; txt = []; out += segHTML(seg); }
        else txt.push(seg);
      });
      if (txt.length) out += '<span class="rline">' + txt.join(' ') + '</span>';
      return out;
    }).join('');

    // ② 순서 맞추기 채점
    arrangeDoc.innerHTML = P.arrange.map(function (c) {
      if (c.parts) {
        return '<span class="rline">' + c.parts.map(function (part) {
          return typeof part === 'string' ? part : slotHTML(part.slot, myOf(P.src, part.f));
        }).join(' ') + '</span>';
      }
      if (c.media != null) return segHTML(c);
      return '<span class="rline rline--muted">' + c.text + '</span>';
    }).join('');

    showPhase(phase);
  }

  /* 단계 전환 — 빈칸 해설 → 순서 해설 (푼 순서 그대로) */
  function showPhase(next) {
    phase = next;
    setSteps();
    var arrange = (phase === 'arrange');
    fillDoc.hidden = arrange;
    arrangeDoc.hidden = !arrange;
    wsLabel.textContent = arrange ? '② 순서 맞추기' : '① 빈칸 맞추기';

    // 콘솔바 안내(RM-PART-07) = 지금 보고 있는 단계에 오답이 있을 때만
    var view = arrange ? arrangeDoc : fillDoc;
    if (window.RMGuide) window.RMGuide.set(view.querySelector('.is-wrong') ? '오답을 눌러 정답을 확인해 보세요!' : '', 'no');

    if (!arrange) primaryLabel.textContent = '순서 맞추기 해설';
    else primaryLabel.textContent = (pi < N - 1) ? '다음 문제' : '결과로 돌아가기';
  }

  primaryBtn.addEventListener('click', function () {
    if (phase === 'fill') { showPhase('arrange'); return; }
    if (pi < N - 1) { load(pi + 1); phase = 'fill'; render(); document.querySelector('.stage-scroll').scrollTop = 0; }
    else window.location.href = D.next;
  });

  qtabs.addEventListener('click', function (e) {
    var t = e.target.closest('.qtab'); if (!t) return;
    load(+t.dataset.i); phase = 'fill'; render();
    document.querySelector('.stage-scroll').scrollTop = 0;
  });

  /* 오답 토글 (빈칸·슬롯 공용): 내 답 ↔ 정답 */
  function wireToggle(root) {
    root.addEventListener('click', function (e) {
      var w = e.target.closest('.rblank.is-wrong, .rslot.is-wrong');
      if (!w) return;
      // 같은 칸에서 내 답 ↔ 정답 교체 (병렬 표시 아님). rslot 값은 URI 인코딩됨
      var showAns = w.classList.toggle('show-ans');
      var valEl = w.querySelector(w.classList.contains('rslot') ? '.rslot__val' : '.rblank__val');
      if (valEl) valEl.innerHTML = E.value(decodeURIComponent(showAns ? w.dataset.ans : w.dataset.my));
    });
  }
  wireToggle(fillDoc);
  wireToggle(arrangeDoc);

  // 문제 카드 접기
  problemHead.addEventListener('click', function () { problem.classList.toggle('is-collapsed'); });

  var resultBtn = document.getElementById('resultBtn');
  if (resultBtn) resultBtn.addEventListener('click', function () { window.location.href = D.next; });

  // 타이머 = pause 상태(해설 화면). 정지된 값 그대로 표시.
  // 테마 토글
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var c = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
  });

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  if (window.RMDebug) window.RMDebug.register({
    title: D.title + ' 해설',
    actions: [
      { label: '빈칸 해설', run: function () { showPhase('fill'); } },
      { label: '순서 해설', run: function () { showPhase('arrange'); } },
      { label: '다음 문제', run: function () { if (pi < N - 1) { load(pi + 1); phase = 'fill'; render(); } } }
    ]
  });

  load(0);
  problem.classList.add('is-collapsed');
  render();
})();
