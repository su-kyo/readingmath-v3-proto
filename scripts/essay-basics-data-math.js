/* =========================================================================
   서술형 훈련 1단계 — 기초 기르기 · 수학 콘텐츠 (essay/basics-math.html)
   실서비스 training 714 · 서술형 기초 기르기 2문항 (중등 3-2 · 1단원 삼각비 · (1) 삼각비).
   글 기호와 빈칸 모양은 scripts/essay-sol.js 머리 주석. 엔진 = scripts/essay-basics-v2.js.
   · 그림 주소: 원본 번호는 「풀이 그림 먼저, 문제 그림 마지막」 순서다(34205 · 34206). 실서비스 그림 크기와 대조해 문제 · 풀이 자리를 맞췄다.
   ========================================================================= */
window.RMEssayFill = {
  title: '기초 기르기',
  next: 'essay/step-result.html',
  problems: [
    {
      "id": 34205,
      "q": "다음 그림에서 두 점 $A$, $B$는 각각 직선 $y$\u200b$=mx+n$과 $x$축, $y$축의 교점이고 원점 $O$에서 $\\overline{AB}$에 내린 수선의 발을 $H$, $\\angle BAO$\u200b$=a$라 합니다. $\\overline{OH}$\u200b$=6$, $\\tan a$\u200b$=\\dfrac{12}{5}$일 때, 양수 $m$, $n$에 대하여 $m+n$의 값을 구해 보세요.\n [IMG assets/img/concept/math-trig/essay1-34205-2.webp]",
      "sol": "이 문제를 어떻게 해결할까요?\n${[1-----]}\n이 문제는 양수 $m$, $n$에 대하여 ${[2--]}을 구하는 문제예요.\n삼각비를 이용하여 밑변과 높이의 ${[3]}을(를) 구하고 미지수 $k$를 사용하여 $\\overline{OA}$, $\\overline{OB}$의 길이를 구해요.\n [IMG assets/img/concept/math-trig/essay1-34205.webp] \n$△ABC$에서 $\\sin A=\\dfrac{a}{b}$, $\\cos A=\\dfrac{c}{b}$, $\\tan A=$${[4]}\n$\\overline{AB}$의 길이를 미지수 $k$를 사용하여 나타내요.\n$\\tan a=$${[5]}$=$${[6]/[6]}이므로 $\\overline{OA}=5k$, $\\overline{OB}=$${[6]}$k(k>0)$으로 놓으면 직각삼각형 $AOB$에서 피타고라스 정리에 의해 \n$\\overline{AB}=$${[7---]}$=$${[6]}$k(k>0$)입니다.\n미지수 $k$의 값을 구해요.\n직각삼각형 $AOB$에서 $\\overline{OA}\\times \\overline{OB}=\\overline{AB}\\times \\overline{OH}$이므로\n$5k\\times $#{[6-2]} $k=$#{[6-3]} $k\\times $${[8]}, 즉 $k=$${[8]/[8]}($k>0)$입니다.\n그러므로 $\\overline{OA}=$${[8]}$k=$${[8]/[8]}, $\\overline{OB}=$#{[6-2]}$k=$${[8]/[8]}입니다.\n직선의 방정식을 구해요.\n$A($#{[8-4]} $,0)$, $B(0,$ #{[8-5]}$)$이므로 기울기는 ${[9]/[9]}$\\div $${[9]/[9]}$=$${[9]/[9]}, $y$절편은 ${[9]/[9]}, 즉 직선의 방정식은 $y=$#{[9-3]}$x+$#{[9-4]}입니다.\n따라서 $m=$${[10]/[10]}, $n=$${[10]/[10]}이므로 #{[2-1]}은 ${[10]}입니다.",
      "blanks": [
        { "type": "choice", "choices": ["자를 이용하여 길이를 재어봐요.", "직각삼각형의 외심이 $H$임을 이용해요.", "삼각형의 변의 길이의 비를 이용해요."], "answer": "삼각형의 변의 길이의 비를 이용해요." },
        { "type": "choice", "choices": ["$mn$의 값", "$m+n$의 값", "$m-n$의 값"], "answer": "$m+n$의 값" },
        { "type": "choice", "choices": ["비율", "길이", "차"], "answer": "비율" },
        { "type": "choice", "choices": ["$\\dfrac{c}{a}$", "$\\dfrac{a}{c}$", "$\\dfrac{b}{c}$"], "answer": "$\\dfrac{a}{c}$" },
        { "type": "choice", "choices": ["$\\dfrac{AH}{OH}$", "$\\dfrac{AB}{OA}$", "$\\dfrac{OB}{OA}$"], "answer": "$\\dfrac{OB}{OA}$" },
        { "type": "key", "answer": [["12", "5"], "12", "13"] },
        { "type": "choice", "choices": ["$\\sqrt{(5k)^{2}+(12k)^{2}}$", "$\\sqrt{(12k)^{2}-(5k)^{2}}$", "$\\sqrt{(10k)^{2}+(24k)^{2}}$"], "answer": "$\\sqrt{(5k)^{2}+(12k)^{2}}$" },
        { "type": "key", "answer": ["6", ["13", "10"], "5", ["13", "2"], ["78", "5"]] },
        { "type": "key", "answer": [["78", "5"], ["13", "2"], ["12", "5"], ["78", "5"]] },
        { "type": "key", "answer": [["12", "5"], ["78", "5"], "18"] }
      ]
    },
    {
      "id": 34206,
      "q": "다음 그림과 같이 $\\angle B$\u200b$=\\angle E$\u200b$=90^\\circ$인 두 직각삼각형 $ABC$, $DEC$에서 세 점 $B$, $C$, $D$는 한 직선 위에 있습니다. $\\overline{BC}$\u200b$=\\overline{CD}$\u200b$=15$이고 $\\sin x$ $=\\dfrac{3}{5}$일 때, $\\tan y$의 값을 구해 보세요.\n [IMG assets/img/concept/math-trig/essay1-34206-2.webp]",
      "sol": "이 문제를 어떻게 해결할까요?\n${[1-----]}\n이 문제는 ${[2]}의 값을 구하는 문제예요.\n$△ABC$에서 $\\sin x$의 값을 이용하여 ${[3]}의 길이를 구하고 닮음과 피타고라스의 정리를 이용하여 $△DEC$의 각 변의 길이를 구해요.\n#{[3-1]}의 길이를 구해요.\n$△ABC$에서 $\\sin x=$${[4-]}$=$${[5]/[5]}, 이때 $\\overline{BC}=$${[5]}이므로 #{[3-1]}$=$${[5]}입니다.\n닮음을 이용하여 $\\overline{EC}$의 길이를 구해요.\n$△ABC$와 $△DEC$에서 $\\angle B=\\angle E=$${[6]}$^\\circ$, $\\angle ACE=\\angle DCE$(맞꼭지각)이므로 $△ABD$∽$△CED$(${[7]}닮음)입니다.\n그러므로 변의 길이를 이용한 비례식을 세우면\n$\\overline{AC} :\\overline{DC}=$${[8]}$: \\overline{EC}$\n [IMG assets/img/concept/math-trig/essay1-34206.webp] #{[5-3]}$:$${[6]}$=$#{[5-2]} $:\\overline{EC}$#{[5-3]}$\\overline{EC}=$${[6]}, 즉 $\\overline{EC}=$${[6]}입니다.\n$\\overline{DE}$의 길이를 구해요.\n$△DEC$에서 $\\overline{DC}=$#{[6-2]}, $\\overline{EC}=$#{[6-4]}이므로 피타고라스의 정리에 의해 $\\overline{DE}=$${[9]}입니다.\n#{[2-1]}의 값을 구해요.\n직각삼각형 $ADE$에서 #{[2-1]}$=$${[10-]}이고, $\\overline{AE}=\\overline{AC}+\\overline{EC}=$${[11]}$+$#{[6-4]}$=$${[11]}, $\\overline{DE}=$#{[9-1]}입니다.\n따라서 #{[2-1]}의 값은 ${[12]/[12]}입니다.",
      "blanks": [
        { "type": "choice", "choices": ["합동인 두 삼각형을 찾아 삼각비를 구해요.", "$\\sin x$의 값을 이용해 각 변의 길이를 구해요.", "$△ABC$의 빗변의 길이를 이용해요."], "answer": "$\\sin x$의 값을 이용해 각 변의 길이를 구해요." },
        { "type": "choice", "choices": ["$\\sin y$", "$\\tan x$", "$\\tan y$"], "answer": "$\\tan y$" },
        { "type": "choice", "choices": ["$AB$", "$\\overline{AC}$", "$\\overline{BC}$"], "answer": "$\\overline{AC}$" },
        { "type": "choice", "choices": ["$\\dfrac{AC}{BC}$", "$\\dfrac{AC}{AB}$", "$\\dfrac{BC}{AC}$"], "answer": "$\\dfrac{BC}{AC}$" },
        { "type": "key", "answer": [["3", "5"], "15", "25"] },
        { "type": "key", "answer": ["90", "15", "225", "9"] },
        { "type": "choice", "choices": ["$AA$", "$SAS$", "$SSS$"], "answer": "$AA$" },
        { "type": "choice", "choices": ["$AB$", "$BC$", "$DE$"], "answer": "$BC$" },
        { "type": "key", "answer": ["12"] },
        { "type": "choice", "choices": ["$\\dfrac{AD}{AE}$", "$\\dfrac{AD}{DE}$", "$\\dfrac{DE}{AE}$"], "answer": "$\\dfrac{DE}{AE}$" },
        { "type": "key", "answer": ["25", "34"] },
        { "type": "key", "answer": [["6", "17"]] }
      ]
    }
  ]
};
