/* =====================================================================
   스텝 결과 공용 — 학습 진행 현황 버튼화 + 학습 시작 모달 + 훈련 결과 버튼
   step-result / type-result / essay-step-result 가 공유(각 페이지 스크립트 뒤에 로드).
   카드 계약: .step-card 에 상태 클래스
     .is-done   완료  → 클릭 시 data-go 로 이동(없으면 토스트)
     .is-current 현재  → 무동작(지금 보는 화면)
     .is-open   미학습 → 클릭 시 '학습을 시작할까요?' 모달 → 학습하기=data-go
   훈련 결과 버튼: #trainResultBtn — 미학습 스텝이 하나도 없을 때만 노출.
   ===================================================================== */
(function () {
  'use strict';

  var ICON = {
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.5c-1.5 1.3-2 5.5-2 5.5s4.2-.5 5.5-2"/><path d="M15 4c2.5-2.5 6.5-2 6.5-2s.5 4-2 6.5l-5.2 5.2-4.5-4.5L15 4z"/><path d="M9 15l-2.5-2.5"/><circle cx="15.5" cy="8.5" r="1.4"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* ---------- 모달 주입 ---------- */
  var modal = document.createElement('div');
  modal.className = 'smodal';
  modal.id = 'smStartModal';
  modal.innerHTML =
    '<div class="smodal__dim" data-sm-close></div>' +
    '<div class="smodal__card" role="dialog" aria-modal="true" aria-labelledby="smTitle">' +
      '<button class="smodal__x" data-sm-close aria-label="닫기">' + ICON.close + '</button>' +
      '<div class="smodal__icon">' + ICON.rocket + '</div>' +
      '<h2 class="smodal__title" id="smTitle">학습을 시작할까요?</h2>' +
      '<p class="smodal__desc"><b id="smStepName">다음 단계</b>를 지금 학습합니다.</p>' +
      '<div class="smodal__btns">' +
        '<button class="smodal__btn smodal__btn--ghost" data-sm-close>취소</button>' +
        '<button class="smodal__btn smodal__btn--go" id="smGo">학습하기</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  /* ---------- 토스트 (없으면 주입) ---------- */
  var toast = document.getElementById('smToast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'smtoast'; toast.id = 'smToast'; document.body.appendChild(toast); }
  var tt;
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1900); }

  /* ---------- 모달 열기/닫기 ---------- */
  var stepNameEl = modal.querySelector('#smStepName');
  var goBtn = modal.querySelector('#smGo');
  var pendingGo = null;

  function openModal(name, go) {
    stepNameEl.textContent = '‘' + name + '’';
    pendingGo = go || null;
    modal.classList.add('is-open');
    goBtn.focus();
  }
  function closeModal() { modal.classList.remove('is-open'); pendingGo = null; }

  modal.addEventListener('click', function (e) { if (e.target.closest('[data-sm-close]')) closeModal(); });
  goBtn.addEventListener('click', function () {
    if (pendingGo) window.location.href = pendingGo;
    else { closeModal(); showToast('이 학습은 준비 중이에요'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------- 스텝 카드 클릭(위임) ---------- */
  document.addEventListener('click', function (e) {
    var card = e.target.closest('.step-card');
    if (!card) return;
    var nameEl = card.querySelector('.step-card__name');
    var name = (nameEl ? nameEl.textContent : '학습').trim();
    var go = card.getAttribute('data-go');
    if (card.classList.contains('is-open')) { openModal(name, go); return; }
    if (card.classList.contains('is-done')) {
      if (go) window.location.href = go; else showToast(name + ' 결과는 준비 중이에요');
    }
    /* is-current: 지금 보는 화면 → 무동작 */
  });

  /* ---------- 홈으로 ---------- */
  var homeBtn = document.querySelector('[data-home]');
  if (homeBtn) homeBtn.addEventListener('click', function () { window.location.href = 'index.html'; });

  /* ---------- 훈련 결과 보기 (모든 스텝 완료 시에만) ---------- */
  var trBtn = document.getElementById('trainResultBtn');
  if (trBtn) {
    var hasOpen = !!document.querySelector('.step-card.is-open');
    // .toolbtn{display:inline-flex} 가 [hidden] 을 이기므로 인라인 style 로 토글
    trBtn.style.display = hasOpen ? 'none' : '';
    trBtn.addEventListener('click', function () {
      var go = trBtn.getAttribute('data-go');
      if (go) window.location.href = go; else showToast('학습 결과 화면은 준비 중이에요');
    });
  }
})();
