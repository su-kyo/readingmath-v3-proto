/* =========================================================================
   개념 다지기(과학) · 문항 데이터 — concept/drill-sci.html 전용
   출처: 테스트 서버 중등 2-1 › 1단원 물질의 특성 › (2) 밀도와 용해도 · 개념 훈련(training 978)
   문항 22389~22394 — 6문제 · 모두 고르기 빈칸(빈칸 11개, 정답 = __ans)
   엔진: scripts/learn-drill.js — 이 파일을 엔진보다 먼저 부른다. 필드 설명은 엔진 머리 주석
   ========================================================================= */
window.RMDrillSet = {
  next: 'concept/organize-sci.html',
  problems: [
    /* 22389 — 정답 × · ○ */
    { type: 'blank', id: 22389,
      q: '다음 설명이 옳으면 O, 틀리면 X를 고르시오.',
      html:
        '<p class="qstep"><span class="qstep__no">(1)</span> 부피는 전자저울, 윗접시저울 등을 이용하여 측정한다. (<span class="dblank"></span>)</p>' +
        '<p class="qstep"><span class="qstep__no">(2)</span> 질량은 측정 장소에 관계없이 일정한 물질의 고유한 양이다. (<span class="dblank"></span>)</p>',
      choices: [['○', '×'], ['○', '×']],
      answers: ['×', '○'] },

    /* 22390 — 정답 × · ○ */
    { type: 'blank', id: 22390,
      q: '다음 설명이 옳으면 O, 틀리면 X를 고르시오.',
      html:
        '<p class="qstep"><span class="qstep__no">(1)</span> 두 물질의 질량이 같을 때 부피가 클수록 밀도가 크다. (<span class="dblank"></span>)</p>' +
        '<p class="qstep"><span class="qstep__no">(2)</span> 기체의 밀도를 나타낼 때는 온도와 압력을 함께 표시한다. (<span class="dblank"></span>)</p>',
      choices: [['○', '×'], ['○', '×']],
      answers: ['×', '○'] },

    /* 22391 — 정답 LNG · LPG */
    { type: 'blank', id: 22391,
      q: '다음 빈칸에 들어갈 알맞은 말을 고르시오.',
      html:
        '<p class="qstep">가스 누출 경보기를 설치할 때 공기보다 밀도가 작은 <span class="dblank"></span>의 경우 천장 쪽에 설치하고, ' +
        '공기보다 밀도가 큰 <span class="dblank"></span>의 경우 바닥 쪽에 설치한다.</p>',
      choices: [['LNG', 'LPG'], ['LNG', 'LPG']],
      answers: ['LNG', 'LPG'] },

    /* 22392 — 정답 × · ○ */
    { type: 'blank', id: 22392,
      q: '다음 설명이 옳으면 O, 틀리면 X를 고르시오.',
      html:
        '<p class="qstep"><span class="qstep__no">(1)</span> 용질이 용매에 최대로 녹아 있는 용액을 불포화 용액이라고 한다. (<span class="dblank"></span>)</p>' +
        '<p class="qstep"><span class="qstep__no">(2)</span> 기체의 용해도는 압력이 클수록, 온도가 낮을수록 증가한다. (<span class="dblank"></span>)</p>',
      choices: [['○', '×'], ['○', '×']],
      answers: ['×', '○'] },

    /* 22393 — 정답 × (원문의 「20℃」 · 「20 ℃」 띄어쓰기 차이는 그대로) */
    { type: 'blank', id: 22393,
      q: '다음 설명이 옳으면 O, 틀리면 X를 고르시오.',
      html:
        '<p class="qstep">20℃ 물 100g에 질산나트륨 87g을 녹였더니 불포화 용액이 되었다. 20 ℃에서 물에 대한 질산나트륨의 용해도는 87이다. (<span class="dblank"></span>)</p>',
      choices: [['○', '×']],
      answers: ['×'] },

    /* 22394 — 정답 높아져 · 감소 */
    { type: 'blank', id: 22394,
      q: '다음 빈칸에 들어갈 알맞은 말을 고르시오.',
      html:
        '<p class="qstep">더운 여름철 강가나 호수의 물고기들이 수면 가까이 올라와 입을 뻐끔거리는 현상은 물의 온도가 <span class="dblank"></span> ' +
        '물에 녹아 있는 산소 기체의 용해도가 <span class="dblank"></span>했기 때문이다.</p>',
      choices: [['높아져', '낮아져'], ['감소', '증가']],
      answers: ['높아져', '감소'] }
  ]
};
