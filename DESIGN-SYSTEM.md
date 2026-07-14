# 리딩수학과학 디자인 시스템 · RMDS v1.0

> **이 문서의 지위** — 이 프로젝트의 모든 색·타이포·형태·컴포넌트 결정의 **단일 정본**이다.
> 코드와 이 문서가 다르면 이 문서가 맞다(코드를 고친다). 새 색·새 규칙이 필요하면
> **이 문서를 먼저 개정**하고 코드에 반영한다.
>
> **에이전트 실행 규칙** — 이 문서를 읽고 수정 작업을 수행하는 에이전트는
> §10(마이그레이션 계획)의 담당 범위만 수정하고, §3.6(금지 규칙)을 위반하지 않으며,
> 완료 시 §10.4(검증 체크리스트)를 반드시 통과시킨다.

---

## 1. 디자인 원칙 (6원칙)

1. **Flat 절대 원칙** — 그라데이션·글로우·컬러 섀도 금지. 심미성은 효과가 아니라
   **팔레트 선택 + 위계 + 여백**으로 만든다.
   *허용 예외 2가지: ① 우주 배경(space-bg 성운·별 캔버스) ② 스켈레톤 시머(로딩 애니메이션).*
2. **브랜드 언더톤 뉴트럴** — 순수 회색 금지. 모든 중립색은 네이비 언더톤 뉴트럴 램프(§3.1)에서만 가져온다.
3. **한 화면 = 한 포인트색** — 각 섹션(개념/유형/서술형/시험/과제)은 액센트 1색만 쓴다.
   정답·오답·주의 같은 **상태색은 전 섹션 공용**이며 섹션 액센트와 역할이 겹치지 않는다.
4. **프레임은 정적, 내용은 테마** — 스크린 최외곽 프레임·헤더 색은 섹션 고정색(라이트/다크 불변).
   내부 표면·글자만 뉴트럴 램프 위에서 라이트/다크로 재배치된다.
5. **content 공통 + 포인트 1색** — 콘텐츠 내부 컴포넌트(카드·선택지·키패드·빈칸·토스트…)는
   전 섹션이 같은 뼈대를 공유하고, 섹션 차이는 **테마 슬롯 값 교체만**으로 표현한다.
6. **색은 토큰으로만** — 페이지 CSS에 raw hex 금지. 예외는 §3.5(에셋 고정색) 목록뿐.
   rgba 틴트도 즉흥 제조 금지 — §3.4의 tint 슬롯만 사용.

---

## 2. 아키텍처: 3단 토큰 + 2개의 HTML 속성

```
1단 PRIMITIVE  색 원본(램프). tokens.css에만 존재. 여기 없는 hex는 이 세상에 없는 색.
2단 SEMANTIC   전역 역할. 표면/글자/테두리/상태/CTA. 라이트·다크는 이 층에서만 갈아끼움.
3단 THEME SLOT 섹션 테마 계약. 모든 섹션이 같은 슬롯 이름(--th-*)을 쓰고 값만 다름.
```

**메커니즘** — 각 페이지는 `<html>`에 속성 2개만 선언한다:

```html
<html data-section="essay" data-theme="light">
```

- `data-theme` : `light` | `dark` — 2단 SEMANTIC이 갈아끼워짐. (토글 버튼 + localStorage `rm-theme`)
- `data-section` : `concept` | `type` | `essay` | `exam` | `assign` | `util` | `space` — 3단 THEME SLOT이 갈아끼워짐.

tokens.css가 `:root[data-section="..."] { --th-…: … }` 블록을 제공하므로,
**페이지 인라인 CSS는 색을 정의하지 않는다.** 레이아웃(배치·크기)만 담당한다.

### 테마 슬롯 계약 (--th-*, 총 11슬롯 — 이것이 섹션이 가질 수 있는 색의 전부)

| 슬롯 | 역할 | 사용처 예 |
|---|---|---|
| `--th-static` | 프레임·헤더 딥톤 (라이트/다크 **불변**) | .screen 테두리, 헤더 bg, 문제번호 배지 |
| `--th-accent` | 섹션 포인트색 | 선택 테두리, 진행바, 활성 탭, 섹션 버튼 |
| `--th-accent-strong` | accent 눌림/음영 | pressed, 진한 강조 |
| `--th-accent-hi` | **다크 표면 위** 액센트 (밝힌 톤) | 다크 모드 강조 텍스트·아이콘 |
| `--th-ink-accent` | **라이트 표면 위** 액센트 텍스트 (대비 확보 딥톤) | 흰 카드 위 섹션색 글자 |
| `--th-on-accent` | accent/static 위 글자 | 항상 `#FFFFFF` |
| `--th-tint` | 액센트 틴트 배경 (호버·연한 선택) | hover bg, 연한 칩 |
| `--th-tint-strong` | 진한 틴트 (선택됨) | is-sel 배경, 활성 칩 |
| `--th-chip` | 불투명 칩 배경 (가족 050/100) | 라벨 필, 뱃지 배경 |
| `--th-panel` | 라이트 콘텐츠 패널(거터) 배경 | .content 배경 (카드 뒤 틴트면) |
| `--th-focus` | 포커스 링 | :focus-visible (라이트=accent, 다크=accent-hi) |

이 10슬롯으로 표현이 안 되는 색 요구가 나오면 → 슬롯을 늘리지 말고 **전역 시맨틱(상태색·뉴트럴)로 해결**하거나 이 문서를 개정한다.

---

## 3. 컬러

### 3.0 컬러 체계 생성 논리 — "한 사다리, 여러 색상" ★

이 시스템의 팔레트는 **손으로 고른 색 모음이 아니라, 하나의 톤 골격에서 생성된다.**
모든 액센트 색상 가족(블루/틸/바이올렛/그린/레드/오렌지/앰버/시안)은
**같은 명도 사다리(OKLCH L) + 같은 채도 곡선(C)** 을 공유하고, 가족마다 **색상각(hue) 하나만** 다르다.

```
스텝   OKLCH L   목표 C    역할   (v1.5 vivid 밴드 명도·채도 상향 — "물 빠져 칙칙" 피드백)
050    0.975     0.026     틴트 배경
100    0.935     0.072     칩 배경
200    0.865     0.120     라이트 보더 · 소프트
300    0.798     0.196     다크 표면 위 텍스트/아이콘 · 뱃지  (n-800 대비 ≥ 8.6:1 보장)
400    0.732     0.252     VIVID — 정체성 (모드탭·CTA·현재 마커·호버)  (n-900 대비 ≥ 6:1)
500    0.598     0.264     CORE — solid 칠 (흰 글자 AA-large ≥3:1 — 굵은/큰 텍스트·아이콘 전용)
600    0.478     0.210     pressed · 흰 배경 컬러 텍스트 (흰 배경 ≥ 6:1 — 작은 글자 OK)
700    0.395     0.170     ink · 섹션 프레임             (흰 배경 ≥ 9:1)
800    0.320     0.140     딥 static · 최심 프레임
900    0.245     0.095     최심부
```
*목표 C는 gamut 한계(GAMUT_SAFETY=0.98)에서 클램프됨 — blue/violet/red/cyan은 여유가 커서 채도가 크게 오르고, green/teal/amber는 sRGB 한계라 소폭.
**중요(v1.5): 500 명도를 올려 solid 칠이 라이트/다크 양쪽에서 쨍하게 됨. 대가로 500 위 흰 글자는 AA(4.5)→AA-large(3:1) 완화 → 500 solid 위 텍스트는 굵은/큰 글자·아이콘만. 작은 컬러 텍스트는 600(흰 배경)/300(다크 배경).***

