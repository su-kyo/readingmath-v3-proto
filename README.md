# 리딩수학과학 · 리디자인 프로토타입

수학·과학 태블릿 학습 서비스의 리디자인을 **HTML · CSS · JavaScript**로 만든 프로토타입입니다.
(React 등 프레임워크 없음 — 그냥 파일을 열면 동작합니다.)

## 열어보는 법 (개발 몰라도 됨)

가장 쉬운 방법: **`index.html`을 더블클릭**해서 브라우저로 열면 됩니다.

- `index.html` — 시작 페이지 (화면 전체 목록)
- `styleguide.html` — 디자인 시스템(색·글자·컴포넌트) 전시장

> 오른쪽 위 ☀ / ☾ 버튼으로 라이트/다크 전환이 됩니다.

**홈 화면만은 주소로 과목·학기를 바꿉니다.**
`nav/home.html?subject=science&sem=mid-3-1` 처럼 붙이면 됩니다.
`subject`는 `math` / `science`, `sem`은 `elem-3-1` / `mid-3-1` / `mid-3-2` 여섯 조합이 있습니다.

## 폴더 구조

화면은 **계열별 폴더**로 나뉘어 있습니다. `index.html`이 묶어 보여주는 그룹과 같은 단위입니다.

```
RM/
├─ index.html            진입 · 화면 목록
├─ styleguide.html       디자인 시스템 전시장
│
├─ nav/                  메인 · 홈 / 네비게이션
│  ├─ home.html            기본 모드 홈 (행성 메인)
│  ├─ freemode.html        자유 모드 (학기별 · 계통별)
│  ├─ curriculum.html      커리큘럼 레이어
│  └─ bridge.html          과목 선택 브릿지
├─ concept/              개념 훈련
│  ├─ learn.html           끊어읽기
│  ├─ organize.html        개념 정리하기
│  ├─ drill.html           다지기
│  └─ basic-ops.html       기초 연산
├─ type/                 유형 훈련 (quiz · review · result · training-result)
├─ essay/                서술형 훈련 (basics · drill · advanced · report · 결과)
├─ assignment/           과제 센터 (home · solve · explain · result)
├─ exam/                 시험 대비 (home · solve)
├─ util/                 공지 · 월간보고서 · 결제
├─ shared/               여러 계열이 함께 쓰는 결과 화면
│  ├─ step-result.html     스텝 결과
│  └─ training-result.html 학습 결과
│
├─ styles/               tokens.css(색·글자 변수) · base · components · 화면별 CSS
├─ scripts/              화면별 동작 JS + theme.js(라이트/다크) + space-bg.js(우주 배경)
├─ assets/               화면이 부르는 재료 — 전부 "쓰임" 기준으로 분류
│  ├─ img/               그림(webp) — 코드가 그대로 띄우는 것
│  │  ├─ bg/               화면 배경 (우주선·우주) 5장
│  │  ├─ home/             행성 홈 6세트 (배경+캐릭터+오브젝트)
│  │  ├─ planets/          자유모드 행성 16장
│  │  ├─ strands/          계통 일러스트 17장
│  │  ├─ grade/            등급 배지 8장
│  │  └─ misc/             낱장 (실험 과정 그림)
│  ├─ icons/             아이콘(svg) — 코드가 색을 바꿔 쓰는 재료
│  │  ├─ gnb/ exam/ hw/    영역별 아이콘
│  │  ├─ console/ star/    콘솔 장식 · 등급 별
│  │  └─ ico-*.svg         공용 낱개
│  └─ fonts/             Kode Mono (직접 넣어둠, 인터넷 없이도 뜸)
│
├─ docs/                 깊은 문서 (아래 「문서 세 개」 참고)
│  ├─ design-system.md     디자인 원칙과 토큰 구조
│  ├─ design-tokens.json   토큰 스냅샷 (2026-07-14 시점)
│  └─ plan-2026-07.md      7월 작업 계획 (보관용)
│
├─ figma-palette/        기존 팔레트 유지 스냅샷 (내부 비교용, 배포 제외)
├─ tools/                팔레트 생성 스크립트 (로컬 전용, 배포 제외)
├─ video/                소개 영상 제작 폴더 (깃·배포 모두 제외, 아래 참고)
│
├─ CLAUDE.md             에이전트용 작업 규칙
└─ README.md             이 문서
```

**이미지는 출처가 아니라 쓰임으로 분류합니다.** 예전에는 `assets/figma/`라는
출처 기준 이름이었는데, 실제로는 대부분 생성 이미지라 이름이 거짓말을 하고 있었습니다.
출처 구분은 원본 보관소(`_source/RM/`)의 몫입니다.

**그림(img)과 아이콘(icons)을 나눈 이유** — 성격이 다릅니다. 그림은 코드가 그대로
띄우고, svg 아이콘은 코드가 색을 갈아입히는 재료입니다.

**파일 이름에서 계열 앞머리를 뺐습니다.** 폴더가 이미 계열을 말해주기 때문입니다.
`essay-drill.html` → `essay/drill.html`, `type-quiz.html` → `type/quiz.html` 식입니다.

