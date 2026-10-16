# RM 커밋 8f58cd3 검수 결과

- 대상: RM(리딩수학과학 리디자인), `f7bb758..8f58cd3`
- 검수 기준: `CLAUDE.md`, 규칙 정본 `styleguide/rules.html`의 RM 규칙 51개
- 핵심 질문: 이 커밋이 주장하는 “화면이 한 픽셀도 안 바뀌는 정리”가 성립하는가?
- 검수 방식: 커밋 전후 코드 및 브라우저 계산 스타일 비교. 화면은 1280×800, 토큰은 라이트·다크 × data-section 7종으로 대조했다. 동적 상태도 별도로 확인했다.
- 원본 저장소는 수정하지 않았다. 문서 말투·문체는 검수 대상에서 제외했다.
- 아래 경로는 RM 저장소 루트 기준이며, 줄 번호는 `8f58cd3` 기준이다.

## 판단

엄밀한 “화면 무변경” 주장은 전체 범위에서 성립하지 않는다. 확정 문제 5건과 라이트 조합에서 확인한 조건부 차이 1건이다. 높음 심각도 문제는 발견하지 못했다.

실제 동작 변화는 서술형 주어진 답 칸의 커서 변경과 내부 팔레트 비교 화면의 메뉴 서랍 손상이다. 결과 화면의 글자색 차이는 라이트를 강제로 적용할 때 발생하며, 기본 다크 경로의 회귀와 구분해야 한다. 나머지는 생성 데이터와 검사 도구의 오류다.

## 발견 사항

### 1. 중간 · tools/tokens-build.py:192

**문제:** 에셋 토큰의 계열별 값을 누락해 `styleguide/data/tokens.json`이 실제 CSS의 모든 계열값을 표현하지 못한다.

`sections` 출력 조건에 `theme`·`semantic`만 포함하고 `asset` 그룹을 제외한다. 그 결과 에셋 토큰은 concept 기준 값만 제공한다.

**재현 방법:**

1. `styles/tokens.css`를 적용한 페이지의 루트에 `data-section="type"`을 설정한다.
2. `--art-screen-veil`을 실제 색 속성에 적용해 브라우저 계산값을 확인하고, `styleguide/data/tokens.json:1828`의 `art-screen-veil`과 비교한다.
3. 실제 CSS의 알파는 **0.55**, JSON은 **0.45**다. essay는 **0.25**, exam·assign은 **0.65**지만 JSON에는 역시 0.45만 있다. 라이트·다크 모두 동일한 누락이다.

같은 원인으로 `--asset-bar-rim`, `--asset-bar-tray`, `--art-screen-bg`의 계열값도 빠진다. type 기준 실제 값은 각각 `#FFF6E6`, `#ECE3D8`, `bg-spaceship-teal.webp`지만 JSON은 concept 값인 `#DAE6F9`, `#87AEEC`, `bg-spaceship-light.webp`만 제공한다.

이는 현재 화면을 직접 바꾸는 오류가 아니라 개발자 전달 데이터의 오류다. `color-mix()` 산술 오류와는 구분해야 한다.

### 2. 중간 · tools/style-audit.py:219

**문제:** 새 JS 스타일 검사가 세부 속성명을 놓쳐 실제 위반이 있어도 `0 ✓`로 통과한다.

정규식이 인라인 문자열의 `margin:`은 잡지만 `margin-top:`, `font-size:`, `background-color:`, `border-color:` 등을 놓친다.

**재현 방법:**

1. 저장소 루트에서 `python3 tools/style-audit.py --strict`를 실행한다.
2. `JS 안 스타일 [RM-JS-01] 0 ✓`와 종료 코드 0을 확인한다.
3. `scripts/util-notice.js:33`, `scripts/util-report.js:24`에는 고정 `margin-top:11px` 인라인 스타일이 있다. 각각 `util/notice.html?state=loading`, `util/report.html?state=loading`에서 사용된다.

기존 인라인 코드 자체가 이번 커밋에서 추가된 것은 아니다. 이번에 도입한 검사가 이미 존재하는 위반을 놓치는 문제다.

### 3. 낮음 · scripts/gnb-drawer.js:22

**문제:** 내부 팔레트 비교 화면 두 곳에서 메뉴 서랍이 보이지 않는다.

JS의 스타일 주입을 제거하고 `styles/gnb.css`로 옮겼지만, 아래 화면들은 자체 `./gnb.css`와 공유 `gnb-drawer.js`를 함께 사용한다. 자체 CSS에는 옮긴 `.rmd` 규칙이 없다.

- `figma-palette/assignment-home.html`
- `figma-palette/exam-home.html`

**재현 방법:** 두 화면 중 하나를 열고 우측 상단 메뉴 버튼을 클릭한다. 이전에는 우측에 고정된 서랍이 열렸지만, 이후에는 화면 아래에 일반 요소로 생성되어 보이지 않는다.