이 구조가 보장하는 것:
1. **어느 가족의 같은 스텝이든 시각 무게가 동일** — teal-500과 violet-500은 형제처럼 읽힘.
2. **뉴트럴이 어디든 어울림** — 뉴트럴도 같은 브랜드 색상각(h≈265, 네이비)의 저채도 버전이므로.
3. **대비 보장이 스텝에 붙음** — "흰 글자는 500부터", "흰 배경 컬러 텍스트는 600부터" 같은
   규칙이 색과 무관하게 성립. 컴포넌트 레시피가 hex가 아니라 **스텝 번호**로 쓰인다.
4. **색 교체 = hue 숫자 하나** — §3.7 프로토콜 참조.

**뉴트럴도 같은 논리로 생성된다** — 라이트 존(050~400)은 다크 존과 동일한 색상각(h≈262)에
채도가 500을 향해 **단조증가**(v1.4: .013→.022→.034→.046→.058→.063)하도록 생성.
다크 존(500~950)은 검증된 우주 네이비를 유지(생성기의 고정 앵커).
*v1.4에서 라이트 뉴트럴 채도를 올림 — "UI가 거의 무채색 그레이라 네이비 우주 배경과 따로 논다"는
피드백에 대응해, 뉴트럴을 네이비 가족의 저채도 버전으로 더 확실히 읽히게 함.*

**생성기**: [`tools/palette-gen.py`](tools/palette-gen.py) — 사다리·색상각의 단일 소스.
실행하면 hex 시트 + WCAG 대비 검증(40항목) + 미리보기(`tools/palette-preview.html`)가 재생성된다.
**팔레트 수정은 반드시 이 스크립트를 통해서만** (hex 손편집 금지 — 사다리 무결성 보호).

### 3.1 프리미티브 정본 시트 (생성 결과 · 2026-07-13 기준)

**뉴트럴 N — 브랜드 네이비 언더톤 (13계단 · 라이트 존 생성 / 다크 존 유지)**

| 토큰 | HEX | 존 | 비고 |
|---|---|---|---|
| `--n-000` | `#FFFFFF` | — | 카드 |
| `--n-050` | `#F0F5FE` | 생성 | 라이트 인셋·서술형 패널 |
| `--n-100` | `#E4ECFB` | 생성 | 라이트 거터·개념/유형 패널 |
| `--n-200` | `#CBD7EE` | 생성 | 라이트 테두리·비활성 |
| `--n-300` | `#A0B0CD` | 생성 | 다크면 muted 글자 (n-800 대비 8.4:1) |
| `--n-400` | `#586B8C` | 생성 | meta 글자 (흰 배경 5.4:1) |
| `--n-500` | `#3A466A` | 유지 | 다크 인터랙티브·콘솔 네이비 (`--c-navy` 흡수) |
| `--n-600` | `#1F2B49` | 유지 | 다크 카드 |
| `--n-650` | `#121E37` | 유지 | 라이트 잉크 (`#121E37`·`--blue-800` 흡수) |
| `--n-700` | `#0F1930` | 유지 | 다크 표면-2 |
| `--n-800` | `#091328` | 유지 | 다크 표면-1 |
| `--n-900` | `#060E20` | 유지 | 다크 배경·GNB |
| `--n-950` | `#03060F` | 유지 | 최심부 |

> 구 라이트 존(`#F2F4F7 / #E4E7EC / #C1CBDA / #9DA3B1 / #5C6373`)은 폐기 — 부록 A 치환 대상.

**액센트 8가족 × 10스텝 (생성)** — 색상각: blue 257° · cyan 220° · teal 182° · green 142° · amber 80° · orange 52° · red 25° · violet 288°

| 가족 | 050 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| `--blue-*` | `#F2F7FF` | `#DDEBFF` | `#B8D5FE` | `#93BFFE` | `#6EAAFD` | `#0A7AF8` | `#0559B8` | `#03438E` | `#01306A` | `#011F48` |
| `--cyan-*` | `#EBFAFF` | `#C9F1FF` | `#86E2FE` | `#18D1FC` | `#14BAE1` | `#0D8EAB` | `#06687E` | `#044F60` | `#023947` | `#01252F` |
| `--teal-*` | `#E5FDF8` | `#B4FAED` | `#68ECD8` | `#19DAC4` | `#15C2AE` | `#0D9484` | `#076C61` | `#045249` | `#023C35` | `#012722` |
| `--green-*` | `#EDFCEB` | `#CFF6CA` | `#A5E79D` | `#68DB5E` | `#23CB12` | `#189A0A` | `#0F7105` | `#095603` | `#053F01` | `#022901` |
| `--amber-*` | `#FFF6E6` | `#FFE6BE` | `#FCCA72` | `#F3AF14` | `#D99C11` | `#A5760A` | `#795605` | `#5D4103` | `#442E01` | `#2D1D01` |
| `--orange-*` | `#FFF4EE` | `#FFE3D4` | `#FEC4A2` | `#FEA46D` | `#FE811B` | `#C3600A` | `#904505` | `#6E3403` | `#522401` | `#371601` |
| `--red-*` | `#FFF4F3` | `#FFE2DF` | `#FEC1BB` | `#FEA098` | `#FE7A73` | `#EC102B` | `#AF081D` | `#870514` | `#65020C` | `#430206` |
| `--violet-*` | `#F6F6FF` | `#E8E7FF` | `#D0CCFE` | `#B9B2FE` | `#A598FD` | `#805AFD` | `#5F38C9` | `#472A9A` | `#341C74` | `#20144A` |

**골드/브론즈 (별·등급, 에셋 세트)** : `--gold-500 #FFC800` [에셋] · `--bronze-500 #E08A4B`

> **구 팔레트 대비 핵심 변화** — 기존 500들은 명도가 0.45~0.85로 널뛰어
> "어떤 건 진하고 어떤 건 연한" 상태였다(사용자 지적: "500이 너무 연함").
> 신규 500은 전 가족 L=0.55로 정규화되어 **전부 흰 글자를 얹을 수 있는 확실한 코어 톤**이다.
> 구색(`#7777FF`·`#58CC02`·`#FF7F00`·`#0B57BD` 등)은 전부 폐기, 부록 A로 치환.
> 옐로 가족은 `--amber-*`로 개명(순수 옐로는 사다리에서 정체성이 무너지므로 골드-앰버로 정의).
> `--purple-*`→`--violet-*` 개명 · `--blue-bright(#008CFF)` 폐기(모드탭은 blue-400).