`shared/`에 있는 두 장은 **개념·유형·서술형이 모두 부르는 화면**이라 어느 계열에도
넣지 않았습니다. 계열 폴더 안에 두면 이름과 실제가 어긋납니다.

### 화면을 새로 만들 때 — 첫 줄에 이것 하나

하위 폴더에 있는 화면은 `<head>` 바로 아래에 이 한 줄이 있어야 합니다.

```html
<base href="../">
```

이게 있으면 `styles/`·`scripts/`·`assets/`를 **최상위 기준**으로 부를 수 있습니다.
즉 폴더가 달라도 경로를 그대로 쓰면 됩니다(`href="styles/tokens.css"`).
화면끼리 오가는 링크도 같은 기준이라 `href="type/quiz.html"`처럼 씁니다.

최상위에 있는 `index.html`과 `styleguide.html`에는 **넣지 않습니다.**

## 색을 바꾸고 싶다면

`styles/tokens.css` 맨 위의 값만 고치면 모든 화면에 반영됩니다.
개별 화면 CSS에는 색을 직접 쓰지 않는 것이 원칙입니다(자세한 이유는 `docs/design-system.md`).

## 기준

- 기준 화면 크기: **1280 × 720 (태블릿 가로, 16:9)**
- 기본 테마: **다크(우주)**
- 스타일 원칙: 외곽선 없는 flat, 그라데이션·과밀 금지, 표면 톤·여백·타이포로 구조 만들기

---

## 알아둘 것 — 이 프로토타입의 현재 상태

### 이미지는 전부 webp입니다 (원본은 프로젝트 밖에)

화면이 쓰는 사진·일러스트는 **webp**, 아이콘·로고는 **svg**입니다.
PNG는 프로젝트 안에 두지 않습니다 — `.gitignore`가 막습니다.

**원본 PNG 96장은 여기 있습니다:**

```
~/Documents/Portfolio/_source/RM/generated/
```

전부 생성한 이미지라 **다시 뽑아도 같은 그림이 안 나옵니다.** 지우면 안 됩니다.
(Figma에서 받은 것은 아이콘 svg뿐이고, 그건 `assets/icons/`에 그대로 있습니다.)

**webp를 다시 만들려면** 원본을 같은 자리 같은 이름으로 바꿔 넣으면 됩니다:

```bash
cwebp -q 92 원본.png -o 결과.webp
```

**96장을 한 번에 다시 만들려면** 아래를 그대로 복사해 실행합니다.
`_source`의 원본을 읽어 `assets/` 안에 webp로 넣습니다 (폴더 구조는 자동으로 맞춰집니다).

```bash
cd ~/Documents/Portfolio/_source/RM/generated && find . -name "*.png" | while read f; do mkdir -p "$HOME/Documents/Portfolio/projects/RM/assets/$(dirname "$f")"; cwebp -q 92 -quiet "$f" -o "$HOME/Documents/Portfolio/projects/RM/assets/${f%.png}.webp"; done && echo "완료"
```

`cwebp`가 없다고 나오면 먼저 설치합니다:

```bash
brew install webp
```

### 어느 쪽을 쓸지 아직 안 정한 화면이 있습니다

두 쌍이 남아 있습니다. **둘 다 살아 있고, 어느 쪽을 쓸지는 미정입니다.**

- `essay/basics.html` / `essay/basics-v2.html`
- `essay/drill.html` / `essay/drill-v2.html`

지금은 자유 모드가 `essay/basics-v2.html`을 부릅니다. 정리를 빠뜨린 게 아니라
**결정을 미뤄둔 상태**입니다.

### 화면이 아직 안 부르는 이미지 6장

`assets/img/strands/`의 과학 계통 일러스트 6장(물리·화학·지구·생명·탐구·통합)은
아직 어느 화면도 부르지 않습니다. **자유 모드에 과학 계통이 붙으면 쓸 것**이라
webp로 바꿔 그대로 남겨뒀습니다.

### 문서 세 개가 서로 조금 다릅니다 — 기준은 이렇습니다

| 무엇 | 지위 |
| --- | --- |
| `styles/tokens.css` | **실제 색값의 현행 기준.** 화면이 이 값을 씁니다 |
| `docs/design-system.md` | **원칙과 구조의 기준.** 3단 토큰·금지 규칙·슬롯 계약은 유효합니다 |
| `docs/design-tokens.json` | 2026-07-14 시점 스냅샷. **색값이 낡았습니다** |

`design-system.md`는 스스로를 "단일 정본"이라 적어 두었지만, 실제로는 그 뒤에
`tokens.css`가 더 갱신됐습니다. **색값이 서로 다르면 `tokens.css`가 맞습니다.**
맞추는 작업은 아직 하지 않았습니다.

### video 폴더는 깃에 없습니다

소개 영상 제작 폴더입니다. 깃과 배포 양쪽에서 빠져 있어서
**이 폴더의 mp4와 소재는 이 컴퓨터에만 있습니다.** 필요하면 따로 백업하세요.

내려받은 꾸러미(`node_modules`)는 지웠습니다. 다시 쓰려면 `video/` 안에서:

```bash
npm install
```

### 배포

Vercel에 올라가 있습니다. `figma-palette` · `tools` · `video`는 배포에서 빠집니다
(`.vercelignore`).
