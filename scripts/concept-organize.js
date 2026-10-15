/* =========================================================================
   개념 정리하기 — 정독 뷰 (인터랙션 없음)
   - 지문은 처음부터 온전히 다 보인다 (끊어읽기/blur/클릭 전진 없음)
   - 지문은 평문 한 벌 — 핵심 문장(key)·그림 구간(img) 데이터는 남기되 화면에 표시하지 않는다
   - 우측 노트의 '요약하기' 버튼 → '개념 요약하기'에서 완성한 요약본(빈칸 채움)을 표시
   - 요약을 확인하면 콘솔 「다 읽었어요」 활성 → 스텝 결과
   - 콘텐츠는 과목별 데이터 파일(window.RMOrganizeSet) — 수학 지문 2개 · 과학 지문 1개.
     지문 수만큼 차례로 쌓고(넘김 단계 없음), 요약도 지문 차례대로 잇는다
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- 데이터 = 과목별 파일 (scripts/concept-organize-data-math.js · -sci.js → window.RMOrganizeSet) ---------- */
  var SET = window.RMOrganizeSet || { passages: [] };
  var PASSAGES = SET.passages;

  /* 글 속 $…$ 를 KaTeX 로 — 한 덩이 글을 글자 · 수식 조각으로 붙인다 */
  function appendTex(parent, text) {
    String(text).split('$').forEach(function (p, i) {
      if (i % 2 === 0) { if (p) parent.appendChild(document.createTextNode(p)); return; }
      var m = document.createElement('span');
      if (window.katex) window.katex.render(p, m, { throwOnError: false, strict: 'ignore' }); else m.textContent = p;
      parent.appendChild(m);
    });
  }

  var article    = document.getElementById('article');
  var doneBtn    = document.getElementById('doneBtn');
  var noteTitle  = document.getElementById('noteTitle');
  var noteHint   = document.getElementById('noteHint');
  var noteBody   = document.getElementById('noteBody');
  var summaryBtn = document.getElementById('summaryBtn');

  /* ---------- 지문 렌더 (전체 · 정적) ----------
     지문 하나 = .passage. 그 안에서 { gap } 은 문단 나눔, { br } 은 줄바꿈. 지문이 하나면 나눔 줄이 없다 */
  function renderArticle() {
    article.innerHTML = '';
    PASSAGES.forEach(function (p) {
      var sec = document.createElement('section');
      sec.className = 'passage';
      var para = null;
      function newPara() { para = document.createElement('p'); para.className = 'para'; sec.appendChild(para); }
      newPara();
      p.segs.forEach(function (s) {
        if (s.gap) { newPara(); return; }
        if (s.br) { para.appendChild(document.createElement('br')); return; }
        var el = document.createElement('span');
        el.className = 'chunk';
        appendTex(el, s.t);
        para.appendChild(el);
        para.appendChild(document.createTextNode(' '));
      });
      article.appendChild(sec);
    });
  }

  /* ---------- 요약 노트 (요약하기 → 완성 요약본) ---------- */
  function buildSummary() {
    noteBody.innerHTML = '';
    PASSAGES.forEach(function (p) {
      if (p.recap.title) {
        var t = document.createElement('p');
        t.className = 'nline nline--title';
        appendTex(t, p.recap.title);
        noteBody.appendChild(t);
      }
      p.recap.lines.forEach(function (line) {
        var pl = document.createElement('p');
        pl.className = 'nline';
        line.forEach(function (part) {
          if (part.fill !== undefined) {
            var b = document.createElement('span');
            b.className = 'nfill';
            appendTex(b, part.fill);
            pl.appendChild(b);
          } else {
            appendTex(pl, part.t);
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
    doneBtn.title = '스텝 결과로 이동';
  });

  /* ---------- 콘솔: 다 읽었어요 → 스텝 결과 (실서비스 순서: 정리가 개념 학습의 마지막, 2026-10-15) ---------- */
  doneBtn.addEventListener('click', function () {
    if (!doneBtn.disabled) window.location.href = 'shared/step-result.html';
  });

  /* ---------- 라이트/다크 토글 ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  });

  renderArticle();
})();
