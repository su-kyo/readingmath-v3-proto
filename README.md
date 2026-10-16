# 리딩수학과학 · 리디자인 프로토타입

수학·과학 태블릿 학습 서비스 「리딩수학과학」의 리디자인을 **HTML · CSS · JavaScript**로 만든 프로토타입입니다.
프레임워크가 없어서 파일을 열면 바로 동작합니다. 개발자는 이 프로토타입을 기준으로 실서버에 새 디자인을 옮기고 있습니다.

- 배포본: **readingmath-v3-proto.vercel.app** (main에 올리면 자동 배포)
- 기준 화면: **1280 × 720** (태블릿 가로)
- 화면 42장 + 디자인 시스템 문서(스토리북) 6장

## 열어보는 법

`index.html`을 브라우저로 열면 화면 전체 목록이 나옵니다. 거기서 각 화면과 스토리북으로 갈 수 있습니다.

- 테마 — 학습 화면은 라이트로 시작하고 오른쪽 위 ☀ / ☾로 바꿉니다(고른 테마는 기억됩니다). 행성 홈과 결과 화면은 항상 다크, 유틸 화면은 다크가 기본입니다.
- 과목 — 개념 · 서술형은 과목마다 화면이 따로 있습니다(`-math` 수학 중3-2 삼각비 · `-sci` 과학 중2-1 밀도와 용해도). 유형 · 결과 화면은 한 벌이라 주소 끝에 `?subject=science`(또는 `math`)를 붙여 과목을 바꿉니다.
- 행성 홈 — `nav/home.html?subject=science&sem=mid-3-1`처럼 과목과 학기를 붙입니다. 학기는 `elem-3-1` ~ `high-1-2` 16개, 과목 둘이라 32조합입니다.

## 폴더 지도

화면은 **계열별 폴더**에 있고, `index.html`의 그룹과 같은 단위입니다.

```
RM/
├─ index.html          시작 페이지 · 화면 목록
│
├─ nav/          4장   행성 홈 · 자유 모드 · 커리큘럼 · 과목 선택
├─ concept/      8장   개념 훈련 — 학습 · 다지기 · 정리(과목마다 한 벌) + 기초 연산(수학) · 개념 확인(과학)
├─ type/         4장   유형 훈련 — 풀이 · 해설 · 결과 · 훈련 결과 (과목 공용)
├─ essay/       13장   서술형 훈련 — 기초 · 다지기 · 해설(과목마다) + 심화(수학) · 보고서(과학) + 결과 2장 + 가로 킵 2장
├─ assignment/   4장   과제 센터
├─ exam/         2장   시험 대비
├─ util/         5장   공지 · 공지 상세 · 월간보고서 · 결제 · 학습 기록
├─ shared/       2장   여러 계열이 같이 쓰는 결과 화면(스텝 결과 · 학습 결과)
│
├─ styleguide/         스토리북 6장 — 기초 · 부품 · 셸 · 패턴 · 규칙 색인 · 화면 지도 (배포 포함)
│  └─ data/              개발자용 tokens.json · rules.json · screens.json (스크립트가 만든다)
├─ styles/             CSS — tokens.css(디자인 토큰) · 공용 · 계열 공용 · screens/(화면 하나에만 있는 것)
├─ scripts/            JS — 화면 동작(<계열>-<화면>.js) · 콘텐츠 데이터(-data-math/-sci.js) · 공용 부품
├─ assets/             화면이 부르는 재료 — img/(그림 webp) · icons/(아이콘 svg) · fonts/
│
├─ docs/               판단과 요청의 기록 — requests · decisions · research · briefs (입구 docs/README.md)
├─ tools/              검수 도구 (배포 제외)
├─ figma-palette/      옛 팔레트를 유지한 비교용 스냅샷 (배포 제외)
├─ video/              소개 영상 작업 폴더 (깃 · 배포 모두 제외)
│
├─ vercel.json         옛 주소를 새 화면으로 넘겨주기 (요청서에 적힌 링크가 살아 있게)
├─ CLAUDE.md           AI 작업 규칙
└─ README.md           이 문서
```

하위 폴더의 화면은 `<head>` 첫 줄에 `<base href="../">`가 있어서, 경로를 모두 최상위 기준으로 씁니다(`styles/tokens.css`, `type/quiz.html`).
루트의 `index.html`에는 넣지 않습니다.

