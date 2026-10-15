/* =========================================================================
   개념 정리하기(수학) · 데이터 — concept/organize-math.html 전용
   출처: 테스트 서버 중등 3-2 › 1단원 삼각비 › (1) 삼각비 · 개념 훈련(training 712)
   - 지문 1 = 개념 학습 지문(1008) — concept/learn-math.html 의 구간을 그대로 옮기고 빈칸은 정답으로 채웠다
     요약 = 34562 (빈칸 4 · 정답 __ans: 길이 · a/b · c/b · a/c). 요약 창의 그림은 이 화면에 싣지 않는다
   - 지문 2 = 지문 1009 의 60구간(m_text1009) — 지문 속 빈칸 구간(36162~36164)은 정답이 든 글 그대로
     요약 = 34574 (빈칸 1 · 정답 직각삼각형)
   - 구간: { t: 글, img: 그림 번호(화면에 표시하지 않음) } · { br: 1 } 줄바꿈 · { gap: 1 } 문단 나눔
   - 요약 줄: { t: 글 } · { fill: 채운 답 } · 글 속 $…$ 는 KaTeX 로 그린다
   엔진: scripts/concept-organize.js — 이 파일을 엔진보다 먼저 부른다
   ========================================================================= */
window.RMOrganizeSet = {
  passages: [
    {
      segs: [
        { t: '삼각비란 무엇일까요?' },
        { br: 1 },
        { t: '직각삼각형에서 직각이 아닌 두 내각 중' },
        { t: '한 내각의 크기가 같으면' },
        { t: '나머지 한 내각의 크기도 같습니다.' },
        { t: '그러므로 한 예각의 크기가 같은 모든 직각삼각형은' },
        { t: '서로 닮은 도형입니다.' },
        { gap: 1 },
        { t: '예를 들어, 다음 그림에서 $\\triangle ABC$, $\\triangle ADE$, $\\triangle AFG$는', img: 1 },
        { t: '모두 $\\angle A$의 크기가 같은 직각삼각형이므로' },
        { t: '서로 닮은 도형입니다.', img: 2 },
        { t: '이때, 닮은 도형은 대응변의 길이의 비가 일정하므로' },
        { t: '$\\dfrac{(\\text{높이})}{(\\text{빗변의길이})}=$' },
        { t: '$\\dfrac{\\overline{BC}}{\\overline{AC}}=\\dfrac{\\overline{DE}}{\\overline{AE}}=\\dfrac{\\overline{FG}}{\\overline{AG}}=\\dfrac{3}{5}$,' },
        { t: '$\\dfrac{(\\text{밑변의길이})}{(\\text{빗변의길이})}=$' },
        { t: '$\\dfrac{\\overline{AB}}{\\overline{AC}}=\\dfrac{\\overline{AD}}{\\overline{AE}}=\\dfrac{\\overline{AF}}{\\overline{AG}}=\\dfrac{4}{5}$,' },
        { t: '$\\dfrac{(\\text{높이})}{(\\text{밑변의길이})}=$' },
        { t: '$\\dfrac{\\overline{BC}}{\\overline{AB}}=\\dfrac{\\overline{DE}}{\\overline{AD}}=\\dfrac{\\overline{FG}}{\\overline{AF}}=\\dfrac{3}{4}$이 성립합니다.' },
        { gap: 1 },
        { t: '이와 같이 $\\angle B=$$90^\\circ$인 직각삼각형 $ABC$에서' },
        { t: '$\\angle A$의 크기가 정해지면' },
        { t: '삼각형의 크기에 관계없이 $\\dfrac{\\overline{BC}}{AC}$, $\\dfrac{\\overline{AB}}{AC}$, $\\dfrac{\\overline{BC}}{AB}$의 값은' },
        { t: '각각 일정함을 알 수 있습니다.' },
        { t: '이때, 일정한 비의 값 $\\dfrac{(\\text{높이})}{(\\text{빗변의길이})}=\\dfrac{\\overline{BC}}{\\overline{AC}}$를', img: 3 },
        { t: '$\\angle A$의 사인이라 하고' },
        { t: '이것을 기호로 $\\sin A$와 같이 나타냅니다.' },
        { t: '이때 $\\sin A$의 $A$는 $\\angle A$의 크기를 말합니다.', img: 4 },
        { br: 1 },
        { t: '또 $\\dfrac{(\\text{밑변의길이})}{(\\text{빗변의길이})}=\\dfrac{\\overline{AB}}{\\overline{AC}}$를', img: 5 },
        { t: '$\\angle A$의 코사인이라 하고' },
        { t: '이것을 기호로 $\\cos A$와 같이 나타냅니다.', img: 6 },
        { br: 1 },
        { t: '그리고 $\\dfrac{(\\text{높이})}{(\\text{밑변의길이})}=\\dfrac{\\overline{BC}}{\\overline{AB}}$를', img: 7 },
        { t: '$\\angle A$의 탄젠트라 하고' },
        { t: '이것을 기호로 $\\tan A$와 같이 나타냅니다.', img: 8 },
        { br: 1 },
        { t: '위의 $\\sin A$, $\\cos A$, $\\tan A$를 통틀어 $\\angle A$의 삼각비라고 합니다.' },
        { gap: 1 },
        { t: '이상을 정리하면 $\\angle B=90^\\circ$인 직각삼각형 $ABC$에서', img: 9 },
        { t: '$\\angle A$, $\\angle B$, $\\angle C$의 대변의 길이를' },
        { t: '각각 $a,b,c$라고 하면' },
        { t: '$\\sin A=\\dfrac{(\\text{높이})}{(\\text{빗변의길이})}=\\dfrac{a}{b}$,' },
        { t: '$\\cos A=\\dfrac{(\\text{밑변의길이})}{(\\text{빗변의길이})}=\\dfrac{c}{b}$,' },
        { t: '$\\tan A=\\dfrac{(\\text{높이})}{(\\text{밑변의길이})}=\\dfrac{a}{c}$입니다.', img: 10 },
        { br: 1 },
        { t: '한편, $\\sin A$, $\\cos A$, $\\tan A$를 구할 때' },
        { t: '기준이 되는 각인 $\\angle A$를 ‘기준각’이라고 하며,' },
        { t: '이 기준각에 따라 높이와 밑변은 바뀔 수 있습니다.' },
        { gap: 1 },
        { t: '예를 들어, 다음 그림과 같은 직각삼각형 $ABC$에서', img: 11 },
        { t: '$\\angle A$와 $\\angle B$의 삼각비의 값을 각각 구해봅시다.', img: 12 },
        { br: 1 },
        { t: '$\\angle A$에 대한 삼각비는 $\\sin A=\\dfrac{\\overline{BC}}{\\overline{AB}}=\\dfrac{8}{17}$,' },
        { t: '$\\cos A=\\dfrac{\\overline{AC}}{\\overline{AB}}=$$\\dfrac{15}{17}$,' },
        { t: '$\\tan A=\\dfrac{\\overline{BC}}{\\overline{AC}}=\\dfrac{8}{15}$이고,' },
        { t: '$\\angle B$에 대한 삼각비는 $\\sin B=\\dfrac{\\overline{AC}}{\\overline{AB}}=\\dfrac{15}{17}$,' },
        { t: '$\\cos B=\\dfrac{\\overline{BC}}{\\overline{AB}}=\\dfrac{8}{17}$,' },
        { t: '$\\tan B=\\dfrac{\\overline{AC}}{\\overline{BC}}=\\dfrac{15}{8}$입니다.' },
        { t: '이와 같이 기준각에 따라 삼각비의 값은 달라집니다.' }
      ],
      recap: {
        title: '삼각비의 뜻',
        lines: [
          [ { t: '▶ 삼각비란 직각삼각형에서 두 변의 ' }, { fill: '길이' }, { t: '의 비를 뜻합니다.' } ],
          [ { t: '▶ $\\angle B=90^\\circ$인 직각삼각형 $ABC$에서' } ],
          [ { t: '$\\sin A=$' }, { fill: '$\\dfrac{a}{b}$' }, { t: ', ' }, { t: '$\\cos A=$' }, { fill: '$\\dfrac{c}{b}$' }, { t: ', ' }, { t: '$\\tan A=$' }, { fill: '$\\dfrac{a}{c}$' }, { t: '입니다.' } ]
        ]
      }
    },
    {
      segs: [
        { t: '삼각비를 이용하여 여러 가지 문제를 풀어 볼까요?' },
        { gap: 1 },
        { t: '(1) 직각삼각형에서 밑변, 높이, 빗변 중 어느 한 변의 길이와' },
        { t: '$\\sin $, $\\cos $, $\\tan $ 중 어느 한 삼각비의 값만 알면' },
        { t: '다른 변의 길이를 구할 수 있습니다.' },
        { t: '주어진 삼각비의 값을 이용하여 변의 길이를 구하고,' },
        { t: '피타고라스 정리를 이용하여 나머지 한 변의 길이를 구합니다.' },
        { t: '예를 들어, 다음 그림과 같은 직각삼각형 $ABC$에서', img: 1 },
        { t: '$\\overline{AC}=6$, $\\cos A=\\dfrac{1}{3}$일 때,' },
        { t: '$\\overline{BC}$의 길이를 구해봅시다.', img: 2 },
        { t: '$\\cos A=\\dfrac{\\overline{AB}}{\\overline{AC}}$이므로 $\\dfrac{\\overline{AB}}{6}=\\dfrac{1}{3}$, $3\\overline{AB}=6$, $\\overline{AB}=2$입니다.' },
        { t: '따라서 $\\overline{BC}$의 길이는 피타고라스 정리를 이용하면' },
        { t: '$\\overline{BC}=\\sqrt{6^{2}-2^{2}}=\\sqrt{32}=4\\sqrt{2}$입니다.' },
        { gap: 1 },
        { t: '(2) 직각삼각형에서 한 삼각비의 값을 알면,' },
        { t: '다른 삼각비의 값을 구할 수 있습니다.' },
        { t: '주어진 삼각비의 값을 갖는 직각삼각형을 그린 후' },
        { t: '피타고라스 정리를 이용하여 나머지 한 변의 길이를 구하고,' },
        { t: '이를 이용하여 다른 삼각비의 값을 구합니다.' },
        { t: '예를 들어, $\\tan A=\\dfrac{\\sqrt{3}}{2}$일 때,' },
        { t: '$\\sin A$, $\\cos A$의 값을 각각 구해봅시다.' },
        { t: '(단, $0^\\circ<A<90^\\circ$입니다.)' },
        { t: '$\\tan A=\\dfrac{\\sqrt{3}}{2}$이므로' },
        { t: '다음 그림과 같이 $\\angle B=90^\\circ$, $\\overline{AB}=2$, $\\overline{BC}=\\sqrt{3}$인', img: 3 },
        { t: '직각삼각형 $ABC$를 그릴 수 있습니다.', img: 4 },
        { t: '이때 $\\overline{AC}=\\sqrt{2^{2}+(\\sqrt{3})^{2}}=\\sqrt{4+3}=\\sqrt{7}$입니다.' },
        { t: '따라서 $\\sin A=\\dfrac{\\overline{BC}}{\\overline{AC}}=\\dfrac{\\sqrt{3}}{\\sqrt{7}}=\\dfrac{\\sqrt{21}}{7}$,' },
        { t: '$\\cos A=\\dfrac{\\overline{AB}}{\\overline{AC}}=\\dfrac{2}{\\sqrt{7}}=\\dfrac{2\\sqrt{7}}{7}$입니다.' },
        { gap: 1 },
        { t: '(3) 직각삼각형의 닮음을 이용하여' },
        { t: '삼각비의 값을 구할 수 있습니다.' },
        { t: '닮음인 직각삼각형을 찾은 후,' },
        { t: '크기가 같은 대응각을 찾아 삼각비의 값을 구합니다.' },
        { t: '예를 들어, 다음 그림과 같은 직각삼각형 $ABC$에서', img: 5 },
        { t: '$\\overline{DE}⊥\\overline{BC}$이고 $\\overline{AB}=4$, $\\overline{AC}=3$일 때,' },
        { t: '$\\cos x$의 값을 구해봅시다.', img: 6 },
        { t: '$△ABC$∽$△EBD$($AA$닮음)이므로' },
        { t: '$\\angle BCA=\\angle BDE=x$입니다.' },
        { t: '$△ABC$에서 $\\overline{BC}=\\sqrt{4^{2}+3^{2}}=\\sqrt{25}=5$이므로' },
        { t: '$\\cos x$$=$$\\cos C$$=$$\\dfrac{\\overline{AC}}{\\overline{BC}}=\\dfrac{3}{5}$입니다.' },
        { gap: 1 },
        { t: '(4) 직선이 $x$축과 이루는 예각의 크기를 $a$라고 할 때,' },
        { t: '삼각비의 값을 구할 수 있습니다.' },
        { t: '직선이 $x$축, $y$축과 만나는 점을 구한 다음' },
        { t: '원점을 꼭짓점으로 하는 직각삼각형을 만들어' },
        { t: '변의 길이를 구합니다.' },
        { t: '예를 들어, 다음 그림과 같이 직선 $5x-6y+30=0$이', img: 7 },
        { t: '$x$축의 양의 방향과 이루는 각의 크기를 $a$라 할 때,' },
        { t: '$\\tan a$의 값을 구해봅시다.', img: 8 },
        { t: '직선 $5x-6y+30=0$이 $x$축과 만나는 점을 구하기 위해' },
        { t: '$y=0$을 대입하면 $5x+30=0$, $x=-6$이고,' },
        { t: '$y$축과 만나는 점을 구하기 위해 $x=0$을 대입하면' },
        { t: '$-6y+30=0$, $y=5$입니다.', img: 9 },
        { t: '그림의 직각삼각형 $OAB$에서', img: 10 },
        { t: '$\\overline{OA}=6$, $\\overline{OB}=5$, $\\overline{AB}=\\sqrt{6^{2}+5^{2}}=\\sqrt{61}$이므로' },
        { t: '$\\tan a=\\dfrac{\\overline{OB}}{\\overline{AO}}=\\dfrac{5}{6}$입니다.' },
        { gap: 1 },
        { t: '(5) 입체도형에서도 삼각비를 구할 수 있습니다.' },
        { t: '입체도형에서 삼각비의 값은 평면도형과 마찬가지로' },
        { t: '직각삼각형을 찾아 변의 길이를 이용하여 구할 수 있습니다.' },
        { t: '예를 들어, 다음 그림과 같이 한 모서리의 길이가 $3$cm인 정육면체에서', img: 11 },
        { t: '$\\angle BHF=x$라 할 때, $\\sin x$의 값을 구해봅시다.', img: 12 },
        { t: '직각삼각형 $FGH$에서 $\\overline{FH}=\\sqrt{3^{2}+3^{2}}=\\sqrt{18}=3\\sqrt{2}$이고,' },
        { t: '직각삼각형 $BFH$에서 $\\overline{BH}=\\sqrt{3^{2}+(3\\sqrt{2})^{2}}=\\sqrt{27}=3\\sqrt{3}$입니다.', img: 13 },
        { t: '따라서 직각삼각형 $BFH$에서' },
        { t: '$\\sin x=\\dfrac{3}{3\\sqrt{3}}=\\dfrac{1}{\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}$입니다.', img: 14 }
      ],
      recap: {
        title: '삼각비를 이용한 여러 가지 문제 풀이',
        lines: [
          [ { t: '▶ 문제에 주어진 그림에서 ' }, { fill: '직각삼각형' }, { t: '을 찾아 삼각비와 피타고라스 정리를 이용하여 변의 길이 또는 삼각비를 구합니다.' } ]
        ]
      }
    }
  ]
};
