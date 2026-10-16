# RM (리딩수학과학 리디자인) 작업 규칙

수학·과학 태블릿 학습 서비스의 리디자인 프로토타입. 프레임워크 없는 HTML·CSS·JS, 기준 화면 1280×720.
개발자가 이 안을 실서버에 옮기는 중이고, 개발자는 저장소가 아니라 **Vercel 배포본**만 본다.
상위 공통 규칙(`../../CLAUDE.md` — 이미지 경량본 · `_source` 원본 보관)이 함께 적용된다.

**정본은 어디에** — 하나씩만 있다. 이 파일에 옮겨 적지 않는다.

- 원칙 · 부품 · 예외 · 규칙(`RM-영역-번호`) → 스토리북 `styleguide/` (규칙 정본 `styleguide/rules.html`)
- 값 → `styles/tokens.css` · 판단 기록과 요청서 → `docs/` (입구 `docs/README.md`)
- 폴더 구조와 열어보는 법 → `README.md` · 작업 이력과 열린 일 → 옵시디언 `3 포트폴리오/RM/작업 기록/리딩수학과학 (RM).md`
- 이 파일 끝의 「규칙 색인」은 `tools/rules-build.py`가 만든다. 규칙을 바꾸면 정본 카드를 고치고 도구를 돌린다

## 작업 방식

- **커밋은 작업 갈래에.** main 병합 · 푸시(= 배포)는 사용자 확인 뒤에만 한다. 배포본이 바뀌면 개발자에게 보낸 링크가 깨진다.
- **CSS·JS를 고쳤으면 전 화면의 `?v=`를 그날 날짜로**(`20261016`, 같은 날 또 고치면 `20261016-2`). 안 올리면 브라우저가 옛 파일을 쓴다 (`RM-FILE-06`).
- **고친 뒤 순서**: `python3 tools/style-audit.py`(지킬 것 11개 전부 ✓) → `tools/color-audit.html` → `tools/usage-scan.py`
  → `tools/screens-build.py` · `tools/tokens-build.py` · `tools/rules-build.py`(개발자용 json) → `?v=` 올리기.
- 같은 체크아웃에서 다른 세션이 일할 수 있다. 커밋 전 `git status`의 `??`를 확인한다.
- 보낸 요청서(`docs/requests/`)는 고치지 않는다. 보낸 뒤 정한 것은 `-addendum` 문서에 모은다.

## 반드시 지킬 것

**① 하위 폴더 화면은 `<head>` 바로 아래 `<base href="../">`** (`RM-FILE-05`). 모든 경로를 최상위 기준으로 쓴다. 루트 `index.html`만 빼고 `styleguide/`도 붙인다.

**② 색은 `styles/tokens.css`의 변수로만** (`RM-COL-01`·`02`·`05`). 화면 CSS·JS에 hex·rgb 0곳, 1단 팔레트(`--n-650`·`--blue-500`)도 0곳.
찾는 순서: 2단 역할(`--text`·`--surface-*`·`--divider*`) → 계열 슬롯(`--th-*`) → 부품 토큰(고정 다크 `--hw-*` · 고정 라이트 `--paper-*` · 그늘 `--shade*` · 화면군 `--util-*`·`--exam-*`·`--assign-*`).
없으면 `tokens.css`에 이름을 만든다. 값이 같아도 뜻이 다르면 이름을 따로 둔다. 화면 지역 변수의 라이트·다크 두 벌도 토큰 쪽에서 전환한다.
반투명은 알파 램프(`--white-a10` · `--black-a30`)나 `color-mix(in srgb, var(--토큰) N%, transparent)`. 예외 목록은 스토리북 「패턴 › 남긴 예외」 = `style-audit.py`의 `EXCEPT`.

**②-1 칠면은 셋이고 잣대가 다르다** (`RM-FILL-01`~`08`, 스토리북 「기초 › 칠면 셋」).
- 텍스트 칠면(작은 글자) → 4.5:1 · 600 스텝(`--th-solid`) 또는 틴트 짝(`--*-tint` 면 + `--*-on-tint` 글자)
- 정체성 칠면(CTA · GNB 모드탭 · 채점/확인) → 3:1 · 450 스텝(`--primary`·`--mode-*`·`--th-vivid`) + 라벨 19px w700 이상
- 장식면(글자 없음) → 면 대비 3:1 · 400 스텝
- 앰버 위에는 흰 글자를 얹지 않는다(`--warn-solid` + 어두운 글자). 정오답 배지는 500 + 숫자 20px w800(`--fs-20`)이나 ✓·✕.
- 칠면은 테마에 따라 안 뒤집히므로 그 위 글자는 다크에서도 흰색 — `--text-on-accent`. 예외: 콘솔바 주황 버튼의 14px 라벨(3.06, 브랜드 인상).
- **칙칙해 보인다고 채도부터 올리지 않는다.** 이 문제로 채도를 두 번 올렸다 내렸다. 어떤 칠면에 어떤 글자인지(정책)를 먼저 본다.

