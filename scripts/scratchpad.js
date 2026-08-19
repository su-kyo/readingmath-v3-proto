/* =========================================================================
   scratchpad.js — 연습장 (공용 · Phase 6 재작업)
   -------------------------------------------------------------------------
   하단 콘솔 바의 「연습장」 버튼이 여는 필기 모드.
   debug-panel·keypad-input과 같은 방식 — 이 파일 하나만 불러오면
   화면의 연습장 버튼(#scratchBtn 또는 '연습장' 라벨 버튼)에 알아서 붙는다.

   방식 (2026-08-20 확정 + 피드백 반영 — 별도 창 아님):
   · 화면 전체가 필기면 — 콘텐츠를 덮는 투명 캔버스에 문제 위로 바로 쓴다.
   · 딤은 "둘레만" — 문제 영역(.content/.rframe)과 콘솔바 띠는 딤에 깔리지 않고
     원래 밝기로 남는다. 딤 농도는 --scrim의 절반.
   · 콘솔바 전환 연출 — 기존 .bar가 아래로 내려가고, 같은 자리에 이 스크립트가
     화면의 .bar를 복제해 네이비 톤으로 칠한 도구 바를 올린다.
     좌우 일러스트도 필터로 네이비 단색조가 된다.
   · 도구: 잉크 3색(기본·빨강·파랑) · 지우개 · 뒤로/앞으로 복귀 · 전체 지우기 · 완료.
   · 잉크는 쓰는 순간의 테마를 따른다 — 라이트=진한 색, 다크=밝은 색.
   · 연습장 모드 중에는 화면 조작이 잠긴다. 나가는 길은 「완료」뿐.
   · 모달(.monitor)이 떠 있으면 콘솔바가 가려지므로 연습장은 열리지 않는다.
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

      /* 오버레이 뼈대 — 콘텐츠 → 딤(둘레만) → 캔버스 → 도구 바 */
      '.scratch{ position:fixed; inset:0; z-index:400; display:none; }',
      '.scratch.is-open{ display:block; }',

      /* 딤 — 문제 영역에 구멍을 뚫은 스포트라이트. 콘솔바 띠(bottom)는 아예 제외 */
      '.scratch__dim{ position:absolute; left:0; right:0; top:0; overflow:hidden; opacity:0; transition:opacity .28s; pointer-events:none; }',
      '.scratch.is-in .scratch__dim{ opacity:1; }',
      '.scratch__hole{ position:absolute; box-shadow:0 0 0 9999px var(--scrim); }',

      '.scratch__canvas{ position:absolute; inset:0; width:100%; height:100%; touch-action:none; cursor:crosshair; }',

      /* 잉크 3색 — 쓰는 순간의 테마를 따른다 (다크 기본 / 라이트 뒤집기) */
      '.scratch{ --scratch-ink-1: var(--n-050); --scratch-ink-2: var(--red-300); --scratch-ink-3: var(--blue-300); }',
      ':root[data-theme="light"] .scratch{ --scratch-ink-1: var(--n-650); --scratch-ink-2: var(--red-500); --scratch-ink-3: var(--blue-450); }',

      /* 도구 바 = 화면 .bar의 복제본 + 네이비 톤. 형태는 화면 CSS를 그대로 물려받는다 */
      '.scratch .bar{ transform: translateY(112%); transition: transform .32s cubic-bezier(.2,.8,.3,1.08); pointer-events:auto; z-index:2; }',
      '.scratch.is-in .bar{ transform: translateY(0); }',
      '.scratch .bar__mid{ background: var(--n-500); pointer-events:auto; }',
      '.scratch .bar__tray{ background: var(--n-650); }',
      /* 좌우 일러스트는 네이비 램프로 다시 칠한다 (듀오톤 — 아래 SVG 필터가 실제 색을 매핑) */
      '.scratch .bar__deco{ filter: url(#scratchNavy); }',

      /* 도구 바 속 — 램프 + 타이틀 + 물리 버튼 (보조 모니터 하드웨어 언어) */
      '.scratch__ttl{ display:flex; align-items:center; gap:10px; color:var(--n-000); font-size:17px; font-weight:700; }',
      '.scratch__ttl i{ width:9px; height:9px; border-radius:50%; background:var(--th-accent-hi, var(--cyan-300)); box-shadow:0 0 6px var(--th-accent-hi, var(--cyan-300)); }',
      '.scratch__tools{ display:flex; align-items:center; gap:9px; }',
      '.scratch__sep{ width:1px; height:26px; background:var(--n-500); margin:0 3px; }',
      '.scratch__swatch{ width:36px; height:36px; border-radius:50%; border:3px solid var(--n-500); background:var(--swatch); cursor:pointer; padding:0; }',
      '.scratch__swatch.is-on{ border-color:var(--n-000); box-shadow:0 0 0 2px var(--n-900); }',
      '.scratch__tool{ height:44px; padding:0 16px; border:0; border-radius:12px; background:var(--n-500); color:var(--n-050); font-size:16px; font-weight:700; font-family:inherit; box-shadow:0 3px 0 var(--n-900); cursor:pointer; display:inline-flex; align-items:center; gap:6px; }',
      '.scratch__tool:active{ transform:translateY(2px); box-shadow:0 1px 0 var(--n-900); }',
      '.scratch__tool.is-on{ background:var(--n-000); color:var(--n-650); }',
      '.scratch__tool.is-off{ opacity:.35; pointer-events:none; }',
      '.scratch__tool--ico{ width:44px; padding:0; justify-content:center; }',
      '.scratch__done{ height:44px; padding:0 22px; border:0; border-radius:12px; background:var(--th-vivid, var(--blue-450)); color:var(--n-000); font-size:19px; font-weight:800; font-family:inherit; box-shadow:0 3px 0 var(--n-900); cursor:pointer; margin-left:4px; }',
      '.scratch__done:active{ transform:translateY(2px); box-shadow:0 1px 0 var(--n-900); }'
    ].join('\n');
    document.head.appendChild(css);

    /* ── 오버레이 조립 ── */
    var root = document.createElement('div');
    root.className = 'scratch';
    root.id = 'scratchpad';
    root.setAttribute('aria-hidden', 'true');
    /* 좌우 일러스트 리컬러 필터 — 밝기를 네이비 램프(n-900…n-300)로 다시 칠한다.
       색조만 씌우는 filter()가 아니라 명암 단계를 토큰 색으로 갈아끼우는 듀오톤이라
       원본의 요철·하이라이트가 그대로 살아 있고 트레이와 한 덩어리로 읽힌다. */
    root.innerHTML =
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
        '<filter id="scratchNavy" color-interpolation-filters="sRGB">' +
          '<feColorMatrix type="matrix" values="' +
            '.2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0"/>' +
          '<feComponentTransfer>' +
            /* n-950 · n-900 · n-800 · n-700 · n-650 · n-600 · n-500 · n-400
               — 원본 일러스트가 대체로 밝아서 넓은 면이 n-650/n-600(트레이 색)에 앉는다.
                 하이라이트만 n-500/n-400으로 떠서 요철이 남는다. */
            '<feFuncR type="table" tableValues="0.012 0.024 0.035 0.059 0.071 0.122 0.227 0.345"/>' +
            '<feFuncG type="table" tableValues="0.024 0.055 0.075 0.098 0.118 0.169 0.275 0.420"/>' +
            '<feFuncB type="table" tableValues="0.059 0.125 0.157 0.188 0.216 0.286 0.416 0.549"/>' +
          '</feComponentTransfer>' +
        '</filter>' +
      '</svg>' +
      '<div class="scratch__dim"><i class="scratch__hole"></i></div>' +
      '<canvas class="scratch__canvas" aria-label="연습장 필기면"></canvas>';

    var ICO_UNDO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L3.5 8.5 8 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 8.5h7.5a4.5 4.5 0 0 1 0 9H8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    var ICO_REDO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l4.5 4.5L12 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8.5H8.5a4.5 4.5 0 0 0 0 9H12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

    /* 화면의 콘솔바를 복제해 도구 바로 쓴다 — 형태·좌우 일러스트가 그대로 온다 */
    var toolbar = pageBar.cloneNode(true);
    toolbar.classList.remove('scratch-anim', 'scratch-away');
    toolbar.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    toolbar.removeAttribute('id');
    var tray = toolbar.querySelector('.bar__tray');
    tray.innerHTML =
      '<span class="scratch__ttl"><i></i>연습장</span>' +
      '<div class="scratch__tools">' +
        '<button class="scratch__swatch is-on" data-ink="1" style="--swatch:var(--scratch-ink-1)" aria-label="잉크 기본색"></button>' +
        '<button class="scratch__swatch" data-ink="2" style="--swatch:var(--scratch-ink-2)" aria-label="잉크 빨강"></button>' +
        '<button class="scratch__swatch" data-ink="3" style="--swatch:var(--scratch-ink-3)" aria-label="잉크 파랑"></button>' +
        '<button class="scratch__tool" data-tool="eraser">지우개</button>' +
        '<span class="scratch__sep"></span>' +
        '<button class="scratch__tool scratch__tool--ico is-off" data-tool="undo" aria-label="뒤로 복귀">' + ICO_UNDO + '</button>' +
        '<button class="scratch__tool scratch__tool--ico is-off" data-tool="redo" aria-label="앞으로 복귀">' + ICO_REDO + '</button>' +
        '<button class="scratch__tool" data-tool="clear">전체 지우기</button>' +
        '<span class="scratch__sep"></span>' +
        '<button class="scratch__done" data-tool="close">완료</button>' +
      '</div>';
    root.appendChild(toolbar);
    document.body.appendChild(root);

    var dim = root.querySelector('.scratch__dim');
    var hole = root.querySelector('.scratch__hole');
    var canvas = root.querySelector('.scratch__canvas');
    var ctx = null;
    var tool = 'pen';
    var ink = 1;
    var drawing = false;

    /* ── 딤 구멍 — 문제 영역은 원래 밝기, 콘솔바 띠는 아예 딤 밖 ── */
    function fitDim() {
      dim.style.bottom = pageBar.offsetHeight + 'px';
      var target = document.querySelector('.content, .rframe');
      if (target) {
        var r = target.getBoundingClientRect();
        hole.style.left = r.left + 'px';
        hole.style.top = r.top + 'px';
        hole.style.width = r.width + 'px';
        hole.style.height = r.height + 'px';
        hole.style.borderRadius = getComputedStyle(target).borderRadius;
      } else {
        /* 문제 영역을 못 찾으면 구멍 없이 전체 딤 */
        hole.style.left = '-40px'; hole.style.top = '-40px';
        hole.style.width = '0'; hole.style.height = '0';
        hole.style.borderRadius = '0';
      }
    }
    window.addEventListener('resize', function () {
      if (root.classList.contains('is-open')) fitDim();
    });

    /* ── 캔버스 ── */
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

    /* ── 뒤로/앞으로 복귀 — 획 단위 스냅샷 (PNG 문자열, 최대 20) ── */
    var hist = [], redoStack = [], HMAX = 20;
    var undoBtn = toolbar.querySelector('[data-tool="undo"]');
    var redoBtn = toolbar.querySelector('[data-tool="redo"]');
    function syncUR() {
      undoBtn.classList.toggle('is-off', !hist.length);
      redoBtn.classList.toggle('is-off', !redoStack.length);
    }
    function snapshot() {
      try {
        hist.push(canvas.toDataURL());
        if (hist.length > HMAX) hist.shift();
        redoStack.length = 0;
        syncUR();
      } catch (e) {}
    }
    function restore(url) {
      var img = new Image();
      img.onload = function () {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = url;
    }

    canvas.addEventListener('pointerdown', function (e) {
      ensureBitmap();
      snapshot();                                  /* 획 시작 전 상태를 저장 → 뒤로 복귀 */
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      var p = pos(e);
      var dpr = window.devicePixelRatio || 1;
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = getComputedStyle(root).getPropertyValue('--scratch-ink-' + ink).trim() || '#1F2B49';
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
    function setPen(nextInk) {
      tool = 'pen'; ink = nextInk;
      toolbar.querySelectorAll('.scratch__swatch').forEach(function (s) {
        s.classList.toggle('is-on', s.dataset.ink === String(nextInk));
      });
      toolbar.querySelector('[data-tool="eraser"]').classList.remove('is-on');
    }
    toolbar.querySelectorAll('.scratch__swatch').forEach(function (s) {
      s.addEventListener('click', function () { setPen(Number(s.dataset.ink)); });
    });
    toolbar.querySelectorAll('[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.dataset.tool;
        if (t === 'close') { close(); return; }
        if (t === 'clear') {
          if (ctx) { snapshot(); ctx.clearRect(0, 0, canvas.width, canvas.height); }
          return;
        }
        if (t === 'undo') {
          if (!hist.length || !ctx) return;
          redoStack.push(canvas.toDataURL());
          restore(hist.pop());
          syncUR(); return;
        }
        if (t === 'redo') {
          if (!redoStack.length || !ctx) return;
          hist.push(canvas.toDataURL());
          restore(redoStack.pop());
          syncUR(); return;
        }
        if (t === 'eraser') {
          tool = 'eraser';
          b.classList.add('is-on');
          toolbar.querySelectorAll('.scratch__swatch').forEach(function (s) { s.classList.remove('is-on'); });
        }
      });
    });

    /* ── 열고 닫기 — 콘솔바 전환 연출 ── */
    pageBar.classList.add('scratch-anim');

    function open() {
      if (root.classList.contains('is-open')) return;
      /* 모달(.monitor)이 떠 있으면 콘솔바가 가려진 상태 — 연습장은 열지 않는다 */
      if (document.querySelector('.monitor.is-open')) return;
      fitDim();
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