### 3.2 전역 시맨틱 — 표면·글자·테두리 (라이트/다크는 여기서만 뒤집힘)

| 시맨틱 | 다크 (기본) | 라이트 (`data-theme="light"`) |
|---|---|---|
| `--bg` 배경(거터 밖) | n-900 | n-100 |
| `--surface-1` 패널 | n-800 | n-000 |
| `--surface-2` 카드 안 인셋 | n-700 | n-050 |
| `--surface-3` 인터랙티브(키·선택지) | n-600 | n-100 |
| `--surface-hover` 호버 | n-500 | n-050 |
| `--surface-sunken` 침몰면 | n-950 | n-200 |
| `--text` 본문 | n-050 | n-650 |
| `--text-muted` 보조 | n-300 | n-500 |
| `--text-meta` 캡션·메타 | n-400 | n-400 |
| `--border` 기본 선 | `rgba(255,255,255,.08)` | `rgba(20,32,58,.10)` |
| `--border-strong` 강한 선 | `rgba(255,255,255,.16)` | `rgba(20,32,58,.20)` |
| `--scrim` 오버레이 딤 | `rgba(6,10,22,.72)` | `rgba(20,28,48,.44)` |
| `--shadow-1` | `0 2px 8px rgba(0,0,0,.28)` | `0 2px 8px rgba(24,40,80,.10)` |
| `--shadow-2` | `0 8px 24px rgba(0,0,0,.36)` | `0 10px 28px rgba(24,40,80,.14)` |

**표면 사다리 규칙** — 겹침은 반드시 한 계단씩:
다크 `배경 n-900 → 패널 n-800 → 카드 인셋 n-700 → 인터랙티브 n-600 → 호버 n-500`,
라이트 `거터 n-100(또는 th-panel) → 카드 n-000 → 인셋 n-050 → 호버 n-050`.
계단을 건너뛰거나 임의 rgba로 층을 만들지 않는다.

### 3.3 상태색 (전 섹션 공용 · 4역할 × 4변형 매트릭스)

> 상태색도 §3.0 사다리의 산물 — 역할별로 스텝만 지정한다: `solid`=500 · `on-dark`=300 · `ink`=600 · `tint`=050.

| 역할 | `solid` 칠 (500) | `on-dark` 다크 위 (300) | `ink` 라이트 글자 (600) | `tint` 배경 (050) |
|---|---|---|---|---|
| 정답 `--ok-*` | `#17890C` | `#82CB7A` | `#116E08` | `#F0FAEE` |
| 오답 `--no-*` | `#C92F33` | `#FD948C` | `#A32226` | `#FFF4F3` |
| 주의 `--warn-*` | amber-300 `#E3AB42` **+ 다크 글자** | `#E3AB42` | amber-600 `#765407` | `#FEF6E8` |
| 정보 `--info-*` | `#0B6DDD` | `#87B8FD` | `#0757B3` | `#F2F7FF` |

- **주의만 예외 규칙**: 앰버는 물리적으로 흰 글자를 얹을 수 없다 → solid 채움은 **amber-300 + n-900 글자**.
- **현재 위치 마커** `--current: var(--amber-300)` — OMR 현재 문항 테두리, "지금 여기" 표시 전용.
  (섹션 액센트는 "선택했다", 앰버는 "지금 여기". 역할 분리 유지.)
- **등급(다크 LCD 텍스트·육각)**: S `cyan-300` · A `green-300` · B `blue-300` · C `n-300` — 전부 300스텝(다크 위 보장).
- **별 등급(커리큘럼 배지)**: [에셋연동] `#FFD21A / #FFC21A / #F1A93C / #E0A45C` (star PNG와 세트)
- 사용 규칙: 칩·배지 채움 = `solid`+흰 글자(주의 제외), 다크 위 텍스트 = `on-dark`, 흰 카드 위 텍스트 = `ink`, 배경 깔기 = `tint`+`ink` 글자. **이 조합 밖 사용 금지.**

### 3.4 섹션 테마 계약 값 (data-section별 슬롯 정의)

> 슬롯은 **가족 + 스텝**으로 정의된다. 섹션마다 다른 것은 "어느 가족이냐"뿐이고,
> 스텝 배정은 전 섹션 동일: accent=500 · strong=700 · hi=300 · ink=600 · tint=색혼합 8/15%.

| 슬롯 (스텝) | concept 개념<br>*blue* | type 유형<br>*teal* | essay 서술형<br>*violet* | exam 시험대비<br>*violet* | assign 과제<br>*blue* | util 유틸<br>*blue* |
|---|---|---|---|---|---|---|
| `--th-static` (프레임: 600~800) | 700 `#04438D` | 700 `#065249` | **800** `#33226B` | 700 `#46328E` | **600** `#0757B3` | n-900 |
| `--th-accent` (500) | `#0B6DDD` | `#0F8376` | `#7156D8` | `#7156D8` | `#0B6DDD` | `#0B6DDD` |
| `--th-accent-strong` (700) | `#04438D` | `#065249` | `#46328E` | `#46328E` | `#04438D` | `#04438D` |
| `--th-accent-hi` (300) | `#87B8FD` | `#87E7D7` | `#B2A9FD` | `#B2A9FD` | `#87B8FD` | — |
| `--th-ink-accent` (600) | `#0757B3` | `#0A695E` | `#5A43B0` | `#5A43B0` | `#0757B3` | `#0757B3` |
| `--th-on-accent` | `#FFFFFF` (전 섹션 공통) | | | | | |
| `--th-tint` | `color-mix(in srgb, var(--th-accent) 8%, transparent)` — **액센트에서 자동 파생** | | | | | |
| `--th-tint-strong` | `color-mix(in srgb, var(--th-accent) 15%, transparent)` | | | | | |
| `--th-chip` (칩 배경: 050/100) | 가족 050=연한 칩 · 100=진한 칩 (불투명 배경이 필요할 때) | | | | | |
| `--th-panel` (라이트) | n-100 | n-100 | n-050 | n-050 | n-100 | n-100 |
| `--th-focus` | 라이트=accent(500) · 다크=accent-hi(300) — 전 섹션 공통 규칙 | | | | | |

- 서술형(800)·시험(700)은 같은 바이올렛 가족, static 깊이만 다름. 개념(700)·과제(600)도 같은 블루 가족, static 깊이만 다름 — **"가족 공유 + 깊이 차등"이 의도된 설계.**
- 틴트가 `color-mix()`로 액센트에서 자동 파생되므로, **primitive의 hue를 바꾸면 틴트까지 전부 따라온다.**
- **space (A층: 홈·브릿지·자유모드·커리큘럼)** — 항상 다크(테마 토글 없음). `--th-static: n-900`,
  액센트는 **모드 색 = 각 가족의 400 스텝**: 기본 `blue-400 #4F98FC` · 자유 `green-400 #4EB245` · 시험 `violet-400 #9582FC` · 과제 `orange-400 #E77413`. GNB 모드탭 = 이 4색(다크 GNB 위 ≥6:1 보장).
