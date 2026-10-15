/* =========================================================================
   서술형 훈련 2단계 — 기본 다지기 · 수학 콘텐츠
   essay/drill-math.html(엔진 essay-drill-v2.js) · essay/drill-review-math.html(엔진 essay-drill-review.js)이 같이 부른다.
   실서비스 training 714 · 서술형 기본 다지기 3문항 (중등 3-2 · 1단원 삼각비 · (1) 삼각비).
   글 기호와 빈칸 모양은 scripts/essay-sol.js 머리 주석.
   · 풀이(sol)의 앞부분 = 빈칸 맞추기, 순서 맞추기 빈칸(order)이 처음 나오는 문단부터 = 순서 맞추기.
   · order.answer(정답 순서)는 실서비스 정답(O[1…n])에 순서가 없어 앞부분의 모범 문장과 대조해 정했다.
   · my = 해설 화면의 데모 학생 답(적은 칸만 오답 · 나머지는 정답). 키 = '빈칸번호-칸번호'.
   · 그림 주소: 원본 번호는 「풀이 그림 먼저, 문제 그림 마지막」 순서다(34216 · 34219). 실서비스 그림 크기와 대조해 문제 · 풀이 자리를 맞췄다.
   ========================================================================= */
window.RMEssayDrill = {
  title: '기본 다지기',
  next: 'essay/step-result.html',
  problems: [
    {
      "id": 34216,
      "q": "다음 그림과 같은 $△ABC$에서// $\\overline{AC}=15$cm이고,// $\\sin B=$\u200b$\\dfrac{3}{5}$, $\\sin C=$\u200b$\\dfrac{4}{5}$일 때,// ** $\\overline{BC}$의 길이**를 구해 보세요.//\n [IMG assets/img/concept/math-trig/essay2-34216-3.webp]",
      "sol": "다음 그림과 같이 $△ABC$의 점 $A$에서 $BC$에 내린 수선의 발을 $H$라 합니다.//\n [IMG assets/img/concept/math-trig/essay2-34216.webp] //$\\sin C=\\dfrac{4}{5}=$${[1]}이므로//\n$AH=12$cm이고, $\\sin B=\\dfrac{3}{5}=\\dfrac{12}{AB}$이므로 $AB=$${[2]}cm입니다.//\n피타고라스 정리에 의해 $BH=$${[3-]}//$=16$(cm), $HC=\\sqrt{15^{2}-12^{2}}=9$(cm)입니다.//\n따라서 $BC$의 길이는 $BH+HC=$${[4]}(cm)입니다.//\n${[5]} ${[5]} ${[5]} ${[5]} ${[5]}//\n [IMG assets/img/concept/math-trig/essay2-34216-2.webp] //$\\sin C=\\dfrac{4}{5}=\\dfrac{AH}{15}$이므로//\n${[6]} ${[6]} ${[6]} ${[6]} ${[6]} ${[6]}//\n피타고라스 정리에 의해 $BH=$${[7]} ${[7]} ${[7]} ${[7]} ${[7]}//\n${[8]} ${[8]} ${[8]} ${[8]}",
      "blanks": [
        { "type": "choice", "choices": ["$\\dfrac{BC}{AB}$", "$\\dfrac{AH}{15}$", "$\\dfrac{BC}{15}$"], "answer": "$\\dfrac{AH}{15}$" },
        { "type": "choice", "choices": ["$15$", "$20$", "$25$"], "answer": "$20$" },
        { "type": "choice", "choices": ["$\\sqrt{20^{2}+12^{2}}$", "$\\sqrt{20^{2}-12^{2}}$", "$\\sqrt{20^{2}-15^{2}}$"], "answer": "$\\sqrt{20^{2}-12^{2}}$" },
        { "type": "choice", "choices": ["$20$", "$25$", "$28$"], "answer": "$25$" },
        { "type": "order", "pieces": ["수선의 발을", "$\\overline{BC}$에 내린", "$△ABC$의 점 $A$에서", "다음 그림과 같이", "$H$라 합니다."],
          "answer": ["다음 그림과 같이", "$△ABC$의 점 $A$에서", "$\\overline{BC}$에 내린", "수선의 발을", "$H$라 합니다."] },
        { "type": "order", "pieces": ["$\\dfrac{12}{\\overline{AB}}$이므로", "$\\overline{AB}=$", "$12$cm이고,", "$\\sin B=$\u200b$\\dfrac{3}{5}$\u200b$=$", "$\\overline{AH}=$", "$20$cm입니다."],
          "answer": ["$\\overline{AH}=$", "$12$cm이고,", "$\\sin B=$\u200b$\\dfrac{3}{5}$\u200b$=$", "$\\dfrac{12}{\\overline{AB}}$이므로", "$\\overline{AB}=$", "$20$cm입니다."] },
        { "type": "order", "pieces": ["$HC=$", "$16$(cm),", "$9$(cm)입니다.", "$\\sqrt{15^{2}-12^{2}}=$", "$\\sqrt{20^{2}-12^{2}}=$"],
          "answer": ["$\\sqrt{20^{2}-12^{2}}=$", "$16$(cm),", "$HC=$", "$\\sqrt{15^{2}-12^{2}}=$", "$9$(cm)입니다."] },
        { "type": "order", "pieces": ["$BH+HC=$", "따라서", "$BC$의 길이는", "$25$(cm)입니다."],
          "answer": ["따라서", "$BC$의 길이는", "$BH+HC=$", "$25$(cm)입니다."] }
      ],
      "my": { "2-1": "$25$", "8-2": "$BH+HC=$", "8-3": "$BC$의 길이는" }
    },
    {
      "id": 34217,
      "q": "이차방정식 $64x^{2}-240x+225=0$의 근이// $\\tan A$의 값과 같을 때,// ** $\\dfrac{\\cos A}{1-\\sin A}$의 값**을 구해 보세요.//",
      "sol": "이차방정식 $64x^{2}-240x+225=0$에서 $(8x-15)^{2}=0$, 즉 $x=\\dfrac{15}{8}$이므로 $\\tan A=$${[1]}입니다.//\n이때 $\\angle B=90^\\circ$, $AB=8$, $BC=15$인 직각삼각형 $ABC$는 다음 그림과 같습니다.\n${[2---]}//\n피타고라스 정리에 의해 $AC=\\sqrt{8^{2}+15^{2}}=17$이므로 $\\sin A=$${[3]},// $\\cos A=\\dfrac{8}{17}$입니다.//\n따라서 $\\dfrac{\\cos A}{1-\\sin A}$의 값은 $\\dfrac{8}{17}\\div (1-\\dfrac{15}{17})=\\dfrac{8}{17}\\div $${[4]}$=$//$4$입니다.//\n${[5]} ${[5]} ${[5]} ${[5]} ${[5]}//\n${[6]} ${[6]} ${[6]} ${[6]} ${[6]}//\n [IMG assets/img/concept/math-trig/essay2-34217.webp] //\n${[7]} ${[7]} ${[7]} ${[7]} ${[7]}//\n${[8]} ${[8]} ${[8]} ${[8]} ${[8]}//",
      "blanks": [
        { "type": "choice", "choices": ["$\\dfrac{8}{15}$", "$\\dfrac{7}{15}$", "$\\dfrac{15}{8}$"], "answer": "$\\dfrac{15}{8}$" },
        { "type": "choice", "choices": ["[IMG assets/img/concept/math-trig/essay2-34217-2.webp]", "[IMG assets/img/concept/math-trig/essay2-34217-3.webp]", "[IMG assets/img/concept/math-trig/essay2-34217-4.webp]"], "answer": "[IMG assets/img/concept/math-trig/essay2-34217-3.webp]" },
        { "type": "choice", "choices": ["$\\dfrac{2}{17}$", "$\\dfrac{8}{17}$", "$\\dfrac{15}{17}$"], "answer": "$\\dfrac{15}{17}$" },
        { "type": "choice", "choices": ["$\\dfrac{2}{17}$", "$\\dfrac{8}{17}$", "$\\dfrac{15}{17}$"], "answer": "$\\dfrac{2}{17}$" },
        { "type": "order", "pieces": ["$64x^{2}-240x+225=0$에서", "$(8x-15)^{2}=0$,", "즉 $x=\\dfrac{15}{8}$이므로", "이차방정식", "$\\tan A=\\dfrac{15}{8}$입니다."],
          "answer": ["이차방정식", "$64x^{2}-240x+225=0$에서", "$(8x-15)^{2}=0$,", "즉 $x=\\dfrac{15}{8}$이므로", "$\\tan A=\\dfrac{15}{8}$입니다."] },
        { "type": "order", "pieces": ["다음 그림과 같습니다.", "$BC=15$인", "이때 $\\angle B=90^\\circ$,", "직각삼각형 $ABC$는", "$AB=8$,"],
          "answer": ["이때 $\\angle B=90^\\circ$,", "$AB=8$,", "$BC=15$인", "직각삼각형 $ABC$는", "다음 그림과 같습니다."] },
        { "type": "order", "pieces": ["피타고라스 정리에 의해", "$AC=$", "$\\sqrt{8^{2}+15^{2}}=17$이므로", "$\\sin A=\\dfrac{15}{17}$,", "$\\cos A=\\dfrac{8}{17}$입니다."],
          "answer": ["피타고라스 정리에 의해", "$AC=$", "$\\sqrt{8^{2}+15^{2}}=17$이므로", "$\\sin A=\\dfrac{15}{17}$,", "$\\cos A=\\dfrac{8}{17}$입니다."] },
        { "type": "order", "pieces": ["$\\dfrac{8}{17}\\div (1-\\dfrac{15}{17})=$", "$\\dfrac{8}{17}\\div \\dfrac{2}{17}=$", "따라서", "$4$입니다.", "$\\dfrac{\\cos A}{1-\\sin A}$의 값은"],
          "answer": ["따라서", "$\\dfrac{\\cos A}{1-\\sin A}$의 값은", "$\\dfrac{8}{17}\\div (1-\\dfrac{15}{17})=$", "$\\dfrac{8}{17}\\div \\dfrac{2}{17}=$", "$4$입니다."] }
      ],
      "my": {}
    },
    {
      "id": 34219,
      "q": "다음 그림의 직사각형 $ABCD$에서// $\\overline{AC}⊥\\overline{DH}$이고// $\\overline{AB}=5$, $\\overline{BC}=12$입니다.// $\\angle ADH=x$일 때,// ** $\\sin x+\\cos x$의 값**을 구해 보세요.//\n [IMG assets/img/concept/math-trig/essay2-34219-3.webp]",
      "sol": "$△ACD$와 $△ADH$에서 $\\angle A$는 공통, ${[1-]}$=\\angle AHD=90^\\circ$이므로// $△ACD$∽$△ADH$($AA$ 닮음)입니다.//\n그러므로 다음 그림과 같이 $\\angle DCH=$${[2-]}$=x$입니다.//\n [IMG assets/img/concept/math-trig/essay2-34219.webp] //$△ACD$에서 피타고라스 정리에 의해 $AC=$${[3-]}$=$//$\\sqrt{169}=13$입니다.//\n따라서 $\\sin x=\\dfrac{12}{13}$, $\\cos x=\\dfrac{5}{13}$로 $\\sin x+\\cos x$의 값은 ${[4]}입니다.//\n${[5]} ${[5]} ${[5]} ${[5]} ${[5]}//\n${[6]} ${[6]} ${[6]} ${[6]}//\n [IMG assets/img/concept/math-trig/essay2-34219-2.webp] //$△ACD$에서 ${[7]} ${[7]} ${[7]} ${[7]} ${[7]}//\n${[8]} ${[8]} ${[8]} ${[8]} ${[8]}//",
      "blanks": [
        { "type": "choice", "choices": ["$\\angle ABC$", "$\\angle ADC$", "$\\angle DHC$"], "answer": "$\\angle ADC$" },
        { "type": "choice", "choices": ["$\\angle ADH$", "$\\angle CDH$", "$\\angle DAH$"], "answer": "$\\angle ADH$" },
        { "type": "choice", "choices": ["$\\sqrt{5^{2}+12^{2}}$", "$\\sqrt{12^{2}-5^{2}}$", "$\\sqrt{12^{2}+x^{2}}$"], "answer": "$\\sqrt{5^{2}+12^{2}}$" },
        { "type": "choice", "choices": ["$\\dfrac{5}{12}$", "$\\dfrac{7}{13}$", "$\\dfrac{17}{13}$"], "answer": "$\\dfrac{17}{13}$" },
        { "type": "order", "pieces": ["$\\angle A$는 공통,", "$△ACD$∽$△ADH$", "$△ACD$와 $△ADH$에서", "$\\angle ADC=\\angle AHD=90^\\circ$이므로", "($AA$ 닮음)입니다."],
          "answer": ["$△ACD$와 $△ADH$에서", "$\\angle A$는 공통,", "$\\angle ADC=\\angle AHD=90^\\circ$이므로", "$△ACD$∽$△ADH$", "($AA$ 닮음)입니다."] },
        { "type": "order", "pieces": ["$\\angle ADH=x$입니다.", "$\\angle DCH=$", "다음 그림과 같이", "그러므로"],
          "answer": ["그러므로", "다음 그림과 같이", "$\\angle DCH=$", "$\\angle ADH=x$입니다."] },
        { "type": "order", "pieces": ["$AC=$", "피타고라스 정리에 의해", "13입니다.", "$\\sqrt{169}=$", "$\\sqrt{5^{2}+12^{2}}=$"],
          "answer": ["피타고라스 정리에 의해", "$AC=$", "$\\sqrt{5^{2}+12^{2}}=$", "$\\sqrt{169}=$", "13입니다."] },
        { "type": "order", "pieces": ["$\\sin x=\\dfrac{12}{13}$,", "따라서", "$\\sin x+\\cos x$의 값은", "$\\cos x=\\dfrac{5}{13}$이므로", "$\\dfrac{17}{13}$입니다."],
          "answer": ["따라서", "$\\sin x=\\dfrac{12}{13}$,", "$\\cos x=\\dfrac{5}{13}$이므로", "$\\sin x+\\cos x$의 값은", "$\\dfrac{17}{13}$입니다."] }
      ],
      "my": { "3-1": "$\\sqrt{12^{2}-5^{2}}$" }
    }
  ]
};
