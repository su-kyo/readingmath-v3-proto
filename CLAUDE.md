# RM (리딩수학과학 리디자인) 작업 규칙

수학·과학 태블릿 학습 서비스의 리디자인 프로토타입. 프레임워크 없는 HTML·CSS·JS.
폴더 구조와 화면 목록은 `README.md`, 디자인 시스템(원칙·부품·예외)은 **스토리북 `styleguide/`** 를 본다.
(`docs/design-system.md`는 2026-10-12부터 안내 한 장이다 — 옛 v1.0 본문은 낡았다.)
상위 공통 규칙(`../../CLAUDE.md` — 이미지 경량본·_source 원본 보관)이 함께 적용된다.

## 반드시 지킬 것

**① 하위 폴더 화면에는 `<base href="../">` 한 줄.**
`<head>` 바로 아래에 넣는다. 이 덕분에 모든 경로(styles·scripts·assets·화면 링크)를
최상위 기준으로 쓴다. 루트의 `index.html`에는 넣지 않는다 (`styleguide/` 4장은 하위 폴더라 붙인다).

**② 색은 `styles/tokens.css`의 변수로만 쓴다.**
화면 CSS·JS에 색값(hex·rgb)을 직접 쓰지 않는다(지금 0곳 — `tools/style-audit.py`가 잰다).
반투명은 알파 램프(`--white-a10` · `--black-a30`), 색이 섞인 반투명은
`color-mix(in srgb, var(--가족-스텝) N%, transparent)`로 쓴다. 마스크의 흑백은 색이 아니라 예외다.
예외 목록은 스토리북 「패턴 › 남긴 예외」와 `style-audit.py`의 `EXCEPT`가 같다.

**②-1 대비 잣대는 하나가 아니다 (v1.6 · 스토리북 「기초 › 칠면 셋」).**
"모든 칠면에 흰 글자 4.5"를 일률 적용해 화면 전체가 칙칙해진 적이 있다. 칠면은 셋이다:

- **텍스트 칠면** (작은 글자) → 4.5:1 · 600 스텝(`--th-solid`) 또는 틴트+잉크
- **정체성 칠면** (CTA·GNB 모드탭·채점/확인) → 3:1 · **450 스텝**(`--primary`·`--mode-*`·`--th-vivid`)
  **+ 라벨 ≥19px w700 필수**. 작은 글자가 필요하면 그건 정체성 칠면이 아니다
- **장식면** (글자 없음) → 면 대비 3:1 · 400 스텝

앰버는 흰 글자를 못 얹는다 — 채움은 `--warn-solid` + 어두운 글자.
**색이 칙칙해 보인다고 채도만 다시 올리지 말 것** — 그 시소를 두 번 탔다.
정책(어떤 칠면에 어떤 글자)을 먼저 확인한다.

**②-2 팔레트 hex는 손으로 고치지 않는다.**
`tools/palette-gen.py`를 고쳐 재생성한다(450은 `solve_identity()`가 대비로 풀어 낸다).
색을 건드렸으면 `tools/cta-check.html`을 열어 CTA가 홈 32배경에서 버티는지 확인한다
(현재 32/32 통과, 최악 3.05). 상태색 `--*-vivid`의 **일괄 치환은 금지** —
다크 호버면에서 대비가 깨지는 경계가 있어 화면별로 눈으로 보며 넓힌다.

**②-3 유틸 4화면은 색 체계가 따로다 (`styles/util.css` · Phase 7-6).**
면은 **뉴트럴-쿨 램프(n-000/050/100) 하나로만** 쌓고, 파랑은 점·선·글자로만 쓴다.
**초록·앰버를 쓰지 않는다** — hue가 멀어 화면이 얼룩진다(그래서 한 번 갈아엎었다).
**「선택 = 반전 칠」이 단일 규칙**이고(필터·페이지네이션·과목·기간·결제수단),
목록은 **테두리 시트**, 선택지는 **타일**이다. 떠 있는 블록과 갭을 쓰지 않는다.
**다크가 기본**이고 라이트도 산다 — 각 화면 `<head>`의 부트스트랩이
`localStorage['rm-theme']`를 읽어 `'light'`일 때만 `data-theme`를 붙인다.
유틸에 테마 토글 버튼은 없다.