- 유틸 액센트 = 브랜드 블루(구 `#2B60E0` 폐기 — 이원화 해소. 마이그레이션 후 사용자 검수 대상).

### 3.4b 주요 CTA (오렌지 — 전 섹션 공통)

| 토큰 | 값 | 비고 |
|---|---|---|
| `--primary` | orange-400 `#E77413` | **의도적으로 400** — CTA는 "정체성 순간"이라 비비드 스텝 사용 |
| `--primary-hover` | orange-300 `#F99B60` | 밝아지는 호버 |
| `--primary-pressed` | orange-500 `#AE560B` | |
| `--primary-deep` | orange-700 `#6E3404` | 드롭 섀도 shade |

- **제약**: CTA 위 흰 글자는 400 위에서 AA-large만 통과(≈3.2:1) → **CTA 라벨은 15px 이상 + w700 이상 필수**.
  작은 텍스트를 얹어야 하면 `--primary` 대신 orange-500을 쓴다.

### 3.7 색 교체 프로토콜 — "primitive만 바꾸면 전부 따라온다" ★

추후 색이 바뀔 때 대대적 수정은 없다. 케이스별 절차:

| 바꾸고 싶은 것 | 절차 | 영향 범위 |
|---|---|---|
| **한 섹션의 색상 자체** (예: 유형을 틸→코럴) | `palette-gen.py`의 `HUES`에서 색상각 1개 수정 → 재실행 → 출력 hex를 tokens.css 해당 가족 램프에 붙여넣기 | 그 가족을 쓰는 모든 화면 자동 연동. 틴트도 color-mix라 자동 |
| **섹션 ↔ 가족 재배정** (예: 시험을 바이올렛→시안) | tokens.css의 `[data-section="exam"]` 블록에서 가족 참조만 교체 | 코드 10줄 이내 |
| **브랜드 전체 톤** (더 진하게/연하게) | `palette-gen.py`의 `STEPS` 사다리(L·C) 수정 → 전 가족 재생성 | 전 시스템 일괄, 관계는 유지 |
| **뉴트럴 언더톤/라이트 존** | `palette-gen.py`의 `NEUTRAL_HUE`·`NEUTRAL_LIGHT_STEPS` 수정 → 재생성 (다크 존은 고정 앵커) | 라이트 표면 전체 — 문서 개정 필수 |

**금지**: 개별 스텝 hex 손편집(사다리 무결성 파괴), 램프 밖 색 추가.
모든 교체 후 `palette-gen.py` 실행 → 대비 검증 40항목 OK 확인 → `tools/palette-preview.html`로 눈 검증.

### 3.5 에셋 고정색 (raw hex 허용 예외 — 이 목록이 전부)

| 색 | 용도 | 이유 |
|---|---|---|
| `#ECE3D8` | 유형 콘솔 트레이 | console-type SVG와 세트 |
| `#C6BFEA` | 서술형 콘솔 트레이 | console-essay SVG와 세트 |
| `#AFC6E8` | 과제 콘솔 배경 | console-task SVG와 세트 |
| `#FFC800` | 별·등급 | star/grade PNG와 세트 |
| `#FFD21A #FFC21A #F1A93C #E0A45C` | 커리큘럼 별 배지 | star PNG 등급 세트 |
| space-bg.css/js 내부 색 | 우주 배경 성운·별 | 배경 아트 (원칙1 예외) |
| 형광펜 마크 1색 | 지문 하이라이트 | 원오프 문학 장치 |

### 3.6 금지 규칙 (에이전트 하드 룰)

1. 페이지/컴포넌트 CSS에 **raw hex 금지** (§3.5 예외만).
2. **새 rgba 제조 금지** — 틴트는 `--th-tint(-strong)`, 상태 tint, `--border(-strong)`, `--scrim`만.
3. **그라데이션·글로우·컬러 섀도 금지** (원칙 1 예외 2가지만).
4. 다크/라이트 분기는 **시맨틱 재정의로만** — 컴포넌트 셀렉터에 `[data-theme]` 직접 분기를 새로 늘리지 않는다(기존 것은 마이그레이션 때 흡수).
5. 섹션색을 상태 의미(정답/오답)로 쓰거나 상태색을 장식으로 쓰지 않는다.
6. 모드 색(각 가족 400 스텝의 GNB·A층 정체성 용도)은 학습 화면 내부에서 사용 금지 — 내부는 `--th-*` 슬롯만.
7. 토큰 추가/삭제는 이 문서 개정 커밋과 함께만.

---

## 4. 타이포그래피

### 4.1 서체 3족 (역할 고정)

| 패밀리 | 토큰 | 역할 | 로딩 |
|---|---|---|---|
| **Pretendard** | `--font-sans` | UI 전부 (버튼·라벨·메타·헤더·표) | CDN (base.css) |
| **Noto Serif KR** | `--font-serif` | **읽기 콘텐츠만** — 문제 지문, 끊어읽기, 풀이 서술, 개념 본문 | CDN (base.css) |
| **Kode Mono** | `--font-mono` | 숫자 전용 — 타이머, 점수, 문항번호, 키패드, LCD | CDN (base.css) |

- 규칙: **"학생이 읽는 글 = 세리프, 학생이 조작하는 것 = 산스, 기계가 보여주는 수 = 모노."**
- 폰트 로딩은 base.css의 @import 한 곳뿐. 페이지별 @import 중복(learn-concept, concept-organize) 제거.
- gnb.css의 자체 폰트 스택 → `var(--font-sans)`로 교체.
- 사용 웨이트만 로드: Pretendard 400/500/600/700/800 · Noto Serif KR 400/500/600/700 · Kode Mono 400/600/700.

### 4.2 타입 스케일

**UI 고정 스케일** (기존 유지):
`--fs-display 32 · --fs-h1 24 · --fs-h2 20 · --fs-title 18 · --fs-body 16 · --fs-sm 14 · --fs-xs 12`
웨이트 토큰에 `--fw-heavy: 800` 추가(라벨·필 강조용 — 현재 페이지들이 이미 800을 관행 사용).

**읽기 유동 스케일** [신규 3토큰 — 페이지마다 제각각인 clamp() 통일]:

| 토큰 | 값 | 용도 |
|---|---|---|
| `--fs-read-lg` | `clamp(17px, 1.5vw, 20px)` | 문제 제목·큰 지문 |
| `--fs-read` | `clamp(15px, 1.4vw, 18.5px)` | 지문·풀이 본문 |
| `--fs-read-sm` | `clamp(14px, 1.25vw, 16px)` | 참고자료·보조 읽기 |

### 4.3 조판 규칙

