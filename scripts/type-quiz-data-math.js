/* =========================================================================
   유형 훈련 · 문항 데이터 (수학) — 유형 4장(type/quiz · review · result · training-result)이 같이 부른다
   출처: 테스트 서버 중등 3-2 › 1단원 삼각비 › (1) 삼각비 · 유형 훈련 1차 유형 (training 713, 문항 33080~33135)
   정답은 서버 original_questions 에서 읽고 해설(exp)과 대조했다(10/10 일치).
   - type: mc-text(선지 글 · 수식) · short-1(키패드 한 칸) · fraction(키패드 분수 칸)
   - answer: 객관식은 0부터 센 번호(⑤ → 4) · 키패드는 글자 · 분수는 { num, den }
   - 글 속 $…$ 는 KaTeX 로 그린다(분수는 \dfrac). q · exp 는 HTML 로 넣는다(<sup> 등)
   - img = 문항 그림 · exp 안의 { img } = 해설 그림
   - pick = 해설 화면 데모에서 학습자가 낸 오답(이 키가 있는 문항만 틀림).
     스텝 결과(type-result.js)와 훈련 결과(type-training-result.js)의 데모 정오답도 이 pick 에서 읽는다 — 지금 5 · 8 · 9번 오답
   - limit = 제한 시간(머리줄 「/ 60:00」)
   ========================================================================= */
