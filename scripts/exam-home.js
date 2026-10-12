/* =========================================================================
   시험대비 메인 홈 (exam-home) — 에디토리얼 라이트 대시보드
   · 우측 패널엔 전 단원이 다 렌더됨. 좌측 사이드바 = 스크롤 위치 표시(scroll-spy).
   · 성취도 필터: 상태별 타일만 강조(나머지 흐리게). '중요 유형만' = 별 달린 타일.
   · 타일 한 칸(상태 6 · 중요 별)과 아이콘은 exam-tile.js 가 그린다.
   ========================================================================= */
(function () {
  // 타일 한 칸과 아이콘은 exam-tile.js (스토리북과 같이 쓴다)
  var G = RMExamTile.G, tile = RMExamTile.html;
  function grid(codes) { return '<div class="grid">' + codes.map(tile).join('') + '</div>'; }
  function band(kind, label, codes) {
    return '<div class="band band--' + kind + '"><span class="band__badge">' + label + '</span>' + grid(codes) + '</div>';
  }
  function bands(b) {
    return '<div class="bands">' + band('basic', '기본', b.basic) + band('skill', '실력', b.skill) + band('adv', '심화', b.adv) + '</div>';
  }

  // ── 대표 상태 패턴(여러 성취도 혼재 + 중요유형 별) ──
  var P = {
    basic: ['e', 'e', 'r', 'u*', 'm*', 'm', 'j', 'u*', 'j'],
    skill: ['u', 'j', 'u*', 'r', 'e*', 'm', 'b', 'u*', 'j'],
    adv:   ['u', 'r', 'u*', 'e', 'b', 'u*', 'j', 'j', 'u']
  };
  var Q = {
    basic: ['e', 'm', 'r', 'u*', 'e*', 'm', 'b', 'j*', 'u'],
    skill: ['u', 'u', 'j*', 'r', 'e*', 'm', 'b', 'u*', 'j'],
    adv:   ['r', 'r', 'u*', 'e', 'b', 'j*', 'u', 'u', 'j', 'e*']
  };

  var UNITS = [
    { no: '1단원', title: '덧셈과 뺄셈', subs: [
      { title: '(1) 받아올림이 없는 세 자리 수의 덧셈', bands: P },
      { title: '(2) 받아올림이 있는 세 자리 수의 덧셈', bands: Q },
      { title: '(3) 받아내림이 있는 세 자리 수의 뺄셈', bands: P } ] },
    { no: '2단원', title: '평면도형', subs: [
      { title: '(1) 선의 종류와 각', bands: Q },
      { title: '(2) 직각삼각형과 직사각형', bands: P } ] },
    { no: '3단원', title: '나눗셈', subs: [
      { title: '(1) 똑같이 나누기', bands: P },
      { title: '(2) 곱셈과 나눗셈의 관계', bands: Q } ] },
    { no: '4단원', title: '곱셈', subs: [
      { title: '(1) (몇십)×(몇)', bands: Q },
      { title: '(2) (몇십몇)×(몇)', bands: P } ] },
    { no: '5단원', title: '길이와 시간', subs: [
      { title: '(1) 1cm보다 작은 단위', bands: P } ] },
    { no: '6단원', title: '분수와 소수', subs: [
      { title: '(1) 분수 알아보기', bands: Q },
      { title: '(2) 소수 알아보기', bands: P } ] }
  ];

  var sidebar = document.getElementById('sidebar');
  var panel = document.getElementById('panel');

  // 성취도 필터 칩 (아이콘 포함)
  var ACH = [
    { f: 'all', label: '전체', ic: '' },
    { f: 'u', label: '미진행', ic: '<span class="cdot cdot--dash"></span>' },
    { f: 'j', label: '미판정', ic: '<span class="cdot cdot--solid"></span>' },
    { f: 'r', label: '재학습', ic: '<span class="cico">' + G.exclam + '</span>' },
    { f: 'b', label: '보충', ic: '<span class="cico">' + G.exclam + '</span>' },
    { f: 'e', label: '이해', ic: '<span class="cico">' + G.check + '</span>' },
    { f: 'm', label: '정복', ic: '<span class="cico">' + G.crown + '</span>' },
    { f: 'imp', label: '중요 유형만', ic: '<span class="cico">' + G.star + '</span>' }
  ];
  document.getElementById('achieveChips').innerHTML = ACH.map(function (a, i) {
    return '<span class="chip' + (i === 0 ? ' is-active' : '') + '" data-f="' + a.f + '">' + a.ic + a.label + '</span>';
  }).join('');

  // 사이드바
  sidebar.innerHTML = UNITS.map(function (u, i) {
    return '<div class="unit' + (i === 0 ? ' is-active' : '') + '" data-unit="' + i + '">' +
      '<span class="unit__no">' + u.no + '</span><span class="unit__title">' + u.title + '</span></div>';
  }).join('');
  var chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  // 우측 패널 = 전 단원
  panel.innerHTML = UNITS.map(function (u, i) {
    var subs = u.subs.map(function (s) {
      return '<section class="subunit"><div class="subunit__head"><span class="subunit__chev">' + chev + '</span>' +
        '<span class="subunit__title">' + s.title + '</span></div>' + bands(s.bands) + '</section>';
    }).join('');
    return '<section class="unit-sec" id="unit-' + i + '" data-unit="' + i + '">' +
      '<div class="unit-sec__head"><span class="unit-badge">' + u.no + '</span><h3>' + u.title + '</h3></div>' + subs + '</section>';
  }).join('');

  var units = Array.prototype.slice.call(sidebar.children);
  var secs = Array.prototype.slice.call(panel.querySelectorAll('.unit-sec'));
  function setActive(i) { units.forEach(function (el, k) { el.classList.toggle('is-active', k === i); }); }

  // 부드러운 스크롤 (scrollTo smooth가 무동작인 환경 대비 — 직접 tween)
  var clickLock = 0, scrollTimer = null;
  function smoothScrollTo(to) {
    var start = panel.scrollTop, diff = to - start;
    if (Math.abs(diff) < 2) { panel.scrollTop = to; return; }
    var dur = Math.min(560, 200 + Math.abs(diff) * 0.22), t0 = Date.now();
    clearInterval(scrollTimer);
    scrollTimer = setInterval(function () {
      var p = Math.min(1, (Date.now() - t0) / dur), ease = 0.5 - 0.5 * Math.cos(Math.PI * p);
      panel.scrollTop = start + diff * ease;
      if (p >= 1) clearInterval(scrollTimer);
    }, 16);
  }

  // 사이드바 클릭 → 해당 단원으로 스크롤
  sidebar.addEventListener('click', function (e) {
    var el = e.target.closest('.unit'); if (!el) return;
    var i = +el.dataset.unit;
    setActive(i); clickLock = Date.now();
    smoothScrollTo(Math.max(0, secs[i].offsetTop - 4));
  });

  // 패널 스크롤 → scroll-spy
  panel.addEventListener('scroll', function () {
    if (Date.now() - clickLock < 650) return;
    var line = panel.scrollTop + 72, cur = 0;
    for (var i = 0; i < secs.length; i++) { if (secs[i].offsetTop <= line) cur = i; }
    setActive(cur);
  }, { passive: true });

  // 소단원 접기 / 타일 클릭 → 유형 상세 패널
  panel.addEventListener('click', function (e) {
    var head = e.target.closest('.subunit__head');
    if (head) { head.parentElement.classList.toggle('is-collapsed'); return; }
    var t = e.target.closest('.tile');
    if (t) openDetail(t);
  });

  // ── 유형 상세 슬라이드 패널 ──
  var detail = document.getElementById('detail'), backdrop = document.getElementById('detailBackdrop');
  var STLABEL = { u: '미진행', j: '미판정', r: '재학습', b: '보충', e: '이해', m: '정복' };
  var TIER = { basic: '기본', skill: '실력', adv: '심화' };
  var xIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>';
  var stIcon = { r: xIcon, b: G.exclam, e: G.check, m: G.crown };
  // 시작 버튼 문구: 이해(e)→왕관 도전, 정복(m)→다시 도전, 그 외→번개 도전
  var START_LABEL = { e: '왕관 도전', m: '다시 도전' };
  var startLabelEl = document.getElementById('startLabel');

  function openDetail(t) {
    var s = t.dataset.s;
    var band = t.closest('.band');
    var tier = band && band.classList.contains('band--basic') ? 'basic'
      : band && band.classList.contains('band--skill') ? 'skill' : 'adv';
    var sub = t.closest('.subunit');
    var title = sub ? sub.querySelector('.subunit__title').textContent.replace(/^\(\d+\)\s*/, '') : '유형';
    document.getElementById('dBadges').innerHTML =
      '<span class="dbadge dbadge--' + s + '">' + (stIcon[s] || '') + STLABEL[s] + '</span>' +
      '<span class="dbadge dbadge--tier">' + TIER[tier] + '</span>';
    document.getElementById('dType').textContent = title;
    startLabelEl.textContent = START_LABEL[s] || '번개 도전';
    // 내가 누른 타일 포커스 유지 (dim 위로 떠오름)
    panel.querySelectorAll('.tile.is-source').forEach(function (x) { x.classList.remove('is-source'); });
    t.classList.add('is-source');
    detail.classList.add('is-open'); backdrop.classList.add('is-open'); detail.setAttribute('aria-hidden', 'false');
  }
  function closeDetail() {
    detail.classList.remove('is-open'); backdrop.classList.remove('is-open'); detail.setAttribute('aria-hidden', 'true');
    panel.querySelectorAll('.tile.is-source').forEach(function (x) { x.classList.remove('is-source'); });
  }
  document.getElementById('detailClose').addEventListener('click', closeDetail);
  backdrop.addEventListener('click', closeDetail);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDetail(); });
  document.getElementById('startBtn').addEventListener('click', function () { window.location.href = 'exam/solve.html'; });

  // ── 성취도 필터 ──
  function applyAchieve(code) {
    if (code === 'all') {
      panel.classList.remove('is-filtering');
      panel.querySelectorAll('.tile.is-match').forEach(function (t) { t.classList.remove('is-match'); });
      return;
    }
    panel.classList.add('is-filtering');
    panel.querySelectorAll('.tile').forEach(function (t) {
      var match = code === 'imp' ? t.dataset.imp === '1' : t.dataset.s === code;
      t.classList.toggle('is-match', match);
    });
  }

  // 칩 단일 선택 (교재 + 성취도)
  document.querySelectorAll('.chips[data-single]').forEach(function (row) {
    row.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      row.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('is-active'); });
      c.classList.add('is-active');
      if (row.hasAttribute('data-achieve')) applyAchieve(c.dataset.f);
    });
  });

  // 초기화
  document.getElementById('resetBtn').addEventListener('click', function () {
    document.querySelectorAll('.chips[data-single]').forEach(function (row) {
      row.querySelectorAll('.chip').forEach(function (x, i) { x.classList.toggle('is-active', i === 0); });
    });
    applyAchieve('all');
  });

  // 필터 카드 접기
  document.getElementById('filterHead').addEventListener('click', function () {
    document.getElementById('filter').classList.toggle('is-collapsed');
  });

  // 상단 모드 탭 (데모)
  document.querySelectorAll('.xtab[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.xtab').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });

  // ── 과제 연계 유형 강조 (과제 결과 화면에서 ?linked 로 진입) ──
  (function () {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { return; }
    if (!params.has('linked')) return;

    // 데모: 방금 푼 과제(중등 · 일차부등식)와 연계된 대표 유형 위치
    // (실서비스에선 과제 메타데이터로 단원/유형을 매핑)
    var LINK = { u: 1, sub: 0, tier: 'skill', idx: 3 };
    var sec = document.getElementById('unit-' + LINK.u);
    var subEl = sec && sec.querySelectorAll('.subunit')[LINK.sub];
    var bandEl = subEl && subEl.querySelector('.band--' + LINK.tier);
    var tileEl = bandEl && bandEl.querySelectorAll('.tile')[LINK.idx];
    if (!tileEl) return;

    // 지속 표시: 코너 링크 배지 (브리딩이 끝나도 어떤 유형이었는지 남김)
    var linkIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 5.7 5.7l-1 1M13.5 17.5l-1 1a4 4 0 0 1-5.7-5.7l1-1"/></svg>';
    tileEl.classList.add('is-linked');
    var flag = document.createElement('span');
    flag.className = 'tile__linkflag';
    flag.innerHTML = linkIco;
    tileEl.appendChild(flag);

    // 진입 콜아웃 말풍선
    var callout = document.createElement('span');
    callout.className = 'tile__callout';
    callout.textContent = '방금 푼 과제와 연관된 유형';
    tileEl.appendChild(callout);

    // 사이드바 활성 + 해당 단원으로 스크롤(사이드바 클릭과 동일한 검증된 경로) 후 브리딩 시작
    // (연계 타일은 해당 단원 첫 소단원 실력밴드에 있어 단원 상단으로 스크롤하면 바로 보임)
    // 레이아웃이 실제로 잡힌 뒤 측정해야 offsetTop이 정확 (초기엔 0폭 상태로 값이 튐)
    setActive(LINK.u);
    clickLock = Date.now();
    function runScroll(tries) {
      if ((panel.clientHeight < 100 || secs[LINK.u].offsetTop < 1) && tries < 40) {
        setTimeout(function () { runScroll(tries + 1); }, 50);
        return;
      }
      clickLock = Date.now();
      smoothScrollTo(Math.max(0, secs[LINK.u].offsetTop - 4));
      tileEl.classList.add('is-breathing');
      // 아래 종료 타이머는 브리딩 시작 기준
      setTimeout(function () { tileEl.classList.remove('is-breathing'); }, 2300);   // 브리딩 ~2초 후 종료
      setTimeout(function () { callout.classList.add('is-hiding'); }, 3200);        // 콜아웃 페이드아웃
      setTimeout(function () { if (callout.parentNode) callout.parentNode.removeChild(callout); }, 3520);
    }
    runScroll(0);
  })();
})();
