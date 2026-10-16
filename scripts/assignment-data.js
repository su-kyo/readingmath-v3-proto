/* =========================================================================
   과제 센터 문항 — 풀이 · 해설 · 결과 3화면이 같이 쓴다 (2026-10-16 한 벌로)
   - answer = 정답(객관식은 보기 번호 0부터, 주관식은 문자열) · user = 학생 답(데모)
   - 데모 학생은 4 · 7 · 10번을 틀렸다. 결과 화면의 정오는 answer와 user로 계산한다
   - 분수는 .frac 로 쓴다(RM-PART-04 — 슬래시로 적지 않는다)
   ========================================================================= */
(function () {
  'use strict';

  function scatter() {
    var pts = [[1,2],[2,1],[2,3],[3,3],[3,4],[4,5],[4,3],[5,5],[3,2],[5,4]];
    var ax = 40, ay = 20, w = 250, h = 160, step = 46, dots = '', grid = '';
    pts.forEach(function (p) {
      var cx = ax + p[0] * step * 0.86, cy = ay + h - p[1] * step * 0.62;
      dots += '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="4" class="chart__dot"/>';
    });
    for (var i = 1; i <= 5; i++) {
      var gx = ax + i * step * 0.86; grid += '<line x1="' + gx + '" y1="' + ay + '" x2="' + gx + '" y2="' + (ay + h) + '" class="chart__grid"/>';
      var gy = ay + h - i * step * 0.62; grid += '<line x1="' + ax + '" y1="' + gy + '" x2="' + (ax + w) + '" y2="' + gy + '" class="chart__grid"/>';
    }
    return '<svg viewBox="0 0 320 214" xmlns="http://www.w3.org/2000/svg">' + grid +
      '<line x1="' + ax + '" y1="' + ay + '" x2="' + ax + '" y2="' + (ay + h) + '" stroke-width="2" class="chart__axis"/>' +
      '<line x1="' + ax + '" y1="' + (ay + h) + '" x2="' + (ax + w) + '" y2="' + (ay + h) + '" stroke-width="2" class="chart__axis"/>' + dots +
      '<text x="' + (ax + w) + '" y="' + (ay + h + 16) + '" font-size="11" text-anchor="end" class="chart__label">음악(점)</text>' +
      '<text x="' + (ax - 6) + '" y="' + (ay - 6) + '" font-size="11" class="chart__label">미술(점)</text></svg>';
  }

  var Q = [
    { type: 'mc', lvl: '기본', name: '일차부등식의 해 구하기', text: '부등식 3x − 2 > 7 을 만족하는 자연수 x 중에서 가장 작은 수를 구하시오.', opts: ['2','3','4','5','6'], answer: 2, user: 2, explain: '3x − 2 > 7 → 3x > 9 → x > 3. 이를 만족하는 가장 작은 자연수는 4입니다.' },
    { type: 'short', lvl: '기본', name: '부등식의 활용 — 개수', text: '한 자루에 800원인 연필을 x자루 사려고 합니다. 5000원으로 살 수 있는 연필은 최대 몇 자루입니까?', unit: '자루', answer: '6', user: '6', explain: '800 × x ≤ 5000 → x ≤ 6.25. 자연수 x의 최댓값은 6자루입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 2(x − 1) ≤ 3x + 4 의 해로 옳은 것을 고르시오.', opts: ['x ≥ −6','x ≤ −6','x > −6','x < 6','x ≥ 6'], answer: 0, user: 0, explain: '2(x − 1) ≤ 3x + 4 → 2x − 2 ≤ 3x + 4 → −6 ≤ x, 즉 x ≥ −6 입니다.' },
    { type: 'mc', lvl: '실력', name: '산점도 해석', text: '다음 산점도는 학생 10명의 음악·미술 점수입니다. 미술 점수가 음악 점수보다 높은 학생은 몇 명입니까?', image: scatter, opts: ['2명','3명','4명','5명','6명'], answer: 2, user: 1, explain: '대각선(미술 = 음악) 위쪽에 있는 점의 개수를 세면 됩니다. 조건을 만족하는 학생은 4명입니다.' },
    { type: 'short', lvl: '실력', name: '연립방정식의 해', text: '연립방정식 { x + y = 10, x − y = 2 } 의 해에서 x의 값을 구하시오.', unit: '', answer: '6', user: '6', explain: '두 식을 더하면 2x = 12 → x = 6 입니다.' },
    { type: 'mc', lvl: '기본', name: '방정식의 해와 미지수', text: 'x = 2, y = 1 이 방정식 ax + y = 7 의 해일 때, 상수 a의 값을 고르시오.', opts: ['1','2','3','4','5'], answer: 2, user: 2, explain: 'x = 2, y = 1 을 대입하면 2a + 1 = 7 → 2a = 6 → a = 3 입니다.' },
    { type: 'short', lvl: '심화', name: '부등식의 활용 — 최솟값', text: '연속하는 세 자연수의 합이 60보다 큽니다. 가장 작은 자연수가 될 수 있는 최솟값을 구하시오.', unit: '', answer: '20', user: '18', explain: '세 수를 n, n+1, n+2라 하면 3n + 3 > 60 → n > 19. 자연수 n의 최솟값은 20입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 −2x + 5 < 1 의 해로 옳은 것을 고르시오.', opts: ['x > 2','x < 2','x ≥ 2','x ≤ 2','x > −2'], answer: 0, user: 0, explain: '−2x + 5 < 1 → −2x < −4 → x > 2 (음수로 나누면 부등호 방향이 바뀝니다).' },
    { type: 'short', lvl: '기본', name: '부등식을 만족하는 개수', text: '부등식 <span class="frac frac--sm"><span class="frac__n">x</span><span class="frac__d">2</span></span> + 1 ≤ 4 를 만족하는 자연수 x는 모두 몇 개입니까?', unit: '개', answer: '6', user: '6', explain: '<span class="frac frac--sm"><span class="frac__n">x</span><span class="frac__d">2</span></span> ≤ 3 → x ≤ 6. 자연수 x는 1, 2, 3, 4, 5, 6 으로 모두 6개입니다.' },
    { type: 'mc', lvl: '심화', name: '연립방정식의 활용', text: '두 자연수의 합이 12이고 차가 4일 때, 두 수 중 큰 수를 고르시오.', opts: ['6','7','8','9','10'], answer: 2, user: 1, explain: '두 수를 x, y (x > y)라 하면 x + y = 12, x − y = 4. 더하면 2x = 16 → x = 8 입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 4 − 3x ≥ −5 의 해로 옳은 것을 고르시오.', opts: ['x ≤ 3','x ≥ 3','x < 3','x > 3','x ≤ −3'], answer: 0, user: 0, explain: '4 − 3x ≥ −5 → −3x ≥ −9 → x ≤ 3 입니다.' },
    { type: 'short', lvl: '실력', name: '부등식의 활용 — 최솟값', text: '사과 x개를 3명이 똑같이 나누면 한 명당 5개보다 많습니다. x의 최솟값을 구하시오.', unit: '', answer: '16', user: '16', explain: '<span class="frac frac--sm"><span class="frac__n">x</span><span class="frac__d">3</span></span> > 5 → x > 15. 자연수 x의 최솟값은 16입니다.' },
    { type: 'mc', lvl: '기본', name: '연립방정식의 해', text: '연립방정식 { 2x + y = 8, y = 2 } 에서 x의 값을 고르시오.', opts: ['1','2','3','4','5'], answer: 2, user: 2, explain: 'y = 2 를 대입하면 2x + 2 = 8 → 2x = 6 → x = 3 입니다.' },
    { type: 'short', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 5x − 3 ≤ 2x + 9 의 해가 x ≤ a 일 때, 상수 a의 값을 구하시오.', unit: '', answer: '4', user: '4', explain: '5x − 3 ≤ 2x + 9 → 3x ≤ 12 → x ≤ 4. 따라서 a = 4 입니다.' },
    { type: 'mc', lvl: '실력', name: '일차부등식의 해', text: '일차부등식 0.3x − 0.5 > 0.1 의 해로 옳은 것을 고르시오.', opts: ['x > 2','x < 2','x > 3','x ≥ 2','x > −2'], answer: 0, user: 0, explain: '양변에 10을 곱하면 3x − 5 > 1 → 3x > 6 → x > 2 입니다.' }
  ];

  function isCorrect(q) {
    if (q.user === null || q.user === undefined) return null;
    return q.type === 'short' ? String(q.user).trim() === String(q.answer).trim() : q.user === q.answer;
  }

  window.RMAssign = { Q: Q, isCorrect: isCorrect };
})();
