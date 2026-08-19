/* =========================================================================
   검수용 디버그 패널 (RMDebug)  — 배포본에서는 보이지 않는다
   -------------------------------------------------------------------------
   주소 끝에 ?debug=1 을 붙였을 때만 화면 왼쪽 아래에 작게 뜬다.
   문제를 직접 풀지 않고도 정답·오답·완료 상태를 버튼으로 오갈 수 있게 하는 도구.

   화면 엔진이 자기 훅을 등록하는 방식이라, 화면마다 동작이 달라도 된다:

     window.RMDebug && window.RMDebug.register({
       title: '개념 다지기',
       actions: [
         { label: '정답 처리', run: function () { ... } },
         { label: '오답 처리', run: function () { ... } },
         { label: '전부 풀기', run: function () { ... } }
       ]
     });

   register()는 여러 번 불러도 된다(모달처럼 화면 안에 엔진이 둘 이상인 경우).
   ?debug=1 이 없으면 등록만 받아두고 아무것도 그리지 않는다.

   주소로 상태를 바로 여는 것도 된다 (스크린샷·공유용):
     ?debug=1&do=오답 처리      버튼 라벨과 같은 값을 주면 그 동작을 바로 실행
     ?debug=1&do=정답 처리|다음 문제   여러 개는 | 로 이어 붙임
     ?debug=1&theme=dark        라이트/다크 강제
   ========================================================================= */
(function () {
  'use strict';

  var ON = /(?:^|[?&])debug=1(?:&|$)/.test(window.location.search);

  var groups = [];   // [{ title, actions:[{label, run}] }]
  var panel = null, list = null;

  /* ---- 등록 API ---- */
  var API = {
    enabled: ON,
    register: function (group) {
      if (!group || !group.actions || !group.actions.length) return;
      groups.push(group);
      if (ON) { ensure(); paint(); runFromUrl(); }
    }
  };
  window.RMDebug = API;
  if (!ON) return;

  /* ---- 주소로 테마·동작 지정 (스크린샷·공유용) ---- */
  var params = new URLSearchParams(window.location.search);
  var forceTheme = params.get('theme');
  if (forceTheme === 'dark' || forceTheme === 'light') {
    document.documentElement.setAttribute('data-theme', forceTheme);
  }
  var queue = (params.get('do') || '').split('|').map(function (x) { return x.trim(); }).filter(Boolean);
  function runFromUrl() {
    if (!queue.length) return;
    // 등록이 끝난 뒤 실행 (엔진이 여럿이면 register가 여러 번 불린다)
    clearTimeout(runFromUrl.t);
    runFromUrl.t = setTimeout(function () {
      queue.forEach(function (label) {
        groups.forEach(function (g) {
          g.actions.forEach(function (a) {
            if (a.label === label) { try { a.run(); } catch (e) { console.warn('[RMDebug]', label, e); } }
          });
        });
      });
      queue = [];
      if (forceTheme) document.documentElement.setAttribute('data-theme', forceTheme);
    }, 0);
  }

  /* ---- 패널 뼈대 (1회 생성) ---- */
  function ensure() {
    if (panel) return;
    injectStyle();
    panel = document.createElement('div');
    panel.className = 'rmdbg';
    panel.innerHTML =
      '<button class="rmdbg__tab" type="button" aria-label="디버그 패널 열고 닫기">' +
        '<span class="rmdbg__dot"></span>DEBUG' +
      '</button>' +
      '<div class="rmdbg__body"><div class="rmdbg__list"></div>' +
        '<p class="rmdbg__foot">검수용 · 주소에서 ?debug=1 을 빼면 사라져요</p>' +
      '</div>';
    document.body.appendChild(panel);
    list = panel.querySelector('.rmdbg__list');
    panel.querySelector('.rmdbg__tab').addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
    panel.classList.add('is-open');
  }

  /* ---- 버튼 다시 그리기 ---- */
  function paint() {
    list.innerHTML = '';
    groups.forEach(function (g) {
      var sec = document.createElement('div');
      sec.className = 'rmdbg__sec';
      if (g.title) {
        var h = document.createElement('div');
        h.className = 'rmdbg__title';
        h.textContent = g.title;
        sec.appendChild(h);
      }
      var row = document.createElement('div');
      row.className = 'rmdbg__row';
      g.actions.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rmdbg__btn' + (a.tone ? ' rmdbg__btn--' + a.tone : '');
        b.textContent = a.label;
        b.addEventListener('click', function () {
          try { a.run(); } catch (err) { console.warn('[RMDebug]', a.label, err); }
        });
        row.appendChild(b);
      });
      sec.appendChild(row);
      list.appendChild(sec);
    });
  }

  /* ---- 스타일 (색은 tokens.css 변수만) ---- */
  function injectStyle() {
    var css =
      '.rmdbg{position:fixed;left:12px;bottom:112px;z-index:9999;font-family:var(--font-sans);' +
        'display:flex;flex-direction:column;align-items:flex-start;gap:6px;}' +
      '.rmdbg__tab{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:0;border-radius:999px;' +
        'background:var(--n-950);color:var(--n-000);font-size:11px;font-weight:800;letter-spacing:.08em;' +
        'cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4);opacity:.72;transition:opacity .12s;}' +
      '.rmdbg__tab:hover{opacity:1;}' +
      '.rmdbg.is-open .rmdbg__tab{opacity:1;}' +
      '.rmdbg__dot{width:7px;height:7px;border-radius:50%;background:var(--primary);}' +
      '.rmdbg__body{display:none;width:212px;padding:12px;border-radius:14px;background:var(--n-950);' +
        'box-shadow:0 18px 44px rgba(0,0,0,.5);}' +
      '.rmdbg.is-open .rmdbg__body{display:block;}' +
      '.rmdbg__sec + .rmdbg__sec{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12);}' +
      '.rmdbg__title{margin-bottom:7px;font-size:11px;font-weight:800;color:var(--n-300);letter-spacing:.02em;}' +
      '.rmdbg__row{display:flex;flex-wrap:wrap;gap:6px;}' +
      '.rmdbg__btn{flex:1 1 auto;min-width:58px;padding:7px 10px;border:0;border-radius:9px;' +
        'background:var(--n-600);color:var(--n-000);font-family:inherit;font-size:12px;font-weight:700;' +
        'cursor:pointer;transition:filter .1s;}' +
      '.rmdbg__btn:hover{filter:brightness(1.25);}' +
      '.rmdbg__btn--ok{background:var(--ok-ink);}' +
      '.rmdbg__btn--no{background:var(--no-ink);}' +
      '.rmdbg__foot{margin:10px 0 0;font-size:10px;line-height:1.4;color:var(--n-350);}' +
      '@media (max-height:620px){.rmdbg__body{max-height:52vh;overflow:auto;}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* 이미 등록된 게 있으면(스크립트 순서가 뒤바뀐 경우) 바로 그린다 */
  if (groups.length) { ensure(); paint(); }
})();
