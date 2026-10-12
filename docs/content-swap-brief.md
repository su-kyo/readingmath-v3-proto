# 학습 콘텐츠를 가짜로 바꾸기 — 인수인계 지시서 (RM)

> 2026-10-12 작성. 새 대화방은 이 문서부터 읽는다. 저장소 `CLAUDE.md`도 함께 읽는다.
> MT에도 같은 지시서가 있다(`projects/MT/docs/content-swap-brief.md`) — 두 프로젝트는 **방을 따로** 연다.

## 0. 시작하면 맨 먼저 할 것 — 쓰기 전에 브리핑

**콘텐츠를 한 줄도 쓰기 전에** 아래 순서를 지킨다. 사용자가 직접 요청한 순서다.

1. 아래 §3 목록을 실제 파일과 대조해 빠진 곳이 없는지 확인한다.
2. **브리핑**: 계열(개념·유형·서술형·과제·시험·유틸)마다 「무엇을 어떤 내용으로 바꿀지」를 한두 줄씩 보여 준다.
   - 학년·학기·단원·주제, 지문 한 문단 요지, 문제는 대표 한두 개만 예시로 나머지는 개수와 유형만
   - 영상(§2)은 대안을 두세 개 근거와 함께 제안
   - 글자 수·줄 수 제약에 걸리는 자리는 표시
3. **사용자 승인을 받은 뒤에** 쓴다. 승인 전에는 파일을 고치지 않는다.

## 1. 목표

포트폴리오(비상교육 「AI 프로덕트 디자이너」 지원)에 화면을 싣기 위해 **회사 서비스의 실제 콘텐츠를 지우고, 그럴듯한 가짜로 바꾼다.**
화면 구조·디자인은 그대로 두고 **글과 데이터만** 바꾼다.

## 2. 바꿀 것 / 둘 것

**바꾼다**
- 개념 학습의 지문·요약, 다지기·기초 연산 문제, 유형 문제·해설, 서술형 문단·빈칸 정답·순서 맞추기 블록
- 과제·시험 문항과 결과표의 문항 이름·발문
- **개념 학습의 YouTube 영상** (`SG56wMWcqMU`) — 회사 콘텐츠다. 대안을 브리핑에서 제안한다
  (예: 자체 제작 짧은 영상 / 재생 화면 정지 이미지 + 재생 UI만 / 저작권 문제없는 공개 영상)
- 유틸 공지 본문(`시험 대비(유형 도전) 기능 오픈 안내` 등 — 실제 서비스 공지로 읽힌다), 결제 상품·가격 — 실제 값이면 가상으로

**두다**
- 행성 · 캐릭터 · 오브젝트 그림, 아이콘 전부
- 교육과정 단원 이름(「세 자리 수의 뺄셈」 같은 국가 교육과정 공통 이름) — 회사 고유 콘텐츠가 아니다. 다만 브리핑에서 한 번 확인받는다
- `index.html`(화면 목록)과 스토리북 `styleguide/`의 설명 글 — 우리가 쓴 문서다

## 3. 콘텐츠가 사는 곳

화면마다 HTML 마크업과 `scripts/`의 데이터 배열에 나뉘어 산다. 아래는 2026-10-12에 찾은 자리다 — 시작할 때 `grep`으로 다시 대조한다.

| 계열 | 파일 · 배열 |
| --- | --- |
| 개념 학습 · 정리 | `concept/learn.html`(지문 마크업이 직접 들어 있다) · `scripts/learn-concept.js` `DATA` · `scripts/concept-organize.js` `PASSAGES` · 영상 `scripts/concept-learn-video.js` `SRC` + `concept/learn.html`의 「유튜브에서 열기」 링크 |
| 개념 다지기 · 기초 연산 | `scripts/learn-drill.js` · `scripts/learn-basic-ops.js` `PROBLEMS` |
| 유형 훈련 · 해설 | `scripts/type-quiz.js` · `scripts/type-review.js` `PROBLEMS` · `scripts/type-result.js` |
| 서술형 | `scripts/essay-basics(-v2).js` · `essay-advanced.js` `ANSWERS`/`PARAS` · `essay-drill(-v2).js` · `essay-drill-review.js` `PROBLEMS` · `essay-report(-review).js` `ANSWERS`/`ROWS` · 각 HTML의 문단 |
| 결과 화면 | `scripts/step-result.js` `ACTIVITIES` · `*-training-result.js` `STAGES` · `essay-step-result.js` |
| 과제 | `scripts/assignment-home.js` `KPIS`/`ACTIVE`/`DONE` · `assignment-solve.js` · `assignment-explain.js` · `assignment-result.js` `ROWS` |
| 시험 | `scripts/exam-home.js` `UNITS`/`ACH` · `scripts/exam-solve.js` `QUESTIONS` · `exam/home.html` |
| 행성 · 커리큘럼 | `scripts/nav-home.js` `UNITS` · `nav-curriculum.js` `UNITS` · `nav-freemode.js` `SEM_UNITS` (단원 이름 — §2 「두다」 참고) |
| 유틸 | `scripts/util-notice-detail.js` `DOCS` · `util-notice.js` · `util-payment.js`(상품·가격) · `util-report.js` · `util-history.js` |
| 서랍 메뉴 | `scripts/gnb-drawer.js` `MENU` |

**킵 화면**(`essay/basics.html` · `essay/drill.html`, 가로 안)도 같이 바꾼다 — 비교용으로 남긴 쌍이라 한쪽만 바뀌면 비교가 깨진다.

## 4. 지킬 제약

- **학년·교과 수준을 맞춘다.** 각 화면의 학기 표기(초등 4-1 · 중등 1-1 등)에 맞는 내용으로.
- **수식은 KaTeX**(`\dfrac` — 슬래시 분수 금지). 수식 안 빈칸 `\htmlClass{dblank}{?}` 같은 장치는 그대로 살린다.
- **개수·구조는 그대로** — 문항 수, 빈칸 수, 보기 수, 순서 맞추기 블록 수, 결과 LED 문항 수.
- **정답이 하나로 정해지게** 쓰고, 정답·해설·채점 데이터를 함께 고친다. 디버그 패널(`?debug=1`)의 정답/오답 훅이 여전히 맞는지 본다.
- 특정 교과서·출판사 문장을 옮겨 오지 않는다. 일반적인 교육과정 주제로 직접 쓴다.
- 화면 CSS·구조는 건드리지 않는다. 글이 길어 레이아웃이 깨지면 글을 줄인다.

## 5. 확인 방법

1. 고치기 전 전 화면을 찍어 둔다: `tools/screen-shot.sh <폴더> 8040` (라이트) + `tools/dark-shot.html`(다크).
2. 바꾼 뒤 다시 찍어 `tools/screen-diff.py`로 대조한다. **바뀐 곳이 글자뿐인지** 본다. 잡음 목록은 `CLAUDE.md` 「검수 도구」.
3. `?debug=1`로 각 화면의 정답·오답·완료 상태를 돌려 본다.
4. `python3 -I tools/style-audit.py --strict` · `tools/usage-scan.py`.
5. JS를 고쳤으면 전 화면 `?v=` 캐시 번호를 올린다.

## 6. 끝나면

- 옵시디언 「리딩수학과학 (RM)」 노트에 판단을 남긴다(`~/Documents/Obsidian/9 템플릿/작업 기록 지시문.md`).
- 이 지시서는 할 일이 끝나면 지운다(판단은 옵시디언에 남는다).
