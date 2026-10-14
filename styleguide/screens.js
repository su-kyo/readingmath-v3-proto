/* styleguide/screens.html 전용 — data/screens.json 을 계열별 카드로 그린다 (2026-10-14).
   데이터는 tools/screens-build.py 가 만든다. 여기서는 그리기만 한다. */
(function () {
  'use strict';
  var THEME = { 'light+dark': '라이트 · 다크 전환', light: '라이트 고정', dark: '다크 고정' };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(s, ruleTitle) {
    var parts = s.parts.map(function (p) {
      return '<a class="sg-chip" href="' + p.doc + '" title="' + esc(p.group) + '">' + esc(p.name) + '</a>';
    }).join('') || '<span class="sg-chip sg-chip--none">스토리북에 실린 부품 없음</span>';
    var rules = s.rules.map(function (id) {
      return '<a class="sg-chip sg-chip--rule" href="styleguide/rules.html#' + id + '" title="' + esc(ruleTitle[id] || '') + '">' + id + '</a>';
    }).join('') || '<span class="sg-chip sg-chip--none">공통 규칙만</span>';
    var toks = s.tokens.map(function (t) {
      return '<span class="sg-chip sg-chip--tok">' + esc(t.name) + ' <b>' + t.count + '</b></span>';
    }).join('');
    var files = s.css.concat(s.js).map(function (f) { return '<code>' + esc(f.replace(/^(styles|scripts)\//, '')) + '</code>'; }).join(' ');
    return '<article class="sg-screen">' +
      '<header class="sg-screen__hd"><h3>' + esc(s.title) + '</h3>' +
        '<a class="sg-screen__path" href="' + s.path + '">' + esc(s.path) + ' ↗</a>' +
        '<span class="sg-screen__meta">' + esc(THEME[s.theme] || s.theme) + (s.section ? ' · data-section="' + s.section + '"' : '') + '</span></header>' +
      '<dl class="sg-screen__dl">' +
        '<dt>부품</dt><dd>' + parts + '</dd>' +
        '<dt>규칙</dt><dd>' + rules + '</dd>' +
        '<dt>토큰</dt><dd>' + (toks || '—') + '<small class="sg-screen__from">' + esc(s.tokensFrom.join(' · ')) + '이 많이 부르는 것</small></dd>' +
        '<dt>파일</dt><dd class="sg-screen__files">' + files + '</dd>' +
      '</dl></article>';
  }

  Promise.all([
    fetch('styleguide/data/screens.json').then(function (r) { return r.json(); }),
    fetch('styleguide/data/rules.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    var ruleTitle = {};
    res[1].rules.forEach(function (r) { ruleTitle[r.id] = r.title; });
    document.querySelectorAll('.sg-map[data-family]').forEach(function (box) {
      var fam = box.getAttribute('data-family');
      box.innerHTML = res[0].screens.filter(function (s) { return s.family === fam; })
        .map(function (s) { return card(s, ruleTitle); }).join('');
    });
  }).catch(function () {
    document.querySelector('.sg-main').insertAdjacentHTML('beforeend',
      '<p class="sg-note">styleguide/data/screens.json 을 못 읽었습니다 — tools/screens-build.py 를 돌리세요.</p>');
  });
})();
