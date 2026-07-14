/* =========================================================================
   시험대비 메인 홈 (exam-home) — 에디토리얼 라이트 대시보드
   · 우측 패널엔 전 단원이 다 렌더됨. 좌측 사이드바 = 스크롤 위치 표시(scroll-spy).
   · 성취도 필터: 상태별 타일만 강조(나머지 흐리게). '중요 유형만' = 별 달린 타일.
   · 아이콘은 피그마 다운로드 SVG를 인라인(currentColor로 상태색). star는 2톤 고정.
   ========================================================================= */
(function () {
  // ── 인라인 SVG 아이콘 (다운로드본, fill=currentColor) ──────────────
  var G = {
    q: '<svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.4766 32.4219C23.4766 33.4827 23.0551 34.5002 22.305 35.2503C21.5548 36.0004 20.5374 36.4219 19.4766 36.4219C18.4157 36.4219 17.3983 36.0004 16.6481 35.2503C15.898 34.5002 15.4766 33.4827 15.4766 32.4219C15.4766 31.361 15.898 30.3436 16.6481 29.5934C17.3983 28.8433 18.4157 28.4219 19.4766 28.4219C20.5374 28.4219 21.5548 28.8433 22.305 29.5934C23.0551 30.3436 23.4766 31.361 23.4766 32.4219Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4195 9.52656C18.0795 9.52656 16.9295 9.92656 16.1195 10.4986C15.3395 11.0506 14.9535 11.6926 14.8415 12.2466C14.676 12.9871 14.2269 13.6333 13.5905 14.0464C12.954 14.4596 12.181 14.6069 11.4372 14.4567C10.6934 14.3065 10.0382 13.8707 9.61198 13.2429C9.18579 12.6151 9.02264 11.8453 9.15753 11.0986C9.61153 8.84656 11.0075 7.00856 12.7755 5.75856C14.6155 4.45856 16.9475 3.72656 19.4195 3.72656C24.5335 3.72656 29.8355 7.14656 29.8355 12.6386C29.8355 15.8186 27.9455 18.3906 25.4975 19.8906C24.8414 20.2921 24.0526 20.4165 23.3047 20.2365C22.5568 20.0565 21.9111 19.5867 21.5095 18.9306C21.108 18.2744 20.9836 17.4856 21.1636 16.7377C21.3436 15.9898 21.8134 15.3441 22.4695 14.9426C23.6095 14.2446 24.0355 13.3546 24.0355 12.6386C24.0355 11.4906 22.6055 9.52656 19.4195 9.52656Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.4195 17.2578C21.0195 17.2578 22.3195 18.5538 22.3195 20.1578V23.1618C22.3195 23.9309 22.014 24.6686 21.4701 25.2124C20.9263 25.7563 20.1887 26.0618 19.4195 26.0618C18.6504 26.0618 17.9128 25.7563 17.3689 25.2124C16.8251 24.6686 16.5195 23.9309 16.5195 23.1618V20.1578C16.5195 18.5578 17.8175 17.2578 19.4195 17.2578Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26.4776 15.9252C26.6735 16.2521 26.803 16.6144 26.8588 16.9915C26.9145 17.3685 26.8954 17.7528 26.8026 18.1224C26.7097 18.4921 26.5449 18.8398 26.3175 19.1457C26.0902 19.4516 25.8047 19.7097 25.4776 19.9052L20.9096 22.6392C20.2497 23.0343 19.4599 23.1512 18.7139 22.964C17.9679 22.7769 17.3268 22.301 16.9316 21.6412C16.5364 20.9813 16.4196 20.1915 16.6067 19.4455C16.7939 18.6994 17.2697 18.0583 17.9296 17.6632L22.4996 14.9272C22.8264 14.7316 23.1886 14.6023 23.5654 14.5467C23.9422 14.4911 24.3263 14.5103 24.6957 14.6031C25.0651 14.696 25.4126 14.8607 25.7184 15.0879C26.0241 15.3151 26.2821 15.5983 26.4776 15.9252Z"/></svg>',
    check: '<svg viewBox="0 0 34 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.5479 29.1803L0.497897 18.1303C-0.165966 17.4664 -0.165966 16.3901 0.497897 15.7261L2.902 13.322C3.56587 12.658 4.64231 12.658 5.30617 13.322L12.75 20.7657L28.6938 4.82197C29.3577 4.1581 30.4341 4.1581 31.098 4.82197L33.5021 7.22614C34.1659 7.89 34.1659 8.96638 33.5021 9.63031L13.9521 29.1804C13.2881 29.8442 12.2118 29.8442 11.5479 29.1803Z"/></svg>',
    crown: '<svg viewBox="0 0 45 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M24.258 10.6303C24.9049 10.117 25.3127 9.32245 25.3127 8.43652C25.3127 6.88261 24.0541 5.62402 22.5002 5.62402C20.9463 5.62402 19.6877 6.88261 19.6877 8.43652C19.6877 9.32245 20.1025 10.117 20.7424 10.6303L15.933 18.1959C15.2299 19.2998 13.7322 19.574 12.6846 18.7865L8.50098 15.6576C8.81738 15.2076 9.0002 14.6521 9.0002 14.0615C9.0002 12.5076 7.7416 11.249 6.1877 11.249C4.63379 11.249 3.3752 12.5076 3.3752 14.0615C3.3752 15.5943 4.60567 16.8459 6.13145 16.874L8.42363 32.167C8.7541 34.3678 10.6455 35.999 12.8744 35.999H32.126C34.3549 35.999 36.2463 34.3678 36.5768 32.167L38.8689 16.874C40.3947 16.8459 41.6252 15.5943 41.6252 14.0615C41.6252 12.5076 40.3666 11.249 38.8127 11.249C37.2588 11.249 36.0002 12.5076 36.0002 14.0615C36.0002 14.6521 36.183 15.2076 36.4994 15.6576L32.3229 18.7935C31.2752 19.581 29.7775 19.3068 29.0744 18.2029L24.258 10.6303Z"/></svg>',
    exclam: '<svg viewBox="0 0 16 43" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7054 4.23281L14.7648 23.0453C14.7131 24.0782 14.2664 25.0517 13.5171 25.7646C12.7677 26.4774 11.7731 26.8749 10.7389 26.875H4.97154C3.93734 26.8749 2.94273 26.4774 2.19341 25.7646C1.44409 25.0517 0.997377 24.0782 0.945667 23.0453L0.00504243 4.23281C-0.0222743 3.68716 0.0616071 3.14165 0.251591 2.62941C0.441576 2.11717 0.733698 1.6489 1.11022 1.25302C1.48674 0.85715 1.93979 0.541941 2.44188 0.326541C2.94396 0.111141 3.48458 0.0000451 4.03092 0L11.6795 0C12.2259 0.0000451 12.7665 0.111141 13.2686 0.326541C13.7707 0.541941 14.2237 0.85715 14.6002 1.25302C14.9768 1.6489 15.2689 2.11717 15.4589 2.62941C15.6489 3.14165 15.7327 3.68716 15.7054 4.23281ZM7.85523 29.5625C9.63715 29.5625 11.3461 30.2704 12.6061 31.5304C13.8661 32.7904 14.574 34.4993 14.574 36.2812C14.574 38.0632 13.8661 39.7721 12.6061 41.0321C11.3461 42.2921 9.63715 43 7.85523 43C6.07331 43 4.36437 42.2921 3.10436 41.0321C1.84435 39.7721 1.13648 38.0632 1.13648 36.2812C1.13648 34.4993 1.84435 32.7904 3.10436 31.5304C4.36437 30.2704 6.07331 29.5625 7.85523 29.5625Z"/></svg>',
    star: '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2363 2.50977C17.3941 2.6027 18.1874 3.36933 18.7549 4.11035C19.3594 4.89972 19.9909 6.04012 20.7266 7.35938L21.1201 8.06445V8.06543C21.3471 8.47267 21.4769 8.70347 21.5869 8.86914C21.6362 8.94339 21.6681 8.98211 21.6855 9.00195C21.7148 9.02672 21.7557 9.04732 21.8535 9.07812C22.0323 9.13441 22.2767 9.19004 22.7197 9.29004L23.4844 9.46387L24.5166 9.69922C25.5103 9.93016 26.3814 10.1534 27.0674 10.4238C28.0105 10.7956 28.9866 11.4021 29.3633 12.6113L29.3643 12.6123C29.7349 13.8055 29.2946 14.866 28.7529 15.7266C28.3542 16.3601 27.7805 17.0703 27.1074 17.8662L26.4033 18.6914L25.8828 19.2979C25.5831 19.6507 25.4134 19.8505 25.2969 20.0107C25.2448 20.0824 25.2186 20.1262 25.2051 20.1514C25.1714 20.2428 25.1526 20.3316 25.251 21.3467L25.3301 22.1592V22.1602C25.4772 23.6819 25.6072 24.9874 25.5625 25.9912C25.5177 26.9975 25.285 28.1451 24.2803 28.9072C23.2517 29.6874 22.0822 29.5627 21.1201 29.2871C20.1771 29.0169 19.016 28.4783 17.6826 27.8643V27.8633L16.9678 27.5361C16.5514 27.3433 16.3214 27.2388 16.1455 27.1748C15.9953 27.1202 15.9742 27.1299 16 27.1299C16.0258 27.1299 16.0047 27.1202 15.8545 27.1748C15.6786 27.2388 15.4486 27.3433 15.0352 27.5342L14.3174 27.8633C12.9845 28.4782 11.8236 29.0168 10.8809 29.2871C9.97982 29.5454 8.89548 29.6716 7.91602 29.0439L7.7207 28.9082C6.71618 28.1459 6.48256 26.9993 6.4375 25.9922C6.3926 24.988 6.5228 23.682 6.66992 22.1602V22.1592L6.74902 21.3477C6.79428 20.88 6.81924 20.6119 6.82324 20.4082C6.82504 20.3167 6.8218 20.2632 6.81836 20.2324C6.80765 20.1796 6.80435 20.1706 6.79297 20.1494C6.77983 20.1249 6.75385 20.0819 6.70215 20.0107C6.5864 19.8514 6.41784 19.652 6.11719 19.3008L5.5957 18.6904V18.6895C4.62211 17.5515 3.77867 16.5721 3.24707 15.7275C2.70514 14.8665 2.26561 13.8064 2.63574 12.6133L2.71387 12.3926C3.13443 11.3272 4.04846 10.7713 4.93262 10.4229C5.61906 10.1523 6.49046 9.92893 7.48438 9.69824L8.51758 9.46289L9.28027 9.29102L9.8125 9.16797C9.95086 9.13439 10.0563 9.10623 10.1455 9.07812C10.2239 9.05341 10.2648 9.03562 10.2842 9.02637C10.3091 9.01002 10.3441 8.97409 10.4131 8.87012C10.5231 8.70434 10.6523 8.47377 10.8799 8.06543V8.06445L11.2734 7.35938C12.0091 6.04012 12.6406 4.89972 13.2451 4.11035C13.8504 3.31995 14.7126 2.5 16 2.5L16.2363 2.50977Z" fill="#FFC800" stroke="white" stroke-width="3"/></svg>'
  };

  // 상태코드 → 타일 클래스 + 아이콘. * 접미사 = 중요 유형(별)
  //  u 미진행(점선?)  j 미판정(실선?)  r 재학습(빨강!)  b 보충(노랑!)  e 이해(초록✓)  m 정복(초록왕관)
  var STATE = {
    u: { cls: 'u', ic: 'q' }, j: { cls: 'j', ic: 'q' },
    r: { cls: 'r', ic: 'exclam' }, b: { cls: 'b', ic: 'exclam' },
    e: { cls: 'e', ic: 'check' }, m: { cls: 'm', ic: 'crown' }
  };
  function tile(code) {
    var imp = code.indexOf('*') > -1, key = code.replace('*', ''), s = STATE[key] || STATE.u;
    return '<span class="tile tile--' + s.cls + '" data-s="' + key + '"' + (imp ? ' data-imp="1"' : '') + ' tabindex="0">' +
      G[s.ic] + (imp ? '<span class="tile__star">' + G.star + '</span>' : '') + '</span>';
  }
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
  document.getElementById('startBtn').addEventListener('click', function () { window.location.href = 'exam-solve.html'; });

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
})();
