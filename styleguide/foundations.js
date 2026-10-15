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

  // 계열 블록은 :root[data-section=...] 이라 <html> 에만 걸린다. 가짜 div 로는 못 읽는다 —
  // 그래서 <html> 의 data-section 을 잠깐 갈아끼우고 읽은 뒤 되돌린다.
  var root = document.documentElement;

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

  /* ---- 토큰 시트 (2026-10-15) ----
     styleguide/data/tokens.json 을 읽어 표 셋을 그린다. 그 파일은 tools/tokens-build.py 가 tokens.css 에서 만든다.
     브라우저 계산값으로 그리지 않는 이유 — color-mix 가 어느 원색을 섞었는지는 계산값에 남지 않는다. */
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function sw(c, mod) { return '<i class="sg-sw' + (mod ? ' ' + mod : '') + '" style="--c:' + esc(c) + '"></i>'; }
  function pct(o) {   // 원색을 투명과 섞은 값이면 그 비율. 알파 램프는 이름이 곧 비율이라 뺀다
    if (!o.ref || /^--(white|black)-a/.test(o.ref)) return '';
    var m = /rgba\([^)]*,\s*([\d.]+)\)$/.exec(o.value || '');
    return m ? ' <span class="sg-sheet__pct">' + Math.round(parseFloat(m[1]) * 100) + '%</span>' : '';
  }
  function ref(o) { return o.ref ? '<code>' + o.ref + '</code>' + pct(o) : '<span class="sg-sheet__raw">직접 값</span>'; }
  // 값 칸 하나 — 칩 · 1단 이름 · 최종 값. tag 는 3단의 「라」·「다」 머리.
  // 3단(narrow)은 칸이 일곱이라 반투명의 rgba 줄을 뺀다 — 원색 이름과 퍼센트로 값이 정해진다
  function val(o, type, base, tag, narrow) {
    var chip = type === 'color' ? sw(o.value, base === 'd' ? 'sg-sw--d' : '') : '';
    var raw = narrow && pct(o) ? '' : '<small>' + esc(o.value) + '</small>';
    return '<div class="sg-val">' + (tag ? '<span class="sg-val__t">' + tag + '</span>' : '') + chip +
           '<span>' + ref(o) + raw + '</span></div>';
  }
  function table(cls, head, body) {
    return '<table class="sg-table sg-table--sheet ' + cls + '"><thead><tr>' +
      head.map(function (h) { return '<th' + (h[1] ? ' style="width:' + h[1] + '"' : '') + '>' + h[0] + '</th>'; }).join('') +
      '</tr></thead><tbody>' + body + '</tbody></table>';
  }
  function grp(label, span) { return '<tr class="sg-sheet__grp"><th colspan="' + span + '">' + label + '</th></tr>'; }
  // 이름 규칙으로 묶는다. 어느 묶음에도 안 맞는 토큰은 「그 밖」으로 — 조용히 빠지지 않게
  function grouped(names, groups) {
    var out = groups.map(function (g) { return [g[0], []]; }).concat([['그 밖', []]]);
    names.forEach(function (n) {
      for (var i = 0; i < groups.length; i++) if (groups[i][1].test(n)) { out[i][1].push(n); return; }
      out[out.length - 1][1].push(n);
    });
    return out.filter(function (g) { return g[1].length; });
  }

  function drawSheet(d) {
    var C = d.primitive.color, X = function (t) { return t.$extensions.rm; };

    /* 1단 · 가족 램프 — 줄 = 가족, 칸 = 스텝 */
    var famSteps = STEPS, fam = FAMILIES.filter(function (f) { return f[2] !== 'n'; }).concat([['골드', '별 · 등급 그림과 세트', 'gold', null]]);
    function rampCell(f, s) {
      var t = C[f] && C[f][s];
      return t ? '<td title="--' + f + '-' + s + '">' + sw(t.$value, 'sg-sw--block') + '<code>' + t.$value + '</code></td>' : '<td></td>';
    }
    document.getElementById('sheetRamp').innerHTML = table('sg-table--ramp',
      [['가족', '']].concat(famSteps.map(function (s) { return [s, '']; })),
      fam.map(function (f) {
        return '<tr><td><strong>' + f[0] + '</strong><br><code>--' + f[2] + '-*</code></td>' +
               famSteps.map(function (s) { return rampCell(f[2], s); }).join('') + '</tr>';
      }).join(''));
    // 순서는 위 FAMILIES 의 뉴트럴 줄을 따른다 — Object.keys 는 '100' 같은 숫자 이름을 앞으로 당겨 000 · 050 이 맨 뒤로 간다
    var nSteps = FAMILIES[0][3];
    document.getElementById('sheetNeutral').innerHTML = table('sg-table--ramp',
      [['', '']].concat(nSteps.map(function (s) { return [s, '']; })),
      '<tr><td><strong>뉴트럴</strong><br><code>--n-*</code></td>' + nSteps.map(function (s) { return rampCell('n', s); }).join('') + '</tr>');

    /* 1단 · 알파 램프 — 흰 · 검정 나란히 */
    function alphaTable(prefix, base) {
      return table('', [['토큰', '45%'], ['값', '']], Object.keys(C.alpha).filter(function (k) { return k.indexOf(prefix) === 0; })
        .map(function (k) {
          return '<tr><td><code>--' + k + '</code></td><td><div class="sg-val">' + sw(C.alpha[k].$value, base) +
                 '<code>' + C.alpha[k].$value + '</code></div></td></tr>';
        }).join(''));
    }
    document.getElementById('sheetAlpha').innerHTML = alphaTable('white-', 'sg-sw--d') + alphaTable('black-', '');

    /* 1단 · 에셋 연동색 — 계열을 따라 갈아 끼우는 칸(sections 가 있는 것)은 3단 표로 보낸다 */
    var assetRaw = Object.keys(d.asset).filter(function (k) { return !X(d.asset[k]).sections; });
    document.getElementById('sheetAsset').innerHTML = table('', [['토큰', '40%'], ['값', '']],
      grouped(assetRaw, [['콘솔바 트레이 · 립 · 몸통', /^asset-console-/], ['우주 배경 · 별', /^art-(space|star)/],
        ['등급 칩', /^art-grade-/], ['행성 링', /^art-planet-/], ['개념 학습 형광펜(다크)', /^art-mark-/]])
      .map(function (g) {
        return grp(g[0], 2) + g[1].map(function (k) {
          var v = d.asset[k].$value;
          return '<tr><td><code>--' + k + '</code></td><td><div class="sg-val">' + sw(v) + '<code>' + v + '</code></div></td></tr>';
        }).join('');
      }).join(''));

    /* 2단 · 역할 — 토큰 | 라이트 | 다크 */
    var sem = Object.keys(d.semantic).filter(function (k) { return X(d.semantic[k]).light; });
    document.getElementById('sheetSemantic').innerHTML = table('', [['토큰', '30%'], ['라이트', '35%'], ['다크', '35%']],
      grouped(sem, [['표면', /^(bg|surface-)/], ['글자', /^text/], ['테두리 · 딤 · 그림자', /^(border|scrim|shadow)/],
        ['상태 · 정답', /^ok-/], ['상태 · 오답', /^no-/], ['상태 · 주의', /^warn-/], ['상태 · 안내', /^info-/],
        ['현재 위치', /^current$/], ['CTA', /^primary/], ['모드색', /^mode-/], ['브랜드', /^brand$/],
        ['과목 계통', /^subj-/], ['우주 액센트', /^accent-/]])
      .map(function (g) {
        return grp(g[0], 3) + g[1].map(function (k) {
          var t = d.semantic[k], r = X(t);
          return '<tr><td><code>--' + k + '</code>' + (r.flipsWithTheme ? '<span class="sg-flip">뒤집힘</span>' : '') + '</td>' +
                 '<td>' + val(r.light, t.$type, 'l') + '</td><td>' + val(r.dark, t.$type, 'd') + '</td></tr>';
        }).join('');
      }).join(''));

    /* 3단 · 계열 슬롯 — 줄 = 슬롯, 칸 = 계열 7벌 */
    var SEC = Object.keys(d.$extensions.rm.sections);
    var SEC_KO = { concept: '개념', type: '유형', essay: '서술형', exam: '시험', assign: '과제', util: '유틸', space: '우주(A층)' };
    function themeRow(k, t, long) {   // long — 이름이 긴 에셋 칸. 칸 안에서 줄을 바꿔 표가 화면 밖으로 밀리지 않게 한다
      var secs = X(t).sections;
      return '<tr' + (long ? ' class="sg-sheet__long"' : '') + '><td><code>--' + k + '</code></td>' + SEC.map(function (s) {
        var l = secs[s].light, dk = secs[s].dark;
        if (t.$type !== 'color') {   // 배경 사진 — 파일 이름만
          return '<td><small>' + esc(l.value.replace(/^url\("?.*\/([^/"]+)"?\)$/, '$1')) + '</small></td>';
        }
        return '<td>' + (l.value === dk.value ? val(l, 'color', 'l', '', true)
          : val(l, 'color', 'l', '라', true) + val(dk, 'color', 'd', '다', true)) + '</td>';
      }).join('') + '</tr>';
    }
    var slotAsset = Object.keys(d.asset).filter(function (k) { return X(d.asset[k]).sections; });
    document.getElementById('sheetTheme').innerHTML = table('sg-table--theme',
      [['슬롯', '']].concat(SEC.map(function (s) { return [SEC_KO[s] || s, '']; })),
      grp('<code>--th-*</code> 슬롯', SEC.length + 1) +
      Object.keys(d.theme).map(function (k) { return themeRow(k, d.theme[k]); }).join('') +
      grp('계열을 따르는 에셋 칸', SEC.length + 1) +
      slotAsset.map(function (k) { return themeRow(k, d.asset[k], true); }).join(''));
  }

  // tokens.json 도 문서의 ?v= 를 따른다 — 안 붙이면 브라우저가 옛 파일을 계속 쓴다(RM-FILE-06)
  var sgLink = document.querySelector('link[href*="sg.css"]');
  var ver = sgLink && /\?v=([\w-]+)/.exec(sgLink.getAttribute('href'));
  fetch('styleguide/data/tokens.json' + (ver ? '?v=' + ver[1] : ''))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(drawSheet)
    .catch(function () {
      ['sheetRamp', 'sheetNeutral', 'sheetAlpha', 'sheetAsset', 'sheetSemantic', 'sheetTheme'].forEach(function (id) {
        document.getElementById(id).innerHTML = '<p class="sg-sheet__err">tokens.json을 읽지 못했습니다. ' +
          '파일을 직접 열면 읽지 못합니다. 미리보기 서버로 엽니다.</p>';
      });
    });

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
})();
