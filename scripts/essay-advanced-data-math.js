/* =========================================================================
   서술형 훈련 3단계 — 실력 키우기 · 수학 콘텐츠 (essay/advanced.html)
   실서비스 training 714 · 서술형 실력 키우기 3문항 (중등 3-2 · 1단원 삼각비 · (1) 삼각비).
   기초 기르기와 같은 모양이라 엔진도 같다 = scripts/essay-basics-v2.js. 글 기호는 scripts/essay-sol.js 머리 주석.
   ========================================================================= */
window.RMEssayFill = {
  title: '실력 키우기',
  next: 'essay/step-result.html',
  problems: [
    {
      "id": 34267,
      "q": "다음 그림과 같은 두 직각삼각형 $ABC$, $AED$에서 $AD=8$, $DE=17$이고 $\\angle B=\\angle AED$일 때, $\\dfrac{\\sin C}{\\sin B}$의 값을 구해 보세요.\n [IMG assets/img/concept/math-trig/essay3-34267.webp]",
      "sol": "$△ABC$와 $△AED$에서 ${[1]}는 공통, $\\angle B=$${[2-]}이므로 $△ABC$∽$△AED$(${[3]}닮음)입니다.\n$△AED$에서 $AD=$${[4]}, $DE=$${[4]}, $AE=$${[4]}이므로\n​$\\sin B=\\sin $(#{[2-1]})$=$${[4]/[4]}, $\\sin C=\\sin $(${[5-]})$=$${[4]/[4]}입니다.\n따라서 $\\dfrac{\\sin C}{\\sin B}$의 값은 ${[6]/[6]}입니다.",
      "blanks": [
        { "type": "choice", "choices": ["$\\angle A$", "$\\angle B$", "$\\angle C$"], "answer": "$\\angle A$" },
        { "type": "choice", "choices": ["$\\angle ADE$", "$\\angle AED$", "$\\angle DAE$"], "answer": "$\\angle AED$" },
        { "type": "choice", "choices": ["$SSS$", "$SAS$", "$AA$"], "answer": "$AA$" },
        { "type": "key", "answer": ["8", "17", "15", ["8", "17"], ["15", "17"]] },
        { "type": "choice", "choices": ["$\\angle ADE$", "$\\angle AED$", "$\\angle DAE$"], "answer": "$\\angle ADE$" },
        { "type": "key", "answer": [["15", "8"]] }
      ]
    },
    {
      "id": 34268,
      "q": "다음 그림과 같이 $\\angle C=90^\\circ$인 직각삼각형 $ABC$에서 $AD=BD$이고, $AC=2$입니다. $\\angle ADC=x$, $\\angle B=y$라 하면 $\\sin x=\\dfrac{\\sqrt{2}}{2}$일 때, $\\tan y$의 값을 구해 보세요.\n [IMG assets/img/concept/math-trig/essay3-34268.webp]",
      "sol": "$△ADC$에서 $\\sin x=\\dfrac{\\sqrt{2}}{2}$이므로 $AD=$${[1]}입니다.\n피타고라스 정리에 의해 $DC=$${[2]}이고 $BD=$${[3]}이므로 $BC=$${[4-]}입니다.\n따라서 $△ABC$에서 $\\tan y=$${[5-]}$=$${[6-]}입니다.",
      "blanks": [
        { "type": "choice", "choices": ["$\\sqrt{2}$", "$2\\sqrt{2}$", "$4\\sqrt{2}$"], "answer": "$2\\sqrt{2}$" },
        { "type": "key", "answer": ["2"] },
        { "type": "choice", "choices": ["$AC$", "$AD$", "$DC$"], "answer": "$AD$" },
        { "type": "choice", "choices": ["$2\\sqrt{2}+2$", "$4\\sqrt{2}+2$", "$2\\sqrt{2}-2$"], "answer": "$2\\sqrt{2}+2$" },
        { "type": "choice", "choices": ["$\\dfrac{4\\sqrt{2}+2}{2}$", "$\\dfrac{2}{2\\sqrt{2}+2}$", "$\\dfrac{2}{2\\sqrt{2}-2}$"], "answer": "$\\dfrac{2}{2\\sqrt{2}+2}$" },
        { "type": "choice", "choices": ["$1-\\sqrt{2}$", "$\\sqrt{2}+1$", "$\\sqrt{2}-1$"], "answer": "$\\sqrt{2}-1$" }
      ]
    },
    {
      "id": 34269,
      "q": "다음 그림과 같이 길이가 $2\\sqrt{5}$인 $AB$를 지름으로 하는 원에 내접하는 직각삼각형 $ABC$가 있습니다. $2\\sin A=\\cos A$가 성립할 때, $△ABC$의 넓이를 구해 보세요.\n [IMG assets/img/concept/math-trig/essay3-34269.webp]",
      "sol": "${[1]}$\\sin A=\\cos A$이므로 #{[1-1]}$\\times \\dfrac{BC}{AB}=$${[2-]}, 즉 $BC=x$라 하면 $AC=$${[1]}$x$입니다.\n$△ABC$에서 피타고라스 정리에 의하여 ${[3]}$x^{2}+x^{2}=$${[3]}, 즉 $x=$${[3]}입니다.\n따라서 $BC=$${[4]}, $AC=$${[4]}이므로 $△ABC$의 넓이는 ${[4]}입니다.",
      "blanks": [
        { "type": "key", "answer": ["2", "2"] },
        { "type": "choice", "choices": ["$\\dfrac{AC}{AB}$", "$\\dfrac{AB}{AC}$", "$\\dfrac{CB}{AC}$"], "answer": "$\\dfrac{AC}{AB}$" },
        { "type": "key", "answer": ["4", "20", "2"] },
        { "type": "key", "answer": ["2", "4", "4"] }
      ]
    }
  ]
};
