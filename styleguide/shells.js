/* styleguide/shells.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
/* 콘솔바 계열 넷 — data-section 은 <html> 에만 걸리므로 액자 하나에 넷을 담을 수 없다.
   그래서 계열마다 토큰값(트레이·립 면색, 일러스트)을 꺼내 인라인으로 심는다. */
(function () {
  var root = document.documentElement, keep = root.getAttribute('data-section');
  // 좌우 일러스트만은 토큰이 아니라 각 화면의 <img src> 로 골라져 있다 (아래 주의 참고).
  var SECS = [['concept','개념',''],['type','유형','type-'],['essay','서술형','essay-'],['assign','과제','task-']];
  var ICO = 'assets/icons/console/console-';
  document.getElementById('barsTpl').innerHTML = SECS.map(function (s) {
    root.setAttribute('data-section', s[0]);
    var p = getComputedStyle(root);
    return '<div style="position:relative;height:100px;overflow:hidden;' +
           '--asset-bar-rim:' + p.getPropertyValue('--asset-bar-rim').trim() + ';' +
           '--asset-bar-tray:' + p.getPropertyValue('--asset-bar-tray').trim() + '">' +
           '<div class="bar">' +
           '<img class="bar__deco bar__deco--l" alt="" src="' + ICO + s[2] + 'right.svg">' +
           '<div class="bar__mid"><div class="bar__tray">' +
             '<div class="bar__group"><button class="toolbtn">연습장</button></div>' +
             '<div class="bar__group"><span style="font-size:12px;font-weight:700;color:var(--n-650)">' +
                s[1] + '</span></div>' +
           '</div></div>' +
           '<img class="bar__deco bar__deco--r" alt="" src="' + ICO + s[2] + 'left.svg">' +
           '</div></div>';
  }).join('');
  root.setAttribute('data-section', keep);
})();