**②-2 팔레트 hex는 손으로 고치지 않는다** (`RM-COL-03`·`04`). `tools/palette-gen.py`로 다시 만든다(450은 `solve_identity()`가 대비로 푼다).
색을 건드렸으면 `tools/cta-check.html`로 CTA가 홈 32배경에서 버티는지 본다(현재 32/32, 최악 3.05). 상태색 `--*-vivid`는 일괄 치환하지 않는다 — 다크 호버면 경계가 있다.

**②-3 학습 화면의 면** (`RM-SURF-01`~`05`, 스토리북 「기초 › 면 규칙」). 색을 흰색에 옅게 섞은 면을 만들지 않는다(빨강은 분홍, 초록은 쑥색이 된다).
- 정오답 칸: 면은 `--opt-bg` 그대로, 상태는 2px 선(500) · 배지(500) · 글자(라이트 `--ok-ink`/`--no-ink` 600 · 다크 `--ok-on-dark`/`--no-on-dark` 300 — 개념 다지기의 `--st-ok`/`--st-no` 방식)
- 해설 박스: 면 없이 왼쪽 4px 계열색 띠(라이트 `--th-accent` · 다크 `--th-accent-hi`). 유형 해설만 띠 없이 옅은 틸 면 `--th-tint`
- 보기 박스 · 선지: 면 없이 1.5px `--border-strong` 한 벌(보기가 선지보다 진하면 안 된다)
- 프레임 `--th-static` = 600(서술형 700). 헤더 칩 `--th-static-deep`, 아이콘 버튼 `--th-accent`. 검정·흰 반투명을 덧칠하지 않는다
- 알려진 미적용: 시험 풀이(`exam-solve.css`)의 정오답 칸은 아직 틴트 면 + 600 배지. 보류(사용자 판단 대기)

**②-4 유틸 4화면은 색 체계가 따로다** (`styles/util.css` · `RM-UTIL-01`~`06` · 근거 `docs/decisions/home-reward-util-0824.md`).
면은 뉴트럴-쿨 램프(n-000/050/100) 하나로 쌓고 파랑은 점·선·글자로만. 초록·앰버를 쓰지 않는다. 선택 = 반전 칠 한 규칙.
목록은 테두리 시트, 선택지는 타일(떠 있는 블록 · 갭 없음). 다크가 기본이고, `<head>` 부트스트랩이 `localStorage['rm-theme-choice']==='light'`일 때만 `data-theme`를 붙인다. 테마 토글 버튼은 없다.
**테마 저장**: `rm-theme-choice`는 시작 페이지 · 과제 · 시험의 테마 버튼을 눌렀을 때만 쓴다. 화면을 여는 것만으로 저장하지 않는다. 학습 화면(개념 · 유형 · 서술형)은 테마를 기억하지 않고 늘 라이트로 시작한다(2026-10-16 결정).

**③ 이미지는 쓰임으로 분류한다** (`RM-ASSET-01`~`05`).
그림(webp) → `assets/img/` (bg · home · planets · strands · grade · misc · concept). `concept/<단원>/`은 실서비스 콘텐츠 그림이고 이름은
개념 학습 `fig-*` · 다지기 `drill-*` · 기초 연산 `ops-*` · 유형 `type-*` · 서술형 `essay1~3-*`(뒤 숫자는 문항 id).
아이콘(svg) → `assets/icons/`, 색은 파일 복제가 아니라 코드로. 세트는 **Lucide**(`lucide-static@0.460.0`, ISC) 한 벌 — 새 아이콘도 여기서, 버튼 문구 → 아이콘은 `docs/decisions/icons-lucide-1016.md`. PNG 원본은 `~/Documents/_source/RM/`(깃 없음 — 삭제·덮어쓰기 전 확인. 콘텐츠 그림 원본은 `concept-learn/` · `subject-split-1015/`).
그림이 들어올 빈자리는 `.dummy-img`(빗금 + 「이미지 예시」, `.qopt__img` · `.ex__skel` · `.sopt__img` · `.sblank__thumb`도 같은 규칙). 그 자리에 `background`를 다시 주면 빗금이 지워진다.