| 항목 | 규칙 |
|---|---|
| 행간 | UI `1.5` · 헤딩 `1.2` · 세리프 읽기 본문 `1.7~2.0` (끊어읽기 2.0~2.15) |
| 자간 | 산스 `-0.02em`(UI) ~ `-0.04em`(큰 제목) · 세리프 `-0.01~-0.02em` · 모노 `0` |
| 한글 줄바꿈 | 읽기 콘텐츠에 `word-break: keep-all` |
| 숫자 정렬 | 숫자가 세로로 정렬되는 모든 곳 `font-variant-numeric: tabular-nums` |
| 최대 행폭 | 읽기 본문 컨테이너 `max-width: 760px` (essay 계열 기존 값을 전 섹션 표준으로) |

---

## 5. 형태 — 간격·반경·그림자·모션·z-index

### 5.1 반경 사다리 (실사용 기준 재정의)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--r-sm` | 8px | 작은 인풋·미니 칩 |
| `--r-md` | 12px | 버튼·키패드 키 |
| `--r-lg` | 16px | 카드 내부 박스·조건박스 |
| `--r-card` | 20px | **[신규]** 표준 카드 |
| `--r-xl` | 24px | 큰 카드·패널 |
| `--r-panel` | 30px | **[신규]** 스크린 내부 패널 (위 모서리) |
| `--r-frame` | 34px | **[신규]** 스크린 최외곽 프레임 (위 모서리) |
| `--r-full` | 999px | 필·버블·트랙 |

### 5.2 간격
기존 4px 기반 스케일 유지 (`--space-1~16`). 카드 내부 패딩 표준: 소 16 / 중 20~24 / 대 26~34(clamp 허용).

### 5.3 그림자 (뉴트럴만)
- `--shadow-1/-2` (§3.2 값) — 오버레이·시트에만. 평면 카드에는 라이트에서 whisper 1개(`0 12px 30px -22px rgba(60,40,130,.5)` 류의 기존 카드 섀도는 `--shadow-card`로 토큰화) 또는 무그림자+테두리.
- **드롭 버튼**(게임식 입체 버튼): `box-shadow: 0 4px 0 <shade>` — shade는 **같은 가족의 +2~3스텝 딥톤**
  (CTA orange-400 → `--primary-deep`(700) · 콘솔 네이비 n-500 → n-650 · 섹션 버튼 500 → `--th-accent-strong`(700)). 컬러 글로우 금지.

### 5.4 모션

| 토큰 | 값 | 용도 |
|---|---|---|
| `--t-fast` | 140ms ease | 호버·토글·색 전환 (기존 `--transition` 개명 유지) |
| `--t-panel` | 300ms cubic-bezier(.3,.8,.3,1) | 시트·드로어·아코디언 |

- 모든 keyframes에 `prefers-reduced-motion: reduce` 대응 필수.
- 의미 있는 모션만: 정답 lockPop, 오답 shake, 진행 유도 pulse. 장식 모션 금지.

### 5.5 z-index 사다리 (전 페이지 통일)

`10` 스티키 요소 · `20` 스티키 카드 · `100` 하단 콘솔바 · `200` 드로어/시트+백드롭 · `300` 모달 · `400` 팝오버(qpop) · `500` 토스트

---

## 6. 컴포넌트 표준 (전 섹션 공용 레시피)

> 형태는 공용, 색은 슬롯. 아래 표의 토큰만 조합하면 어느 섹션에서든 그 섹션 테마로 렌더된다.

| 컴포넌트 | 레시피 (핵심만) |
|---|---|
| **스크린 셸** | 프레임 `border: 6px solid var(--th-static); border-radius: var(--r-frame) var(--r-frame) 0 0` · 헤더 bg `--th-static` + 글자 `--th-on-accent` · 내부 패널 radius `--r-panel` |
| **콘텐츠 거터** | 라이트 `--th-panel` / 다크 `--surface-1` |
| **카드** | bg `--surface-1`(라이트=n-000) · border `--border` · radius `--r-card` · 라이트 카드 섀도 `--shadow-card` |
| **CTA 버튼** | bg `--primary`(오렌지 전 섹션 공통) · drop `0 4px 0 var(--primary-deep)` · hover `--primary-hover` · **라벨 15px+ w700+** (§3.4b) |
| **콘솔 버튼** | bg `--n-500` · 글자 #FFF · drop `0 4px 0 var(--n-650)` |
| **섹션 버튼/활성 탭** | bg `--th-accent` · 글자 `--th-on-accent` · pressed `--th-accent-strong` |
| **고스트/보조 버튼** | bg `--surface-3` · hover `--surface-hover` · 글자 `--text` |
| **선택지 .opt** | 기본 bg `--surface-1`+border `--border-strong` · hover `--surface-hover` · 선택 `border --th-accent + bg --th-tint` · 번호원: 기본 `--border-strong`/선택 `--th-accent` 채움 |
| **빈칸 .blank** | 미채움 border-dash `--border-strong` · 활성 `--th-tint`+`--th-accent` 링(+pulse) · 채움 `--th-tint-strong` 배경 · 글자 `--th-ink-accent`(라이트)/`--th-accent-hi`(다크) |
| **키패드 .kp** | bg `--surface-3` · 글자 `--text` mono · 기능키 글자 `--th-accent` + bg `--th-tint` |
| **OMR 셀** | 미풀이: dashed `--border-strong` · 완료: `--th-accent` 채움+흰글자 · **현재: `--current` 3px 테두리** |
| **버블(답안 마킹)** | 기본 테두리 `--border-strong` · 마킹 `--th-accent` 채움+체크 |
| **진행바** | 트랙 `--surface-sunken` · 채움 `--th-accent` |
| **세그먼트 토글** | 트랙 `--surface-sunken` · 활성 `--th-accent`+흰글자 |
| **레벨 칩 (기본/실력/심화)** | 기본 `--info-tint`+`--info-ink` · 실력 `--th-tint`+`--th-ink-accent` · 심화 `--warn-tint`+`--warn-ink` *(즉흥 rgba 3종 → 시스템 칩으로 통일)* |
| **정오답 표시** | §3.3 매트릭스 그대로 (칠=solid, 텍스트=ink/on-dark, 배경=tint) |
| **토스트** | bg `--scrim`보다 진한 `--n-650`(라이트)/`--n-950`(다크) + 흰글자 · 에러 변형 bg `--no-ink` |
| **모달/시트** | 백드롭 `--scrim` · 패널 `--surface-1` · radius `--r-frame` 방향 모서리 · `--shadow-2` |
| **스크롤바** | thumb: 다크 `rgba(255,255,255,.2)` / 라이트 `--th-tint-strong` · pill · `background-clip: padding-box` |
| **포커스 링** | `outline: 3px solid var(--th-focus); outline-offset: 2px` — 전 페이지 동일 |

---

## 7. 라이트/다크 모드 규칙

