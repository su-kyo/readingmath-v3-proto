/* nav/bridge.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  var toast = document.getElementById('toast'), tt;
  function showToast(msg){
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('is-on'); }, 1900);
  }
  // 자동 진입 상태 복원/저장
  var auto = document.getElementById('autoEnter');
  auto.checked = localStorage.getItem('rm-auto-enter') === '1';
  auto.addEventListener('change', function(){
    localStorage.setItem('rm-auto-enter', auto.checked ? '1' : '0');
  });
  // 카드 진입
  document.querySelectorAll('.card').forEach(function(card){
    card.addEventListener('click', function(){
      if(auto.checked){
        var subj = card.classList.contains('card--math') ? 'math' : 'science';
        localStorage.setItem('rm-auto-subject', subj);
      }
      location.href = card.getAttribute('data-go');
    });
  });
  // 로그아웃(데모)
  document.getElementById('logoutBtn').addEventListener('click', function(){
    showToast('로그아웃되었습니다. (데모)');
  });
})();