**④ 새 화면은 `index.html` 목록에도 넣는다** (`RM-FILE-07`). 계열 폴더(nav · concept · type · essay · assignment · exam · util · shared)와 index 그룹은 같은 단위다.

**⑤ 화면 파일 규칙** (`RM-FILE-*` · `RM-NAME-*` · `RM-JS-*` · `RM-SIZE-*`).
- HTML 안에 `<style>`·`<script>` 없음. 예외는 `<head>`의 테마 초기화 한 줄(빼면 첫 화면이 깜빡인다)과 스토리북 `<template>` 안.
- 화면 CSS `styles/screens/<계열>-<화면>.css`, 화면 JS `scripts/<계열>-<화면>.js`. 계열이 같이 쓰면 계열 파일(result · essay · type · assign · exam · nav · util+history), 여러 계열이면 `components.css`.
  몇 화면만 같이 쓰는 한 묶음은 그 화면들만 부르는 공용 파일을 화면 CSS 바로 앞에 둔다 — 문항 화면 `quiz.css`(개념 기초 연산 · 확인하기 · 다지기 · 유형 문제 · 해설) · 서술형 스테퍼 `stepbar.css`(다지기 · 다지기 해설).
- 규칙을 옮길 때 같은 요소에 붙는 클래스(BEM 변형 · 다중 클래스)의 순서를 지킨다. 변형만 먼저 옮겨 훈련 결과표가 깨진 적이 있다.
- `components.css`에는 화면이 실제로 쓰는 것만 둔다. 「언젠가 쓸」 부품은 만들지 않는다.
- 이름은 뜻 하나에 하나: 토스트 `.toast` + `.is-on`(서랍만 `.rmd-toast`) · 선택지 목록형 `.opt`(과제 · 시험, `__num`·`__txt`, `.is-selected`·`.is-correct`·`.is-wrong`) / 타일형 `.qopt`(개념 · 유형) ·
  결과 LED `.led` · 끊어읽기 `.chunk` · 분절 토글 `.segmented` · 시험 경로 `.scrumb__item`. 상태는 `.is-*`, 변형은 `--modifier`.
- JS는 스타일을 만들지 않는다(`<style>` 주입 · 색 · 글자 · 여백 인라인 금지). 계산값(위치 · 크기 · 진행률) · 데이터값(그림 주소, CSS 변수 하나) · 보이기/숨기기만. 서랍 CSS는 `gnb.css` 끝, 연습장 CSS는 `styles/scratchpad.css`.
- 그림 주소를 변수에 넣으면 절대 주소로(`new URL(src, document.baseURI)` — `scripts/nav-home.js`의 `--m`). 공용 파일로 올릴 때 `url()`을 그 파일 기준으로 다시 쓴다(`screens/`는 `../../assets`, `styles/`는 `../assets`).
- 치수: 눈금에 있는 값(글자 · 간격 · 모서리 · 선 `--bw-1/1_5/2/3/4` · 볼록 `--depth-2/4`)은 px로 쓰지 않는다. 부품 고유 치수 · 위치 미세조정 · `clamp()` 끝값 · @media 조건은 px 허용. 층위는 화면끼리만 `--z-*`.

## 행성 홈 (`nav/home.html` · `RM-ASSET-04`)

좌표 고정 · 그림 교체 방식이다. 배치표 `LAYOUT` · `HAS_CHAR` · `CHAR_V`는 `scripts/nav-home.js`에 있다.
학기 16 × 과목 2 = 32화면이지만 배치는 과목당 한 벌. 학기를 늘려도 좌표를 새로 잡지 않고 `assets/img/home/<과목>-<학기>/`에 같은 이름으로 그림만 넣는다.

| 파일 | 자리 |
| --- | --- |
| `obj-1` | 중앙 큰 구조물 |
| `obj-2` · `obj-3` | 좌 · 우 중단 |
| `obj-4` · `obj-5` | 좌 · 우 하단 |
| `obj-6` | 공중에 뜬 작은 것(유일하게 떠다닌다) |