**③ 이미지는 쓰임 기준으로 분류한다.**
- 그림(webp) → `assets/img/` (bg·home·planets·strands·grade·misc)
- 아이콘(svg) → `assets/icons/` — 색은 파일 복제가 아니라 코드로 바꾼다
- PNG 등 원본은 프로젝트에 넣지 않는다. `~/Documents/_source/RM/`에 둔다
  (깃 없음 — 삭제·덮어쓰기 전 반드시 사용자 확인)

**④ 화면을 새로 만들면 `index.html` 목록에도 추가한다.**
계열 폴더(nav·concept·type·essay·assignment·exam·util·shared)와
index의 그룹 분류는 같은 단위다 — 둘이 어긋나게 두지 않는다.

**⑤ 행성 홈(`nav/home.html`)은 좌표 고정 · 그림 교체 방식이다.** 배치표 `LAYOUT`·`HAS_CHAR`·`CHAR_V`는 `scripts/nav-home.js`에 있다.
학기 16종 × 과목 2종 = 32화면이지만 배치는 `LAYOUT`의 **과목당 한 벌**뿐이다.
학기를 늘려도 좌표를 새로 잡지 않는다 — `assets/img/home/<과목>-<학기>/`에
같은 이름으로 그림만 넣으면 된다. 원본 32세트가 모두 지키는 자리 규칙:

| 파일 | 자리 |
| --- | --- |
| `obj-1` | 중앙 큰 구조물 |
| `obj-2` · `obj-3` | 좌·우 중단 |
| `obj-4` · `obj-5` | 좌·우 하단 |
| `obj-6` | 공중에 뜬 작은 것 (유일하게 떠다니는 애니메이션) |

원본 `chapter-object-0N.png`가 그대로 `obj-N`이 된다. 순서를 바꾸지 않는다.
캐릭터는 **16학기 전부 들어가 있다**(2026-08-25). 학기당 한 명이고 수학·과학이 같은
그림을 쓰되 **칸 폭은 과목마다 다르다**(`LAYOUT`의 `hero` — 수학 31.25% · 과학 25%).
과학은 실내라 오브젝트가 전부 작아서, 같은 폭을 쓰면 캐릭터만 커 보인다.
검수 도구 `planet-ref.py`·`char-on-bg.py`의 `HERO_W`도 같은 값이니 함께 고친다.
`HAS_CHAR`에서 키를 빼면 그 학기는 말풍선만 세운다(`.hero.is-nochar`).
**캐릭터 그림을 교체하면 `CHAR_V` 숫자를 올린다** — 파일명이 `character.webp`로
고정이라 안 올리면 브라우저가 옛 그림을 계속 쓴다. 제작 규칙은 `docs/character-brief.md`.
32화면을 한눈에 보려면 `tools/home-contact.html` (배포 제외).

**⑥ 화면 파일 규칙 (마감 회차 2026-10-12 · RMDS v2.0).**
- **HTML 안에 `<style>`·`<script>`를 쓰지 않는다.** 화면 CSS는 `styles/screens/<계열>-<화면>.css`,
  화면 JS는 `scripts/<계열>-<화면>.js`. 예외는 `<head>`의 테마 초기화 한 줄(빼면 첫 화면이 깜빡인다)과
  스토리북의 데모 틀(`<template>`) 안뿐이다.
- **계열이 같이 쓰는 규칙은 계열 파일로.** result · essay · type · assign · exam · nav · util(+history).
  여러 계열이면 components. 화면 파일에는 그 화면에만 있는 것만 남긴다.
  옮길 때는 **같은 요소에 붙는 클래스(BEM 변형·다중 클래스)의 순서**를 지킨다 —
  변형만 먼저 옮겨 훈련 결과표가 깨진 적이 있다.
- **이름은 뜻 하나에 하나.** 토스트 `.toast` + 상태 `.is-on`(서랍만 `.rmd-toast`) ·
  선택지는 목록형 `.opt`(과제·시험 — 안쪽은 `__num`·`__txt`, 상태는 `.is-selected`·`.is-correct`·`.is-wrong`) / 타일형 `.qopt`(개념·유형) ·
  옛 `.seg`는 `.led`(결과 LED) · `.chunk`(끊어읽기) · `.segmented`(분절 토글) · `.scrumb__item`(시험 경로).
