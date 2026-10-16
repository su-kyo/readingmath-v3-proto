# 화면 아이콘 — Lucide 한 벌로 (2026-10-16)

연습장 지우개 · 전체 지우기가 테스트 서버의 Font Awesome Regular였고(라이선스 불명), 나머지 아이콘도 피그마에서 내보낸 것 · 손으로 그린 선 아이콘 · Font Awesome이 섞여 있었다.
무료 세트 하나로 맞추기로 하고 Lucide와 Tabler 두 벌을 전 화면에 끼워 비교한 뒤 **Lucide**를 골랐다(사용자 결정).

- 세트: [Lucide](https://lucide.dev) — `lucide-static@0.460.0`, 라이선스 **ISC**(MIT와 같은 수준, 저작권 표기만 요구). 24 격자 · 선 2 · 둥근 끝
- 새 아이콘이 필요하면 같은 세트에서 가져온다. 선 굵기는 자리 크기에 맞춰 원래 값(1.8 ~ 3)을 따른다

## 반영 범위

- 인라인 아이콘 329곳(화면 HTML · 화면 JS) — GNB · 서랍 · 콘솔바 · 연습장 도구 · 유틸 4화면 · 시험 · 과제 · 결과 · 브레드크럼
- 콘솔바 흰 아이콘 파일 17개(`assets/icons/ico-*.svg`, img로 부르므로 흰색을 파일에 박았다)
- 스토리북 견본 1곳(빈칸 그림 표시)

**그대로 둔 것** — 선 아이콘 세트가 아니라 그림 · 기호다.
정오답 표시(진행 점의 ✓ ○ ✕ · 빈칸 선지 창 표시) · 등급 별 · 테마 손잡이의 해 · 달 · 머리줄의 색 있는 초시계 · 콘솔 장식 · 로고 ·
시험 타일 상태 배지(? ✓ 왕관 ! 별) · 과제 차트 · 진행 링.

## 판단

- **Lucide**(사용자 결정). Tabler와 견줘 같은 선 2지만 모양이 조금 크고 둥글다.
- **요약 아이콘을 빌려 쓰던 버튼에 뜻 맞는 아이콘을 단다.** 지금까지 「채점하기 · 다음 문제 · 결과보기 · 제출하기 · 홈으로」 등 약 30곳이 모두 요약 아이콘(`ico-summary`)이었다.
- **제출하기 = 종이비행기**(사용자 제안). 과제 풀이는 이미 종이비행기였고, 유형 문제도 맞췄다.

## 세션이 정한 것 (사용자 확인 대기)

버튼 문구 → 아이콘

| 문구 | 파일 | Lucide |
| --- | --- | --- |
| 채점하기 · 진단 평가(서랍) | `ico-grade` | clipboard-check |
| 다음 문제 · 다음으로 | `ico-next` | arrow-right |
| 결과보기 | `ico-result` | chart-column |
| 결과로 돌아가기 | `ico-back` | undo-2 |
| 다 읽었어요 | `ico-done` | circle-check-big |
| 제출하기 | `ico-send` | send |
| 해설 보기 | `ico-explain` | book-open |
| 홈으로 | `ico-home` | house |
| 오답노트 확인하기 · 오답 노트(서랍) | `ico-wrongnote` | notebook-text |
| 보고서 미리보기 · 추천 보고서 | `ico-doc` | file-text |
| 개념 요약하기 | `ico-summary` | list |
| 연습장 | `ico-note` · `ico-note-edit` | notebook-pen |
| 글자 | `ico-text` | type |
| 개념 영상 보기 | `ico-play` | circle-play |
| 나가기 | `ico-exit` | log-out |
| 오류 신고 · 긴급 | `ico-siren` · GNB | siren |

- **오류 신고는 어디서나 사이렌.** GNB의 「오류 신고」가 삼각 경고, 시험 풀이가 삼각 경고, 콘솔바가 사이렌으로 셋이 달랐다. 콘솔바에 맞췄다.
- GNB: 도움말 circle-help · 공지 megaphone · 메뉴 menu. 서랍: 마이페이지 user · 학습 기록 list · 월간 보고서 calendar · 이용권 결제 credit-card · 이용 가이드 circle-help.
- 「채점하기 ↔ 다음 문제」처럼 문구가 바뀌는 버튼은 아이콘도 같이 바뀐다(`learn-drill.js` · `learn-basic-ops.js`의 `setCta`, 그림 주소만 바꾼다 — `RM-JS-01`).
- 원래 칠한 모양이던 재생(▶) · 번개 도전(⚡)은 칠을 남겼다.
- 서랍 메뉴는 경로 한 줄(`d`) 대신 아이콘 속을 통째로 받게 했다(`gnb-drawer.js` `MENU`).

## 개발자 전달 목록

1. 연습장 지우개 · 전체 지우기는 Lucide `eraser` · `trash-2`로 바꿔 주세요(Font Awesome Regular 대신).
2. 위 「버튼 문구 → 아이콘」 표. 실서버도 버튼마다 같은 아이콘을 쓰고 있다면 뜻에 맞게 나눠 주세요.
3. 라이선스 — Lucide는 ISC라 배포물 어딘가(라이선스 고지 파일 등)에 저작권 표기를 넣어야 한다.

<details class="sg-why"><summary>근거</summary>

- 비교 시안: Lucide · Tabler 두 갈래를 같은 도구(`tools/icon-swap.py`, 뜻 → 세트 이름 표)로 만들어 같은 화면 세 벌(지금 · Lucide · Tabler)을 나란히 봤다. 도구 · 비교판 · Tabler 갈래는 결론 뒤 지웠다(깃 기록 `f035ce6` · `cce4761`).
- 그 전 단계: 연습장 두 아이콘만 Lucide · Tabler · Phosphor Bold · Material Symbols로 견줬다(`b1f0bc5`). 사용자가 Lucide · Tabler 두 축으로 범위를 전 화면으로 넓혔다.
</details>