원본 `chapter-object-0N.png`가 그대로 `obj-N`이다. 순서를 바꾸지 않는다.
캐릭터는 16학기 전부 있고 수학 · 과학이 같은 그림을 쓴다. 칸 폭은 과목마다 다르다(`LAYOUT`의 `hero` — 수학 31.25% · 과학 25%). 과학은 실내라 오브젝트가 작다.
검수 도구 `planet-ref.py` · `char-on-bg.py`의 `HERO_W`도 같은 값이니 함께 고친다. `HAS_CHAR`에서 빼면 말풍선만 선다(`.hero.is-nochar`).
**캐릭터 그림을 바꾸면 `CHAR_V`를 올린다**(파일명이 고정이라 안 올리면 옛 그림이 남는다). 제작 규칙 `docs/briefs/character-brief.md`, 32화면 한눈에 `tools/home-contact.html`.
홈 보상(홀로그램 · 명판) 사양은 `docs/decisions/home-reward-util-0824.md`.

## 공용 부품 — 화면마다 새로 만들지 않는다 (`RM-PART-01`)

- **보조 모니터** `styles/monitor.css` — 화면 위에 뜨는 것(요약 · 영상 · 확대 · 끊어읽기 · 미리보기 · 답안표)의 틀. `.monitor > .monitor__rig > .monitor__frame > (.monitor__hd · .monitor__screen · .monitor__chin)`, `.is-open`으로 연다. 변형은 `--side` · `--lock`뿐. 안의 내용은 화면 것을 그대로 넣는다.
- **키패드** `scripts/keypad.js` + `styles/keypad.css` — 마크업 `RMKeypad.html()`, 값 편집 `RMKeypad.apply(값, 키)`. 키 구성 고정(7~0 · ⌫ · C · − · . · 확인, 버튼은 `.keypad__key` 한 벌). 정적 하드웨어라 라이트 · 다크 같은 모습. 「확인」의 동작은 화면이 정한다. 물리 키보드는 `scripts/keypad-input.js`가 화면 버튼을 대신 누른다.
- **빈칸 선지 창** `scripts/blank-pop.js` + `.bpop` (`RM-PART-06`) — 개념 학습 · 서술형 6장. `RMBlankPop.open(빈칸, {choices, answer, onPick, onDone, onClose})`. 오답 → 빨간 ✕ 0.5초 → 회색 ✕ 비활성, 정답 → 초록 ✓ 0.5초 뒤 닫힘, `answer`가 없으면 채점 없이 넣는다. 서술형 키패드 창 `.qpop`은 따로다. 근거 `docs/decisions/blank-pop-1015.md`.
- **빈칸에서 여는 창의 자리** `scripts/pop-place.js` — 선지 창 · 떠 있는 키패드 · `.qpop` 모두 `RMPopPlace.place(창, 빈칸, {reveal, side})`. 빈칸 아래 12px 기본 → 위 → 스크롤 → 키패드만 옆, 분수 칸(`.fraction` · `.mfrac`)은 처음부터 옆. 빈칸이 영역 밖으로 나가면 닫는다. 화면 JS에 자리 계산을 만들지 않는다.
- **빈칸** `components.css` + `--blank-*` (`RM-PART-08`) — 칸형 한 벌(`.chunk--blank` · `.sblank` · `.dblank` · 서술형 `.blank`). 면은 하나, 상태는 테두리 · 글자 · 배지. 「지금」은 2px 계열 600, 바깥 링 · 커서 없음. 화면 CSS는 크기 · 글꼴 · 배지 · 누를 수 있는지만 정한다. 답안 칸 `.sinput` · 순서 맞추기 `.slot`은 밖이다.
- **콘솔바 안내** `scripts/learn-guide.js` + `.guide` (`RM-PART-07`) — CTA 바로 왼쪽 한 줄, `RMGuide.set(문장, 'ok'|'no')`. 글자는 `--guide-ink` 하나, 상태는 램프로만. 「채점하기 · 다음 문제」는 콘솔바 CTA, 오답은 눌러야 정답이 열린다. 근거 `docs/decisions/guide-1015.md`.
- **학습 타이머** `scripts/learn-timer.js` + `.lheader__timer` — 유형 · 서술형 학습 화면. 「진행 / 제한」(제한 글자 `.lheader__limit`가 정본), 넘으면 `.is-over`, 해설 · 결과는 `.is-paused`. 제한 시간은 콘텐츠마다 다르다. 근거 `docs/decisions/timer-1015.md`.
- **연습장** `scripts/scratchpad.js` + `styles/scratchpad.css`(화면 CSS 바로 뒤) — 학습 화면에 알아서 붙는다(결과 화면에는 없다). 투명 캔버스에 바로 필기, 딤은 필기 뒤 · 문제 영역(`.content`/`.rframe`)과 콘솔바는 딤에서 빠진다. 도구 바는 그 화면의 `.bar`를 복제한 것이고 다시 칠하지 않는다 — 콘솔바 구조를 바꾸면 여기도 본다.
- **등급** `scripts/grade.js` — `RMGrade.of(점수)` 하나. 95 이상 S · 85 이상 A · 70 이상 B · 그 아래 C(현안 83점 = B). 결과 화면 6장 · 학습 기록이 부른다. 화면 JS에 기준을 새로 쓰지 않는다.
- **수식** `scripts/vendor/katex/`(동봉, CDN 안 씀 · `RM-PART-04`) — 분수는 `\dfrac`, 슬래시로 적지 않는다. `\htmlClass{dblank}{?}`로 수식 안 빈칸을 만들 수 있다(`trust` 콜백 필요 · `learn-drill.js`, 지금 쓰는 문항은 없다).