window.RMTypeData = window.RMTypeData || {};
window.RMTypeData.math = {
  limit: '60:00',
  problems: [
    { id: 33080, type: 'mc-text',
      q: '다음과 같은 직각삼각형에서 $\\tan C\\sin C$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33080.webp',
      options: ['$\\dfrac{25}{156}$', '$\\dfrac{60}{169}$', '$\\dfrac{5}{13}$', '$\\dfrac{12}{13}$', '$\\dfrac{144}{65}$'], answer: 4,
      exp: ['$\\overline{AB}=\\sqrt{13^{2}-5^{2}}=\\sqrt{169-25}=\\sqrt{144}=12$',
        '$∴\\tan C\\sin C=\\dfrac{12}{5}\\times \\dfrac{12}{13}=\\dfrac{144}{65}$'] },

    { id: 33081, type: 'mc-text',
      q: '아래 그림에서 삼각형 $ABC$는 $\\angle B=90^\\circ$인 직각삼각형입니다. $\\overline{AB}=12$, $\\overline{BC}=9$일 때, 다음 중 옳은 것을 고르세요.',
      img: 'assets/img/concept/math-trig/type-33081.webp',
      options: ['$\\sin A=\\dfrac{3}{4}$', '$\\cos A=\\dfrac{3}{5}$', '$\\tan A=\\dfrac{4}{3}$', '$\\sin C=\\dfrac{3}{5}$', '$\\cos C=\\dfrac{3}{5}$'], answer: 4,
      exp: ['$△ABC$는 $\\angle B=90^\\circ$인 직각삼각형이므로',
        '$\\overline{AC}=\\sqrt{12^{2}+9^{2}}=\\sqrt{225}=15$',
        '① $\\sin A=\\dfrac{3}{5}$', '② $\\cos A=\\dfrac{4}{5}$', '③ $\\tan A=\\dfrac{3}{4}$', '④ $\\sin C=\\dfrac{4}{5}$',
        '따라서 옳은 것은 ⑤입니다.'] },

    /* 서버 발문 끝의 「(　　)cm²」 줄은 답 칸 뒤 단위(unit)로 옮겼다 */
    { id: 33082, type: 'short-1',
      q: '다음 그림과 같은 직각삼각형 $ABC$에서 $\\overline{BC}=15$cm, $\\tan A=\\dfrac{5}{4}$일 때, $△ABC$의 넓이를 구하세요.',
      img: 'assets/img/concept/math-trig/type-33082.webp',
      unit: 'cm<sup>2</sup>', answer: '90',
      exp: ['$\\tan A=\\dfrac{\\overline{BC}}{\\overline{AC}}$이므로 $\\dfrac{15}{\\overline{AC}}=\\dfrac{5}{4}$, $5\\overline{AC}=60$',
        '$∴\\overline{AC}=12$(cm)',
        '$∴△ABC=\\dfrac{1}{2}\\times 15\\times 12=90$(cm<sup>2</sup>)'] },

    { id: 33083, type: 'mc-text',
      q: '다음 그림과 같은 직각삼각형 $ABC$에서 $\\sin B=\\dfrac{1}{2}$이고 $\\overline{AB}=3$일 때, $△ABC$의 둘레의 길이를 구하세요.',
      img: 'assets/img/concept/math-trig/type-33083.webp',
      options: ['$3(1+\\sqrt{3})$', '$3(2+\\sqrt{3})$', '$3(3+\\sqrt{3})$', '$3(4+\\sqrt{3})$', '$3(5+\\sqrt{3})$'], answer: 0,
      exp: ['$\\sin B=\\dfrac{\\overline{AC}}{\\overline{BC}}=\\dfrac{1}{2}$이므로 $\\overline{AC}=k$, $\\overline{BC}=2k(k>0)$라 하면 직각삼각형 $ABC$에서 피타고라스 정리에 의하여',
        '$(2k)^{2}=k^{2}+3^{2}$, $3k^{2}=9$, $k^{2}=3$',
        '$∴k=\\sqrt{3}(∵k>0)$',
        '즉, $\\overline{AC}=\\sqrt{3}$, $\\overline{BC}=2\\sqrt{3}$이므로 $△ABC$의 둘레의 길이는 $3+\\sqrt{3}+2\\sqrt{3}=3+3\\sqrt{3}=3(1+\\sqrt{3})$'] },

    { id: 33084, type: 'fraction',
      q: '그림과 같이 $\\angle C=90^\\circ$, $\\overline{AC}=6$인 직각삼각형 $ABC$에서 $\\overline{AD}=\\overline{BD}$일 때, $\\angle ABC=x$, $\\angle ADC=y$라 하면 $\\tan x=\\dfrac{1}{3}$일 때, $\\sin y$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33084.webp',
      answer: { num: '3', den: '5' }, pick: { num: '4', den: '5' },
      exp: ['$△ABC$에서 $\\tan x=\\dfrac{6}{\\overline{BC}}=\\dfrac{1}{3}$',
        '$∴\\overline{BC}=18$',
        '$\\overline{AD}=\\overline{BD}=a$라 하면 $\\overline{CD}=18-$ $a$',
        '$△ADC$에서 $a^{2}=(18-a)^{2}+6^{2}$, $36a=360$',
        '$∴a=10$',
        '따라서 $\\overline{AD}=10$이므로 $\\sin y=\\dfrac{\\overline{AC}}{\\overline{AD}}=\\dfrac{6}{10}=\\dfrac{3}{5}$'] },

    /* 서버 발문의 「$\angle ACB=$(보이지 않는 칸)$y$」 는 수식 하나로 이었다 — 글자는 같다 */
    { id: 33085, type: 'fraction',
      q: '다음 그림과 같은 직각삼각형 $ABC$에서 $\\overline{AC}=25$, $\\overline{AD}=17$이고 $\\angle BAD=x$, $\\angle ACB=y$라 하면 $\\sin x=\\dfrac{8}{17}$입니다. $\\sin y\\tan y$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33085.webp',
      answer: { num: '9', den: '20' },
      exp: ['$\\sin x=\\dfrac{\\overline{BD}}{17}=\\dfrac{8}{17}$에서 $\\overline{BD}=8$',
        '$∴\\overline{AB}=\\sqrt{17^{2}-8^{2}}=15$',
        '$△ABC$에서 $\\overline{BC}=\\sqrt{25^{2}-15^{2}}=20$이므로',
        '$\\sin y=\\dfrac{\\overline{AB}}{\\overline{AC}}=\\dfrac{15}{25}=\\dfrac{3}{5}$, $\\tan y=\\dfrac{\\overline{AC}}{\\overline{BC}}=\\dfrac{15}{20}=\\dfrac{3}{4}$',
        '$∴\\sin y\\tan y=\\dfrac{3}{5}\\times \\dfrac{3}{4}=\\dfrac{9}{20}$'] },

    { id: 33086, type: 'fraction',
      q: '다음 그림과 같은 직사각형 $ABCD$에서 $\\overline{AC}⊥\\overline{DH}$이고 $\\overline{AB}=12$, $\\overline{BC}=9$, $\\angle CDH=\\angle x$일 때, $\\sin x+\\cos x$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33086.webp',
      answer: { num: '7', den: '5' },
      exp: ['$△ACD$와 $△DCH$에서 $\\angle C$는 공통, $\\angle ADC=\\angle DHC=90^\\circ$이므로 $△ACD$∽$△DCH$($AA$ 닮음)',
        '이때 다음 그림과 같이 $\\angle CAD=\\angle CDH=x$라 하면',
        { img: 'assets/img/concept/math-trig/type-33086-2.webp' },
        '$△ACD$에서 $\\overline{AC}=\\sqrt{9^{2}+12^{2}}=\\sqrt{225}=15$이므로 $\\sin x=\\dfrac{\\overline{CD}}{\\overline{AC}}=\\dfrac{12}{15}=\\dfrac{4}{5}$, $\\cos x=\\dfrac{\\overline{AD}}{\\overline{AC}}=\\dfrac{9}{15}=\\dfrac{3}{5}$',
        '$∴\\sin x+\\cos x=\\dfrac{4}{5}+\\dfrac{3}{5}=\\dfrac{7}{5}$'] },

    { id: 33112, type: 'mc-text',
      q: '그림과 같은 직각삼각형 $ABC$의 꼭짓점 $A$에서 변 $BC$에 내린 수선의 발을 $D$라고 할 때, 다음 중 옳은 것을 고르세요.',
      img: 'assets/img/concept/math-trig/type-33112.webp',
      options: ['$\\sin B=\\dfrac{\\overline{AD}}{\\overline{BC}}$', '$\\cos B=\\dfrac{\\overline{AB}}{\\overline{BC}}$', '$\\tan B=\\dfrac{\\overline{AC}}{\\overline{BC}}$',
        '$\\sin C=\\dfrac{\\overline{AC}}{\\overline{BC}}$', '$\\tan C=\\dfrac{\\overline{CD}}{\\overline{BD}}$'], answer: 1, pick: 0,
      exp: ['$△ABC$∽$△DBA$∽$△DAC$($AA$ 닮음)이므로 $\\angle CAD=\\angle B$, $\\angle BAD=\\angle C$',
        { img: 'assets/img/concept/math-trig/type-33112-2.webp' },
        '① $△ABC$에서 $\\sin B=\\dfrac{\\overline{AC}}{\\overline{BC}}$',
        '③ $△ABC$에서 $\\tan B=\\dfrac{\\overline{AC}}{\\overline{AB}}$',
        '④ $△ABC$에서 $\\sin C=\\dfrac{\\overline{AB}}{\\overline{BC}}$',
        '⑤ $△ABC$에서 $\\tan C=\\dfrac{\\overline{AB}}{\\overline{AC}}$',
        '$△ACD$에서 $\\tan C=\\dfrac{\\overline{AD}}{\\overline{CD}}$',
        '$△ABD$에서 $\\tan C=\\dfrac{\\overline{BD}}{\\overline{AD}}$',
        '따라서 옳은 것은 ②입니다.'] },

    { id: 33123, type: 'mc-text',
      q: '다음 그림과 같이 $\\angle B=90^\\circ$인 직각삼각형 $ABC$에서 $\\overline{AC}⊥\\overline{DE}$이고 $\\overline{CD}=8$, $\\overline{CE}=12$일 때, $\\tan x+\\tan y$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33123.webp',
      options: ['$\\dfrac{\\sqrt{5}}{5}$', '$1$', '$\\dfrac{3\\sqrt{5}}{5}$', '$\\dfrac{9\\sqrt{5}}{10}$', '$3\\sqrt{5}$'], answer: 3, pick: 2,
      exp: ['$△DEC$에서 $\\overline{DE}=\\sqrt{12^{2}-8^{2}}=4\\sqrt{5}$이므로 $\\tan y=\\dfrac{4\\sqrt{5}}{8}=\\dfrac{\\sqrt{5}}{2}$',
        { img: 'assets/img/concept/math-trig/type-33123-2.webp' },
        '한편, $\\angle DEC=180^\\circ$ $-90^\\circ-\\angle y=\\angle BAC=\\angle x$이므로 $\\tan x=\\dfrac{8}{4\\sqrt{5}}=\\dfrac{2}{\\sqrt{5}}=\\dfrac{2\\sqrt{5}}{5}$',
        '$∴\\tan x+\\tan y=\\dfrac{\\sqrt{5}}{2}+\\dfrac{2\\sqrt{5}}{5}=\\dfrac{9\\sqrt{5}}{10}$'] },

    { id: 33135, type: 'fraction',
      q: '다음 그림과 같이 직각삼각형 $ABC$에서 $\\overline{AB}⊥\\overline{DE}$이고 $\\overline{AC}=15$, $\\overline{BC}=8$일 때, $\\sin x+\\cos y$의 값을 구하세요.',
      img: 'assets/img/concept/math-trig/type-33135.webp',
      answer: { num: '23', den: '17' },
      exp: ['$\\angle B=90^\\circ-\\angle A=\\angle ADE$, 즉 $\\angle x=\\angle y$',
        '$△ABC$에서 $\\overline{AB}=\\sqrt{8^{2}+15^{2}}=17$이므로 $\\sin x=\\dfrac{15}{17}$, $\\cos y=\\cos x=\\dfrac{8}{17}$',
        '$∴\\sin x+\\cos y=\\dfrac{23}{17}$'] }
  ]
};