1. **기본 테마**: 학습 페이지(개념/유형/서술형/과제solve) = **라이트 기본**, 토글로 다크.
   A층(space) = 다크 고정(토글 없음). 시험대비·유틸 = 라이트 고정(토글 없음, 현행 유지).
2. **영속화**: 토글 시 `localStorage['rm-theme']` 저장, 모든 토글 페이지 `<head>` 최상단에 공통 부트 스니펫(assignment-solve의 것을 표준으로) — FOUC 방지.
3. **불변 요소** (테마를 무시함): `--th-static` 프레임·헤더 · `--primary` CTA · 상태색 solid · 에셋 고정색 · GNB(항상 다크).
4. **뒤집히는 것**: §3.2 전역 시맨틱 전부 + `--th-focus`.
5. 다크에서 라이트 잉크(`n-650`)나 라이트에서 다크 표면(`n-600↓`)을 직접 참조하지 않는다 — 반드시 시맨틱을 통해서만.

---

## 8. 파일 아키텍처 & 코딩 규칙

### 8.1 CSS 파일 역할 (목표 상태)

```
styles/tokens.css      1·2·3단 토큰 전부 (+ data-section 테마 블록). 셀렉터는 :root 계열만.
styles/base.css        리셋 + 폰트 로딩 + 포커스 + 스크롤바 + 텍스트 유틸
styles/components.css  공용 UI 컴포넌트 (§6 레시피 구현)
styles/learn-shell.css 학습 스크린 셸 (프레임·헤더·브레드크럼·콘솔바)
styles/essay.css       서술형 전용 컴포넌트만 (빈칸 코어·qpop 등 공용화 후 잔여)
styles/type.css        유형 전용 컴포넌트만
styles/gnb.css         GNB+드로어 (토큰 소비자로 전환 — 자체 hex·폰트 제거)
styles/util.css        유틸 문서 셸 (토큰 소비자로 전환)
styles/space-bg.css    우주 배경 (에셋급 — 색 자유 예외)
```

### 8.2 로딩 규약

- **모든 페이지**는 최소 `tokens.css → base.css`를 로드한다 (home.html·bridge.html 누락 수정).
- 순서: `tokens → base → components → (섹션 css) → 인라인 <style>`.
- 캐시 버전: tokens.css 수정 시 전 페이지 `?v=` 일괄 +1 (sed 일괄 치환).

### 8.3 페이지 인라인 `<style>` 계약

- 허용: 레이아웃(배치·크기·그리드), 페이지 고유 컴포넌트의 **기하**.
- 금지: raw hex, 신규 rgba, 신규 토큰 정의, `[data-theme]` 신규 분기, z-index 사다리 밖 값.
- 페이지가 색을 만지는 유일한 방법: **이미 정의된 토큰을 참조**하는 것.

### 8.4 명명 규칙

- 토큰: `--{층위}-{역할}(-{변형})` — 케밥케이스, 축약 일관(`th`=theme, `fs`=font-size, `r`=radius).
- 클래스: BEM 라이트 (`.block__elem--mod`) + 상태는 `.is-*` (기존 관행 유지).
- 상태 클래스 표준 세트: `is-active / is-sel / is-done / is-cur / is-open / is-collapsed / is-hidden / is-wrong / is-locked / is-ready / is-on / is-err`.

---

## 9. 접근성 기준

| 항목 | 기준 |
|---|---|
| 본문 텍스트 대비 | 4.5:1 이상 (muted 텍스트 포함) |
| 큰 텍스트·UI 요소 | 3:1 이상 (섹션 accent가 3:1 미달이면 텍스트에는 반드시 `--th-ink-accent` 사용) |
| 포커스 | 모든 인터랙티브 요소 `:focus-visible` 링 (§6) |
| 모션 | 모든 keyframes `prefers-reduced-motion` 대응 |
| 정오답 표시 | 색 + 형태(✓/✗/테두리) 이중 부호화 — 색맹 대응 |
| 터치 타깃 | 최소 40×40px (태블릿 주 사용) |

---

## 10. 마이그레이션 계획 (병렬 에이전트 실행 설계)

### 10.0 실행 원칙
- **Phase 0·1은 직렬**(모든 것의 기반), **Phase 2는 페이지 패밀리별 병렬**(파일 겹침 없음 → 충돌 없음).
- Phase 0 완료 후 tokens.css는 **read-only** — Phase 2 에이전트는 절대 수정 금지. 토큰이 부족하면 작업 중단하고 보고.
- 각 에이전트 산출물: 수정 파일 + 검증 결과(§10.4) + "치환 못 한 hex" 목록(있다면).

### Phase 0 — 토큰 정본화 (에이전트 1개, 최우선)
1. tokens.css를 §3 기준으로 재작성: 프리미티브 51색 정리(개명·중복 제거), 전역 시맨틱(§3.2·3.3), `data-section` 테마 블록 7종(§3.4), 타이포·형태 토큰(§4·5).
2. 구 토큰명은 **호환 알리아스 층**으로 임시 유지(`--essay-accent: var(--th-accent)` 식) — Phase 2가 끝나면 삭제.
3. styleguide.html에 신규 토큰 시트 반영(살아있는 스펙으로).

