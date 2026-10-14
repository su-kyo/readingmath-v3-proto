/* styleguide/foundations.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
/* 이 페이지의 견본은 tokens.css 에서 계산된 값을 읽어 그린다.
   hex 를 옮겨 적지 않기 때문에 토큰을 고치면 문서가 저절로 따라온다. */
(function () {
  var cs = getComputedStyle(document.documentElement);
  function v(name) { return cs.getPropertyValue(name).trim(); }

  // 칩 위 글자색 — 칩이 밝으면 검정, 어두우면 흰색.
  function ink(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return 'var(--n-000)';
    var n = parseInt(m[1], 16);
    var lum = 0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255);
    return lum > 140 ? 'var(--n-900)' : 'var(--n-000)';
  }

  /* ---- 색 램프 ---- */
  var FAMILIES = [
    ['뉴트럴 N', '브랜드 네이비 언더톤 · 표면과 글자를 함께 담당한다', 'n',
      ['000','050','100','200','300','350','400','500','600','650','700','800','900','950']],
    ['블루', '개념 · 과제 · 유틸 · 안내', 'blue', null],
    ['틸', '유형', 'teal', null],
    ['바이올렛', '서술형 · 시험대비', 'violet', null],
    ['오렌지', 'CTA · 과제 모드', 'orange', null],
    ['그린', '정답 · 자유 모드', 'green', null],
    ['레드', '오답', 'red', null],
    ['앰버', '주의 · 현재 마커 — 흰 글자를 못 얹는 유일한 가족', 'amber', null],
    ['시안', '우주 액센트 · 별 · 등급 S', 'cyan', null]
  ];
  var STEPS = ['050','100','200','300','400','450','500','600','700','800','900'];

  document.getElementById('ramps').innerHTML = FAMILIES.map(function (f) {
    var steps = f[3] || STEPS;
    return '<p class="sg-ramp__lb"><strong>' + f[0] + '</strong> — ' + f[1] + '</p>' +
      '<div class="sg-ramp">' + steps.map(function (s) {
        var hex = v('--' + f[2] + '-' + s);
        if (!hex) return '';
        return '<span title="--' + f[2] + '-' + s + ' · ' + hex + '" style="background:' + hex + '">' +
               '<b style="color:' + ink(hex) + '">' + s + '</b></span>';
      }).join('') + '</div>';
  }).join('');

  /* ---- 알파 램프 ---- 흰 램프는 다크 면 위에, 검정 램프는 밝은 면 위에 세운다.
     번호 글자는 칸이 절반보다 진해지는 지점(50)에서 흰↔먹을 바꾼다 */
  function alphaRow(prefix, steps, bg, lb) {
    return '<p class="sg-ramp__lb"><strong>' + lb + '</strong></p>' +
      '<div class="sg-ramp" style="background:' + bg + ';padding:6px;border-radius:12px;gap:6px">' + steps.map(function (s) {
        var name = '--' + prefix + '-a' + s;
        return '<span title="' + name + ' · ' + v(name) + '" style="background:var(' + name + ');border-radius:6px">' +
               '<b style="color:' + ((prefix === 'white') === (+s < 50) ? 'var(--n-000)' : 'var(--n-900)') + '">' + s + '</b></span>';
      }).join('') + '</div>';
  }
  document.getElementById('alphas').innerHTML =
    alphaRow('white', ['04','06','08','10','12','14','16','20','24','30','40','50','60','80','90','95'], 'var(--n-900)', '흰 — 다크 면 위 덧칠 · 트랙 · 헤어라인') +
    alphaRow('black', ['10','20','25','30','40','50','60','70'], 'var(--n-000)', '검정 — 그림자 · 딤 · 눌림');

  /* ---- 계열 슬롯 ---- */
  var SECTIONS = [
    ['concept', '개념', '파랑 700'], ['type', '유형', '틸 700'],
    ['essay', '서술형', '바이올렛 800 — 가장 깊은 프레임'], ['exam', '시험대비', '바이올렛 700'],
    ['assign', '과제센터', '파랑 600'], ['util', '유틸', '중성 900 — 색 체계가 따로다'],
    ['space', 'A층 우주', '중성 900 · 항상 다크 · 토글 없음']
  ];
  // 계열 블록은 :root[data-section=...] 이라 <html> 에만 걸린다. 가짜 div 로는 못 읽는다 —
  // 실제로 그렇게 재서 일곱 계열이 전부 같은 색으로 찍힌 적이 있다.
  // 그래서 <html> 의 data-section 을 잠깐 갈아끼우고 읽은 뒤 되돌린다.
  var root = document.documentElement;
  var keep = root.getAttribute('data-section');
  document.getElementById('sections').innerHTML =
    '<table class="sg-table"><thead><tr><th style="width:120px">계열</th>' +
    '<th style="width:150px">프레임 static</th><th style="width:130px">정체성 vivid</th>' +
    '<th style="width:130px">텍스트 solid</th><th>메모</th></tr></thead><tbody>' +
    SECTIONS.map(function (s) {
      root.setAttribute('data-section', s[0]);
      var p = getComputedStyle(root);
      function chip(name) {
        var c = p.getPropertyValue(name).trim();
        return '<span style="display:inline-block;width:14px;height:14px;border-radius:4px;' +
               'vertical-align:-2px;margin-right:6px;background:' + c + '"></span><code>' + c + '</code>';
      }
      return '<tr><td><strong>' + s[1] + '</strong><br><code>' + s[0] + '</code></td>' +
             '<td>' + chip('--th-static') + '</td><td>' + chip('--th-vivid') + '</td>' +
             '<td>' + chip('--th-solid') + '</td><td>' + s[2] + '</td></tr>';
    }).join('') + '</tbody></table>';
  root.setAttribute('data-section', keep);

  /* ---- 배경 사진 + 다크 막 견본 ----
     계열 토큰은 <html> 에만 걸리므로 여기서 값을 꺼내 타일에 직접 심는다. */
  var VEIL = [['concept','개념','45%'],['type','유형','55%'],['essay','서술형','25%'],['assign','과제','65%']];
  // 토큰 값은 url("../assets/…") 모양이다. 두 가지를 손봐야 style 속성 안에 들어간다 —
  //  · 큰따옴표가 속성을 중간에 닫아 버린다 → 작은따옴표로
  //  · 경로가 tokens.css 기준이라 액자(최상위 base)에서는 루트 위를 가리킨다 → ../ 제거
  function bgUrl(p) {
    return p.getPropertyValue('--art-screen-bg').trim().replace(/"/g, "'").replace('../', '');
  }
  var keep2 = root.getAttribute('data-section');
  document.getElementById('veilTpl').innerHTML =
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px">' +
    VEIL.map(function (sec) {
      root.setAttribute('data-section', sec[0]);
      var p = getComputedStyle(root);
      return '<div style="position:relative;height:96px;border-radius:8px;overflow:hidden;' +
             'background:' + bgUrl(p) + ' center/cover">' +
             '<span style="position:absolute;inset:0;background:' +
                p.getPropertyValue('--art-screen-veil').trim() + '" data-veil></span>' +
             '<span style="position:absolute;left:6px;bottom:6px;color:var(--n-000);font-size:var(--fs-11);' +
             'font-weight:700;background:color-mix(in srgb, var(--n-900) 72%, transparent);padding:2px 6px;border-radius:4px">' +
             sec[1] + ' ' + sec[2] + '</span></div>';
    }).join('') + '</div>' +
    '<style>:root[data-theme="light"] [data-veil]{display:none}</style>';
  root.setAttribute('data-section', keep2);

  /* ---- 글자 눈금 ---- */
  var SAMPLE = '우주 탐험 학습 Reading Math 0123';
  document.getElementById('fs').innerHTML = [11,12,13,14,15,16,19,20,22,26,32].map(function (n) {
    var use = { 11:'캡션 · 배지 글자', 12:'메타 · 작은 라벨', 13:'보조 · 목록 항목', 14:'본문 보조',
      15:'본문', 16:'강조 본문 · 타이머', 19:'정체성 라벨 최소 · CTA', 20:'정오답 배지 숫자', 22:'소제목',
      26:'화면 제목', 32:'결과 히어로 숫자' }[n];
    return '<div class="sg-type"><small>--fs-' + n + ' · ' + n + 'px · ' + use + '</small>' +
           '<span style="font-size:var(--fs-' + n + ')">' + SAMPLE + '</span></div>';
  }).join('');

  document.getElementById('fw').innerHTML = [['regular',400,'본문 전용'],['semibold',600,'라벨 · 보조 강조'],
    ['bold',700,'제목 · 버튼'],['heavy',800,'히어로 · 숫자']].map(function (w) {
    return '<div class="sg-type"><small>--fw-' + w[0] + ' · ' + w[1] + ' · ' + w[2] + '</small>' +
           '<span style="font-size:var(--fs-19);font-weight:' + w[1] + '">' + SAMPLE + '</span></div>';
  }).join('');

  /* ---- 간격 · 모서리 ---- */
  document.getElementById('sp').innerHTML = [4,6,8,12,16,20,24,32,40].map(function (n) {
    return '<div class="sg-tile"><div class="sg-tile__bar" style="width:' + n + 'px"></div>' +
           '<div class="sg-tile__name">--sp-' + n + '</div></div>';
  }).join('');
  document.getElementById('r').innerHTML = [['4','4px'],['8','8px'],['12','12px'],['16','16px'],
    ['22','22px'],['30','30px'],['full','999px'],['frame','34px ★']].map(function (r) {
    return '<div class="sg-tile"><div class="sg-tile__box" style="border-radius:var(--r-' + r[0] + ')"></div>' +
           '<div class="sg-tile__name">--r-' + r[0] + ' · ' + r[1] + '</div></div>';
  }).join('');

  /* ---- 선 굵기 · 볼록 두께 (2026-10-14 · RM-SIZE-02) ---- */
  document.getElementById('bw').innerHTML = [['1','1px','헤어라인'],['1_5','1.5px','보기·선지 테두리'],['2','2px','정오답 칸 선'],
    ['3','3px','선택 링'],['4','4px','해설 띠']].map(function (b) {
    return '<div class="sg-tile"><div class="sg-tile__box" style="background:none;box-shadow:inset 0 0 0 var(--bw-' + b[0] + ') var(--text)"></div>' +
           '<div class="sg-tile__name">--bw-' + b[0] + ' · ' + b[1] + '<br>' + b[2] + '</div></div>';
  }).join('') + [['2','2px','작은 버튼·칩'],['4','4px','CTA·채점·키패드']].map(function (d) {
    return '<div class="sg-tile"><div class="sg-tile__box" style="border-radius:var(--r-12);background:var(--primary);box-shadow:0 var(--depth-' + d[0] + ') 0 var(--primary-edge)"></div>' +
           '<div class="sg-tile__name">--depth-' + d[0] + ' · ' + d[1] + '<br>' + d[2] + '</div></div>';
  }).join('');

  /* ---- 에셋 연동색 ---- */
  var ASSETS = [
    ['--asset-console-concept-body','개념 콘솔 바탕'], ['--asset-console-concept-rim','개념 콘솔 립'],
    ['--asset-console-concept-tray','개념 콘솔 트레이'], ['--asset-console-type-tray','유형 트레이'],
    ['--asset-console-essay-rim','서술형 립'], ['--asset-console-essay-tray','서술형 트레이'],
    ['--asset-console-task-body','과제 콘솔 바탕'], ['--asset-console-task-rim','과제 립'], ['--asset-console-task-tray','과제 트레이'],
    ['--art-star','별'], ['--art-star-bright','밝은 별'],
    ['--art-star-halo','별빛'], ['--art-star-halo-big','큰 별빛'], ['--art-star-flare','별 섬광'],
    ['--art-space-glow-1','성운 1'], ['--art-space-glow-2','성운 2'], ['--art-space-glow-3','성운 3'],
    ['--art-grade-s','등급 S 칩'], ['--art-grade-a','등급 A 칩'],
    ['--art-grade-b','등급 B 칩'], ['--art-grade-c','등급 C 칩'],
    ['--art-planet-1','행성 링 1'], ['--art-planet-2','행성 링 2'],
    ['--art-planet-3','행성 링 3'], ['--art-planet-4','행성 링 4'],
    ['--art-mark-bg','형광펜 면 (다크)'], ['--art-mark-fg','형광펜 글자 (다크)'],
    ['--gold-500','별·등급 PNG 금색']
  ];
  document.getElementById('assets').innerHTML = '<div class="sg-tiles">' + ASSETS.map(function (a) {
    return '<div class="sg-tile"><div style="height:44px;border-radius:8px;background:' + v(a[0]) + '"></div>' +
           '<div class="sg-tile__name">' + a[0] + '<br>' + a[1] + '</div></div>';
  }).join('') + '</div>';
})();
