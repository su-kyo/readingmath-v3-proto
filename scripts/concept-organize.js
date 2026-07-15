/* =========================================================================
   개념 정리하기 — 정독 뷰 (인터랙션 없음)
   - 지문은 처음부터 온전히 다 보인다 (끊어읽기/blur/클릭 전진 없음)
   - 핵심 문장(seg--key)·용어(seg--img)는 정적 강조만
   - 우측 노트의 '요약하기' 버튼 → '개념 요약하기'에서 완성한 요약본(빈칸 채움)을 표시
   - 요약을 확인하면 콘솔 '개념 다지기로' 활성
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 데이터 (지문 2개) ---------- */
  var PASSAGES = [
    {
      segs: [
        { t: '우리가 주변에서 보는 여러 가지 액체, 즉 용액은' },
        { t: '색깔이나 냄새, 투명한 정도가 서로 다르다.', key: true },
        { t: '식초는 연한 노란색이고 투명하며' },
        { t: '냄새가 나지만 거품은 오래 가지 않는다.' },
        { t: '유리 세정제는', img: 1 },
        { t: '연한 푸른색으로 투명하고 냄새가 나며,' },
        { t: '흔들면 거품이 3초 이상 유지된다.', key: true },
        { t: '탄산수는', img: 2 },
        { t: '무색이고 투명하며 냄새는 없고' },
        { t: '거품도 오래 가지 않는다.' }
      ],
      recap: {
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
        { t: '산성 용액에서 푸른 종이가 붉게 변하고,', key: true },
        { t: '염기성 용액에서 붉은 종이가 푸르게 변한다.' },
        { t: '페놀프탈레인 용액은' },
        { t: '산성에서는 색이 변하지 않지만,' },
        { t: '염기성에서는 붉은색으로 변한다.', key: true }
      ],
      recap: {
        lines: [
          [ { t: '▶ 리트머스 종이는 산성에서 ' }, { fill: '붉게' }, { t: ', 염기성에서 ' }, { fill: '푸르게' }, { t: ' 변한다.' } ],
          [ { t: '▶ 페놀프탈레인 용액은 ' }, { fill: '염기성' }, { t: '에서 붉은색으로 변한다.' } ]
        ]
      }
    }
  ];

  var article    = document.getElementById('article');
  var doneBtn    = document.getElementById('doneBtn');
  var noteTitle  = document.getElementById('noteTitle');
  var noteHint   = document.getElementById('noteHint');
  var noteBody   = document.getElementById('noteBody');
  var summaryBtn = document.getElementById('summaryBtn');

  /* ---------- 지문 렌더 (전체 · 정적) ---------- */
  function renderArticle() {
    article.innerHTML = '';
    PASSAGES.forEach(function (p) {
      var para = document.createElement('p');
      para.className = 'para';
      p.segs.forEach(function (s) {
        var el = document.createElement('span');
        el.className = 'seg' + (s.key ? ' seg--key' : '') + (s.img ? ' seg--img' : '');
        el.textContent = s.t;
        para.appendChild(el);
        para.appendChild(document.createTextNode(' '));
      });
      article.appendChild(para);
    });
  }

  /* ---------- 요약 노트 (요약하기 → 완성 요약본) ---------- */
  function buildSummary() {
    noteBody.innerHTML = '';
    PASSAGES.forEach(function (p) {
      p.recap.lines.forEach(function (line) {
        var pl = document.createElement('p');
        pl.className = 'nline';
        line.forEach(function (part) {
          if (part.fill !== undefined) {
            var b = document.createElement('span');
            b.className = 'nfill';
            b.textContent = part.fill;
            pl.appendChild(b);
          } else {
            pl.appendChild(document.createTextNode(part.t));
          }
        });
        noteBody.appendChild(pl);
      });
    });
  }

  summaryBtn.addEventListener('click', function () {
    buildSummary();
    noteTitle.textContent = '개념 요약';
    noteHint.classList.add('is-off');
    noteBody.classList.add('is-on');
    doneBtn.disabled = false;
    doneBtn.title = '개념 다지기로 이동';
  });

  /* ---------- 콘솔: 개념 다지기로 ---------- */
  doneBtn.addEventListener('click', function () {
    if (!doneBtn.disabled) window.location.href = 'learn-concept-drill.html';
  });

  /* ---------- 라이트/다크 토글 ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  renderArticle();
})();