### Phase 1 — 공용 파일 (에이전트 2개, Phase 0 뒤)
- **1A**: base.css(폰트 웨이트 정리·포커스 링 표준) + components.css(§6 레시피로 정비) + learn-shell.css.
- **1B**: gnb.css(hex·자체 폰트 제거→토큰 소비) + util.css(액센트 #2B60E0→brand blue, 토큰 소비) + space-bg 점검.

### Phase 2 — 페이지 패밀리 병렬 (에이전트 7개, 동시 실행 가능)

| 에이전트 | 담당 페이지 | 핵심 작업 |
|---|---|---|
| **2-개념** | learn-concept, learn-concept-drill, learn-basic-ops, concept-organize, step-result, training-result | `data-section="concept"` 부여, `--concept-*`→`--th-*`/전역 치환, 인라인 hex 제거 |
| **2-유형** | type-quiz, type-review, type-result, type-training-result | 동일 (`type`) |
| **2-서술형** | essay-* 10개 (v2 포함) | 동일 (`essay`) |
| **2-시험** | exam-home, exam-solve | 동일 (`exam`) |
| **2-과제** | assignment-home/-solve/-explain/-result | 동일 (`assign`) + 레벨칩·현재마커 표준화 |
| **2-A층** | home, bridge, curriculum, freemode | `data-section="space"`, tokens/base 로딩 추가, 인라인 hex 토큰화 |
| **2-유틸** | notice, notice-detail, report, payment, index | `data-section="util"`, util.css 신토큰 확인 |

각 에이전트 공통 절차: ① 부록 A 매핑으로 기계 치환 → ② 남은 raw hex를 grep으로 색출해 토큰 매핑(불가 시 보고) → ③ z-index·포커스·스크롤바 표준 적용 → ④ §10.4 검증.

### Phase 3 — 마무리 (에이전트 1개)
호환 알리아스 층 삭제 → 전 페이지 hex 센서스(`grep -rhoE '#[0-9A-Fa-f]{3,8}'`)로 §3.5 예외 외 0건 확인 → `?v=` 일괄 범프 → styleguide.html 최종화 → 이 문서 v1.0 → v1.1 개정 기록.

### 10.4 검증 체크리스트 (모든 에이전트 필수)
- [ ] 담당 페이지 라이트/다크 각각 스크린샷 — 프레임·헤더 불변, 내부만 전환되는지
- [ ] 콘솔 에러 0
- [ ] 핵심 인터랙션 1회 구동 (선택지 선택 / 빈칸 입력 / OMR 마킹 등 페이지 대표 동작)
- [ ] `grep -oE '#[0-9A-Fa-f]{3,8}' <파일>` 결과가 §3.5 예외 목록뿐
- [ ] 포커스 링 표시 확인 (Tab 키)

---

## 부록 A — 기존 → 신규 토큰 매핑 (기계 치환표)

> Phase 2 에이전트는 이 표를 위→아래 순서로 적용한다. `(섹션)` 표기는 해당 페이지의 data-section 문맥에서의 치환.

**뉴트럴·고아 hex**
`#121E37`→`var(--n-650)` · `#5C6373`→`var(--n-400)` · `#3A466A`(=구 --c-navy, --essay-key, --type-input-d-br 등)→`var(--n-500)` · `--blue-800`→`var(--n-650)` · `--blue-900`→`var(--n-700)` · `--text-faint`→`var(--text-meta)`
구 라이트 존 hex: `#F2F4F7`→`var(--n-050)` · `#E4E7EC`→`var(--n-100)` · `#C1CBDA`→`var(--n-200)` · `#9DA3B1`→`var(--n-300)` (토큰 값 자체가 신규 생성값으로 교체됨)

**바이올렛 개명**
`--purple-900`→`--violet-900` · `--purple-500`→`--violet-500` · `--purple-300/-200`→`--violet-300` · `--purple-400`→`var(--n-300)` (오염 수정)

**블루 정리**
`--navy-500`→`--blue-500` · `--navy-300`→`--blue-300` · `--navy-050`→`--blue-050` · `--blue-400`→`--blue-300` · 구`--blue-300 #7EC4FF`→`--blue-200` · 구`--blue-200/-100 #B0DBFF`→`--blue-100` · `--blue-primary/#008CFF`→`var(--blue-400)`(모드탭) · `#094BB8`→`--blue-600`

**옐로 → 앰버 개명**
`--yellow-500 #FFC148`→`var(--amber-300)`(warn solid·현재 마커) · `--yellow-300 #FFD584`→`var(--amber-200)` · `--yellow-050`→`--amber-050`

**섹션 토큰 → 슬롯 (대표 — 같은 패턴으로 전부)**
- `--concept-frame/-select`→`--th-accent` · `--concept-select-shade`→`--th-accent-strong` · `--concept-cyan-l`→`--th-ink-accent` · `--concept-muted-*`→`--text-muted` · `--concept-fill`→`--th-accent` · `--concept-hi`→`--th-accent-hi`
- `--type-deep/-frame`→`--th-static`/`--th-accent`(문맥) · `--type-accent`→`--th-accent` · `--type-mint/-hi`→`--th-accent-hi` · `--type-ink-l`→`var(--n-650)` · `--type-muted(-l)`→`--text-muted` · `--type-ok*`→`--ok-*` · `--type-no*`→`--no-*` · `--type-disabled`→`var(--n-500)`
- `--essay-accent`→`--th-accent` · `--essay-accent-shade/-btn`→`--th-accent-strong` · `--essay-accent-d/-vivid-2/-title-l`→`--th-accent-hi` · `--essay-ind`→`--th-accent` · `--essay-ind-ink-l`→`--th-ink-accent` · `--essay-ink`→`var(--n-650)` · `--essay-sub(-l)/-muted-*`→`--text-muted`/`--text-meta` · `--essay-ok*`→`--ok-*` · `--essay-no-ink-l`→`--no-ink` · `--essay-amber`→`--warn-solid` · `--essay-panel-dark`→`--surface-1`(다크) · `--essay-bg-d`→`--surface-1` · `--essay-border-l`→`var(--n-100)` · `--essay-skel-d*`→`var(--n-500)`
- `--exam-accent`→`--th-accent` · `--exam-accent-ink`→`--th-ink-accent` · `--exam-accent-tint-br`→`var(--violet-100)` · `--exam-good*`→`--ok-*` · `--exam-bad*`→`--no-*` · `--exam-warn`→`--warn-ink` · `--exam-ink2`→`var(--n-500)` · `--exam-faint`→`var(--n-300)` · `--exam-star`→`var(--amber-200)`
- `--assign-hd`→`--th-static` · `--assign-blue(-shade)`→`--th-accent(-strong)` · `--assign-accent-d`→`--th-accent-hi` · `--assign-yellow`→`--current`/`--warn-solid`(문맥) · `--assign-ok`→`--ok-ink` · `--assign-no`→`--no-solid` · `--assign-ink(-l)`→`var(--n-650)` · `--assign-green`→`--ok-ink` · `--assign-indigo`→`var(--violet-500)` · `--assign-orange`→`--primary` · `--assign-sky`→(GNB 외 사용이면 `--info-solid`) · `--assign-seg-l`→`var(--n-200)` · `--assign-line-d/-dash-d/-scroll-d`→`var(--n-500)` · `--assign-faint-*`→`--text-muted` · `--assign-body`→[에셋 #AFC6E8 유지]
- `--subject-*`→`--th-static`(해당 섹션) · `--grade-*`·`--star-*` 유지 · `--mark-correct`→`var(--cyan-500)` · `--kp-num`→`var(--teal-300)`(유형 문맥 `--th-accent-hi`)

**상태색 구명칭**
`--success*`→`--ok-*` · `--danger*`→`--no-*` · `--warning*`→`--warn-*` · `--info`→`--info-solid`
(`--success-on-dark #8FDD55`·`--danger-on-dark #FF7F87` 등은 §3.3 매트릭스 위치로)

## 부록 B — 페이지 인벤토리 (36p · 로딩 상태 → 목표)

| 패밀리 | 페이지 | 현재 로딩 | 목표 |
|---|---|---|---|
| A층 space | home / bridge / curriculum / freemode | gnb 단독·space-bg 단독 등 **토큰 누락** | tokens+base(+gnb/space-bg), `data-section="space"` |
| 개념 | learn-concept(-drill), learn-basic-ops, concept-organize, step-result, training-result | tokens+base+components(+learn-shell) | +`data-section="concept"` |
| 유형 | type-quiz/-review/-result/-training-result | +type.css | +`data-section="type"` |
| 서술형 | essay-* 10 | +essay.css | +`data-section="essay"` |
| 시험 | exam-home/-solve | tokens+base(+gnb) | +`data-section="exam"` |
| 과제 | assignment-home/-solve/-explain/-result | tokens(+gnb), base 누락 페이지 있음 | tokens+base 통일, `data-section="assign"` |
| 유틸 | notice(-detail), report, payment | gnb+util (**tokens 누락**) | tokens+base+gnb+util, `data-section="util"` |
| 공통 | index, styleguide | tokens+base+components | styleguide = 살아있는 스펙 |

---

*RMDS v1.0 — 2026-07-13. 개정 이력은 이 블록 아래에 추가.*

*v1.1 — 2026-07-13. 컬러 체계를 생성형으로 전환: §3.0 "한 사다리, 여러 색상" 생성 논리 신설
(OKLCH 지각 균일 램프 · `tools/palette-gen.py` = 팔레트 단일 소스 · WCAG 40항목 자동 검증),
§3.1 프리미티브를 생성 팔레트(8가족×10스텝)로 전면 교체 — 500 명도 정규화(L=0.55)로
"500이 연하다" 문제 해소, §3.3 상태색을 스텝 규칙(500/300/600/050)으로 재정의(주의=앰버 예외),
§3.4 테마 슬롯을 가족+스텝 참조로 재정의 + 틴트 `color-mix()` 자동 파생 + `--th-chip` 추가,
§3.4b CTA=orange-400(정체성 스텝) 정책, §3.7 색 교체 프로토콜 신설, 옐로→앰버 개명,
모드탭=각 가족 400 스텝(`--blue-bright` 폐기).*

*v1.2 — 2026-07-13. 뉴트럴 라이트 존(050~400) 재생성(사용자 지적 "밝은 구간이 다른 재질로 보임"):
다크 존과 동일 색상각(h≈268)에 채도 단조증가로 생성 — `#F3F5F9 / #E8ECF4 / #D1D7E5 / #A7AFC3 / #606A83`.
다크 존(500~950)은 고정 앵커로 유지. 구 라이트 존 5색 폐기(부록 A).*

*v1.3 — 2026-07-13. **마이그레이션 실행 완료**(Phase 0~3). Phase 0: tokens.css를 3단 토큰(프리미티브 생성팔레트 + 전역 시맨틱/상태/CTA + 7개 data-section 테마블록)으로 재작성 + 하단에 호환 알리아스 층. Phase 1: 공용 CSS 5종(base·gnb·components·learn-shell·util)을 토큰 소비자로 전환 — learn-shell `.lheader`/`.content`가 `--th-static`/`--th-panel` 계약 소비, base 포커스 링 `--th-focus`, gnb 전면 재작성. Phase 2: 7개 패밀리 병렬 에이전트로 35개 HTML(+essay.css/type.css)에 `data-section` 부여 + 인라인 hex·구 섹션토큰 → `--th-*`/전역/상태 토큰 치환. Phase 3: 전 페이지 `tokens.css?v=12` 정규화, hex 센서스 통과(§3.5 에셋만 잔존), 7패밀리 라이트/다크 브라우저 검증(콘솔 0).
  - **다크 모드 변화**: 학습 화면 다크가 과목 틴트(블루/틸/바이올렛 표면)에서 **뉴트럴 네이비 표면**으로 통일(§3.2대로). 프레임·헤더만 과목 static 유지.
  - **알리아스 층 슬리밍 완료**: 마이그레이션 후 참조 0인 구 토큰 126개 삭제(166→39). 남은 39개는 여전히 소비되는 브릿지(components의 `--subject-*`/`--success`/`--danger`/`--info`, `--transition`, `--text-dim`, `--brand`, 에셋 `--assign-body`, 일부 페이지의 `--static-*` 등). 삭제된 이름이 어디서도 참조되지 않음을 전수 검증 → 시각 변화 0.
  - **알려진 후속 과제**(hex/토큰 범위 밖, 사전존재): ① 다크 표면용 상태/섹션 틴트 토큰 부재(현재 반투명 rgba 브릿지 — color-mix 방식 토큰 신설 검토) ② exam-home 타일 컬러 글로우·step-result 그라데이션 텍스트 등 원칙1 위반 잔재 ③ JS 하드코딩 차트색(assignment 산점도 축·격자, type/basic-ops 도형 fill, 평균점수 링) ④ 별 배지 에셋색(#FFC148/#FFA94D)이 §3.5 정본 세트(#FFD21A…)와 불일치 — 실제 PNG 대조 필요 ⑤ 검수용 색 변화: 정답 진행 도트 시안→초록, type-result 라이트 액센트 초록→틸, assignment-result 정답마커 블루→초록, 서술형 빈칸 활성=오렌지 유지.*

*v1.4 — 2026-07-13. **채도 튜닝**(사용자: "포인트 컬러가 다 물이 빠진 듯 칙칙 / 뉴트럴이 무채색 그레이라 네이비 우주와 따로 논다"). `palette-gen.py`에서 **① 액센트 채도 사다리 상향**(300 .135→.172·400 .175→.222·500 .190→.240, GAMUT_SAFETY 0.97→0.98) — gamut 여유 있는 blue/violet/red/cyan은 크게, green/teal/amber는 sRGB 한계로 소폭. **② 뉴트럴 라이트존 채도 상향**(050 .006→.013 … 400 .042→.058, hue 268→262) — 그레이 탈피, 네이비 결 부여로 우주 배경과 통일감. 프리미티브 hex만 교체(§3.1)되고 상태색·`--th-*`·틴트는 var()/color-mix로 자동 연동. 대비 40항목 재검 통과(green solid 흰글자 4.5=AA 경계). tokens `?v=13`. 시험대비·커리큘럼 라이트/다크 검증.*

*v1.5 — 2026-07-13. **vivid 밴드 명도 상향 + 다크 솔리드 통일**(사용자: "라이트 칙칙·다크 물빠짐"). ① 사다리 300/400/500 명도↑(500 L0.55→0.598) → solid 칠이 라이트·다크 양쪽에서 쨍. 500 위 흰 글자 대비는 AA-large(3:1)로 완화(굵은/큰 글자·아이콘 전용). green-500 `#148A08→#189A0A`, red-500 `#C92F33→#EC102B`, teal-500 `#0A8476→#0D9484`, violet-500 `#7156D8→#805AFD`. ② **상태색 채움 규칙 신설**: 정오답·성취 **채움(background/fill)은 라이트·다크 공통 솔리드**(`--ok/no/warn-solid`·`--th-accent`) — 다크에서 -on-dark(연한 300)로 다운시키던 페이지들이 "물빠짐" 원인이었음. **-on-dark(300)은 이제 "다크 표면 위 텍스트/아이콘 색"에만 사용, 채움에는 쓰지 않는다.** 앰버 채움만 예외(warn-solid=amber-300 + 어두운 글자). exam-home 레퍼런스 + 병렬 에이전트로 type/essay/assign/개념·시험·A층 페이지 적용. tokens `?v=15`.*
