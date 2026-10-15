/* =========================================================================
   scratchpad.js — 연습장 (공용 · Phase 6 재작업)
   -------------------------------------------------------------------------
   하단 콘솔 바의 「연습장」 버튼이 여는 필기 모드.
   debug-panel·keypad-input과 같은 방식 — 이 파일 하나만 불러오면
   화면의 연습장 버튼(#scratchBtn 또는 '연습장' 라벨 버튼)에 알아서 붙는다.

   방식 (2026-08-20 확정 + 피드백 반영 — 별도 창 아님):
   · 화면 전체가 필기면 — 콘텐츠를 덮는 투명 캔버스에 문제 위로 바로 쓴다.
   · 딤은 "둘레만" — 문제 영역(.content/.rframe)과 콘솔바 띠는 딤에 깔리지 않고
     원래 밝기로 남는다. 딤 농도는 0.8 — 둘레를 확실히 눌러 문제만 뜨게 한다.
   · 콘솔바 전환 연출 — 기존 .bar가 아래로 내려가고, 같은 자리에 이 스크립트가
     화면의 .bar를 그대로 복제한 도구 바를 올린다(모양·색이 원래 콘솔바와 같다 — 2026-10-15,
     전에는 네이비로 다시 칠했다). 트레이 안 버튼만 연습장 도구로 바뀐다.
   · 도구: 잉크 3색(기본·빨강·파랑) · 지우개 · 뒤로/앞으로 복귀 · 전체 지우기.
   · 나가는 버튼은 「연습장」 버튼과 같은 왼쪽 자리 — 켠 자리에서 끈다.
   · 잉크는 쓰는 순간의 테마를 따른다 — 라이트=진한 색, 다크=밝은 색.
   · 연습장 모드 중에는 화면 조작이 잠긴다. 나가는 길은 「연습장 닫기」뿐.
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

    /* ── 스타일 ── styles/scratchpad.css (2026-10-14: <style> 주입을 CSS 파일로 옮김 · RM-JS-01) ── */

    /* ── 오버레이 조립 ── */
    var root = document.createElement('div');
    root.className = 'scratch';
    root.id = 'scratchpad';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="scratch__dim"><i class="scratch__hole"></i></div>' +
      '<canvas class="scratch__canvas" aria-label="연습장 필기면"></canvas>';

    var ICO_UNDO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4L3.5 8.5 8 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 8.5h7.5a4.5 4.5 0 0 1 0 9H8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    var ICO_REDO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l4.5 4.5L12 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8.5H8.5a4.5 4.5 0 0 0 0 9H12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

    var ICO_CHECK = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.4l3 3 6-6.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ICO_CLOSE = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

    /* 화면의 콘솔바를 복제해 도구 바로 쓴다 — 형태 · 색 · 좌우 일러스트가 그대로 온다 */
    var toolbar = pageBar.cloneNode(true);
    toolbar.classList.remove('scratch-anim', 'scratch-away');
    toolbar.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    toolbar.removeAttribute('id');
    var tray = toolbar.querySelector('.bar__tray');
    /* 나가는 버튼은 「연습장」 버튼이 있던 왼쪽 그 자리 — 켠 자리에서 끈다.
       (오른쪽 끝에 두면 열어만 본 사람이 닫으려고 반대편까지 가야 한다) */
    tray.innerHTML =
      '<button class="toolbtn toolbtn--primary scratch__done" data-tool="close">' + ICO_CLOSE + '<span>연습장 닫기</span></button>' +
      '<div class="scratch__tools">' +
        '<button class="scratch__swatch is-on" data-ink="1" aria-label="잉크 기본색">' + ICO_CHECK + '</button>' +
        '<button class="scratch__swatch" data-ink="2" aria-label="잉크 빨강">' + ICO_CHECK + '</button>' +
        '<button class="scratch__swatch" data-ink="3" aria-label="잉크 파랑">' + ICO_CHECK + '</button>' +
        '<button class="toolbtn scratch__tool" data-tool="eraser"><span>지우개</span></button>' +
        '<span class="scratch__sep"></span>' +
        '<button class="toolbtn scratch__tool scratch__tool--ico" data-tool="undo" aria-label="뒤로 복귀" disabled>' + ICO_UNDO + '</button>' +
        '<button class="toolbtn scratch__tool scratch__tool--ico" data-tool="redo" aria-label="앞으로 복귀" disabled>' + ICO_REDO + '</button>' +
        '<button class="toolbtn scratch__tool" data-tool="clear"><span>전체 지우기</span></button>' +
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

    /* ── 딤 구멍 — 문제 영역만 원래 밝기로 남긴다 ── */
    function fitDim() {
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
    function syncUR() {                          /* 비활성은 화면의 .toolbtn:disabled 규칙을 그대로 탄다 */
      undoBtn.disabled = !hist.length;
      redoBtn.disabled = !redoStack.length;
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
      ctx.strokeStyle = getComputedStyle(root).getPropertyValue('--scratch-ink-' + ink).trim() || '#1F2B49'; /* 방어값 = --n-600 */
      ctx.lineWidth = (tool === 'eraser' ? 26: 3) * dpr;
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
      /* 다음 프레임에 등장시켜야 트랜지션이 걸린다. 다만 탭이 가려져 있으면
         rAF가 멈춰 바가 안 올라오므로, 타이머로도 한 번 더 챙긴다. */
      var raised = false;
      function raise() {
        if (raised) return;
        raised = true;
        root.classList.add('is-in');                    /* 딤 + 도구 바 등장 */
        ensureBitmap();
      }
      requestAnimationFrame(function () { requestAnimationFrame(raise); });
      setTimeout(raise, 60);
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