- **변수에 그림 주소를 넣으면 절대 주소로.** `url()`이 든 변수는 그 변수를 쓰는 CSS 파일 기준으로 풀린다
  (`scripts/nav-home.js`의 `--m` — `new URL(src, document.baseURI)`).
- **`components.css`에는 화면이 실제로 쓰는 것만 둔다.** 「언젠가 쓸」 라이브러리 부품은 만들지 않는다 —
  마감 회차에 그런 부품 17종을 걷어냈고, 그중 셋(`.blank`·`.block`·`.grade`)은 이름이 같은 화면 부품에 속성이 새고 있었다.
- 고치고 나면: `python3 tools/style-audit.py`(지킬 것 6개 전부 ✓) → `tools/usage-scan.py` → `?v=` 올리기.

## 조심할 것

- **조립식 경로**: 이미지·화면 경로가 `'star-'+g` 처럼 코드에서 조립되는 곳이 많다.
  경로를 옮길 때 문자열 검색만 믿으면 빠뜨린다 — 서버 띄워 전 화면 404 검사로 검증한다.
- **공용 JS**: `gnb-drawer.js`(9개 화면 공유)·`step-progress.js` 안에 화면 이동 경로가 있다.
- `essay/basics·drill`의 **가로 안(basics.html·drill.html)은 '킵'** — 확정안은 v2(세로)다.
  index에서 킵 그룹으로 분리해 뒀다. 어느 쪽도 지우지 않는다.
- `shared/`의 결과 화면 2장은 개념·유형·서술형이 모두 부른다.
- **CSS·JS를 고쳤으면 HTML의 `?v=`를 그날 날짜로 올린다**(전 화면 같은 값). 같은 날 또 고치면 회차를 붙인다
  (`20261012-3`). 안 올리면 브라우저가 옛 파일을 계속 써서 "고쳤는데 화면이 안 바뀐다"가 된다
  (Phase 5에서 두 번, 마감 회차에서도 한 번 — 옛 스크립트가 바뀐 HTML과 짝이 안 맞아 오류가 났다).

## 검수 도구 (Phase 5 신설)

**디버그 패널** — 주소 끝에 `?debug=1`을 붙이면 화면 왼쪽 아래에 작게 뜬다.
문제를 직접 풀지 않고 정답·오답·완료 상태를 버튼으로 오갈 수 있다.
결과 화면에서는 시간 초과 ↔ 제한 시간 내를 바꾼다. 배포본에서는 보이지 않는다.

- 뼈대: `scripts/debug-panel.js` · 화면 엔진이 `window.RMDebug.register({title, actions})`로 자기 훅을 등록한다.
- 붙어 있는 화면: 개념(학습·다지기·기초연산) · 유형(훈련) · 서술형(기초·다지기·해설) ·
  과제 풀이 · 시험 풀이 · 학습 결과 3종.
- 새 학습 화면을 만들면 `debug-panel.js`를 부르고 엔진에서 `register`만 하면 된다.

**목록 상태 파라미터 (Phase 7-6 신설)** — 주소 끝에 `?state=loading|empty|error`를 붙이면
공지 목록·월간보고서의 로딩 스켈레톤·빈 목록·불러오기 실패 화면을 바로 볼 수 있다.
정적 데모라 통신이 없어서 이 상태들이 저절로 나오지 않는다. 배포본에서는 쓰이지 않는다.

**키패드 물리 키보드** — `scripts/keypad-input.js` 하나가 전 화면을 담당한다.
입력 로직을 새로 만들지 않고 **눌린 키에 해당하는 화면 키패드 버튼을 대신 클릭**한다.
Phase 6에서 키패드가 한 벌(`.keypad__key`)로 합쳐져 이 파일도 한 벌만 본다.

**더미 이미지 자리** — `styles/components.css`의 `.dummy-img` (빗금 + '이미지 예시' 라벨).
`.qopt__img`·`.ex__skel`·`.sopt__img`·`.sblank__thumb`도 같은 규칙을 받는다.
새 자리를 만들면 `.dummy-img`를 붙인다. 화면 CSS에서 그 자리에 `background`를 다시
지정하면 빗금이 지워지니 주의.

## 공용 부품 (Phase 6 신설)

화면마다 따로 만들지 말 것. **이미 있는 부품을 먼저 찾는다.**

