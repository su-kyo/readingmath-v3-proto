/* exam/home.html · exam/solve.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  var btn = document.getElementById('themeToggle');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('rm-theme', next); }catch(e){}
  });
})();
