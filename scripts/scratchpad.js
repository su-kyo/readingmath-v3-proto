/* =========================================================================
   scratchpad.js — 연습장 (공용 · Phase 6 재작업)
   -------------------------------------------------------------------------
   하단 콘솔 바의 「연습장」 버튼이 여는 필기 모드.
   debug-panel·keypad-input과 같은 방식 — 이 파일 하나만 불러오면
   화면의 연습장 버튼(#scratchBtn 또는 '연습장' 라벨 버튼)에 알아서 붙는다.

   방식 (2026-08-20 확정 — 별도 창 아님):
   · 화면 전체가 필기면 — 콘텐츠를 덮는 투명 캔버스에 문제 위로 바로 쓴다.
   · 레이어: 콘텐츠 → 옅은 딤(--scrim 절반 농도) → 필기 캔버스 → 연습장 콘솔바.
   · 콘솔바 전환 연출 — 기존 .bar가 아래로 내려가고, 같은 자리에 이 스크립트가
     화면의 .bar를 복제해 다크 톤으로 칠한 도구 바(펜·지우개·전체 지우기·완료)를 올린다.
     트레이 생김새(형태·좌우 일러스트)는 화면 것을 그대로 물려받는다.
   · 잉크는 쓰는 순간의 테마를 따른다 — 라이트=네이비(n-650), 다크=밝은 색(n-050).
   · 연습장 모드 중에는 화면 조작이 잠긴다. 나가는 길은 「완료」뿐.
   · 필기는 같은 화면 안에서는 닫았다 열어도 남는다 (화면을 떠나면 사라짐 — 프로토타입).
   ========================================================================= */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    /* ── 연습장 버튼 찾기 ── */
    var buttons = [];
    var byId = document.getElementById('scratchBtn');
    if (byId) buttons.push(byId);
    document.querySelectorAll('button.toolbtn').forEach(function (b) {
      if (buttons.indexOf(b) < 0 && /연습장/.test(b.textContent)) buttons.push(b);
    });
    var pageBar = document.querySelector('.bar');
    if (!buttons.length || !pageBar) return;

    /* ── 스타일 ── */
    var css = document.createElement('style');
    css.textContent = [
      /* 기존 콘솔바 퇴장 연출 (스크립트가 클래스로만 켠다) */
      '.bar.scratch-anim{ transition: transform .32s cubic-bezier(.4,0,.2,1); }',
      '.bar.scratch-away{ transform: translateY(112%); }',

      /* 오버레이 뼈대 — 콘텐츠 → 딤 → 캔버스 → 도구 바 */
      '.scratch{ position:fixed; inset:0; z-index:400; display:none; }',
      '.scratch.is-open{ display:block; }',
      '.scratch__dim{ position:absolute; inset:0; background:var(--scrim); opacity:0; transition:opacity .28s; }',
      '.scratch.is-in .scratch__dim{ opacity:.5; }',            /* --scrim 절반 농도 — 문제가 계속 읽힌다 */
      '.scratch__canvas{ position:absolute; inset:0; width:100%; height:100%; touch-action:none; cursor:crosshair; }',

      /* 잉크 — 쓰는 순간의 테마를 따른다 */
      '.scratch{ --scratch-ink: var(--n-050); }',
      ':root[data-theme="light"] .scratch{ --scratch-ink: var(--n-650); }',

      /* 도구 바 = 화면 .bar의 복제본 + 다크 톤. 형태는 화면 CSS를 그대로 물려받는다 */
      '.scratch .bar{ transform: translateY(112%); transition: transform .32s cubic-bezier(.2,.8,.3,1.08); pointer-events:auto; z-index:2; }',
      '.scratch.is-in .bar{ transform: translateY(0); }',
      '.scratch .bar__mid{ background: var(--n-500); pointer-events:auto; }',
      '.scratch .bar__tray{ background: var(--n-650); }',
      '.scratch .bar__deco{ filter: brightness(.5) saturate(.65); }',

      /* 도구 바 속 — 램프 + 타이틀 + 물리 버튼 (보조 모니터 하드웨어 언어) */
      '.scratch__ttl{ display:flex; align-items:center; gap:10px; color:var(--n-000); font-size:17px; font-weight:700; }',
      '.scratch__ttl i{ width:9px; height:9px; border-radius:50%; background:var(--th-accent-hi, var(--cyan-300)); box-shadow:0 0 6px var(--th-accent-hi, var(--cyan-300)); }',
      '.scratch__tools{ display:flex; align-items:center; gap:10px; }',
      '.scratch__tool{ height:44px; padding:0 18px; border:0; border-radius:12px; background:var(--n-500); color:var(--n-050); font:700 16px/1 inherit; font-family:inherit; box-shadow:0 3px 0 var(--n-900); cursor:pointer; }',
      '.scratch__tool:active{ transform:translateY(2px); box-shadow:0 1px 0 var(--n-900); }',
      '.scratch__tool.is-on{ background:var(--n-000); color:var(--n-650); }',
      '.scratch__done{ height:44px; padding:0 22px; border:0; border-radius:12px; background:var(--th-vivid, var(--blue-450)); color:var(--n-000); font-size:19px; font-weight:800; font-family:inherit; box-shadow:0 3px 0 var(--n-900); cursor:pointer; margin-left:6px; }',
      '.scratch__done:active{ transform:translateY(2px); box-shadow:0 1px 0 var(--n-900); }'
    ].join('\n');
    document.head.appendChild(css);

    /* ── 오버레이 조립 ── */
    var root = document.createElement('div');
    root.className = 'scratch';
    root.id = 'scratchpad';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="scratch__dim"></div><canvas class="scratch__canvas" aria-label="연습장 필기면"></canvas>';

    /* 화면의 콘솔바를 복제해 도구 바로 쓴다 — 형태·좌우 일러스트가 그대로 온다 */
    var toolbar = pageBar.cloneNode(true);
    toolbar.classList.remove('scratch-anim', 'scratch-away');
    toolbar.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    toolbar.removeAttribute('id');
    var tray = toolbar.querySelector('.bar__tray');
    tray.innerHTML =
      '<span class="scratch__ttl"><i></i>연습장</span>' +
      '<div class="scratch__tools">' +
        '<button class="scratch__tool is-on" data-tool="pen">펜</button>' +
        '<button class="scratch__tool" data-tool="eraser">지우개</button>' +
        '<button class="scratch__tool" data-tool="clear">전체 지우기</button>' +
        '<button class="scratch__done" data-tool="close">완료</button>' +
      '</div>';
    root.appendChild(toolbar);
    document.body.appendChild(root);

    /* ── 캔버스 ── */
    var canvas = root.querySelector('.scratch__canvas');
    var ctx = null;
    var tool = 'pen';
    var drawing = false;

    /* 처음 열릴 때 비트맵 크기를 잡는다 (이후 유지 — 필기 보존) */
    function ensureBitmap() {
      if (ctx) return;
      var r = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx = canvas.getContext('2d');
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    }
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (canvas.width / r.width),
        y: (e.clientY - r.top) * (canvas.height / r.height)
      };
    }
    canvas.addEventListener('pointerdown', function (e) {
      ensureBitmap();
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      var p = pos(e);
      var dpr = window.devicePixelRatio || 1;
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = getComputedStyle(root).getPropertyValue('--scratch-ink').trim() || '#1F2B49';
      ctx.lineWidth = (tool === 'eraser' ? 26 : 3) * dpr;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e);
      ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    ['pointerup', 'pointercancel'].forEach(function (t) {
      canvas.addEventListener(t, function () { drawing = false; if (ctx) ctx.beginPath(); });
    });

    /* ── 도구 버튼 ── */
    toolbar.querySelectorAll('[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.dataset.tool;
        if (t === 'close') { close(); return; }
        if (t === 'clear') { if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        tool = t;
        toolbar.querySelectorAll('[data-tool="pen"],[data-tool="eraser"]').forEach(function (x) {
          x.classList.toggle('is-on', x.dataset.tool === t);
        });
      });
    });

    /* ── 열고 닫기 — 콘솔바 전환 연출 ── */
    pageBar.classList.add('scratch-anim');

    function open() {
      if (root.classList.contains('is-open')) return;
      pageBar.classList.add('scratch-away');            /* 기존 바 퇴장 */
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.classList.add('is-in');                  /* 딤 + 도구 바 등장 */
          ensureBitmap();
        });
      });
    }
    function close() {
      root.classList.remove('is-in');                   /* 딤 + 도구 바 퇴장 */
      root.setAttribute('aria-hidden', 'true');
      setTimeout(function () {
        root.classList.remove('is-open');
        pageBar.classList.remove('scratch-away');       /* 기존 바 복귀 */
      }, 300);
    }

    buttons.forEach(function (b) { b.addEventListener('click', open); });

    /* 검수용 — 주소에 ?scratch=1 을 붙이면 열린 상태로 시작 */
    try { if (new URLSearchParams(location.search).get('scratch') === '1') open(); } catch (e) {}
  });
})();
