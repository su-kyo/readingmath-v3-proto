/* =========================================================================
   개념 학습 · 끊어읽기 인터랙션
   - 안 읽은 구간: blur + opacity. 지금 구간은 읽은 곳과 같은 평문
   - 지문 아무 데나 누르기 · 스페이스바(꾹 눌러도 한 칸) = 한 칸 전진, 읽는 곳을 따라 스크롤
   - 그림 구간: 닿으면 그 그림이 켜진다(굵게 + 계열색 · 우측 이미지).
     왼쪽 알약 [아이콘 + 번호들]로 다시 켜고 끈다. 안 읽은 줄의 알약은 없다
   - 빈칸 도달 시 근처에 빈칸 선지 창(토글) — 공용 부품 scripts/blank-pop.js
   - 이미지 클릭 시 확대 레이어(라이트박스)
   ========================================================================= */
(function () {
  var article = document.querySelector('.article');
  var segs = [].slice.call(document.querySelectorAll('.chunk'));
  var blank = document.querySelector('.chunk--blank');
  var viewer = document.querySelector('.viewer');
  var vLabel = viewer.querySelector('.viewer__label');
  var vPager = viewer.querySelector('.viewer__pager__num');
  var lightbox = document.querySelector('.lightbox');
  var lbLabel = lightbox.querySelector('.lightbox__img');

  var imgTerms = [].slice.call(document.querySelectorAll('.chunk--img'))
    .sort(function (a, b) { return (+a.dataset.img) - (+b.dataset.img); });
  var cursor = 0;
  var ICON = '<svg class="img-tag__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-9 9"/></svg>';

  var summaryBtn = document.getElementById('summaryBtn');

  /* ---- 읽기 상태 렌더 ---- */
  function render() {
    segs.forEach(function (s, i) {
      s.classList.toggle('is-read', i < cursor);
      s.classList.toggle('is-current', i === cursor);
      s.classList.toggle('is-unread', i > cursor);
    });
    article.classList.toggle('is-done', cursor >= segs.length);
    // 마지막 구간까지 모두 읽으면 '개념 요약하기' 활성화
    if (summaryBtn && cursor >= segs.length) summaryBtn.disabled = false;
    // 콘솔바 안내(RM-PART-07) — 첫 구간에서 「어떻게 읽나」, 다 읽으면 「다음에 무엇을」. 그 사이는 숨긴다.
    if (window.RMGuide) window.RMGuide.set(cursor >= segs.length ? '다 읽었어요! 개념 요약하기 버튼을 눌러 주세요!'
      : cursor === 0 ? '글을 눌러 이어 읽어 주세요!' : '');
    renderTags();
  }

  /* ---- 이미지 뷰어 ---- */
  function activeImg() { return document.querySelector('.chunk--img.is-active'); }
  function reachedImgs() { return imgTerms.filter(function (x) { return segs.indexOf(x) <= cursor; }); }
  function setActiveImg(el) {
    imgTerms.forEach(function (x) { x.classList.toggle('is-active', x === el); });
    updateViewer();
    renderTags();
  }
  function clearImg() { setActiveImg(null); }
  function updateViewer() {
    var a = activeImg();
    if (!a) {
      viewer.dataset.state = 'empty';
      vLabel.textContent = '이미지가 있는 구간에 닿으면\n여기에 표시돼요';
      vPager.textContent = '– / ' + imgTerms.length;
      return;
    }
    viewer.dataset.state = 'filled';
    viewer.dataset.img = a.dataset.img;
    vLabel.textContent = '이미지 ' + a.dataset.img;
    vPager.textContent = a.dataset.img + ' / ' + imgTerms.length;
  }
  /* 페이저는 읽은 데까지의 그림만 오간다 (뒤 그림에 앞 문제의 답이 보일 수 있다) */
  function stepImg(dir) {
    var r = reachedImgs(); if (!r.length) return;
    var idx = r.indexOf(activeImg());
    idx = idx < 0 ? r.length - 1 : (idx + dir + r.length) % r.length;
    setActiveImg(r[idx]);
    r[idx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---- 그림 번호 알약 — 위치(top)만 계산해서 넣는다. 모양은 CSS(.img-tag) ---- */
  function renderTags() {
    [].forEach.call(article.querySelectorAll('.img-tag'), function (g) { g.remove(); });
    var base = article.getBoundingClientRect().top - article.scrollTop, rows = [];
    var on = activeImg();
    reachedImgs().forEach(function (x) {
      var r = [].filter.call(x.getClientRects(), function (q) { return q.width > 1; })[0]; if (!r) return;
      var mid = r.top - base + r.height / 2;
      var row = rows.filter(function (w) { return Math.abs(w.mid - mid) < 8; })[0];   // 같은 줄이면 한 알약에
      if (row) row.imgs.push(x); else rows.push({ mid: mid, imgs: [x] });
    });
    rows.forEach(function (w) {
      var g = document.createElement('div');
      g.className = 'img-tag';
      g.innerHTML = '<span class="img-tag__pill' + (w.imgs.length === 1 ? ' is-one' : '') + '">' + ICON +
        w.imgs.map(function (x) {
          return '<span class="img-tag__num' + (x === on ? ' is-on' : '') + '" data-img="' + x.dataset.img + '">' + x.dataset.img + '</span>';
        }).join('') + '</span>';
      article.appendChild(g);
      g.style.top = (w.mid - g.offsetHeight / 2) + 'px';
    });
  }

  /* ---- 빈칸 선지 창 (공용 · scripts/blank-pop.js) ----
     오답 → 빨간 표시 0.5초 뒤 비활성(다시 못 고름) · 빈칸도 같이 흔든다
     정답 → 빈칸을 바로 채우고 초록 0.5초를 보여 준 뒤 창이 닫히며 다음 구간으로 */
  var CHOICES = ['성질', '무게', '온도', '개수'], ANSWER = '성질';
  function isPopOpen() { return window.RMBlankPop.isOpen(); }
  function openPop() {
    blank.classList.add('is-open');
    window.RMBlankPop.open(blank, {
      choices: CHOICES, answer: ANSWER,
      onPick: function (val, ok) {
        if (!ok) { blank.classList.remove('is-wrong'); void blank.offsetWidth; blank.classList.add('is-wrong'); return; }
        blank.querySelector('.chunk--blank__text').textContent = val;
        blank.classList.remove('is-wrong');
        blank.classList.add('is-filled', 'is-just-correct');
      },
      onDone: function () {
        blank.classList.remove('is-just-correct');
        if (cursor === segs.indexOf(blank)) advance();
      },
      onClose: function () { blank.classList.remove('is-open'); }
    });
  }
  function closePop() { window.RMBlankPop.close(); }
  function togglePop() { isPopOpen() ? closePop() : openPop(); }

  /* ---- 라이트박스 ---- */
  function openLightbox(n) { lbLabel.textContent = '이미지 ' + n; lightbox.classList.add('is-open'); }
  function closeLightbox() { lightbox.classList.remove('is-open'); }

  /* ---- 전진 ---- */
  function advance() {
    var cur = segs[cursor]; if (!cur) return;
    if (cur === blank && !blank.classList.contains('is-filled')) { if (!isPopOpen()) openPop(); return; }  // 빈칸은 답해야 전진
    cursor++;
    if (segs[cursor] && segs[cursor].classList.contains('chunk--img')) setActiveImg(segs[cursor]);
    render();
    if (segs[cursor]) segs[cursor].scrollIntoView({ block: 'nearest', behavior: 'smooth' });  // 읽는 곳이 화면 밖으로 안 나가게
  }

  /* ---- 클릭 처리 — 알약 번호는 그 그림을 켜고 끄고, 나머지는 어디를 눌러도 한 칸 ---- */
  article.addEventListener('click', function (e) {
    var t = e.target.closest('.img-tag__num, .img-tag__pill.is-one');
    if (t) {
      var n = (t.dataset.img || t.querySelector('.img-tag__num').dataset.img);
      var x = imgTerms.filter(function (q) { return q.dataset.img === n; })[0];
      x && x.classList.contains('is-active') ? clearImg() : setActiveImg(x);
      return;
    }
    if (e.target.closest('.chunk--blank') === blank && segs.indexOf(blank) <= cursor) { togglePop(); return; }
    advance();
  });
  /* 스페이스바 = 지문 누르기. 꾹 누르고 있어도 한 칸, 버튼에 남은 포커스는 뗀다(그 버튼이 같이 눌리지 않게).
     위에 레이어(요약 · 영상 · 확대 · 연습장)가 떠 있으면 지문은 넘기지 않는다 */
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' && e.key !== ' ') return;
    if (document.querySelector('.monitor.is-open, .scratch.is-open')) return;
    e.preventDefault();
    if (e.repeat) return;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    advance();
  });

  /* 빈칸 흔들림은 0.4초 뒤 거둔다 (선지 쪽 0.5초는 blank-pop.js 몫) */
  blank.addEventListener('animationend', function () { blank.classList.remove('is-wrong'); });

  /* 뷰어 · 페이저 · 라이트박스 */
  viewer.querySelector('.viewer__frame').addEventListener('click', function () {
    if (viewer.dataset.state === 'filled') openLightbox(viewer.dataset.img);
  });
  viewer.querySelector('.viewer__prev').addEventListener('click', function (e) { e.stopPropagation(); stepImg(-1); });
  viewer.querySelector('.viewer__next').addEventListener('click', function (e) { e.stopPropagation(); stepImg(1); });
  /* 닫기 = dim 클릭 또는 X 버튼 (이미지 자체를 눌러도 닫히지 않게) */
  lightbox.addEventListener('click', function (e) {
    if (e.target.closest('.monitor__x') || e.target.classList.contains('monitor__dim')) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePop(); closeLightbox(); }
  });
  /* 줄이 바뀌면(창 크기 · 글자 크기 · 웹폰트 도착) 알약 위치를 다시 잡는다 */
  if (window.ResizeObserver) new ResizeObserver(renderTags).observe(article);
  article.addEventListener('rm:textsize', renderTags);   // 「글자」 크기를 바꾸면 줄 위치가 달라진다 (concept-learn-textsize.js)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderTags);

  /* 라이트/다크 토글 */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---- 검수용 디버그 훅 (?debug=1일 때만 패널에 뜸) ---- */
  function dbgBlank(ok) {
    var bi = segs.indexOf(blank);
    if (cursor < bi) { cursor = bi; render(); blank.scrollIntoView({ block: 'center' }); }   // 빈칸 차례까지 먼저 읽는다 — 주소(&do=)로 바로 열 수 있게
    if (!isPopOpen()) openPop();
    var o = [].filter.call(document.querySelectorAll('.bpop__opt:not(.is-dead)'), function (x) {
      return (x.dataset.val === ANSWER) === ok;
    })[0];
    if (o) o.click();
  }
  function dbgReadAll() {
    if (!blank.classList.contains('is-filled')) {
      blank.querySelector('.chunk--blank__text').textContent = ANSWER;
      blank.classList.add('is-filled');
    }
    closePop();
    cursor = segs.length; render();
  }
  if (window.RMDebug) window.RMDebug.register({
    title: '끊어읽기',
    actions: [
      { label: '빈칸 정답', tone: 'ok', run: function () { dbgBlank(true); } },
      { label: '빈칸 오답', tone: 'no', run: function () { dbgBlank(false); } },
      { label: '끝까지 읽기', run: dbgReadAll }
    ]
  });

  if (segs[0] && segs[0].classList.contains('chunk--img')) setActiveImg(segs[0]);
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
  // 요약 다음 = 개념 다지기 (실서비스 순서: 학습 → 요약 → 다지기 → 정리, 2026-10-15)
  if (nextBtn) nextBtn.addEventListener('click', function () { window.location.href = 'concept/drill.html'; });
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
    box.classList.toggle('is-done', cursor >= segs.length);
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
    advance();                                   // 빈칸 채우면 다음 구간으로
  }

  /* 아무 데나 누르기 · 스페이스바 = 한 칸. 빈칸 차례에는 선지로만 채운다 */
  function advance() {
    var cur = segs[cursor]; if (!cur) return;
    if (cur.classList.contains('sblank') && !cur.classList.contains('is-filled')) return;
    cursor++; render();
    if (segs[cursor]) segs[cursor].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  box.addEventListener('click', advance);
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' && e.key !== ' ') return;
    if (!modal.classList.contains('is-open') || document.querySelector('.scratch.is-open')) return;
    e.preventDefault();
    if (e.repeat) return;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    advance();
  });

  openBtn.addEventListener('click', function () {
    if (openBtn.disabled) return;
    modal.classList.add('is-open');
    render();
  });

  /* ---- 검수용 디버그 훅 ---- */
  function dbgOpen() { openBtn.disabled = false; modal.classList.add('is-open'); render(); }
  function dbgFillAll() {
    dbgOpen();
    var guard = 0;
    while (cursor < segs.length && guard++ < 200) {
      var cur = segs[cursor];
      if (cur.classList.contains('sblank') && !cur.classList.contains('is-filled')) {
        var d = DATA[cur.dataset.blank];
        fill(cur, d.kind, d.options[0]);
      } else { cursor++; render(); }
    }
  }
  if (window.RMDebug) window.RMDebug.register({
    title: '개념 요약하기 모달',
    actions: [
      { label: '모달 열기', run: dbgOpen },
      { label: '전부 채우기', tone: 'ok', run: dbgFillAll }
    ]
  });
  closeBtn.addEventListener('click', function () { modal.classList.remove('is-open'); });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('monitor__dim')) modal.classList.remove('is-open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('is-open'); });

  render();
})();

