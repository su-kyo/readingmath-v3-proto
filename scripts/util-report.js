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
  var EXT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>';
  var CHART='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>';
  var CLOUD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12v4" /><path d="M12 20h.01" /><path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" /></svg>';
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
