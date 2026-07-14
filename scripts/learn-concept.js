/* =========================================================================
   개념 학습 · 끊어읽기 인터랙션
   - 안 읽은 구간: blur + opacity
   - 현재 구간을 클릭하면 한 칸씩 읽어나감 (커서 전진)
   - 이미지 보유 용어: 읽으면 점선 밑줄, 누르면 활성(파란 밑줄) + 우측 이미지
   - 빈칸 도달 시 근처에 정답 선택 팝오버(토글)
   - 이미지 클릭 시 확대 레이어(라이트박스)
   ========================================================================= */
(function () {
  var article = document.querySelector('.article');
  var segs = [].slice.call(document.querySelectorAll('.seg'));
  var pop = document.querySelector('.answer-pop');
  var blank = document.querySelector('.seg--blank');
  var viewer = document.querySelector('.viewer');
  var vLabel = viewer.querySelector('.viewer__label');
  var vPager = viewer.querySelector('.viewer__pager__num');
  var lightbox = document.querySelector('.lightbox');
  var lbLabel = lightbox.querySelector('.lightbox__img');

  var imgTerms = [].slice.call(document.querySelectorAll('.seg--img'))
    .sort(function (a, b) { return (+a.dataset.img) - (+b.dataset.img); });
  var cursor = 0;

  var summaryBtn = document.getElementById('summaryBtn');

  /* ---- 읽기 상태 렌더 ---- */
  function render() {
    segs.forEach(function (s, i) {
      s.classList.toggle('is-read', i < cursor);
      s.classList.toggle('is-current', i === cursor);
      s.classList.toggle('is-unread', i > cursor);
    });
    // 마지막 구간까지 모두 읽으면 '개념 요약하기' 활성화
    if (summaryBtn && cursor >= segs.length) summaryBtn.disabled = false;
  }

  /* ---- 이미지 뷰어 ---- */
  function activeImg() { return document.querySelector('.seg--img.is-active'); }
  function setActiveImg(el) {
    imgTerms.forEach(function (x) { x.classList.toggle('is-active', x === el); });
    updateViewer();
  }
  function clearImg() {
    imgTerms.forEach(function (x) { x.classList.remove('is-active'); });
    updateViewer();
  }
  function updateViewer() {
    var a = activeImg();
    if (!a) {
      viewer.dataset.state = 'empty';
      vLabel.textContent = '용어를 누르면\n이미지가 여기에 표시돼요';
      vPager.textContent = '– / ' + imgTerms.length;
      return;
    }
    viewer.dataset.state = 'filled';
    viewer.dataset.img = a.dataset.img;
    vLabel.textContent = '이미지 ' + a.dataset.img;
    vPager.textContent = a.dataset.img + ' / ' + imgTerms.length;
  }
  function stepImg(dir) {
    var a = activeImg();
    var idx = a ? imgTerms.indexOf(a) : -1;
    idx = (idx + dir + imgTerms.length) % imgTerms.length;
    setActiveImg(imgTerms[idx]);
  }

  /* ---- 정답 팝오버 ---- */
  function positionPop() {
    var r = blank.getBoundingClientRect();
    var w = pop.offsetWidth || 210;
    var left = r.left + r.width / 2;
    left = Math.max(w / 2 + 8, Math.min(left, window.innerWidth - w / 2 - 8));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + 12) + 'px';
    pop.style.setProperty('--caret-x', (r.left + r.width / 2 - (left - w / 2)) + 'px');
  }
  function openPop() { pop.classList.add('is-open'); blank.classList.add('is-open'); positionPop(); }
  function closePop() { pop.classList.remove('is-open'); blank.classList.remove('is-open'); }
  function togglePop() { pop.classList.contains('is-open') ? closePop() : openPop(); }

  /* ---- 라이트박스 ---- */
  function openLightbox(n) { lbLabel.textContent = '이미지 ' + n; lightbox.classList.add('is-open'); }
  function closeLightbox() { lightbox.classList.remove('is-open'); }

  /* ---- 클릭 처리 ---- */
  segs.forEach(function (s, i) {
    s.addEventListener('click', function () {
      if (i > cursor) return;                 // 아직 못 읽는 앞 구간
      if (i === cursor) {                      // 현재 구간 → 전진
        if (s.classList.contains('seg--blank')) { togglePop(); return; }  // 빈칸은 답해야 전진
        if (s.classList.contains('seg--img')) { setActiveImg(s); }
        cursor++; render();
        return;
      }
      // 이미 읽은 구간
      if (s.classList.contains('seg--img')) {
        s.classList.contains('is-active') ? clearImg() : setActiveImg(s);
      } else if (s.classList.contains('seg--blank')) {
        togglePop();
      }
    });
  });

  /* 선지 선택 → 빈칸 채우고 전진 */
  pop.querySelectorAll('.answer-opt').forEach(function (o) {
    o.addEventListener('click', function () {
      pop.querySelectorAll('.answer-opt').forEach(function (x) { x.classList.remove('is-selected'); });
      o.classList.add('is-selected');
      blank.querySelector('.seg--blank__text').textContent = o.dataset.value;
      blank.classList.add('is-filled');
      closePop();
      var bi = segs.indexOf(blank);
      if (cursor === bi) { cursor++; render(); }
    });
  });

  /* 뷰어 · 페이저 · 라이트박스 */
  viewer.querySelector('.viewer__frame').addEventListener('click', function () {
    if (viewer.dataset.state === 'filled') openLightbox(viewer.dataset.img);
  });
  viewer.querySelector('.viewer__prev').addEventListener('click', function (e) { e.stopPropagation(); stepImg(-1); });
  viewer.querySelector('.viewer__next').addEventListener('click', function (e) { e.stopPropagation(); stepImg(1); });
  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePop(); closeLightbox(); }
  });
  article.addEventListener('scroll', function () { if (pop.classList.contains('is-open')) positionPop(); });
  window.addEventListener('resize', function () { if (pop.classList.contains('is-open')) positionPop(); });

  /* 라이트/다크 토글 */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    });
  }

  render();
  updateViewer();
})();