## 조심할 것

- **조립식 경로** — 이미지 · 화면 경로를 `'star-'+g`처럼 코드에서 조립하는 곳이 많다. 경로를 옮기면 서버를 띄워 전 화면 404 검사로 확인한다(`RM-JS-03`).
- **과목 두 벌** — 개념 · 서술형은 과목마다 파일이 따로다(`-math` 수학 중3-2 삼각비 · `-sci` 과학 중2-1 밀도와 용해도, 한 과목에만 있는 basic-ops · check · advanced · report는 이름 그대로).
  유형 4장 · 결과 화면은 한 벌이고 데이터 · 머리줄만 바뀐다. 과목 판정은 `scripts/subject.js` 하나(`RMSubject.pick`, 과목별 화면 `<html data-subject>`, 공용 화면 `data-crumb`) — 화면 JS에 새로 만들지 않는다.
  학기 16개 목록과 이름(`RMSubject.sems` · `semLabel()` · `sem()`)도 여기 한 벌 — 서랍 · 홈 · 학습 기록이 부르므로 `subject.js`를 그 스크립트보다 먼저 불러온다.
  콘텐츠는 엔진 한 벌 + `<계열>-<화면>-data-<math|sci>.js`. 과제 센터 15문항은 `assignment-data.js` 한 벌(풀이 · 해설 · 결과). 옛 주소(learn · drill · organize · basics-v2 · drill-v2 · drill-review)는 `vercel.json`이 넘긴다.
- **공용 JS 안의 화면 이동 경로** — `gnb-drawer.js`(서랍) · `step-progress.js` · `learn-exit.js`(학습 화면 「나가기」) · `RMSubject.home()`(결과 「홈으로」 → 행성 홈). 몇 화면이 부르는지는 숫자로 적지 않는다 — `grep -rl scripts/<파일>.js`로 센다.
- **킵 화면** — `essay/basics.html` · `drill.html`(가로 안)은 킵이다. 확정은 세로(`-math` · `-sci`, 파일 이름 `essay-*-v2`). 어느 쪽도 지우지 않는다.
- **결과 화면** — `shared/` 2장은 개념 · 유형 · 서술형이 같이 부른다. `step-result.html?step=ops`는 기초 연산 결과. 결과 6장에는 연습장 · 「n/전체」 진행 점이 없다.
- **개념 훈련은 스텝 둘**(개념 학습 · 기초 연산). 흐름은 학습 → 요약 → 다지기 → 정리(「다 읽었어요」) → 스텝 결과. 개념 결과에는 타이머 · 소요 · 감점이 없다.
- **공통 `:hover`가 변형보다 셀 수 있다** — 칠이 있는 변형을 만들면 그 변형의 호버에도 배경을 다시 적는다.

## 검수 스위치 (배포본에서는 안 보인다)

- `?debug=1` — 왼쪽 아래 패널. 정답 · 오답 · 완료 상태를 버튼으로 오간다(개념 다지기는 「일부 정답」, 결과 화면은 시간 초과 ↔ 제한 내). `&do=버튼이름`(여러 개 `|`)이면 그 상태로 열린다(모든 스크립트가 등록된 `load` 뒤 실행). `&theme=light|dark`.
  뼈대 `scripts/debug-panel.js`, 엔진이 `window.RMDebug.register({title, actions})`. 새 학습 화면에는 붙인다(`RM-PART-05`).
