/* concept/learn-sci.html(과학판) 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). 수학판(learn-math.html)은 개념 영상이 없어 이 파일을 부르지 않는다. */
/* 개념 영상 레이어 — 진입 시 자동 표시(dim), '개념 영상 보기'로 재호출.
   닫을 때 iframe 제거 → 재생/소리 정지. */
(function () {
  var box = document.getElementById('videobox');
  var frame = document.getElementById('videoFrame');
  var fallback = document.getElementById('videoFallback');
  var openBtn = document.getElementById('videoBtn');
  var closeBtn = document.getElementById('videoClose');
  var SRC = 'https://www.youtube.com/embed/FVUE-FaBAJU?rel=0&modestbranding=1';
  function open() {
    frame.innerHTML = '<iframe src="' + SRC + '" title="개념 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    frame.appendChild(fallback);
    box.classList.add('is-open');
  }
  function close() { box.classList.remove('is-open'); frame.innerHTML = ''; frame.appendChild(fallback); }
  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('monitor__dim')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-open')) close(); });
  /* 검수용 훅 — 영상 레이어를 열고 닫아 아래 화면을 볼 수 있게 */
  if (window.RMDebug) window.RMDebug.register({
    title: '개념 영상 레이어',
    actions: [
      { label: '영상 닫기', run: close },
      { label: '영상 열기', run: open }
    ]
  });

  open();   // 진입 시 자동 표시
})();
