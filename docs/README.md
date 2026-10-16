# docs — 판단과 요청의 기록

배포에서 빠지는 폴더다. **디자인 시스템의 정본은 여기가 아니다** — 아래 「정본은 어디에」를 본다.
여기에는 정본에 다 담기지 않는 것, 곧 **왜 그렇게 정했나 · 개발자에게 무엇을 보냈나 · 무엇을 조사했나**가 있다.

## 네 칸

```
docs/
├─ requests/    개발자에게 보낸(보낼) 요청서. 보낸 원본은 고치지 않는다 — 보낸 뒤 정한 것은 addendum에 모은다
├─ decisions/   한 주제의 판단 기록. 시안을 비교해 정한 것 · 확정 사양. 규칙 번호의 근거가 여기 있다
├─ research/    조사 · 검수 결과. 그 시점의 사진이라 숫자는 낡는다 — 날짜를 같이 읽는다
└─ briefs/      지금도 쓰는 작업 지시서. 그 일을 다시 할 때 먼저 읽는다
```

| 칸 | 파일 | 무엇 |
| --- | --- | --- |
| requests | `dev-request-1015.md` | 실서버 QA 1회차 요청 1~15 (2026-10-15 보냄) |
| requests | `dev-request-1015-addendum.md` | 보낸 뒤 정한 추가분 — **아직 안 보냄** |
| requests | `dev-request-1016.md` | 요청 16~18 지문 폭 · 지문 카운터 · 문제 카드 스크롤바 (2026-10-16 보냄) |
| decisions | `home-reward-util-0824.md` | 행성 홈 보상(홀로그램) · 유틸 4화면 확정 사양 |
| decisions | `history-page-0824.md` | 학습 기록 페이지 진단 · 구조 · 데이터 · 상태 규칙 |
| decisions | `chunk-reading-1015.md` | 끊어읽기 스타일 (`RM-READ-*`) |
| decisions | `blank-pop-1015.md` | 빈칸 선지 창 (`RM-PART-06`) |
| decisions | `guide-1015.md` | 콘솔바 안내 (`RM-PART-07`) |
| decisions | `timer-1015.md` | 학습 타이머 진행 / 제한 시간 |
| decisions | `icons-lucide-1016.md` | 화면 아이콘 Lucide 한 벌 · 버튼 문구 → 아이콘 |
| research | `color-ref-survey.md` | 1차 범위 화면의 색 참조 구조 조사 (2026-10-15) |
| research | `live-qa-compare-1015.md` | 테스트 서버 ↔ 프로토타입 비교표 (요청서의 재료) |
| research | `codex-review-8f58cd3.md` | 외부 검수(Codex) 원문 (2026-10-14) |
| research | `phase10-brief.md` | 스타일 체계 정리 계획과 코드 실측 (2026-08-28, 완료) |
| briefs | `character-brief.md` | 행성 대표 캐릭터 제작 지시서 |
| briefs | `content-swap-brief.md` | 학습 콘텐츠를 가짜로 바꾸는 지시서 (포트폴리오용, 아직 안 함) |

**새 문서를 만들 때** — 칸을 먼저 고르고, 이름은 `<주제>-<월일>.md`. 이 표에 한 줄 더한다.
끝난 지시서는 확정 사양만 `decisions/`로 옮기고 지운다(깃 기록에 남는다).

## 정본은 어디에

| 무엇 | 어디 |
| --- | --- |
| 원칙 · 구조 · 부품 · 예외 | `styleguide/` 스토리북 6장 (기초 · 부품 · 셸 · 패턴 · 규칙 색인 · 화면 지도) — 배포 포함 |
| 규칙 (번호 붙은 정본) | `styleguide/rules.html` — `RM-영역-번호` 58개. QA에서 번호로 인용한다 |
| 실제 값 | `styles/tokens.css` — 스토리북 견본이 이 파일의 계산값을 읽어 그린다 |
| 개발자에게 넘기는 데이터 | `styleguide/data/` — `tokens.json`(DTCG) · `rules.json` · `screens.json`. 스크립트가 만든다 |
| 규칙을 지키는지 | `python3 tools/style-audit.py` — 지킬 것 11개(0이어야) · 지켜볼 것 4개 |
| 작업 이력 · 열린 일 | 옵시디언 `3 포트폴리오/RM/작업 기록/리딩수학과학 (RM).md` (저장소 밖) |

## 남은 과제 (2026-10-16 `style-audit.py` 「지켜볼 것」)

- 화면 간 똑같은 규칙 217개(`RM-FILE-03`) — 이름만 같고 화면마다 다른 부품과 킵 화면 쌍이 섞여 있다
- 눈금 밖 간격 · 글자 · 모서리 213곳(`RM-SIZE-03`) — 맞추면 화면이 1~2px 바뀌므로 디자인 판단 때 정리
- 시험 풀이의 정오답 칸 — 아직 틴트 면(`RM-SURF-02` 알려진 예외, 보류)
- `.card` · `.qtab` · `.problem` — 화면마다 다른 부품인데 이름이 같다. 공용으로 올리기 전에 이름부터 가른다

<details>
<summary>옛 설계서 RMDS v1.0 — 뒤집힌 결정</summary>

이 파일 자리(옛 이름 `docs/design-system.md`)에 2026-07-14의 설계서 RMDS v1.0(606줄)이 있었다. 문서와 화면이 어긋나서
2026-10-12에 정본을 스토리북 하나로 모았다. 옛 본문은 `git show 145f2b2:docs/design-system.md`로 꺼낸다.
옛 본문을 읽을 때 아래는 지금과 반대다.

| v1.0에 적힌 것 | 지금 |
| --- | --- |
| 「Flat 절대 원칙 — 그라데이션·글로우 금지」 | 결과·학습 셸은 우주선의 사물(계기판·콘솔·홀로그램)이다. 빛과 그림자는 그 사물의 재료로 쓴다 |
| 「모든 칠면에 흰 글자 4.5:1」 | 칠면 셋 — 텍스트 4.5 · 정체성(450 스텝) 3:1 + 라벨 19px w700 · 장식면 3:1 |
| 크기를 sm/md/lg 로 부른다 | 값으로 이름한 눈금 (`--fs-13` · `--sp-16` · `--r-12`) |
| 「rgba 틴트 즉흥 제조 금지 — tint 슬롯만」 | 알파 램프(`--white-a*` · `--black-a*`)와 `color-mix(토큰, N%)` |
| 「페이지 인라인 `<style>` 계약」 | HTML 안 CSS·JS 0줄 — 화면 CSS는 `styles/screens/`, 계열 공용은 계열 파일 |
| 라이브러리 부품을 미리 정의 | 화면이 쓰는 것만 남긴다 — 17종을 걷어냈다 |

</details>