- `?state=loading|empty|error` — 공지 목록 · 월간보고서의 목록 네 상태(`RM-UTIL-06`). 학습 기록은 `?state=empty|first|max`.
- `?scratch=1` — 연습장이 열린 채로. `?subject=math|science` — 공용 화면의 과목. 홈은 `?subject=…&sem=elem-3-1`~`high-1-2`.

## 스토리북 `styleguide/` (배포 포함)

`foundations`(색 3단 · 칠면 · 눈금) · `components`(화면이 쓰는 부품만) · `shells`(GNB · 학습 헤더 · 콘솔바 · 모니터 · 키패드 · 연습장) · `patterns`(목록 네 상태 · 유틸 예외 · JS 변수 · 검수 스위치 · 남긴 예외) · `rules`(규칙 정본 58개) · `screens`(화면 지도).
`data/`의 `tokens.json`(DTCG) · `rules.json` · `screens.json`은 스크립트가 만든다. `sg.css` · `sg.js`가 공용 뼈대, `usage.json`은 `usage-scan.py`가 만든다.

- **부품 스타일을 옮겨 적지 않는다.** 데모는 `<template>` 마크업을 iframe(`srcdoc`)에 넣고 `styles/`의 진짜 CSS로 그린다. 견본 색도 `tokens.css` 계산값을 읽는다.
- 부품을 추가하면 `.sg-item`에 `data-uses="클래스"`(쓰는 화면 수 자동). 그 밖에 `data-section` · `data-css` · `data-themes`(기본 `light,dark`) · `data-pad` · `data-bg` · `data-stack`(좁은 폭 @media가 있는 부품).
- 액자 CSS의 `?v=`는 문서의 `sg.css` 링크에서 따온다. 「고쳤는데 데모가 옛 모양」이면 `?v=`부터 본다. 부품 · 공용 CSS를 고쳤으면 `usage-scan.py`를 다시 돌린다.
- **글쓰기** — 읽는 사람은 디자이너 · 개발자 · 개발자의 AI. 무엇(한 문장) → 언제 · 어떻게(견본 · 표 · 규칙 번호) → 예외 → `<details class="sg-why"><summary>근거</summary>`(이유 · 이력). 날짜 · Phase · 바뀌기 전 숫자는 접힌 칸에만.
  설명은 「~합니다」, 지킬 것 · 표 칸은 「~한다」나 명사, 「~요」는 쓰지 않는다. 「」는 화면에 실제로 찍히는 문구에만. 비유 · 회고는 사실 문장으로.
  규칙 카드는 제목 → 어떻게 → 검사 · 예외 → 근거(접힘, `rules-build.py`가 읽는다). 다른 장은 링크로, 규칙은 `<code>RM-…</code>`(자동 링크).

## tools/ (배포 제외 · 검수용)

- 색: `palette-gen.py`(팔레트 생성) · `palette-preview.html` · `cta-check.html`(CTA 32배경) · `color-audit.html`(화면 × 테마 × 디버그 상태별 글자 · 면 대비. 테마 토글이 없는 결과 화면은 그 테마만 정식 기준)
- 규칙 · 데이터: `style-audit.py`(지킬 것 11 · 지켜볼 것 4, `--strict`면 실패 시 종료 코드 1) · `usage-scan.py` → `screens-build.py` · `tokens-build.py` · `rules-build.py`
- 홈 · 캐릭터: `home-contact.html` · `holo-check.html` · `holo-bench.html` · `planet-ref.py` · `char-on-bg.py`
- 전후 대조: `screen-shot.sh /tmp/before [포트]` → `screen-shot.sh /tmp/after` → `screen-diff.py /tmp/before /tmp/after`(`--crop 화면`) · `rule-compare.py`(`--count`) · `dark-shot.html`(다크 촬영 — `screen-shot.sh`는 라이트만)
  - 부품을 옮겼는데 0.00%면 성공. `nav/*`의 0.1~2%는 별 반짝임 잡음, 무한 애니메이션 · 테마 전환 중 촬영도 튄다 — 같은 코드로 두 번 찍어 0.00%가 나오는지 본다.
  - 화소 대조가 못 잡는 것: 커서 · 화면이 쓰지 않는 테마 · 눌러야 뜨는 것. 그래서 「화면 변화 0」의 주 근거는 계산 스타일 대조다 —
    `git worktree add --detach .wt-old <커밋>`(`.git/info/exclude`에 `.wt-old/`)으로 옛 판을 같은 서버에 열고 요소마다 계산 스타일을 라이트 · 다크로 비교, 끝나면 `git worktree remove .wt-old`.
