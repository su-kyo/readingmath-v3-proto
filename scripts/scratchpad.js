/* =========================================================================
   scratchpad.js — 연습장 캔버스 (공용 · Phase 6 신설)
   -------------------------------------------------------------------------
   하단 콘솔 바의 「연습장」 버튼이 여는 손글씨 캔버스.
   debug-panel·keypad-input과 같은 방식 — 이 파일 하나만 불러오면
   화면의 연습장 버튼(#scratchBtn 또는 '연습장' 라벨 버튼)에 알아서 붙는다.

   · 프레임 = 공용 보조 모니터(styles/monitor.css). 링크가 없으면 주입한다.
   · dim 없음 + 바깥 클릭 통과 — 문제를 보면서 쓰는 팔레트라 화면을 막지 않는다.
   · 종이는 항상 밝다(하드웨어 원칙) — 잉크는 네이비 고정.
   · 도구: 펜 · 지우개 · 전체 지우기 · 닫기. 손가락/펜/마우스(포인터 이벤트).
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
    if (!buttons.length) return;

    /* ── monitor.css 없으면 주입 ── */
    if (!document.querySelector('link[href*="monitor.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'styles/monitor.css?v=1';
      document.head.appendChild(link);
    }

    /* ── 연습장 전용 스타일 ── */
    var css = document.createElement('style');
    css.textContent = [
      '.monitor--pad{ pointer-events:none; }',                            /* 바깥은 그대로 조작 가능 */
      '.monitor--pad.is-open{ align-items:flex-end; padding-right:clamp(12px,3vw,40px); }',
      '.monitor--pad .monitor__rig{ pointer-events:auto; margin-bottom:auto; }',
      '.monitor--pad .monitor__tool.is-on{ background:var(--th-vivid, var(--blue-450)); box-shadow:0 3px 0 var(--n-900); }',
      '.monitor--pad .monitor__screen{ background:var(--n-050); overflow:hidden; }', /* 종이 = 항상 밝다 */
      '.scratch__canvas{ display:block; width:100%; height:52vh; touch-action:none; cursor:crosshair; }'
    ].join('\n');
    document.head.appendChild(css);

    /* ── 마크업 (공용 보조 모니터 골격) ── */
    var root = document.createElement('div');
    root.className = 'monitor monitor--pad';
    root.id = 'scratchpad';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="monitor__rig" style="--mon-w:560px" role="dialog" aria-label="연습장">' +
        '<div class="monitor__mount"><i></i><i></i></div>' +
        '<div class="monitor__frame">' +
          '<div class="monitor__hd">' +
            '<span class="monitor__lamps"><i class="is-live"></i><i></i><i></i></span>' +
            '<span class="monitor__ttl">연습장</span>' +
            '<div class="monitor__tools">' +
              '<button class="monitor__tool is-on" data-tool="pen">펜</button>' +
              '<button class="monitor__tool" data-tool="eraser">지우개</button>' +
              '<button class="monitor__tool" data-tool="clear">전체 지우기</button>' +
            '</div>' +
            '<button class="monitor__x" data-tool="close" aria-label="닫기">' +
              '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="monitor__screen"><canvas class="scratch__canvas"></canvas></div>' +
          '<div class="monitor__chin"><span class="monitor__slit"></span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    var canvas = root.querySelector('.scratch__canvas');
    var ctx = null;
    var tool = 'pen';
    var drawing = false;
    var INK = '#1F2B49';   /* 네이비 잉크 (종이가 항상 밝으므로 고정) */

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
      ctx.strokeStyle = INK;
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
    root.querySelectorAll('[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.dataset.tool;
        if (t === 'close') { close(); return; }
        if (t === 'clear') { if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        tool = t;
        root.querySelectorAll('[data-tool="pen"],[data-tool="eraser"]').forEach(function (x) {
          x.classList.toggle('is-on', x.dataset.tool === t);
        });
      });
    });

    function open() {
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(ensureBitmap);   /* 레이아웃 잡힌 뒤 비트맵 확보 */
    }
    function close() { root.classList.remove('is-open'); root.setAttribute('aria-hidden', 'true'); }
    function toggle() { root.classList.contains('is-open') ? close() : open(); }

    buttons.forEach(function (b) { b.addEventListener('click', toggle); });
  });
})();
