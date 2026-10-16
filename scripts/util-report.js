/* util/report.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  /* 학습 기간(term)·등록일(reg) 둘 다 유지. 번호(id)는 화면에 노출하지 않는다 */
  var DATA=[
    { id:5, term:'2026.06.01 ~ 2026.06.30', reg:'2026.07.01', isNew:true },
    { id:4, term:'2026.05.01 ~ 2026.05.31', reg:'2026.06.01' },
    { id:3, term:'2026.04.01 ~ 2026.04.30', reg:'2026.05.01' },
    { id:2, term:'2026.03.01 ~ 2026.03.31', reg:'2026.04.01' },
    { id:1, term:'2026.02.01 ~ 2026.02.28', reg:'2026.03.01' }
  ];
  var EXT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"/></svg>';
  var CHART='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1"/><path d="M8 14v3M12 10v7M16 12v5"/></svg>';
  var CLOUD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1A3.5 3.5 0 0 1 17 18z"/><path d="M12 10v4M12 16.5h.01"/></svg>';
  var listEl=document.getElementById('list');

  /* 검수용 상태 파라미터 — ?state=loading|empty|error (배포본에서는 쓰이지 않는다) */
  var FORCE=new URLSearchParams(location.search).get('state')||'';
  if(FORCE==='empty') DATA=[];

  if(FORCE==='loading'){
    var h=''; for(var i=0;i<5;i++){
      h+='<div class="u-skrow">'
        +'<div class="u-sk u-sk--title" style="width:'+(46+(i*11)%34)+'%"></div>'
        +'<div class="u-sk u-sk--meta" style="width:'+(20+(i*7)%14)+'%"></div></div>';
    }
    listEl.innerHTML='<div class="u-sheet u-rise">'+h+'</div>';
  } else if(FORCE==='error'){
    listEl.innerHTML='<div class="u-sheet u-rise"><div class="u-state">'
      +'<div class="u-state__ico is-warn">'+CLOUD+'</div>'
      +'<div class="u-state__t">리포트를 불러오지 못했어요.</div>'
      +'<div class="u-state__d">잠시 후 다시 시도해 주세요.</div>'
      +'<button class="u-btn" onclick="location.href=\'util/report.html\'">다시 시도</button>'
      +'</div></div>';
  } else if(!DATA.length){
    listEl.innerHTML='<div class="u-sheet u-rise"><div class="u-state">'
      +'<div class="u-state__ico">'+CHART+'</div>'
      +'<div class="u-state__t">아직 받은 리포트가 없어요.</div>'
      +'<div class="u-state__d">한 달치 학습이 쌓이면 다음 달 1일에 첫 리포트를 보내 드려요.</div>'
      +'</div></div>';
  } else {
    listEl.innerHTML='<div class="u-sheet u-rise">'+DATA.map(function(d){
      var y=d.term.slice(0,4), m=parseInt(d.term.slice(5,7),10);
      return '<button class="u-row">'
        +'<span class="u-row__main">'
          +'<span class="u-row__ttl">'+y+'년 '+m+'월 학습 리포트'+(d.isNew?'<span class="u-new">N</span>':'')+'</span>'
          +'<span class="u-row__meta">학습 기간 '+d.term+'<i></i>등록 '+d.reg+'</span>'
        +'</span>'
        /* 태블릿에는 호버가 없다 — 상시 표시 */
        +'<span class="u-row__ext">'+EXT+'새 창에서 열기</span></button>';
    }).join('')+'</div>';
  }

  var toastEl=document.getElementById('toast'), tt;
  function toast(m){ toastEl.textContent=m; toastEl.classList.add('is-on'); clearTimeout(tt);
    tt=setTimeout(function(){ toastEl.classList.remove('is-on'); },1900); }
  listEl.addEventListener('click', function(e){
    if(!e.target.closest('.u-row')) return;
    toast('월간보고서는 새 창에서 열립니다. (리포트 연동 예정)');
  });
})();
