/* =========================================================================
   세미 스토리북 뼈대 (Phase 10-④)

   이 파일이 하는 일 셋

   ① 좌측 목록을 그린다 — 네 장이 이 한 벌을 공유한다. 각 장은 목록을 갖지
      않고, 자기 안의 <section class="sg-sec"> 제목만 내주면 목차가 따라온다.

   ② 부품 데모를 라이트·다크 **두 액자에 동시에** 세운다.
      <template class="sg-src"> 안의 마크업을 iframe 두 개에 srcdoc 으로 넣고,
      한쪽에만 data-theme="dark" 를 박는다. 액자 안에서 부르는 CSS 는
      styles/ 의 **진짜 파일**이라, 화면이 바뀌면 이 문서도 같이 바뀐다.
      (부품 스타일을 스토리북에 옮겨 적으면 그 순간부터 둘이 어긋난다.)

   ③ 「쓰는 화면」 숫자를 붙인다 — styleguide/usage.json 을 읽는다.
      그 파일은 tools/usage-scan.py 가 마크업을 훑어 만든다. 손으로 안 센다.

   액자 높이는 안쪽 내용에 맞춰 잰다. 폰트가 늦게 오면 한 번 더 잰다.
   ========================================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     ① 좌측 목록
     ------------------------------------------------------------------ */
  // 이 폴더의 문서들은 화면 규칙대로 <base href="../"> 를 쓴다(CLAUDE.md ①).
  // 그래서 여기 경로도 최상위 기준으로 적는다 — 'components.html' 로 적으면 루트를 가리킨다.
  var PAGES = [
    ['foundations.html', '기초',   '색 · 글자 · 간격 · 층'],
    ['components.html',  '부품',   '버튼 · 배지 · 문제 블록 · 계기판'],
    ['shells.html',      '셸',     '콘솔바 · 헤더 · 모니터 · 키패드'],
    ['patterns.html',    '패턴',   '화면 껍데기 · 목록 상태 · 예외']
  ];
  var DIR = 'styleguide/';

  function buildNav() {
    var here = location.pathname.split('/').pop() || 'foundations.html';
    var nav = document.querySelector('.sg-nav');
    if (!nav) return;

    var html = '' +
      '<a class="sg-nav__brand" href="index.html">리딩수학과학 디자인 시스템' +
        '<small>화면 목록으로 돌아가기 ↩</small></a>' +
      '<div class="sg-nav__group"><p class="sg-nav__label">문서</p>' +
      PAGES.map(function (p) {
        return '<a href="' + DIR + p[0] + '"' + (p[0] === here ? ' class="is-current"' : '') + '>' +
               '<strong>' + p[1] + '</strong></a>';
      }).join('') +
      '</div>';

    var secs = [].slice.call(document.querySelectorAll('.sg-sec[id]'));
    if (secs.length) {
      html += '<div class="sg-nav__group sg-nav__toc"><p class="sg-nav__label">이 문서</p>' +
        secs.map(function (s) {
          var h = s.querySelector('h2');
          var t = h ? h.childNodes[0].textContent.trim() : s.id;
          // <base href="../"> 때문에 "#id" 만 쓰면 최상위(index.html#id)로 풀려 페이지를 떠난다.
          // 그래서 이 문서의 경로를 붙이고, 누르면 이동 대신 그 자리로 스크롤한다.
          return '<a href="' + DIR + here + '#' + s.id + '" data-sec="' + s.id + '">' + t + '</a>';
        }).join('') + '</div>';
    }

    html += '<p class="sg-nav__foot">토큰 <code>styles/tokens.css</code><br>' +
            '쓰는 화면 수는 <a href="index.html"><span id="sgScreens">전 화면</span></a>을 훑어' +
            ' 자동으로 셉니다 — <code>tools/usage-scan.py</code></p>';
    nav.innerHTML = html;

    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-sec]');
      if (!a) return;
      var sec = document.getElementById(a.getAttribute('data-sec'));
      if (!sec) return;
      e.preventDefault();
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', location.pathname + location.search + '#' + sec.id);
    });

    // 스크롤에 따라 지금 보는 절을 목차에 표시
    if (!secs.length || !('IntersectionObserver' in window)) return;
    var links = {};
    nav.querySelectorAll('.sg-nav__toc a').forEach(function (a) { links[a.getAttribute('data-sec')] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (a) a.classList.toggle('is-seen', e.isIntersecting);
      });
    }, { rootMargin: '-10% 0px -70% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------------
     ② 라이트/다크 액자
     ------------------------------------------------------------------ */
  // 액자가 기본으로 부르는 스타일시트. 페이지가 body[data-sg-css] 로 갈아끼우고,
  // 부품 하나만 다르게 필요하면 .sg-item[data-css] 로 덮는다.
  var DEFAULT_CSS = 'tokens,base,components';

  // srcdoc 액자는 자기 주소가 없어서 부모의 base 를 물려받는다. 물려받은 값에 기대면
  // 나중에 부모의 <base> 가 바뀔 때 조용히 깨지므로, 최상위를 직접 계산해 박는다.
  var ROOT = new URL('./', document.baseURI).href;

  function frameDoc(markup, theme, section, css, pad, bg) {
    var links = css.split(',').map(function (n) {
      return '<link rel="stylesheet" href="styles/' + n.trim() + '.css?v=20261012-5">';
    }).join('');
    return '<!doctype html><html lang="ko" data-theme="' + theme + '" data-section="' + section + '">' +
      '<head><meta charset="utf-8"><base href="' + ROOT + '">' + links +
      '<style>' +
        /* base.css 가 html,body 에 height:100% 를 건다. 액자에서는 내용만큼만 자라야
           높이를 잴 수 있으므로 여기서만 되돌린다. */
        'html,body{margin:0;height:auto;min-height:0}' +
        'body{padding:' + pad + ';background:' + (bg || 'var(--bg)') + ';color:var(--text);' +
                'font-family:var(--font-sans);overflow-x:hidden}' +
        '.sg-row{display:flex;flex-wrap:wrap;gap:16px;align-items:center}' +
        '.sg-col{display:flex;flex-direction:column;gap:12px;align-items:flex-start}' +
        '.sg-cap{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--text-meta);' +
                'margin-bottom:6px;display:block}' +
      '</style></head><body>' + markup + '</body></html>';
  }

  // 액자 높이는 안쪽 내용이 정한다. 한 번만 재면 폰트·이미지가 늦게 와서 잘린다 —
  // 실제로 데모 하나가 아래쪽이 잘린 채 그려졌다. ResizeObserver 로 계속 따라간다.
  function fit(f) {
    try {
      var d = f.contentDocument;
      if (!d || !d.body) return;
      var h = Math.ceil(Math.max(d.body.scrollHeight, d.body.getBoundingClientRect().height));
      if (h && Math.abs(h - f.offsetHeight) > 1) f.style.height = h + 'px';
    } catch (e) {}
  }

  function keepFitted(f) {
    fit(f);
    try {
      var d = f.contentDocument;
      d.fonts.ready.then(function () { fit(f); });
      if ('ResizeObserver' in window) new ResizeObserver(function () { fit(f); }).observe(d.body);
    } catch (e) {}
    setTimeout(function () { fit(f); }, 400);
  }

  function buildStage(item) {
    var tpl = item.querySelector('template.sg-src');
    if (!tpl) return;
    var markup  = tpl.innerHTML.trim();
    var section = item.dataset.section || document.body.dataset.sgSection || 'concept';
    var css     = item.dataset.css || document.body.dataset.sgCss || DEFAULT_CSS;
    var pad     = item.dataset.pad || '20px';
    var themes  = (item.dataset.themes || 'light,dark').split(',');

    var stage = document.createElement('div');
    stage.className = 'sg-stage' + (themes.length === 1 ? ' sg-stage--one' : '');

    themes.forEach(function (t) {
      t = t.trim();
      var pane = document.createElement('div');
      pane.className = 'sg-pane';
      pane.innerHTML = '<span class="sg-pane__lb">' + (t === 'dark' ? '다크' : '라이트') + '</span>';
      var f = document.createElement('iframe');
      f.setAttribute('scrolling', 'no');
      f.setAttribute('title', (item.querySelector('h3') || {}).textContent + ' · ' + t);
      f.srcdoc = frameDoc(markup, t, section, css, pad, item.dataset.bg);
      f.addEventListener('load', function () { keepFitted(f); });
      pane.appendChild(f);
      stage.appendChild(pane);
    });
    item.appendChild(stage);

    // 마크업 보기
    var det = document.createElement('details');
    det.className = 'sg-code';
    det.innerHTML = '<summary>마크업 보기</summary><pre><code></code></pre>';
    det.querySelector('code').textContent = dedent(tpl.innerHTML);
    item.appendChild(det);

    window.addEventListener('resize', function () { stage.querySelectorAll('iframe').forEach(fit); });
  }

  function dedent(s) {
    var lines = s.replace(/\t/g, '  ').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    var pad = Math.min.apply(null, lines.filter(function (l) { return l.trim(); })
      .map(function (l) { return l.match(/^ */)[0].length; }));
    return lines.map(function (l) { return l.slice(pad); }).join('\n');
  }

  /* ------------------------------------------------------------------
     ③ 쓰는 화면 수
     ------------------------------------------------------------------ */
  function attachUsage(data) {
    var n = document.getElementById('sgScreens');
    if (n && data['_화면 수']) n.textContent = data['_화면 수'] + '화면';

    document.querySelectorAll('.sg-item[data-uses]').forEach(function (item) {
      var names = item.dataset.uses.split(/\s*,\s*/).filter(Boolean);
      var merged = {};
      names.forEach(function (n) {
        var m = data.usage[n] || {};
        Object.keys(m).forEach(function (screen) {
          if (!merged[screen] || m[screen] === 'markup') merged[screen] = m[screen];
        });
      });
      var screens = Object.keys(merged).sort();
      var hd = item.querySelector('.sg-item__hd');
      if (!hd) return;

      var box = document.createElement('span');
      box.className = 'sg-uses';
      box.innerHTML = '<button class="sg-uses__btn" data-n="' + screens.length + '">쓰는 화면 ' +
                      screens.length + '</button>';
      hd.appendChild(box);
      if (!screens.length) { box.querySelector('button').disabled = true; return; }

      var list = document.createElement('div');
      list.className = 'sg-uses__list';
      list.innerHTML = '<ul>' + screens.map(function (s) {
        return '<li data-how="' + merged[s] + '">' + s.replace(/\.html$/, '') + '</li>';
      }).join('') + '</ul>';
      item.insertBefore(list, item.querySelector('.sg-stage'));

      box.querySelector('button').addEventListener('click', function () {
        list.classList.toggle('is-open');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  function init() {
    buildNav();
    document.querySelectorAll('.sg-item').forEach(buildStage);
    fetch(DIR + 'usage.json')
      .then(function (r) { return r.json(); })
      .then(attachUsage)
      .catch(function () {
        // 파일이 없으면 숫자만 빠지고 문서는 그대로 산다.
        document.querySelectorAll('.sg-item[data-uses]').forEach(function (i) {
          delete i.dataset.uses;
        });
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
