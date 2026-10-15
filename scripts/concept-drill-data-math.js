/* =========================================================================
   개념 다지기(수학) · 문항 데이터 — concept/drill-math.html 전용
   출처: 테스트 서버 중등 3-2 › 1단원 삼각비 › (1) 삼각비 · 개념 훈련(training 712)
   지문 1(1008)의 34576 · 지문 2(1009)의 34575 · 34612 — 3문제 (정답 = __ans)
   엔진: scripts/learn-drill.js — 이 파일을 엔진보다 먼저 부른다. 필드 설명은 엔진 머리 주석
   ========================================================================= */
window.RMDrillSet = {
  next: 'concept/organize-math.html',
  problems: [
    /* 34576 — 고르기 빈칸 4 (정답 C3 · C2 · C3 · C1). 첫 칸의 선지 √3 뒤에 서버 원문의 보이지 않는 글자(U+200B)가 있어 뺐다 */
    { type: 'blank', id: 34576,
      q: '그림과 같은 직각삼각형 $ABC$에 대하여 다음을 구하세요.',
      img: 'assets/img/concept/math-trig/drill-34576.webp', imgAlt: '∠A가 직각이고 AB=1, AC=2인 직각삼각형 ABC',
      html:
        '<p class="qstep"><span class="qstep__no">(1)</span> $\\overline{BC}$의 길이를 구하세요.<br><span class="dblank"></span></p>' +
        '<p class="qstep"><span class="qstep__no">(2)</span> $\\sin C$, $\\cos C$, $\\tan C$의 값을 구하세요.<br>' +
        '$\\sin C=$<span class="dblank"></span>, $\\cos C=$<span class="dblank"></span>, $\\tan C=$<span class="dblank"></span></p>',
      choices: [
        ['$\\sqrt{3}$', '$\\sqrt{4}$', '$\\sqrt{5}$'],
        ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{5}}{5}$', '$\\dfrac{2\\sqrt{5}}{5}$'],
        ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{5}}{5}$', '$\\dfrac{2\\sqrt{5}}{5}$'],
        ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{5}}{5}$', '$\\dfrac{2\\sqrt{5}}{5}$']
      ],
      answers: ['$\\sqrt{5}$', '$\\dfrac{\\sqrt{5}}{5}$', '$\\dfrac{2\\sqrt{5}}{5}$', '$\\dfrac{1}{2}$'] },

    /* 34575 — 키패드 분수 (정답 K[12, 13]) */
    { type: 'fraction', id: 34575,
      q: '$\\sin A=\\dfrac{5}{13}$일 때, $\\cos A$의 값을 구하세요.',
      answer: { num: '12', den: '13' } },

    /* 34612 — 키패드 (정답 K[24]) */
    { type: 'short-1', id: 34612,
      q: '다음 그림의 직각삼각형 $ABC$에서 $\\overline{AC}=10,\\cos C=\\dfrac{3}{5}$일 때, 직각삼각형 $ABC$의 넓이를 구하세요.',
      img: 'assets/img/concept/math-trig/drill-34612.webp', imgAlt: '∠B가 직각이고 AC=10인 직각삼각형 ABC',
      answer: '24' }
  ]
};
