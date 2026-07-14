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

  function scatter() {
    var pts = [[1,2],[2,1],[2,3],[3,3],[3,4],[4,5],[4,3],[5,5],[3,2],[5,4]];
    var ax = 40, ay = 20, w = 250, h = 160, step = 46, dots = '', grid = '';
    pts.forEach(function (p) {
      var cx = ax + p[0] * step * 0.86, cy = ay + h - p[1] * step * 0.62;
      dots += '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="4" fill="#1E1E1E"/>';
    });
    for (var i = 1; i <= 5; i++) {
      var gx = ax + i * step * 0.86; grid += '<line x1="' + gx + '" y1="' + ay + '" x2="' + gx + '" y2="' + (ay + h) + '" stroke="#E6E6E6"/>';
      var gy = ay + h - i * step * 0.62; grid += '<line x1="' + ax + '" y1="' + gy + '" x2="' + (ax + w) + '" y2="' + gy + '" stroke="#E6E6E6"/>';
    }
    return '<svg viewBox="0 0 320 214" xmlns="http://www.w3.org/2000/svg">' + grid +
      '<line x1="' + ax + '" y1="' + ay + '" x2="' + ax + '" y2="' + (ay + h) + '" stroke="#1E1E1E" stroke-width="2"/>' +
      '<line x1="' + ax + '" y1="' + (ay + h) + '" x2="' + (ax + w) + '" y2="' + (ay + h) + '" stroke="#1E1E1E" stroke-width="2"/>' + dots +
      '<text x="' + (ax + w) + '" y="' + (ay + h + 16) + '" font-size="11" text-anchor="end" fill="#1E1E1E">음악(점)</text>' +
      '<text x="' + (ax - 6) + '" y="' + (ay - 6) + '" font-size="11" fill="#1E1E1E">미술(점)</text></svg>';
  }

  // 15문항: answer=정답, user=학생답(null=미입력). Q4·Q7·Q10 오답.
  var Q = [
    { type: 'mc', lvl: '기본', name: '일차부등식의 해 구하기', text: '부등식 3x − 2 > 7 을 만족하는 자연수 x 중에서 가장 작은 수를 구하시오.', opts: ['2','3','4','5','6'], answer: 2, user: 2, explain: '3x − 2 > 7 → 3x > 9 → x > 3. 이를 만족하는 가장 작은 자연수는 4입니다.' },
    { type: 'short', lvl: '기본', name: '부등식의 활용 — 개수', text: '한 자루에 800원인 연필을 x자루 사려고 합니다. 5000원으로 살 수 있는 연필은 최대 몇 자루입니까?', unit: '자루', answer: '6', user: '6', explain: '800 × x ≤ 5000 → x ≤ 6.25. 자연수 x의 최댓값은 6자루입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 2(x − 1) ≤ 3x + 4 의 해로 옳은 것을 고르시오.', opts: ['x ≥ −6','x ≤ −6','x > −6','x < 6','x ≥ 6'], answer: 0, user: 0, explain: '2(x − 1) ≤ 3x + 4 → 2x − 2 ≤ 3x + 4 → −6 ≤ x, 즉 x ≥ −6 입니다.' },
    { type: 'mc', lvl: '실력', name: '산점도 해석', text: '다음 산점도는 학생 10명의 음악·미술 점수입니다. 미술 점수가 음악 점수보다 높은 학생은 몇 명입니까?', image: scatter, opts: ['2명','3명','4명','5명','6명'], answer: 2, user: 1, explain: '대각선(미술 = 음악) 위쪽에 있는 점의 개수를 세면 됩니다. 조건을 만족하는 학생은 4명입니다.' },
    { type: 'short', lvl: '실력', name: '연립방정식의 해', text: '연립방정식 { x + y = 10, x − y = 2 } 의 해에서 x의 값을 구하시오.', unit: '', answer: '6', user: '6', explain: '두 식을 더하면 2x = 12 → x = 6 입니다.' },
    { type: 'mc', lvl: '기본', name: '방정식의 해와 미지수', text: 'x = 2, y = 1 이 방정식 ax + y = 7 의 해일 때, 상수 a의 값을 고르시오.', opts: ['1','2','3','4','5'], answer: 2, user: 2, explain: 'x = 2, y = 1 을 대입하면 2a + 1 = 7 → 2a = 6 → a = 3 입니다.' },
    { type: 'short', lvl: '심화', name: '부등식의 활용 — 최솟값', text: '연속하는 세 자연수의 합이 60보다 큽니다. 가장 작은 자연수가 될 수 있는 최솟값을 구하시오.', unit: '', answer: '20', user: '18', explain: '세 수를 n, n+1, n+2라 하면 3n + 3 > 60 → n > 19. 자연수 n의 최솟값은 20입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 −2x + 5 < 1 의 해로 옳은 것을 고르시오.', opts: ['x > 2','x < 2','x ≥ 2','x ≤ 2','x > −2'], answer: 0, user: 0, explain: '−2x + 5 < 1 → −2x < −4 → x > 2 (음수로 나누면 부등호 방향이 바뀝니다).' },
    { type: 'short', lvl: '기본', name: '부등식을 만족하는 개수', text: '부등식 x/2 + 1 ≤ 4 를 만족하는 자연수 x는 모두 몇 개입니까?', unit: '개', answer: '6', user: '6', explain: 'x/2 ≤ 3 → x ≤ 6. 자연수 x는 1, 2, 3, 4, 5, 6 으로 모두 6개입니다.' },
    { type: 'mc', lvl: '심화', name: '연립방정식의 활용', text: '두 자연수의 합이 12이고 차가 4일 때, 두 수 중 큰 수를 고르시오.', opts: ['6','7','8','9','10'], answer: 2, user: 1, explain: '두 수를 x, y (x > y)라 하면 x + y = 12, x − y = 4. 더하면 2x = 16 → x = 8 입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 4 − 3x ≥ −5 의 해로 옳은 것을 고르시오.', opts: ['x ≤ 3','x ≥ 3','x < 3','x > 3','x ≤ −3'], answer: 0, user: 0, explain: '4 − 3x ≥ −5 → −3x ≥ −9 → x ≤ 3 입니다.' },
    { type: 'short', lvl: '실력', name: '부등식의 활용 — 최솟값', text: '사과 x개를 3명이 똑같이 나누면 한 명당 5개보다 많습니다. x의 최솟값을 구하시오.', unit: '', answer: '16', user: '16', explain: 'x/3 > 5 → x > 15. 자연수 x의 최솟값은 16입니다.' },
    { type: 'mc', lvl: '기본', name: '연립방정식의 해', text: '연립방정식 { 2x + y = 8, y = 2 } 에서 x의 값을 고르시오.', opts: ['1','2','3','4','5'], answer: 2, user: 2, explain: 'y = 2 를 대입하면 2x + 2 = 8 → 2x = 6 → x = 3 입니다.' },
    { type: 'short', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 5x − 3 ≤ 2x + 9 의 해가 x ≤ a 일 때, 상수 a의 값을 구하시오.', unit: '', answer: '4', user: '4', explain: '5x − 3 ≤ 2x + 9 → 3x ≤ 12 → x ≤ 4. 따라서 a = 4 입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 0.3x − 0.5 > 0.1 의 해로 옳은 것을 고르시오.', opts: ['x > 2','x < 2','x > 3','x ≥ 2','x > −2'], answer: 0, user: 0, explain: '양변에 10을 곱하면 3x − 5 > 1 → 3x > 6 → x > 2 입니다.' }
  ];

  var N = Q.length;
  // 결과 화면 등에서 ?q=인덱스로 특정 문항 진입
  var cur = 0;
  try { var m = location.search.match(/[?&]q=(\d+)/); if (m) cur = Math.min(N - 1, Math.max(0, parseInt(m[1], 10))); } catch (e) {}
  function isCorrect(i) { var q = Q[i]; return q.type === 'short' ? String(q.user).trim() === String(q.answer).trim() : q.user === q.answer; }
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
          if (i === q.answer) { cls = ' opt--correct'; badge = ICO.check; }
          else if (i === q.user) { cls = ' opt--wrong'; badge = ICO.x; }
          return '<div class="opt' + cls + '"><span class="opt__n">' + badge + '</span>' +
            '<span class="opt__t">' + o + '</span></div>';
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
  document.getElementById('scratchBtn').addEventListener('click', function () { showToast('연습장은 준비 중이에요.'); });
  document.getElementById('resultBtn').addEventListener('click', function () { window.location.href = 'assignment-result.html'; });

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem('rm-theme', t); } catch (e) {}
  }
  var savedTheme = 'light';
  try { savedTheme = localStorage.getItem('rm-theme') === 'dark' ? 'dark' : 'light'; } catch (e) {}
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  buildGrid();
  render();
})();
