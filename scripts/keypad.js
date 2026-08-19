/* ============================================================
   keypad.js — 주관식 숫자 키패드 한 벌 (Phase 6 통일)
   ------------------------------------------------------------
   키 구성·마크업·값 편집 규칙의 단일 소스.
   화면(개념·유형·서술형·과제·시험)은 이 파일이 만든 같은 물건을
   떠 있는 자리(모달·팝오버) 또는 붙박이 자리에 놓기만 한다.

   키 구성(확정): 7 8 9 ⌫ / 4 5 6 C / 1 2 3 − / 0 . 확인(2칸)
   · '+' 삭제 — 답 입력에 덧셈 기호가 필요한 근거 없음 (Phase 6)
   · '↻' → 'C' — 전체 지우기 라벨 통일 (↻는 "다시하기"로 오독)
   · data-k: 숫자 · back · clear · minus · dot · ok

   쓰는 법:
     wrap.innerHTML = RMKeypad.html();                  // 디스플레이 포함
     wrap.innerHTML = RMKeypad.html({ display:false }); // 그리드만 (붙박이)
     v = RMKeypad.apply(v, key);                        // 값 편집 규칙
       - back: 한 글자 삭제 / clear: 전체 삭제
       - minus: 맨 앞 − 부호 토글 / dot: 소수점 중복 방지(빈값이면 0.)
       - 숫자: 뒤에 붙임 (opts.max 자릿수 제한, 기본 10)
       - ok 는 값이 아니라 화면의 몫 — 그대로 반환

   물리 키보드는 scripts/keypad-input.js 가 data-k 버튼을 대신 누른다.
   ============================================================ */
(function () {
  'use strict';

  var BACK_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4H8l-6 8 6 8h13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/><path d="M18 9l-6 6M12 9l6 6"/></svg>';

  /* [data-k, 표시, 추가 클래스] — 이 배열이 키 구성의 정본 */
  var KEYS = [
    ['7', '7', ''], ['8', '8', ''], ['9', '9', ''], ['back', BACK_SVG, 'keypad__key--fn'],
    ['4', '4', ''], ['5', '5', ''], ['6', '6', ''], ['clear', 'C', 'keypad__key--fn'],
    ['1', '1', ''], ['2', '2', ''], ['3', '3', ''], ['minus', '−', 'keypad__key--fn'],
    ['0', '0', ''], ['dot', '.', ''], ['ok', '확인', 'keypad__key--ok']
  ];

  function html(opts) {
    opts = opts || {};
    var out = '';
    if (opts.display !== false) out += '<div class="keypad__display" data-kp-display>0</div>';
    out += '<div class="keypad__grid">';
    KEYS.forEach(function (k) {
      out += '<button type="button" class="keypad__key' + (k[2] ? ' ' + k[2] : '') +
             '" data-k="' + k[0] + '" aria-label="' + (k[0] === 'back' ? '지우기' : k[0] === 'clear' ? '전체 지우기' : k[0] === 'minus' ? '부호 바꾸기' : k[0] === 'dot' ? '소수점' : k[1]) + '">' + k[1] + '</button>';
    });
    out += '</div>';
    return out;
  }

  /* 값 편집 규칙 — 전 화면 공통. 부호는 U+2212(−)가 아니라 ASCII '-'로 저장한다. */
  function apply(v, key, opts) {
    v = v || '';
    var max = (opts && opts.max) || 10;
    if (key === 'back') return v.slice(0, -1);
    if (key === 'clear') return '';
    if (key === 'minus') return v.charAt(0) === '-' ? v.slice(1) : '-' + v;
    if (key === 'dot') {
      if (v.indexOf('.') !== -1) return v;
      return (v === '' || v === '-') ? v + '0.' : v + '.';
    }
    if (/^[0-9]$/.test(key)) {
      if (v.replace('-', '').replace('.', '').length >= max) return v;
      return v + key;
    }
    return v; /* ok 등은 값 변화 없음 */
  }

  window.RMKeypad = { html: html, apply: apply };
})();