- **시안은 결론이 나면 지운다.** 남길 것은 파일이 아니라 판단이고, 판단은 `docs/decisions/`와 옵시디언 「판단 기록」에 적는다. 지운 시안은 깃 기록에 있다.
  아직 결론이 안 난 것만 남긴다: `mission-board-mockup.html`(과제센터 보류, 머리 주석에 9차 계획) · `proposal-curr-layout.html` + `curr-layout.html`(커리큘럼 라운드 배치 A · B · C 보류, 둘이 한 벌).

## 미리보기 · 배포

- 서버: `.claude/launch.json`의 **rm-static**(8020). Bash로 서버를 띄우지 않는다. Portfolio 폴더에서 연 세션은 공통 설정의 rm-static(8040) — `tools/screen-shot.sh /tmp/x 8040`.
- 배포: main에 푸시하면 Vercel 자동 배포(`readingmath-v3-proto.vercel.app`). `figma-palette` · `tools` · `video` · `docs` · `CLAUDE.md` · `.claude`는 배포 제외(`.vercelignore`).

## 규칙 색인 (2026-10-14)

<!-- rules:start (tools/rules-build.py 가 쓴다 — 손으로 고치지 않는다) -->

규칙 색인 — 정본은 스토리북 `styleguide/rules.html`(근거·검사·예외는 거기). 인용은 번호로 한다.

- **COL** 색
  - `RM-COL-01` 색은 `tokens.css`의 변수로만 쓴다
  - `RM-COL-02` 반투명은 알파 램프 또는 「토큰을 N% 섞기」 두 문법만
  - `RM-COL-03` 팔레트 hex는 손으로 고치지 않는다 — 생성기로 다시 만든다
  - `RM-COL-04` 상태색 `--*-vivid`를 일괄 치환하지 않는다 (눈)
  - `RM-COL-05` 화면은 팔레트를 직접 부르지 않는다 — 2단 역할 · 부품 토큰으로 받는다
- **FILL** 칠면
  - `RM-FILL-01` 작은 글자가 올라가는 칠면은 600 스텝 · 4.5:1
  - `RM-FILL-02` 정체성 칠면은 450 스텝 · 3:1 · 라벨 19px w700 이상
  - `RM-FILL-03` 글자 없는 장식면은 400 스텝 · 면 대비 3:1 (눈)
  - `RM-FILL-04` 앰버 위에는 흰 글자를 얹지 않는다
  - `RM-FILL-05` 정오답 배지는 500 · 숫자 20px w800 또는 ✓·✕
  - `RM-FILL-06` 칠면 위 글자는 다크에서도 흰색 — `--text-on-accent`
  - `RM-FILL-07` 칙칙해 보이면 채도부터 올리지 않는다 (눈)
  - `RM-FILL-08` CTA는 홈 32배경 모두에서 면 대비 3:1을 버틴다
- **SURF** 학습 화면의 면
  - `RM-SURF-01` 색을 흰색에 옅게 섞은 면을 만들지 않는다 (눈)
  - `RM-SURF-02` 정오답 칸은 면을 칠하지 않는다 — 선 · 배지 · 글자로만
  - `RM-SURF-03` 해설 박스는 면 없이 왼쪽 4px 계열색 띠 (눈)
  - `RM-SURF-04` 보기 박스와 선지는 같은 테두리 한 벌 — 보기가 선지보다 진하면 안 된다 (눈)
  - `RM-SURF-05` 프레임은 계열 600(서술형·시험 700) — 그 위에 반투명을 덧칠하지 않는다 (눈)
- **READ** 끊어읽기
  - `RM-READ-01` 안 읽은 곳만 흐리게 — 지금 구간은 읽은 곳과 같은 평문 (눈)
  - `RM-READ-02` 진행은 지문 아무 데나 누르기와 스페이스바 — 꾹 눌러도 한 칸 (눈)
  - `RM-READ-03` 그림 구간은 왼쪽 알약 `[그림 아이콘 + 번호들]`로만 알린다 (눈)
  - `RM-READ-04` 행간은 2.1, 분수가 든 줄과 문단 사이는 0.35em 더 (눈)