**보조 모니터 — `styles/monitor.css`.** 화면 위에 뜨는 것(요약·영상·확대·끊어읽기·
보고서 미리보기·답안표 등)의 공통 틀이다. 우주선 콘솔 모니터 모양 — 마운트 암 + 베젤 +
램프 + 물리 버튼. 골격은 `.monitor > .monitor__rig > .monitor__frame >
(.monitor__hd · .monitor__screen · .monitor__chin)`이고, `.is-open`으로 연다.
변형은 `--side`(오른쪽 도킹) · `--lock`(닫기 버튼 없음)뿐이다.
**안의 내용은 화면 것을 그대로 넣는다** — 틀만 공용이다.

**키패드 — `scripts/keypad.js` + `styles/keypad.css`.** 마크업은 `RMKeypad.html()`,
값 편집은 `RMKeypad.apply(값, 키)`가 한다. 키 구성은 한 벌로 고정(7~0 · ⌫ · C · − · . · 확인).
**계산기는 우주선의 물건이라 라이트·다크에서 같은 모습이다**(정적 하드웨어).
「확인」이 무엇을 하는지는 화면이 정한다 — 개념·유형은 닫기, 서술형은 채점,
과제 좌측은 다음 문제, 답안표는 접기, 시험은 제출.

**연습장 — `scripts/scratchpad.js`.** 한 줄만 부르면 그 화면의 「연습장」 버튼에 알아서
붙는다(22개 화면). 화면 위를 덮는 투명 캔버스에 바로 필기하고, 딤은 필기 뒤에 깔리되
**문제 영역(`.content`/`.rframe`)과 콘솔바는 딤에서 빠진다.**
도구 바는 **그 화면의 `.bar`를 복제해 네이비로 다시 칠한 것**이라 트레이 형태와
좌우 일러스트가 자동으로 따라온다 — 콘솔바 구조를 바꾸면 여기도 확인할 것.
검수는 주소에 `?scratch=1`.

**수식 — `scripts/vendor/katex/` (동봉, 592KB).** CDN을 쓰지 않는다.
**수식 안에 빈칸을 넣을 수 있다** — `\htmlClass{dblank}{?}`가 분수 분자 같은 자리에
실제 입력 빈칸을 만든다(`trust` 콜백 필요). 본보기는 개념 다지기 6번 문제.
슬래시 분수(`a/b`)로 적지 않는다 — `\dfrac`을 쓴다.

## 세미 스토리북 (Phase 10-④ 신설 · 배포 포함)

`styleguide/` 4장이 디자인 시스템 문서다. **`index.html`에서 바로 갈 수 있다.**

```
styleguide/foundations.html   색 3단 · 칠면 셋 · 글자/간격/모서리/층 눈금
styleguide/components.html    버튼 · 상태 타일 · 빈칸 · 선택지 · 계기판 · 토스트 (화면이 쓰는 것만)
styleguide/shells.html        GNB/서랍 · 학습 헤더 · 콘솔바 · 보조 모니터 · 키패드 · 연습장
styleguide/patterns.html      목록 네 상태 · 유틸 예외 체계 · JS가 넣는 변수 · 검수 스위치
styleguide/sg.css · sg.js     네 장이 공유하는 뼈대 (목록 · 액자 · 배지)
styleguide/usage.json         tools/usage-scan.py 가 만든 사용 집계
```

**부품 스타일을 이 문서에 옮겨 적지 않는다.** 데모는 `<template>` 마크업을
iframe 두 개(`srcdoc`)에 넣고 `styles/`의 **진짜 CSS**를 불러 그린다 —
그래서 화면이 바뀌면 문서가 따라온다. 색·눈금 견본도 `tokens.css`에서
계산된 값을 읽는다. **옮겨 적는 순간 둘이 어긋나기 시작한다.**

부품을 추가할 때는 `.sg-item`에 `data-uses="클래스"`만 적으면 「쓰는 화면 N」이
자동으로 붙는다. 쓸 수 있는 속성: `data-section` · `data-css`(액자가 부를 스타일시트) ·
`data-themes`(기본 `light,dark`) · `data-pad` · `data-bg`.

**부품·공용 CSS를 고쳤으면 `tools/usage-scan.py`를 다시 돌린다.**

## tools/ 정리 규칙 (2026-08-22 신설)

`tools/`는 **배포에서 빠지는 검수용 폴더**다. 두 종류가 섞이는데, 성격이 다르다.

