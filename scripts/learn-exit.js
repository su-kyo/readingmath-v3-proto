/* =========================================================================
   학습 헤더의 「나가기」 — 들어온 곳으로 돌아간다 (23개 화면 공용).
   개념·유형·서술형 = 커리큘럼(스텝을 고른 곳) · 과제 = 과제 센터.
   과목·학기는 홈/커리큘럼이 남긴 rm-subject · rm-sem 을 그대로 쓴다.
   ========================================================================= */
(function () {
  var img = document.querySelector('header img[src*="ico-exit"]');
  var btn = img && img.closest('button');
  if (!btn) return;

  function dest() {
    if (document.documentElement.dataset.section === 'assign') return 'assignment/home.html';
    var subject = 'math', sem = 'elem-3-1';
    try {
      subject = localStorage.getItem('rm-subject') || subject;
      sem = localStorage.getItem('rm-sem') || sem;
    } catch (e) {}
    return 'nav/curriculum.html?subject=' + subject + '&sem=' + sem;
  }

  btn.addEventListener('click', function () { window.location.href = dest(); });
})();
