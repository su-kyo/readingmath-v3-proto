/* =========================================================================
   키패드 · 물리 키보드 입력 (공용)
   -------------------------------------------------------------------------
   화면 키패드가 떠 있을 때 컴퓨터 키보드로도 숫자·지우기·확인을 누를 수 있게 한다.
   입력 로직을 따로 만들지 않는다 — 눌린 키에 해당하는 **화면 키패드 버튼을 대신
   클릭**해 준다. 그래서 채점·표시·다음 단계 이동까지 손으로 누른 것과 완전히 같다.

   키패드는 Phase 6에서 한 벌(scripts/keypad.js · .keypad__key[data-k])로
   통일됐다. 자리만 두 가지다:
     · 떠 있는 자리  .keypad--float.is-open (개념·유형) / .qpop.is-open (서술형)
     · 붙박이 자리   .keypad (과제·시험 — 화면에 늘 보임)

   키 대응 : 0~9 / Backspace=지우기 / Delete=전체지우기 / Enter=확인 / .(소수점) / -(부호)
   ========================================================================= */
(function () {
  'use strict';

  // 키보드 키 → 키패드 버튼의 data-k (통일된 한 벌 기준)
  var MAP = {
    'Backspace': 'back',
    'Delete': 'clear',
    'Enter': 'ok',
    '.': 'dot',
    '-': 'minus'
  };

  /* 화면에 실제로 보이는가.
     키패드는 position:fixed 라 offsetParent 가 항상 null 이다 — 그걸로 판단하면 안 된다.
     닫힌 상태는 visibility:hidden / opacity:0 로 표현되므로 계산된 스타일을 본다. */
  function visible(el) {
    if (!el || el.hasAttribute('hidden')) return false;
    if (el.closest('[aria-hidden="true"]')) return false;      // 닫힌 오버레이 안
    var cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    return el.getClientRects().length > 0;
  }

  /* 지금 입력을 받고 있는 키패드 하나를 고른다 (열린 것 우선, 없으면 화면에 보이는 마지막 것) */
  function activePad() {
    var qpop = document.querySelector('#qpop.is-open, .qpop.is-open');
    if (qpop && qpop.querySelector('[data-k]')) return qpop;

    var open = document.querySelector('.keypad.is-open');
    if (visible(open)) return open;

    var all = document.querySelectorAll('.keypad');
    for (var i = all.length - 1; i >= 0; i--) {              // 오버레이가 뒤에 있으므로 뒤에서부터
      if (visible(all[i]) && !all[i].classList.contains('is-locked')) return all[i];
    }
    return null;
  }

  /* 글자를 직접 치는 칸에 포커스가 있으면 가로채지 않는다 */
  function typingInField() {
    var a = document.activeElement;
    if (!a) return false;
    if (a.isContentEditable) return true;
    var tag = a.tagName;
    if (tag === 'TEXTAREA') return true;
    if (tag === 'INPUT') return !(a.readOnly || a.disabled);
    return false;
  }

  function keyFor(pad, e) {
    var name = MAP[e.key] || (/^[0-9]$/.test(e.key) ? e.key : null);
    if (!name) return null;
    var btn = pad.querySelector('[data-k="' + name + '"]');
    return (btn && !btn.disabled) ? btn : null;
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (typingInField()) return;
    var pad = activePad();
    if (!pad) return;
    var btn = keyFor(pad, e);
    if (!btn) return;
    e.preventDefault();       // Backspace 뒤로가기 · Enter 폼전송 방지
    btn.click();
  });
})();