브라우저 비교에서 서랍의 `position`은 **fixed → static**, 너비는 **384px → 화면 전체**로 바뀌었다. 1366×1024 검증 화면에서 y 좌표는 **0 → 1024**, 배경은 네이비에서 투명으로 바뀌었다.

배포 제외 내부 비교 화면에 한정된 회귀이므로 낮음으로 분류했다. 운영 화면의 서랍과는 구분해야 한다.

### 4. 낮음 · styles/essay.css:209

**문제:** 주어진 답 칸의 커서가 클릭 가능한 손 모양으로 바뀐다.

`.blank--given { cursor:default }`를 먼저 로드되는 공용 파일로 옮겨, 뒤에 로드되는 화면 CSS의 `.blank { cursor:pointer }`가 같은 우선순위로 덮는다.

**재현 방법:**

1. `essay/basics-v2.html`에서 “고등어 6손을 3마리씩 나눠요.” 칸 위에 마우스를 올린다.
2. 또는 콘솔에서 아래 값을 비교한다.

```js
getComputedStyle(document.querySelector('.blank--given')).cursor
```

이전은 **default**, 이후는 **pointer**다. `essay/basics.html`, `essay/advanced.html`도 동일하다. 클릭은 JS에서 계속 무시되므로 커서가 실제 동작과 맞지 않게 된다.

### 5. 낮음·조건부 · styles/result.css:118

**문제:** 고정 계기판 글자색을 테마 종속 토큰으로 바꿔 라이트 조합에서 값이 달라진다.

`.score__val` 등의 고정 팔레트 색을 `--text`·`--text-muted`로 바꿨다. 다크에서는 같지만 라이트에서는 다른 색으로 계산된다.

**재현 방법:** `shared/training-result.html`에서 다음을 실행하고 두 커밋의 값을 비교한다.

```js
document.documentElement.dataset.theme = 'light';
getComputedStyle(document.querySelector('.score__val')).color;
```

이전은 **#F0F5FE**, 이후는 **#121E37**이다. 유형·서술형 훈련 결과에서도 같은 차이를 확인했다.

**적용 조건:** 이 화면들은 기본 다크 고정이며 사용자용 테마 토글이 없다. 요청한 라이트·다크 조합 검사에서는 확정 불일치지만, 기본 다크 사용 경로에서 발생하는 회귀로 해석하면 안 된다.

### 6. 낮음 · tools/screens-build.py:60

**문제:** KaTeX 경로 판정이 실제 로드 경로와 맞지 않아 화면 지도에서 수식 규칙이 빠진다.

`loads()`는 목록 원소의 완전 일치를 검사하는데 조건에는 파일 경로가 아닌 `scripts/vendor/katex` 디렉터리 경로를 넣었다.

**재현 방법:** `concept/drill.html`의 `scripts/vendor/katex/katex.min.js` 로드와 `styleguide/data/screens.json`의 해당 화면 `rules`를 대조한다. KaTeX를 사용하지만 `RM-PART-04`가 없다.

## 그 밖의 확인 결과와 범위

- `--sp-*`, `--bw-*`, `--depth-*`를 실제 px로 복원해 대조했으며, 치수 값 불일치는 찾지 못했다.
- `@media` 조건 변경이나 `clamp()` 내부 값의 잘못된 치환은 발견하지 못했다.
- 공용 CSS로 옮긴 선언의 누락과 이동한 `url()`의 경로 오류는 발견하지 못했다. 과제 화면의 달 아이콘 경로는 `../../assets`에서 `../assets`로 올바르게 조정됐다.
- 지원 화면 맥락에서 새 `--text-on-accent` 사용의 확정적인 의미상 오용은 찾지 못했다.
- 운영 화면 10곳의 서랍·학기 변경 모달, curriculum 태그·등급, freemode 상세 태그, assignment 차트·링, exam 중요 유형 별, nav-home 강조색은 검사한 동작에서 이전과 같은 계산 스타일이었다. 연습장도 대표 화면에서 계산 스타일과 필터 적용이 같았다.
- 현재 `color-mix()` 산술 자체는 브라우저 계산과 맞았다. 예를 들어 type/light `--th-tint`는 `rgba(13, 148, 132, 0.08)`, essay/dark `--th-tint-strong`은 `rgba(128, 90, 253, 0.38)`로 일치했다.
- `--text`의 라이트·다크 값, `--primary`, `--bw-1_5`, `--depth-4` 표본은 CSS와 JSON이 일치했다. 1번 문제는 계열별 에셋 값의 누락이다.
- `rules.json`의 51개 규칙은 정본과 일치했고 `python3 tools/rules-build.py --check`도 통과했다.
- 결과 화면의 순차 점등 등 시간차로 발생한 비교 차이는 `?snap=1` 최종 상태로 재검사해 제외했다.
- 이 검수는 코드 및 계산 스타일·동작 대조이며, 모든 해상도와 모든 상태의 화소 단위 동일성을 보증하는 검사는 아니다.
