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

  /* 학기 16개 — 홈 · 서랍의 학기 변경 · 결과 「홈으로」가 같이 쓴다 (2026-10-16 한 벌로) */
  var SEMS = ['elem-3-1','elem-3-2','elem-4-1','elem-4-2','elem-5-1','elem-5-2','elem-6-1','elem-6-2',
              'mid-1-1','mid-1-2','mid-2-1','mid-2-2','mid-3-1','mid-3-2','high-1-1','high-1-2'];
  /* 고등 과목명(공통수학 · 통합과학 등)은 확정 전이라 학년 · 학기로만 부른다 */
  var LVL = { elem: '초등', mid: '중등', high: '고등' };

  window.RMSubject = {
    id: id,
    unit: UNITS[id],
    /* 과목에 따라 둘 중 하나 — RMSubject.pick(수학 값, 과학 값) */
    pick: function (math, science) { return id === 'science' ? science : math; },
    sems: SEMS,
    /* 'mid-3-2' → 「중등 3학년 2학기」 · short 이면 「중등 3-2」 */
    semLabel: function (key, short) {
      var p = key.split('-');
      return short ? LVL[p[0]] + ' ' + p[1] + '-' + p[2] : LVL[p[0]] + ' ' + p[1] + '학년 ' + p[2] + '학기';
    },
    /* 마지막에 본 학기 — 부를 때마다 새로 읽는다(없으면 초등 3-1) */
    sem: function () {
      var sem = null;
      try { sem = localStorage.getItem('rm-sem'); } catch (e) {}
      return SEMS.indexOf(sem) < 0 ? 'elem-3-1' : sem;
    },
    /* 결과 화면 「홈으로」 — 행성 홈 */
    home: function () { return 'nav/home.html?subject=' + id + '&sem=' + this.sem(); }
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