/* =========================================================================
   개념 요약하기 모달 — 끊어읽기 화면 위 오버레이
   - progressive 빈칸(초록 활성) + 선지(활성 빈칸일 때만, 2~5개, 텍스트/이미지)
   - 선지 영역 높이 고정 → 박스 상하 흔들림 없음
   - 닫기(X) 시 상태 유지, 재열기 시 이어서
   - 모든 빈칸 채우면 '다음으로' 활성화
   ========================================================================= */
(function () {
  var openBtn = document.getElementById('summaryBtn');
  var modal = document.getElementById('summary');
  if (!openBtn || !modal) return;
  var box = document.getElementById('summaryBox');
  var optsWrap = document.getElementById('summaryOptions');
  var nextBtn = document.getElementById('summaryNext');
  var closeBtn = document.getElementById('summaryClose');
  var segs = [].slice.call(box.querySelectorAll('.sseg'));   // 모달 내 끊어읽기 구간
  var cursor = 0;

  // 빈칸별 선지 (kind: text | image, 2~5개)
  var DATA = {
    '1': { kind: 'text', options: ['1', '10', '100', '1000'] },
    '2': { kind: 'image', options: ['이미지 1', '이미지 2'] }
  };

  function render() {
    segs.forEach(function (s, i) {
      s.classList.toggle('is-read', i < cursor);
      s.classList.toggle('is-current', i === cursor);
      s.classList.toggle('is-unread', i > cursor);
      if (s.classList.contains('sblank')) {
        s.classList.toggle('is-active', i === cursor && !s.classList.contains('is-filled'));
      }
    });
    var cur = segs[cursor];
    var isBlank = cur && cur.classList.contains('sblank') && !cur.classList.contains('is-filled');
    renderOptions(isBlank ? cur : null);         // 현재 구간이 빈칸일 때만 선지
    nextBtn.hidden = cursor < segs.length;       // 끝까지 읽기 전엔 아예 비노출
  }
  function renderOptions(cur) {
    optsWrap.innerHTML = '';
    if (!cur) return;                            // 빈칸 아닐 땐 비움 (공간은 CSS로 예약)
    var d = DATA[cur.dataset.blank];
    d.options.forEach(function (o) {
      var btn = document.createElement('button');
      btn.className = 'sopt' + (d.kind === 'image' ? ' sopt--img' : '');
      if (d.kind === 'image') btn.innerHTML = '<span class="sopt__img"></span>';
      else btn.textContent = o;
      btn.addEventListener('click', function () { fill(cur, d.kind, o); });
      optsWrap.appendChild(btn);
    });
  }
  function fill(b, kind, val) {
    b.classList.remove('is-active');
    b.classList.add('is-filled');
    if (kind === 'image') b.innerHTML = '<span class="sblank__thumb"></span>';
    else b.textContent = val;
    cursor++; render();                          // 빈칸 채우면 다음 구간으로
  }

  segs.forEach(function (s, i) {
    s.addEventListener('click', function () {
      if (i !== cursor) return;                              // 현재 구간만 클릭 가능
      if (s.classList.contains('sblank')) return;            // 빈칸은 선지로만 채움(클릭 전진 X)
      cursor++; render();
    });
  });

  openBtn.addEventListener('click', function () {
    if (openBtn.disabled) return;
    modal.classList.add('is-open');
    render();
  });
  closeBtn.addEventListener('click', function () { modal.classList.remove('is-open'); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('is-open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('is-open'); });

  render();
})();