## 검수하는 법 — 문제를 직접 풀지 않아도 됩니다

주소 끝에 **`?debug=1`**을 붙이면 왼쪽 아래에 작은 패널이 뜹니다. 정답 · 오답 · 전부 풀기 · 시간 초과 같은 상태를 버튼으로 오갑니다.
`&do=버튼 이름`을 더하면 그 상태로 바로 열려서, 스크린샷을 찍거나 「이 상태 봐 주세요」라고 공유할 때 씁니다.

```
concept/drill-math.html?debug=1&theme=dark&do=오답 처리
```

- `theme` — `light` / `dark` · `do` — 패널 버튼에 적힌 라벨 그대로, 여러 개는 `|`로 잇습니다
- 공지 목록 · 월간보고서는 `?state=loading|empty|error`로 로딩 · 빈 목록 · 실패 화면을 봅니다
- 키패드가 있는 화면은 컴퓨터 키보드도 됩니다(숫자 · `Backspace` · `Enter`)

배포본에서는 이 스위치가 안 보입니다.

## 디자인 시스템은 어디에

- **설명과 규칙은 스토리북 `styleguide/`** 한 곳입니다. 부품마다 라이트 · 다크를 나란히 세우고 「쓰는 화면 수」를 자동으로 셉니다. 규칙에는 번호(`RM-영역-번호`, 58개)가 있어 QA에서 번호로 가리킵니다.
- **값은 `styles/tokens.css`** 한 곳입니다. 여기만 고치면 전 화면에 반영되고, 화면 CSS · JS에는 색값을 직접 쓰지 않습니다. 스토리북 견본도 이 파일의 값을 읽어 그립니다.
- **지켜졌는지는 기계가 잽니다.**

```bash
python3 tools/style-audit.py
```

## 이미지 원본

화면이 쓰는 그림은 **webp**, 아이콘은 **svg**입니다. PNG는 프로젝트에 두지 않습니다(`.gitignore`가 막습니다).
원본은 깃이 없는 창고 `~/Documents/_source/RM/`에 있고, **전부 생성한 그림이라 다시 뽑아도 같은 그림이 나오지 않습니다. 지우면 안 됩니다.**

```
_source/RM/
├─ generated/img/      화면 그림 원본 — assets/img/ 와 폴더 · 이름이 1:1 짝 (홈 · 배경 · 행성 · 계통 · 등급 · 캐릭터)
├─ character-trials/   캐릭터 시안과 검사 이미지 91장 (채택 안 된 것)
├─ concept-learn/ · subject-split-1015/   학습 콘텐츠 그림 원본 (실서비스에서 받은 것)
└─ live-capture/       실서버 탐방 캡처
```

webp를 다시 만들 때는 원본을 같은 자리 같은 이름으로 바꿔 넣습니다. `cwebp`가 없으면 `brew install webp`.

```bash
cwebp -q 92 원본.png -o 결과.webp
```

## 아직 정하지 않은 것

- **서술형 가로 안 2장**(`essay/basics.html` · `essay/drill.html`) — 확정안은 세로(`-math` · `-sci`)이고, 가로 안은 옛 콘텐츠 그대로 참고용으로 킵합니다. index에서도 킵 그룹으로 따로 있습니다.
- **과학 계통 일러스트 6장**(`assets/img/strands/` 물리 · 화학 · 지구 · 생명 · 탐구 · 통합) — 아직 어느 화면도 부르지 않습니다. 자유 모드에 과학 계통이 붙으면 씁니다.
- **보류 시안 둘** — 과제센터 미션 보드(`tools/mission-board-mockup.html`) · 커리큘럼 라운드 배치(`tools/proposal-curr-layout.html`).
- 그 밖의 열린 일은 옵시디언 작업 기록의 「다음에 할 것」에 있습니다.

## 깃 밖 폴더와 배포

- `video/`는 깃과 배포 양쪽에서 빠져 있어서 **mp4와 소재가 이 컴퓨터에만 있습니다.** 다시 쓰려면 `video/` 안에서 `npm install`.
- `_source/`도 깃이 없습니다. 둘 다 따로 백업해 두세요.
- 배포는 Vercel입니다. `figma-palette` · `tools` · `video` · `docs` · `CLAUDE.md`는 배포에서 빠집니다(`.vercelignore`).