- **UTIL** 유틸 4화면
  - `RM-UTIL-01` 면은 뉴트럴-쿨 램프 하나로 쌓고, 파랑은 점·선·글자로만 (눈)
  - `RM-UTIL-02` 유틸에는 초록·앰버를 쓰지 않는다 (눈)
  - `RM-UTIL-03` 선택 = 반전 칠, 한 규칙 (눈)
  - `RM-UTIL-04` 목록은 테두리 시트, 선택지는 타일 — 떠 있는 블록과 갭을 쓰지 않는다 (눈)
  - `RM-UTIL-05` 다크가 기본, 라이트도 산다 — 테마 토글 버튼은 없다 (눈)
  - `RM-UTIL-06` 목록은 네 상태를 다 갖춘다 — 정상 · 로딩 · 빈 목록 · 실패 (눈)
- **SIZE** 치수
  - `RM-SIZE-01` 글자·간격·모서리는 눈금 토큰으로 — 눈금에 있는 값을 px로 쓰지 않는다
  - `RM-SIZE-02` 선 굵기와 볼록 두께도 눈금 — `--bw-*` · `--depth-*`
  - `RM-SIZE-03` px를 허용하는 곳은 넷 — 부품 고유 치수 · 위치 미세조정 · 반응형 끝값 · @media 조건
  - `RM-SIZE-04` 층위는 화면끼리만 `--z-*` 6단 — 부품 안쪽 순서는 1~9 (눈)
- **FILE** 파일
  - `RM-FILE-01` HTML 안에 `<style>`·`<script>`를 쓰지 않는다
  - `RM-FILE-02` 화면 파일 이름은 `<계열>-<화면>` (눈)
  - `RM-FILE-03` 계열이 같이 쓰는 규칙은 계열 파일로, 여러 계열이면 `components.css`
  - `RM-FILE-04` `components.css`에는 화면이 실제로 쓰는 부품만 둔다
  - `RM-FILE-05` 하위 폴더 화면은 `<head>` 바로 아래 `<base href="../">`
  - `RM-FILE-06` CSS·JS를 고쳤으면 전 화면의 `?v=`를 그날 날짜로
  - `RM-FILE-07` 새 화면은 `index.html` 목록에도 넣는다 (눈)
  - `RM-FILE-08` 그림 주소는 그것을 해석하는 파일 기준 — 변수에 넣을 때는 절대 주소로
- **NAME** 이름
  - `RM-NAME-01` 뜻 하나에 이름 하나 — 같은 이름에 다른 부품을 담지 않는다 (눈)
  - `RM-NAME-02` 상태는 `.is-*`, 변형은 `--modifier` (눈)
- **ASSET** 이미지
  - `RM-ASSET-01` 그림은 webp, 아이콘은 svg, 원본은 프로젝트 밖
  - `RM-ASSET-02` 아이콘 색은 파일 복제가 아니라 코드로 바꾼다 (눈)
  - `RM-ASSET-03` 그림이 들어올 빈자리는 `.dummy-img` (눈)
  - `RM-ASSET-04` 행성 홈은 좌표 고정 · 그림 교체 (눈)
  - `RM-ASSET-05` 그림과 이어 붙는 색은 에셋 연동색 토큰으로
- **PART** 공용 부품
  - `RM-PART-01` 이미 있는 부품을 먼저 찾는다 (눈)
  - `RM-PART-02` 보조 모니터는 틀만 공용 — 안의 내용은 화면 것 그대로 (눈)
  - `RM-PART-03` 계산기와 결과 계기판은 정적 하드웨어 — 테마를 따라가지 않는다 (눈)
  - `RM-PART-04` 수식은 KaTeX — 분수는 `\dfrac`, 슬래시로 적지 않는다 (눈)
  - `RM-PART-05` 새 학습 화면에는 검수 스위치를 붙인다 (눈)
  - `RM-PART-06` 빈칸 선지는 공용 창 하나 — 오답은 회색 ✕로 남고 정답은 0.5초 뒤 닫힌다 (눈)
  - `RM-PART-07` 콘솔바 안내는 CTA 바로 왼쪽 한 줄 — 글자는 하나, 상태는 램프로만 (눈)
  - `RM-PART-08` 문장 속 빈칸은 칸형 한 벌 — 면은 하나, 상태는 테두리 · 글자 · 배지로 (눈)
- **JS** 스크립트
  - `RM-JS-01` JS는 스타일을 만들지 않는다
  - `RM-JS-02` JS가 심는 변수는 목록에 올린다
  - `RM-JS-03` 조립식 경로는 문자열 검색만 믿지 않는다 — 전 화면 404 검사 (눈)

<!-- rules:end -->
