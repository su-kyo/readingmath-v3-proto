/* =========================================================================
   개념 정리하기 — 끊어읽기 레이아웃 재사용 (한 지문당 사이클)
   - 지문을 끊어읽기(현재 구간 탭 → 전진, 안 읽은 구간 blur)
   - 요약 파트(seg--recap)는 읽고 나면 밑줄 강조 → 클릭 시 우측 '개념 요약 노트'에
     '개념 요약하기에서 맞춘 요약본'(빈칸 채워짐)이 레이아웃 안에 정리됨 (모달 아님)
   - 지문을 다 읽으면 '다음 지문 ›' → 다음 지문 사이클, 마지막이면 '개념 다지기로' 활성
   - 지문 진행 표식(슬림 stepper)
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 데이터 (지문 2개) ---------- */
  var PASSAGES = [
    {
      segs: [
        { t: '우리가 주변에서 보는 여러 가지 액체, 즉 용액은' },
        { t: '색깔이나 냄새, 투명한 정도가 서로 다르다.', recap: true },
        { t: '식초는 연한 노란색이고 투명하며' },
        { t: '냄새가 나지만 거품은 오래 가지 않는다.' },
        { t: '유리 세정제는', img: 1 },
        { t: '연한 푸른색으로 투명하고 냄새가 나며,' },
        { t: '흔들면 거품이 3초 이상 유지된다.', recap: true },
        { t: '탄산수는', img: 2 },
        { t: '무색이고 투명하며 냄새는 없고' },
        { t: '거품도 오래 가지 않는다.' }
      ],
      recap: {
        title: '개념 요약 · 용액의 성질',
        lines: [
          [ { t: '▶ 여러 가지 용액은 색깔·냄새·' }, { fill: '투명한 정도' }, { t: '가 서로 다르다.' } ],
          [ { t: '▶ 유리 세정제는 흔들면 거품이 ' }, { fill: '3초 이상' }, { t: ' 유지된다.' } ],
          [ { t: '▶ 탄산수는 ' }, { fill: '무색' }, { t: '이고 거품이 오래 가지 않는다.' } ]
        ]
      }
    },
    {
      segs: [
        { t: '용액의 성질은 지시약으로도 구분할 수 있다.' },
        { t: '리트머스 종이는', img: 1 },
        { t: '산성 용액에서 푸른 종이가 붉게 변하고,', recap: true },
        { t: '염기성 용액에서 붉은 종이가 푸르게 변한다.' },
        { t: '페놀프탈레인 용액은' },
        { t: '산성에서는 색이 변하지 않지만,' },
        { t: '염기성에서는 붉은색으로 변한다.', recap: true }
      ],
      recap: {
        title: '개념 요약 · 지시약',
        lines: [
          [ { t: '▶ 리트머스 종이는 산성에서 ' }, { fill: '붉게' }, { t: ', 염기성에서 ' }, { fill: '푸르게' }, { t: ' 변한다.' } ],
          [ { t: '▶ 페놀프탈레인 용액은 ' }, { fill: '염기성' }, { t: '에서 붉은색으로 변한다.' } ]
        ]
      }
    }
  ];

  var article = document.getElementById('article');
  var pstepEl = document.getElementById('pstep');
  var doneBtn = document.getElementById('doneBtn');
  var noteTitle = document.getElementById('noteTitle');
  var noteHint = document.getElementById('noteHint');
  var noteBody = document.getElementById('noteBody');
  var lightbox = document.querySelector('.lightbox');
  var lbLabel = lightbox.querySelector('.lightbox__img');

  var pi = 0;          // 현재 지문 index
  var cursor = 0;      // 현재 지문 내 읽기 커서
  var segEls = [];     // 현재 지문 세그먼트 요소

  /* ---------- 지문 진행 표식 ---------- */
  function renderStep() {
    pstepEl.innerHTML = '';
    PASSAGES.forEach(function (p, i) {
      if (i) { var bar = document.createElement('span'); bar.className = 'pstep__bar' + (i <= pi ? ' is-done' : ''); pstepEl.appendChild(bar); }
      var it = document.createElement('span');
      it.className = 'pstep__item' + (i < pi ? ' is-done' : i === pi ? ' is-current' : '');
      it.innerHTML = '<span class="n">' + (i < pi ? '✓' : (i + 1)) + '</span>지문 ' + (i + 1);
      pstepEl.appendChild(it);
    });
  }

  /* ---------- 요약 노트 (레이아웃 통합) ---------- */
  function resetNote() {
    noteBody.classList.remove('is-on');
    noteBody.innerHTML = '';
    noteHint.classList.remove('is-off');
    noteTitle.textContent = '개념 요약 노트';
  }
  function revealNote() {
    if (noteBody.classList.contains('is-on')) return;
    var R = PASSAGES[pi].recap;
    noteTitle.textContent = R.title;
    noteBody.innerHTML = '';
    R.lines.forEach(function (line) {
      var p = document.createElement('p');
      p.className = 'nline';
      line.forEach(function (part) {
        if (part.fill !== undefined) {
          var b = document.createElement('span');
          b.className = 'nfill';
          b.textContent = part.fill;
          p.appendChild(b);
        } else {
          p.appendChild(document.createTextNode(part.t));
        }
      });
      noteBody.appendChild(p);
    });
    noteHint.classList.add('is-off');
    noteBody.classList.add('is-on');
  }

  /* ---------- 지문 렌더 ---------- */
  function renderPassage() {
    cursor = 0;
    article.innerHTML = '';
    PASSAGES[pi].segs.forEach(function (s) {
      var el = document.createElement('span');
      el.className = 'seg' + (s.img ? ' seg--img' : '') + (s.recap ? ' seg--recap' : '');
      if (s.img) el.dataset.img = s.img;
      el.textContent = s.t;
      article.appendChild(el);
      article.appendChild(document.createTextNode(' '));
    });
    var np = document.createElement('div');
    np.className = 'nextpsg'; np.id = 'nextpsg';
    np.innerHTML = '<button id="nextpsgBtn">다음 지문 <span aria-hidden="true">›</span></button>';
    article.appendChild(np);

    segEls = [].slice.call(article.querySelectorAll('.seg'));
    wireSegs();
    document.getElementById('nextpsgBtn').addEventListener('click', nextPassage);
    resetNote();
    paint();
    renderStep();
  }

  function paint() {
    segEls.forEach(function (s, i) {
      s.classList.toggle('is-read', i < cursor);
      s.classList.toggle('is-current', i === cursor);
      s.classList.toggle('is-unread', i > cursor);
    });
    var finished = cursor >= segEls.length;
    var np = document.getElementById('nextpsg');
    var last = pi >= PASSAGES.length - 1;
    if (np) np.classList.toggle('is-on', finished && !last);
    if (finished && last) { doneBtn.disabled = false; doneBtn.title = '개념 다지기로 이동'; }
  }

  function wireSegs() {
    segEls.forEach(function (s, i) {
      s.addEventListener('click', function () {
        if (i > cursor) return;                       // 아직 못 읽는 앞 구간
        if (i === cursor) {                           // 현재 구간 → 전진
          if (s.classList.contains('seg--img')) openLightbox(s.dataset.img);
          cursor++; paint();
          return;
        }
        // 이미 읽은 구간
        if (s.classList.contains('seg--recap')) revealNote();
        else if (s.classList.contains('seg--img')) openLightbox(s.dataset.img);
      });
    });
  }

  function nextPassage() {
    if (pi >= PASSAGES.length - 1) return;
    pi++; renderPassage();
    article.scrollTop = 0;
  }

  /* ---------- 라이트박스 (이미지 용어) ---------- */
  function openLightbox(n) { lbLabel.textContent = '이미지 ' + n; lightbox.classList.add('is-open'); }
  lightbox.addEventListener('click', function () { lightbox.classList.remove('is-open'); });

  /* ---------- 콘솔: 개념 다지기로 ---------- */
  doneBtn.addEventListener('click', function () { if (!doneBtn.disabled) window.location.href = 'learn-concept-drill.html'; });

  /* ---------- 키보드 ---------- */
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lightbox.classList.remove('is-open'); });

  /* ---------- 라이트/다크 토글 ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  renderPassage();
})();
