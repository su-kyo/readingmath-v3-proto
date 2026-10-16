/* =========================================================================
   과제 센터 · 해설 화면 (assignment-explain) — 풀이의 리뷰 버전
   · 보기 정오답 표시 + 해설 · OMR 초록/빨강 그리드(현재=노랑테) · 결과 보기
   · 데모: 15문항 중 Q4·Q7·Q10 오답 (12정답)
   ========================================================================= */
(function () {
  var ICO = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>'
  };


  var Q = RMAssign.Q;   /* 문항은 scripts/assignment-data.js 한 벌 */

  var N = Q.length;
  // 결과 화면 등에서 ?q=인덱스로 특정 문항 진입
  var cur = 0;
  try { var m = location.search.match(/[?&]q=(\d+)/); if (m) cur = Math.min(N - 1, Math.max(0, parseInt(m[1], 10))); } catch (e) {}
  function isCorrect(i) { return RMAssign.isCorrect(Q[i]) === true; }
  var correctCount = Q.filter(function (_, i) { return isCorrect(i); }).length;

  var qpanel = document.getElementById('qpanel');
  var omrGrid = document.getElementById('omrGrid');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  // OMR 그리드 (초록/빨강)
  function buildGrid() {
    var h = '';
    for (var i = 0; i < N; i++) {
      var ok = isCorrect(i);
      h += '<button class="cell cell--' + (ok ? 'correct' : 'wrong') + '" data-i="' + i + '">' + (i + 1) +
        '<span class="cell__mark">' + (ok ? ICO.check : ICO.x) + '</span></button>';
    }
    omrGrid.innerHTML = h;
    document.getElementById('progText').textContent = correctCount + '/' + N;
    document.getElementById('progBar').style.width = (correctCount / N * 100) + '%';
  }
  function markCur() {
    Array.prototype.forEach.call(omrGrid.children, function (c, i) { c.classList.toggle('is-cur', i === cur); });
  }

  // 문제 렌더 (리뷰)
  function render() {
    var q = Q[cur];
    var html = '<div class="qmeta"><span class="qmeta__n">문제 ' + (cur + 1) + '</span>' +
      '<span class="qmeta__type">' + q.name + '</span>' +
      '<span class="lvl lvl--' + q.lvl + '">' + q.lvl + '</span></div>' +
      '<h1 class="qtext">' + q.text + '</h1>';

    if (q.image) html += '<div class="qimg">' + q.image() + '</div>';

    if (q.type === 'short') {
      var ok = isCorrect(cur);
      html += '<div class="short"><div class="short__field ' + (ok ? 'is-correct' : 'is-wrong') + '">' +
        '<span class="short__val">' + (q.user == null ? '—' : q.user) + '</span>' +
        (q.unit ? '<span class="short__unit">' + q.unit + '</span>' : '') +
        '<span class="short__mark ' + (ok ? 'o' : 'x') + '">' + (ok ? ICO.check : ICO.x) + '</span></div>' +
        (ok ? '' : '<span class="short__ans">정답 <b>' + q.answer + (q.unit || '') + '</b></span>') + '</div>';
    } else {
      var many = q.opts.some(function (o) { return o.length > 8; });
      html += '<div class="opts' + (many ? ' opts--col' : '') + '">' +
        q.opts.map(function (o, i) {
          var cls = '', badge = (i + 1);
          if (i === q.answer) { cls = ' is-correct'; badge = ICO.check; }
          else if (i === q.user) { cls = ' is-wrong'; badge = ICO.x; }
          return '<div class="opt' + cls + '"><span class="opt__num">' + badge + '</span>' +
            '<span class="opt__txt">' + o + '</span></div>';
        }).join('') + '</div>';
    }

    html += '<div class="expl"><span class="expl__t">해설</span><p class="expl__b">' + q.explain + '</p></div>';

    qpanel.innerHTML = html;
    qpanel.scrollTop = 0;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === N - 1;
    markCur();
  }

  omrGrid.addEventListener('click', function (e) { var c = e.target.closest('.cell'); if (!c) return; cur = +c.dataset.i; render(); });
  prevBtn.addEventListener('click', function () { if (cur > 0) { cur--; render(); } });
  nextBtn.addEventListener('click', function () { if (cur < N - 1) { cur++; render(); } });

  var toast = document.getElementById('toast'), toastT = null;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('is-on'); }, 2200); }
  /* 연습장 = 공용 scripts/scratchpad.js 가 담당 */
  document.getElementById('resultBtn').addEventListener('click', function () { window.location.href = 'assignment/result.html'; });

  function applyTheme(t, save) {
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    if (save) { try { localStorage.setItem('rm-theme-choice', t); } catch (e) {} }
  }
  var savedTheme = 'light';
  try { savedTheme = localStorage.getItem('rm-theme-choice') === 'dark' ? 'dark' : 'light'; } catch (e) {}
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  buildGrid();
  render();
})();
