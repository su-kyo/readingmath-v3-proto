/* gnb-drawer.js — 공용 사이드 메뉴 드로어 + 학기변경 모달
   사용: 페이지에 <script src="scripts/gnb-drawer.js?v=1"></script> 추가.
   #menuBtn(또는 [data-drawer-open]) 클릭 시 자동으로 열림. window.RMDrawer.open()/close() 도 제공. */
(function () {
  /* 학기 목록과 이름은 scripts/subject.js 한 벌 — 이 파일보다 먼저 불러야 한다 */
  var S = window.RMSubject;
  var SEM = {
    elem: S.sems.slice(0, 8).map(function (k) { return [k, S.semLabel(k, true)]; }),
    mid:  S.sems.slice(8).map(function (k) { return [k, S.semLabel(k, true)]; })
  };
  function fullLabel(key){ return S.semLabel(key); }

  /* 과목은 부를 때마다 새로 읽는다 — 홈은 열린 뒤에 주소의 과목을 저장한다 */
  function subject(){ try { return localStorage.getItem('rm-subject') === 'science' ? 'science' : 'math'; } catch (e) { return 'math'; } }
  function semKey(){ return S.sem(); }

  /* 서랍 스타일은 styles/gnb.css 끝에 있다 (2026-10-14 · RM-JS-01) */

  // [라벨, 아이콘path, (선택)이동URL]
  var MENU = [
    ['마이페이지','<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />'],
    ['학습 기록','<path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" />','util/history.html'],
    ['월간 보고서','<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />','util/report.html'],
    ['오답 노트','<path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9.5 8h5" /><path d="M9.5 12H16" /><path d="M9.5 16H14" />'],
    ['진단 평가','<rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" />'],
    ['이용권 결제','<rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />','util/payment.html'],
    ['이용 가이드','<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />']  /* 노션 외부 페이지 예정 */
  ];

  var scrim, drawer, modal, toastEl, tt, modalTab='elem', modalSel=null, built=false;

  function build(){
    if(built) return; built=true;

    scrim=document.createElement('div'); scrim.className='rmd-scrim'; document.body.appendChild(scrim);

    drawer=document.createElement('aside'); drawer.className='rmd';
    var menuHtml = MENU.map(function(m){
      var act = m[2] ? 'data-go="'+m[2]+'"' : 'data-toast="'+m[0]+' — 준비 중입니다."';
      return '<button class="rmd-mi" '+act+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+m[1]+'</svg>'+m[0]+'</button>';
    }).join('');
    drawer.innerHTML =
      '<div class="rmd__head"><span class="rmd__title">메뉴</span>'
      + '<button class="rmd__x" data-close><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button></div>'
      + '<div class="rmd__prof"><div class="rmd__nm">김학생</div><div class="rmd__exp">이용 가능 기간 · 2029년 3월 31일까지</div></div>'
      + '<div class="rmd__cards">'
      +   '<div class="rmd-card"><span class="rmd-card__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg></span>'
      +     '<div class="rmd-card__m"><div class="rmd-card__k">현재 학기</div><div class="rmd-card__v" id="rmdSem">초등 3학년 1학기</div></div><button class="rmd-card__b" data-chg-sem>변경</button></div>'
      +   '<div class="rmd-card"><span class="rmd-card__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /></svg></span>'
      +     '<div class="rmd-card__m"><div class="rmd-card__k">현재 과목</div><div class="rmd-card__v" id="rmdSubj">수학</div></div><button class="rmd-card__b" data-chg-subj>변경</button></div>'
      + '</div>'
      + '<div class="rmd__menu">'+menuHtml+'</div>'
      + '<div class="rmd__foot">'
      +   '<button class="rmd-add" data-toast="홈 화면에 추가 — 준비 중입니다."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>홈 화면에 추가</button>'
      +   '<button class="rmd-out" data-out><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>로그아웃</button>'
      + '</div>';
    document.body.appendChild(drawer);

    modal=document.createElement('div'); modal.className='rmd-modal';
    modal.innerHTML =
      '<div class="rmd-modal__box">'
      + '<div class="rmd-modal__t">학습할 학기를 선택해주세요</div>'
      + '<div class="rmd-modal__s">선택한 학기의 행성 메인으로 이동합니다.</div>'
      + '<div class="rmd-tabs"><button class="rmd-tab is-on" data-tab="elem">초등</button><button class="rmd-tab" data-tab="mid">중고등</button></div>'
      + '<div class="rmd-grid" id="rmdGrid"></div>'
      + '<div class="rmd-modal__foot"><button class="rmd-modal__ghost" data-mclose>취소</button><button class="rmd-modal__go" data-mgo>시작하기</button></div>'
      + '</div>';
    document.body.appendChild(modal);

    toastEl=document.createElement('div'); toastEl.className='rmd-toast'; document.body.appendChild(toastEl);

    // 이벤트
    scrim.addEventListener('click', close);
    drawer.addEventListener('click', function(e){
      var t=e.target.closest('[data-toast],[data-close],[data-out],[data-chg-sem],[data-chg-subj],[data-go]'); if(!t) return;
      if(t.hasAttribute('data-close')) return close();
      if(t.hasAttribute('data-out')) return toast('로그아웃되었습니다. (데모)');
      if(t.hasAttribute('data-chg-subj')){ location.href='nav/bridge.html'; return; }
      if(t.hasAttribute('data-chg-sem')){ openModal(); return; }
      if(t.hasAttribute('data-go')){ location.href=t.getAttribute('data-go'); return; }
      if(t.hasAttribute('data-toast')) return toast(t.getAttribute('data-toast'));
    });
    modal.addEventListener('click', function(e){
      if(e.target===modal) return closeModal();
      var tab=e.target.closest('[data-tab]'); if(tab){ modalTab=tab.dataset.tab; modalSel=null;
        modal.querySelectorAll('.rmd-tab').forEach(function(b){ b.classList.toggle('is-on', b===tab); }); renderGrid(); return; }
      if(e.target.closest('[data-mclose]')) return closeModal();
      if(e.target.closest('[data-mgo]')){ if(!modalSel){ toast('학기를 선택해주세요.'); return; }
        localStorage.setItem('rm-sem', modalSel); location.href='nav/home.html?subject='+subject()+'&sem='+modalSel; }
    });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeModal(); close(); } });
  }

  function renderGrid(){
    var g=document.getElementById('rmdGrid'); g.innerHTML='';
    SEM[modalTab].forEach(function(p){
      var b=document.createElement('button'); b.className='rmd-sem'+(modalSel===p[0]?' is-sel':''); b.textContent=p[1];
      b.addEventListener('click', function(){ modalSel=p[0]; renderGrid(); });
      g.appendChild(b);
    });
  }
  function syncCurrent(){
    document.getElementById('rmdSem').textContent = fullLabel(semKey());
    document.getElementById('rmdSubj').textContent = subject()==='science'?'과학':'수학';
  }
  function open(){ build(); syncCurrent(); scrim.classList.add('is-open'); drawer.classList.add('is-open'); }
  function close(){ if(scrim){ scrim.classList.remove('is-open'); drawer.classList.remove('is-open'); } }
  function openModal(){ modalTab = semKey().indexOf('elem')===0?'elem':'mid'; modalSel=semKey();
    modal.querySelectorAll('.rmd-tab').forEach(function(b){ b.classList.toggle('is-on', b.dataset.tab===modalTab); });
    renderGrid(); modal.classList.add('is-open'); }
  function closeModal(){ if(modal) modal.classList.remove('is-open'); }
  function toast(m){ toast_(m); }
  function toast_(m){ build(); toastEl.textContent=m; toastEl.classList.add('is-on'); clearTimeout(tt); tt=setTimeout(function(){toastEl.classList.remove('is-on');},1900); }

  // ---- 실제 피그마 GNB 로고/아이콘 주입 (currentColor → 다크/라이트 공용) ----
  var GNB_LOGO = '<svg viewBox="0 0 32 32" fill="none"><path d="M26.03 9.7V7.31c-5.01 0-7.86 3.26-10.2 6.6-2.35-3.34-5.2-6.6-10.21-6.6V9.7c4.19 0 6.48 2.98 8.76 6.31-2.28 3.33-4.57 6.31-8.76 6.31v2.38c5.01 0 7.86-3.26 10.2-6.59 2.35 3.33 5.2 6.59 10.21 6.59v-2.38c-4.19 0-6.48-2.98-8.76-6.31 2.28-3.33 4.57-6.31 8.76-6.31Z" fill="#3C7BE0"/><path d="M27.67 16.88v-1.75h-5.73v1.75h5.73Z" fill="#F7417A"/><path d="M18.69 5.99h-1.99V4h-1.75v1.99h-1.99v1.75h1.99v1.99h1.75V7.74h1.99V5.99Z" fill="#4BC8DC"/><path d="M18.53 25.84v-1.56h-5.41v1.56h5.41ZM16.6 28V26.44h-1.56V28h1.56ZM16.6 23.68v-1.57h-1.56v1.57h1.56Z" fill="#64C947"/><path d="M9.62 14.6 8.39 13.36l-1.41 1.41-1.41-1.41-1.24 1.24 1.41 1.41-1.41 1.41 1.24 1.24 1.41-1.41 1.41 1.41 1.23-1.24-1.41-1.41 1.41-1.41Z" fill="#FF9B4E"/></svg>';
  var GNB_ICONS = {
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>',
    report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18v-6a5 5 0 1 1 10 0v6" /><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" /><path d="M21 12h1" /><path d="M18.5 4.5 18 5" /><path d="M2 12h1" /><path d="M12 2v1" /><path d="m4.929 4.929.707.707" /><path d="M12 12v6" /></svg>',
    notice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>'
  };
  function hydrateGnb(){
    var lg=document.querySelector('.gnb__logo');
    if(lg && !lg.__h){ lg.__h=1; lg.innerHTML=GNB_LOGO; }
    var icos=document.querySelectorAll('.gnb__ico');
    for(var i=0;i<icos.length;i++){ (function(b){ if(b.__h) return; b.__h=1;
      var t=b.getAttribute('title')||'';
      var key = t.indexOf('도움')>=0?'help':((t.indexOf('오류')>=0||t.indexOf('긴급')>=0)?'report':(t.indexOf('공지')>=0?'notice':(t.indexOf('메뉴')>=0?'menu':'')));
      if(key){ var dot=b.querySelector('.gnb__dot'); b.innerHTML=GNB_ICONS[key]; if(dot) b.appendChild(dot); }
    })(icos[i]); }
  }

  function bind(){
    hydrateGnb();
    // 로고 클릭 → 기본모드 홈(현재 과목/학기)
    var lg=document.querySelector('.gnb__logo');
    if(lg && !lg.__go){ lg.__go=1; lg.setAttribute('title','기본모드 홈');
      lg.addEventListener('click', function(){ location.href='nav/home.html?subject='+subject()+'&sem='+semKey(); }); }
    var mb=document.getElementById('menuBtn') || document.querySelector('[data-drawer-open]');
    if(mb) mb.addEventListener('click', function(e){ e.preventDefault(); open(); });
    // 공지사항 아이콘 → 공지 목록
    var nb=document.getElementById('noticeBtn');
    if(nb && !nb.__go){ nb.__go=1; nb.addEventListener('click', function(){ location.href='util/notice.html'; }); }
    // 공용 모드 탭 네비게이션
    var gos=document.querySelectorAll('[data-go]');
    for(var i=0;i<gos.length;i++){ (function(b){ if(b.__go) return; b.__go=1;
      b.addEventListener('click', function(){ var u=b.getAttribute('data-go'); if(u) location.href=u; }); })(gos[i]); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  window.RMDrawer = { open:open, close:close, toast:toast_ };
})();
