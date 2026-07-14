/* space-bg.js — 별 우주 배경 별 생성기
   .spacebg 요소마다 반짝이는 별을 채운다. data-stars 로 개수 지정 가능(기본=화면넓이 기반 자동).
   멱등: 한 번만 생성. 리사이즈 시 재생성 안 함(별은 % 좌표라 스케일만 됨). */
(function () {
  function rand(a, b) { return a + Math.random() * (b - a); }

  function build(bg) {
    if (bg.__starred) return;
    bg.__starred = true;

    var area = (bg.clientWidth || window.innerWidth) * (bg.clientHeight || window.innerHeight);
    var count = parseInt(bg.dataset.stars, 10) || Math.round(area / 9000) || 160;
    count = Math.max(90, Math.min(count, 340));

    var layer = document.createElement('div');
    layer.className = 'spacebg__stars';
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'star';
      var r = Math.random();
      var size = r < 0.86 ? rand(1, 2.2) : rand(2.2, 3.4);
      s.style.width = s.style.height = size.toFixed(2) + 'px';
      s.style.left = rand(0, 100).toFixed(3) + '%';
      s.style.top = rand(0, 100).toFixed(3) + '%';
      s.style.setProperty('--o', rand(.35, .95).toFixed(2));
      s.style.setProperty('--d', rand(2.4, 5.6).toFixed(2) + 's');
      s.style.setProperty('--delay', (-rand(0, 6)).toFixed(2) + 's');
      if (r > 0.90) s.classList.add('star--big');
      else if (r > 0.82) s.classList.add('star--bright');
      if (r > 0.975) { s.classList.add('star--cross'); s.classList.add('star--bright'); }
      frag.appendChild(s);
    }
    layer.appendChild(frag);
    bg.appendChild(layer);
  }

  function init() {
    var list = document.querySelectorAll('.spacebg');
    for (var i = 0; i < list.length; i++) build(list[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.RMSpaceBG = { build: init };
})();
