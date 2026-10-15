/* =========================================================================
   과목 — 학습 화면 수학 · 과학 두 벌 (2026-10-15)
   - 과목별 화면은 <html data-subject="math | science">. 열리면 rm-subject 에 적는다
     (그 뒤에 여는 결과 · 유형 화면이 이어 읽는다)
   - 두 과목이 같이 쓰는 화면(유형 4장 · 결과)은 rm-subject 를 읽는다. 없으면 수학
     주소에 ?subject=math | science 를 붙이면 그 과목으로 열고 기억한다(화면 목록 · 검수 링크용)
   - 머리줄의 [data-crumb="sem | unit | sub"] 칸에 그 과목의 학년 · 단원 · 소단원을 넣는다
   - 콘텐츠: 수학 중등 3-2 (1) 삼각비(training 712~714) · 과학 중등 2-1 (2) 밀도와 용해도(978 · 985 · 990)
   ========================================================================= */
(function () {
  'use strict';

  var UNITS = {
    math:    { name: '수학', sem: '중등 3-2', unit: '1단원 삼각비',      sub: '(1) 삼각비' },
    science: { name: '과학', sem: '중등 2-1', unit: '1단원 물질의 특성', sub: '(2) 밀도와 용해도' }
  };

  var fixed = document.documentElement.getAttribute('data-subject') ||
              new URLSearchParams(location.search).get('subject');
  var id = fixed;
  if (!id) { try { id = localStorage.getItem('rm-subject'); } catch (e) {} }
  if (id !== 'science') id = 'math';
  if (fixed) { try { localStorage.setItem('rm-subject', id); } catch (e) {} }

  window.RMSubject = {
    id: id,
    unit: UNITS[id],
    /* 과목에 따라 둘 중 하나 — RMSubject.pick(수학 값, 과학 값) */
    pick: function (math, science) { return id === 'science' ? science : math; }
  };

  function fill() {
    var u = UNITS[id];
    document.querySelectorAll('[data-crumb]').forEach(function (el) {
      var k = el.getAttribute('data-crumb');
      el.textContent = k === 'sem' ? u.name + ' ' + u.sem : (u[k] || el.textContent);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill);
  else fill();
})();