**도구는 남긴다** — 반복해서 다시 쓰는 것.
`palette-gen.py`(팔레트 생성기) · `cta-check.html`(CTA 32배경 판정) ·
`palette-preview.html`(팔레트 눈 검증) · `home-contact.html`(홈 32화면 한눈보기) ·
`holo-check.html`(홀로그램 톤 생존 검사) · `holo-bench.html`(홀로그램 성능 자동 측정) ·
`planet-ref.py`(캐릭터 생성용 행성 자료 뽑기) · `char-on-bg.py`(캐릭터를 홈 배경에 올려
대비 판정 — 몸 대비·자체 대비를 숫자로 찍는다) ·
`usage-scan.py`(부품별 쓰는 화면 집계 → 스토리북) ·
`style-audit.py`(스타일 규칙 검사 — 지킬 것 6 · 지켜볼 것 4, `--strict`면 실패 시 종료 코드 1) ·
`dark-shot.html`(다크 모드 화면을 헤드리스로 찍는 액자 — `screen-shot.sh`는 라이트만 찍힌다)

**스타일 정리 3종 (Phase 10 신설)** — 공용 CSS·부품을 건드릴 때 세트로 쓴다.
`screen-shot.sh`(배포 대상 37화면 헤드리스 촬영) ·
`screen-diff.py`(전후 화소 대조 — `--crop 화면이름`으로 바뀐 자리만 잘라 본다) ·
`rule-compare.py`(클래스가 어느 화면에 어떻게 정의됐는지 비교, `--count`로 복붙/고유 집계).

```bash
tools/screen-shot.sh /tmp/rm-before   # 고치기 전
tools/screen-shot.sh /tmp/rm-after    # 고친 뒤
tools/screen-diff.py /tmp/rm-before /tmp/rm-after
```

**잡음을 먼저 알 것** — `dark-shot.html`은 화면을 연 뒤 테마를 바꾸므로 전환 애니메이션 도중에 찍히는 일이
있다(선택지가 하얗게 남거나 토글이 미끄러지는 중). 무한 반복 애니메이션(행성 홈 숨쉬기 · 결과 LED 깜빡임)은
위상이 달라진다. 튀는 화면은 같은 코드로 두 번 다시 찍어 0.00%가 나오는지 본다.

**부품을 옮겼는데 0.00%가 나오면 성공이다.** 이 대조가 Phase 10에서 실수를 두 번
잡았다 — 여러 줄 규칙을 한 줄만 지워 화면이 백지가 된 것, 잘린 출력을 보고 옮겨 적어
라벨 글자가 커진 것. **둘 다 코드만 봐서는 안 보였다.**
행성 계열(`nav/*`)의 0.1~2%는 별이 반짝이는 잡음이라 회귀가 아니다.

**시안은 결론이 나면 지운다.** 「어떤 안으로 갈까」를 비교하려고 만든 페이지는
고르는 순간 역할이 끝난다. **남길 것은 파일이 아니라 판단**이고, 그건 옵시디언
`3 포트폴리오/리딩수학과학 (RM).md`의 「판단 기록」과 `docs/`의 지시서에 적는다.
파일을 남기면 폴더가 무덤이 되고, 나중에 어느 게 현행인지 알 수 없게 된다.

**예외 하나** — 아직 결론이 안 난 것은 남긴다.
`mission-board-mockup.html`(③ 과제센터 보류 · 머리 주석에 9차 계획)
※ `util-brand-proposals-2.html`·`util-white.html`은 ④ 유틸이 확정·적용되어 지웠다
  (2026-08-24). 판단은 `docs/phase7-brief.md`의 「④ 확정 사양」에 있다.

지운 시안은 깃 기록에 남아 있다. 되살리려면 지운 커밋을 찾아 그 파일만 꺼내면 된다.

## 미리보기 · 배포

- 서버: `.claude/launch.json`의 **rm-static** (8020). Bash로 서버 띄우지 않는다.
  Portfolio 폴더에서 세션을 열면 공통 설정의 **rm-static**(8040)을 쓴다(8020은 회사 MT와 겹친다).
  `screen-shot.sh`에 포트를 넘긴다: `tools/screen-shot.sh /tmp/x 8040`.
- 배포: 푸시하면 Vercel 자동 배포. `figma-palette`·`tools`·`video`·`docs`·`generated`·`CLAUDE.md`는 배포 제외(`.vercelignore`).
