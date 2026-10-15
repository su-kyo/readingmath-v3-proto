/* =========================================================================
   기초 연산(수학 STEP 2) · 문항 데이터 — concept/basic-ops.html 전용
   출처: 테스트 서버 중등 3-2 › 1단원 삼각비 › (1) 삼각비 · 개념 훈련 STEP 2 (training 712, 문항 34452~34465)
   14문제 모두 그림 + 계산기 입력. 정답은 서버 정답(__ans.m_ops) — 그림으로 다시 풀어 14/14 맞는 것을 확인했다(2026-10-15).
   분수 답은 fraction(분자 num · 분모 den). 34456 발문 끝 마침표가 없는 것은 원문 그대로.
   엔진: scripts/learn-basic-ops.js — 이 파일을 엔진보다 먼저 부른다
   ========================================================================= */
window.RMOpsSet = {
  title: '기초 연산',
  next: 'shared/step-result.html?step=ops',
  problems: [
    { type: 'short-1', id: 34452, q: '다음 직각삼각형에서 $x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34452.webp', imgAlt: '직각삼각형 — 빗변 13, 높이 5, 밑변 x', answer: '12' },
    { type: 'short-1', id: 34453, q: '다음 직각삼각형에서 $x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34453.webp', imgAlt: '직각삼각형 — 빗변 2√5, 한 변 4, 다른 변 x', answer: '2' },
    { type: 'fraction', id: 34454, q: '다음 직각삼각형에서 $\\sin A+\\cos C$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34454.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AB=5, BC=12, AC=13', answer: { num: '24', den: '13' } },
    { type: 'fraction', id: 34455, q: '다음 직각삼각형에서 $\\sin C+\\cos A$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34455.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AB=2, BC=√5, AC=3', answer: { num: '4', den: '3' } },
    { type: 'fraction', id: 34456, q: '다음 직각삼각형에서 $\\sin A+\\tan A$의 값을 구하세요',
      img: 'assets/img/concept/math-trig/ops-34456.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AB=15, BC=8, AC=17', answer: { num: '256', den: '255' } },
    { type: 'fraction', id: 34457, q: '다음 직각삼각형에서 $\\sin A$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34457.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AB=6, AC=10', answer: { num: '4', den: '5' } },
    { type: 'short-1', id: 34458, q: '$\\cos A=\\dfrac{\\sqrt{2}}{2}$일 때, $y^{2}$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34458.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AC=6, AB=x, BC=y', answer: '18' },
    { type: 'short-1', id: 34459, q: '$\\tan A=\\dfrac{\\sqrt{5}}{3}$일 때, $x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34459.webp', imgAlt: '∠B가 직각인 직각삼각형 ABC — AB=6√5, BC=x, AC=y', answer: '10' },
    { type: 'fraction', id: 34460, q: '$\\cos A$의 값이 다음과 같을 때, $\\sin A$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34460.webp', imgAlt: 'cos A = 12/13', answer: { num: '5', den: '13' } },
    { type: 'fraction', id: 34461, q: '$\\cos A$의 값이 다음과 같을 때, $\\sin A$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34461.webp', imgAlt: 'cos A = √7/4', answer: { num: '3', den: '4' } },
    { type: 'fraction', id: 34462, q: '다음 직각삼각형에서 $\\sin x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34462.webp', imgAlt: '직각삼각형 ABC 안의 직각삼각형 ADE — AB=12, AC=15, ∠ADE=x', answer: { num: '4', den: '5' } },
    { type: 'short-1', id: 34463, q: '다음 직각삼각형에서 $\\tan x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34463.webp', imgAlt: '직각삼각형 ABC 안의 DE∥BC — AB=AC=5, ∠ADE=x', answer: '1' },
    { type: 'fraction', id: 34464, q: '다음 도형에서 $\\sin x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34464.webp', imgAlt: '직육면체 — FG=GH=4, DH=7, ∠CEG=x', answer: { num: '7', den: '9' } },
    { type: 'short-1', id: 34465, q: '다음 도형에서 $\\tan x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/ops-34465.webp', imgAlt: '직육면체 — FG=6, GH=8, DH=10, ∠AGE=x', answer: '1' }
  ]
};
