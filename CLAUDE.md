# RM (리딩수학과학 리디자인) 작업 규칙

수학·과학 태블릿 학습 서비스의 리디자인 프로토타입. 프레임워크 없는 HTML·CSS·JS.
폴더 구조와 화면 목록은 `README.md`, 디자인 원칙은 `docs/design-system.md`를 본다.
상위 공통 규칙(`../../CLAUDE.md` — 이미지 경량본·_source 원본 보관)이 함께 적용된다.

## 반드시 지킬 것

**① 하위 폴더 화면에는 `<base href="../">` 한 줄.**
`<head>` 바로 아래에 넣는다. 이 덕분에 모든 경로(styles·scripts·assets·화면 링크)를
최상위 기준으로 쓴다. 루트의 `index.html`·`styleguide.html`에는 넣지 않는다.

**② 색은 `styles/tokens.css`의 변수로만 쓴다.**
화면 CSS에 hex를 직접 쓰지 않는다. 색값의 현행 기준은 tokens.css이고,
원칙·구조의 기준은 `docs/design-system.md`다 (둘이 다르면 색값은 tokens.css가 맞다).

**③ 이미지는 쓰임 기준으로 분류한다.**
- 그림(webp) → `assets/img/` (bg·home·planets·strands·grade·misc)
- 아이콘(svg) → `assets/icons/` — 색은 파일 복제가 아니라 코드로 바꾼다
- PNG 등 원본은 프로젝트에 넣지 않는다. `~/Documents/Portfolio/_source/RM/`에 둔다
  (깃 없음 — 삭제·덮어쓰기 전 반드시 사용자 확인)

**④ 화면을 새로 만들면 `index.html` 목록에도 추가한다.**
계열 폴더(nav·concept·type·essay·assignment·exam·util·shared)와
index의 그룹 분류는 같은 단위다 — 둘이 어긋나게 두지 않는다.

**⑤ 행성 홈(`nav/home.html`)은 좌표 고정 · 그림 교체 방식이다.**
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
캐릭터는 6학기에만 있고, 없는 학기는 말풍선만 세운다(`.hero.is-nochar`).
32화면을 한눈에 보려면 `tools/home-contact.html` (배포 제외).

## 조심할 것

- **조립식 경로**: 이미지·화면 경로가 `'star-'+g` 처럼 코드에서 조립되는 곳이 많다.
  경로를 옮길 때 문자열 검색만 믿으면 빠뜨린다 — 서버 띄워 전 화면 404 검사로 검증한다.
- **공용 JS**: `gnb-drawer.js`(9개 화면 공유)·`step-progress.js` 안에 화면 이동 경로가 있다.
- `essay/basics·drill`의 v2 쌍은 결정 대기 상태 — 임의로 지우지 않는다.
- `shared/`의 결과 화면 2장은 개념·유형·서술형이 모두 부른다.

## 미리보기 · 배포

- 서버: `.claude/launch.json`의 **rm-static** (8020). Bash로 서버 띄우지 않는다.
- 배포: 푸시하면 Vercel 자동 배포. `figma-palette`·`tools`·`video`는 배포 제외.
