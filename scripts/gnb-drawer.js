/* gnb-drawer.js — 공용 사이드 메뉴 드로어 + 학기변경 모달
   사용: 페이지에 <script src="scripts/gnb-drawer.js?v=1"></script> 추가.
   #menuBtn(또는 [data-drawer-open]) 클릭 시 자동으로 열림. window.RMDrawer.open()/close() 도 제공. */
(function () {
  var SEM = {
    elem: [['elem-3-1','초등 3-1'],['elem-3-2','초등 3-2'],['elem-4-1','초등 4-1'],['elem-4-2','초등 4-2'],
           ['elem-5-1','초등 5-1'],['elem-5-2','초등 5-2'],['elem-6-1','초등 6-1'],['elem-6-2','초등 6-2']],
    mid:  [['mid-1-1','중등 1-1'],['mid-1-2','중등 1-2'],['mid-2-1','중등 2-1'],['mid-2-2','중등 2-2'],
           ['mid-3-1','중등 3-1'],['mid-3-2','중등 3-2'],['high-1-1','통합과학 1'],['high-1-2','통합과학 2']]
  };
  var SEM_LABEL = {};
  ['elem','mid'].forEach(function(g){ SEM[g].forEach(function(p){ SEM_LABEL[p[0]] = p[1].replace('초등','초등 ').replace('중등','중등 '); }); });
  function fullLabel(key){
    var m = { 'elem':'초등 ', 'mid':'중등 ', 'high':'통합과학 ' };
    if(key.indexOf('high')===0) return key==='high-1-1'?'통합과학 1':'통합과학 2';
    var parts = key.split('-'); // elem-3-1
    var grade = parts[1], sem = parts[2];
    return (parts[0]==='elem'?'초등':'중등') + ' ' + grade + '학년 ' + sem + '학기';
  }

  function subject(){ return localStorage.getItem('rm-subject') || 'math'; }
  function semKey(){ return localStorage.getItem('rm-sem') || 'elem-3-1'; }

  var CSS = ''
    + '.rmd-scrim{position:fixed;inset:0;z-index:80;background:rgba(3,7,18,.6);opacity:0;pointer-events:none;transition:.24s;}'
    + '.rmd-scrim.is-open{opacity:1;pointer-events:auto;}'
    + '.rmd{position:fixed;top:0;right:0;bottom:0;width:384px;max-width:90vw;z-index:81;background:#0B1428;'
    + 'border-left:1px solid rgba(255,255,255,.08);transform:translateX(102%);transition:transform .3s cubic-bezier(.3,.7,.3,1);'
    + 'display:flex;flex-direction:column;font-family:\'Pretendard\',\'Noto Sans KR\',sans-serif;color:#EAF0FF;letter-spacing:-.02em;box-shadow:-24px 0 60px -20px #000;}'
    + '.rmd.is-open{transform:none;}'
    + '.rmd__head{display:flex;align-items:center;justify-content:space-between;padding:20px 22px 14px;}'
    + '.rmd__x{width:34px;height:34px;border:0;background:transparent;color:#9DA9C6;cursor:pointer;display:grid;place-items:center;border-radius:9px;}'
    + '.rmd__x:hover{background:rgba(255,255,255,.06);color:#fff;}'
    + '.rmd__prof{padding:2px 22px 16px;}'
    + '.rmd__nm{font-size:19px;font-weight:800;}'
    + '.rmd__exp{font-size:12.5px;color:#8493B5;font-weight:600;margin-top:3px;}'
    + '.rmd__cards{padding:4px 22px 8px;display:flex;flex-direction:column;gap:9px;}'
    + '.rmd-card{display:flex;align-items:center;gap:11px;padding:13px 15px;border-radius:14px;background:#111E39;border:1px solid rgba(255,255,255,.05);}'
    + '.rmd-card__i{width:34px;height:34px;border-radius:10px;flex:none;display:grid;place-items:center;background:rgba(76,134,255,.16);color:#7FB0FF;}'
    + '.rmd-card__i svg{width:18px;height:18px;}'
    + '.rmd-card__m{flex:1;min-width:0;}'
    + '.rmd-card__k{font-size:11.5px;color:#8493B5;font-weight:700;}'
    + '.rmd-card__v{font-size:15px;font-weight:800;margin-top:1px;}'
    + '.rmd-card__b{border:0;background:rgba(255,255,255,.08);color:#EAF0FF;font-family:inherit;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:9px;cursor:pointer;transition:.15s;}'
    + '.rmd-card__b:hover{background:rgba(255,255,255,.16);}'
    + '.rmd__menu{flex:1;overflow-y:auto;padding:12px 12px 8px;margin-top:4px;border-top:1px solid rgba(255,255,255,.06);}'
    + '.rmd-mi{display:flex;align-items:center;gap:12px;width:100%;padding:12px 12px;border:0;background:transparent;color:#D6DEF2;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;border-radius:11px;text-align:left;}'
    + '.rmd-mi:hover{background:rgba(255,255,255,.05);}'
    + '.rmd-mi svg{width:19px;height:19px;color:#8493B5;flex:none;}'
    + '.rmd__foot{padding:12px 16px 18px;border-top:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;gap:8px;}'
    + '.rmd-add{display:flex;align-items:center;justify-content:center;gap:8px;height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#EAF0FF;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;}'
    + '.rmd-add:hover{background:rgba(255,255,255,.05);}'
    + '.rmd-out{display:flex;align-items:center;justify-content:center;gap:8px;height:44px;border-radius:12px;border:0;background:rgba(255,64,76,.14);color:#FF7F87;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;}'
    + '.rmd-out:hover{background:rgba(255,64,76,.22);}'
    + '.rmd-add svg,.rmd-out svg{width:17px;height:17px;}'
    // 학기변경 모달
    + '.rmd-modal{position:fixed;inset:0;z-index:90;display:none;place-items:center;background:rgba(3,7,18,.74);font-family:\'Pretendard\',\'Noto Sans KR\',sans-serif;}'
    + '.rmd-modal.is-open{display:grid;}'
    + '.rmd-modal__box{width:540px;max-width:92vw;background:#0B1428;border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:26px;color:#EAF0FF;letter-spacing:-.02em;}'
    + '.rmd-modal__t{font-size:21px;font-weight:800;}'
    + '.rmd-modal__s{font-size:13.5px;color:#8493B5;font-weight:600;margin:4px 0 18px;}'
    + '.rmd-tabs{display:flex;gap:6px;background:#111E39;padding:4px;border-radius:13px;margin-bottom:16px;}'
    + '.rmd-tab{flex:1;padding:10px;border:0;border-radius:10px;background:transparent;color:#8493B5;font-family:inherit;font-size:14.5px;font-weight:800;cursor:pointer;transition:.15s;}'
    + '.rmd-tab.is-on{background:#008CFF;color:#fff;}'
    + '.rmd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:20px;}'
    + '.rmd-sem{padding:13px 6px;border-radius:12px;border:1.5px solid rgba(255,255,255,.08);background:#111E39;color:#D6DEF2;font-family:inherit;font-size:13.5px;font-weight:700;cursor:pointer;transition:.15s;}'
    + '.rmd-sem:hover{border-color:rgba(127,176,255,.5);}'
    + '.rmd-sem.is-sel{border-color:#4C86FF;background:rgba(76,134,255,.18);color:#fff;}'
    + '.rmd-modal__foot{display:flex;gap:10px;justify-content:flex-end;}'
    + '.rmd-modal__ghost{height:48px;padding:0 20px;border-radius:13px;border:1px solid rgba(255,255,255,.16);background:transparent;color:#C4CEE4;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;}'
    + '.rmd-modal__go{height:48px;padding:0 26px;border-radius:13px;border:0;background:#FF7F00;color:#fff;font-family:inherit;font-size:16px;font-weight:800;cursor:pointer;}'
    + '.rmd-modal__go:hover{background:#FF9124;}'
    + '.rmd-toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(16px);z-index:95;background:#0E1A38;border:1px solid rgba(255,255,255,.1);color:#EAF0FF;padding:11px 18px;border-radius:12px;font-size:13.5px;font-weight:600;opacity:0;pointer-events:none;transition:.2s;font-family:\'Pretendard\',sans-serif;}'
    + '.rmd-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}';

  // [라벨, 아이콘path, (선택)이동URL]
  var MENU = [
    ['마이페이지','M4 20a8 8 0 0 1 16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'],
    ['학습 기록','M4 5h16M4 12h16M4 19h10'],
    ['월간 보고서','M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1','report.html'],
    ['오답 노트','M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1M14 3v6h6'],
    ['진단 평가','M9 11l2 2 4-4M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1'],
    ['이용권 결제','M3 7h18v10H3zM3 11h18','payment.html'],
    ['이용 가이드','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7M12 16.5h.01']  /* 노션 외부 페이지 예정 */
  ];

  var scrim, drawer, modal, toastEl, tt, modalTab='elem', modalSel=null, built=false;

  function build(){
    if(built) return; built=true;
    var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

    scrim=document.createElement('div'); scrim.className='rmd-scrim'; document.body.appendChild(scrim);

    drawer=document.createElement('aside'); drawer.className='rmd';
    var menuHtml = MENU.map(function(m){
      var act = m[2] ? 'data-go="'+m[2]+'"' : 'data-toast="'+m[0]+' — 준비 중입니다."';
      return '<button class="rmd-mi" '+act+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="'+m[1]+'"/></svg>'+m[0]+'</button>';
    }).join('');
    drawer.innerHTML =
      '<div class="rmd__head"><span style="font-size:16px;font-weight:800">메뉴</span>'
      + '<button class="rmd__x" data-close><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
      + '<div class="rmd__prof"><div class="rmd__nm">김학생</div><div class="rmd__exp">이용 가능 기간 · 2029년 3월 31일까지</div></div>'
      + '<div class="rmd__cards">'
      +   '<div class="rmd-card"><span class="rmd-card__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18"/></svg></span>'
      +     '<div class="rmd-card__m"><div class="rmd-card__k">현재 학기</div><div class="rmd-card__v" id="rmdSem">초등 3학년 1학기</div></div><button class="rmd-card__b" data-chg-sem>변경</button></div>'
      +   '<div class="rmd-card"><span class="rmd-card__i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>'
      +     '<div class="rmd-card__m"><div class="rmd-card__k">현재 과목</div><div class="rmd-card__v" id="rmdSubj">수학</div></div><button class="rmd-card__b" data-chg-subj>변경</button></div>'
      + '</div>'
      + '<div class="rmd__menu">'+menuHtml+'</div>'
      + '<div class="rmd__foot">'
      +   '<button class="rmd-add" data-toast="홈 화면에 추가 — 준비 중입니다."><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>홈 화면에 추가</button>'
      +   '<button class="rmd-out" data-out><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h12"/></svg>로그아웃</button>'
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
      if(t.hasAttribute('data-chg-subj')){ location.href='bridge.html'; return; }
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
        localStorage.setItem('rm-sem', modalSel); location.href='home.html?subject='+subject()+'&sem='+modalSel; }
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
  function toast_(m){ build(); toastEl.textContent=m; toastEl.classList.add('show'); clearTimeout(tt); tt=setTimeout(function(){toastEl.classList.remove('show');},1900); }

  // ---- 실제 피그마 GNB 로고/아이콘 주입 (currentColor → 다크/라이트 공용) ----
  var GNB_LOGO = '<svg viewBox="0 0 32 32" fill="none"><path d="M26.03 9.7V7.31c-5.01 0-7.86 3.26-10.2 6.6-2.35-3.34-5.2-6.6-10.21-6.6V9.7c4.19 0 6.48 2.98 8.76 6.31-2.28 3.33-4.57 6.31-8.76 6.31v2.38c5.01 0 7.86-3.26 10.2-6.59 2.35 3.33 5.2 6.59 10.21 6.59v-2.38c-4.19 0-6.48-2.98-8.76-6.31 2.28-3.33 4.57-6.31 8.76-6.31Z" fill="#3C7BE0"/><path d="M27.67 16.88v-1.75h-5.73v1.75h5.73Z" fill="#F7417A"/><path d="M18.69 5.99h-1.99V4h-1.75v1.99h-1.99v1.75h1.99v1.99h1.75V7.74h1.99V5.99Z" fill="#4BC8DC"/><path d="M18.53 25.84v-1.56h-5.41v1.56h5.41ZM16.6 28V26.44h-1.56V28h1.56ZM16.6 23.68v-1.57h-1.56v1.57h1.56Z" fill="#64C947"/><path d="M9.62 14.6 8.39 13.36l-1.41 1.41-1.41-1.41-1.24 1.24 1.41 1.41-1.41 1.41 1.24 1.24 1.41-1.41 1.41 1.41 1.23-1.24-1.41-1.41 1.41-1.41Z" fill="#FF9B4E"/></svg>';
  var GNB_ICONS = {
    help: '<svg viewBox="0 0 28 28" fill="none"><mask id="rmgh" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28"><path d="M0 0H28V28H0V0Z" fill="#fff"/><path d="M15.8721 20.691C15.8721 21.2622 15.6452 21.81 15.2413 22.214C14.8374 22.6179 14.2895 22.8448 13.7183 22.8448C13.1471 22.8448 12.5992 22.6179 12.1953 22.214C11.7914 21.81 11.5645 21.2622 11.5645 20.691C11.5645 20.1197 11.7914 19.5719 12.1953 19.168C12.5992 18.764 13.1471 18.5371 13.7183 18.5371C14.2895 18.5371 14.8374 18.764 15.2413 19.168C15.6452 19.5719 15.8721 20.1197 15.8721 20.691Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6873 8.36233C12.9657 8.36233 12.3465 8.57772 11.9104 8.88572C11.4904 9.18295 11.2825 9.52864 11.2222 9.82695C11.1331 10.2257 10.8913 10.5736 10.5486 10.7961C10.2059 11.0186 9.78962 11.0979 9.38912 11.017C8.98863 10.9361 8.63579 10.7015 8.4063 10.3634C8.17682 10.0254 8.08896 9.61087 8.1616 9.2088C8.40606 7.99618 9.15775 7.00649 10.1097 6.33341C11.1005 5.63341 12.3562 5.23926 13.6873 5.23926C16.441 5.23926 19.2959 7.0808 19.2959 10.038C19.2959 11.7503 18.2782 13.1353 16.9601 13.943C16.6067 14.1592 16.182 14.2262 15.7793 14.1292C15.3766 14.0323 15.0289 13.7793 14.8127 13.426C14.5965 13.0727 14.5295 12.648 14.6264 12.2453C14.7233 11.8426 14.9763 11.4949 15.3296 11.2786C15.9434 10.9028 16.1728 10.4236 16.1728 10.038C16.1728 9.41987 15.4028 8.36233 13.6873 8.36233Z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6875 12.5244C14.5491 12.5244 15.2491 13.2223 15.2491 14.086V15.7035C15.2491 16.1176 15.0845 16.5148 14.7917 16.8077C14.4988 17.1005 14.1017 17.265 13.6875 17.265C13.2734 17.265 12.8762 17.1005 12.5833 16.8077C12.2905 16.5148 12.126 16.1176 12.126 15.7035V14.086C12.126 13.2244 12.8249 12.5244 13.6875 12.5244Z" fill="#000"/></mask><g mask="url(#rmgh)"><circle cx="14" cy="14" r="12.83" fill="currentColor"/></g></svg>',
    report: '<svg viewBox="0 0 28 28" fill="none"><path d="M11.4327 11.4335C11.4327 10.7277 11.6842 10.1237 12.1873 9.62146C12.6903 9.11925 13.2944 8.86772 13.9993 8.86686C14.363 8.86686 14.668 8.74366 14.9144 8.49726C15.1608 8.25086 15.2835 7.94628 15.2827 7.58353C15.2818 7.22077 15.1586 6.9162 14.9131 6.6698C14.6675 6.4234 14.363 6.3002 13.9993 6.3002C12.5877 6.3002 11.3792 6.80283 10.3739 7.80811C9.36865 8.81339 8.86601 10.0219 8.86601 11.4335V14.0002C8.86601 14.3638 8.98921 14.6688 9.23561 14.9152C9.48201 15.1616 9.78659 15.2844 10.1493 15.2835C10.5121 15.2827 10.8171 15.1595 11.0644 14.9139C11.3116 14.6684 11.4344 14.3638 11.4327 14.0002V11.4335ZM3.73268 25.5502C3.02685 25.5502 2.42283 25.2991 1.92062 24.7969C1.4184 24.2947 1.16687 23.6902 1.16602 22.9835V20.4169C1.16602 19.711 1.41755 19.107 1.92062 18.6048C2.42368 18.1026 3.0277 17.8511 3.73268 17.8502H5.01602V11.4335C5.01602 8.93103 5.88783 6.8084 7.63145 5.06563C9.37507 3.32286 11.4977 2.45105 13.9993 2.4502C16.501 2.44934 18.6241 3.32115 20.3685 5.06563C22.113 6.81011 22.9844 8.93274 22.9827 11.4335V17.8502H24.266C24.9718 17.8502 25.5763 18.1017 26.0794 18.6048C26.5824 19.1079 26.8335 19.7119 26.8327 20.4169V22.9835C26.8327 23.6894 26.5816 24.2938 26.0794 24.7969C25.5772 25.2999 24.9727 25.551 24.266 25.5502H3.73268Z" fill="currentColor"/></svg>',
    notice: '<svg viewBox="0 0 28 28" fill="none"><path d="M2.33301 11.6667V16.3334C2.33301 17.6167 3.38301 18.6667 4.66634 18.6667H6.99967V9.33336H4.66634C3.38301 9.33336 2.33301 10.3834 2.33301 11.6667ZM25.1647 3.71003C25.008 3.60171 24.8273 3.53338 24.6381 3.51101C24.449 3.48864 24.2573 3.51291 24.0797 3.5817L9.33301 9.2517V18.7484L10.2897 19.11L9.74134 20.7434C9.35634 21.91 9.93967 23.1817 11.0947 23.6484L14.758 25.1184C15.038 25.2234 15.3297 25.2817 15.6213 25.2817C15.9597 25.2817 16.298 25.2117 16.6013 25.06C17.1847 24.7917 17.628 24.29 17.8263 23.6834L18.3163 22.2017L24.068 24.4184C24.208 24.465 24.348 24.5 24.488 24.5C24.7213 24.5 24.9547 24.43 25.153 24.29C25.468 24.0684 25.6547 23.7067 25.6547 23.3334V4.6667C25.6547 4.2817 25.468 3.92003 25.153 3.71003H25.1647ZM15.6213 22.96L11.958 21.49L12.4713 19.95L16.1463 21.3617L15.6213 22.9484V22.96Z" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 20" fill="none"><path d="M24.0001 17.0001V19.0001C24.0001 19.2709 23.9012 19.5053 23.7033 19.7032C23.5053 19.9012 23.271 20.0001 23.0001 20.0001H1.00001C0.729171 20.0001 0.494794 19.9012 0.296877 19.7032C0.0989589 19.5053 0 19.2709 0 19.0001V17.0001C0 16.7293 0.0989589 16.4949 0.296877 16.297C0.494794 16.099 0.729171 16.0001 1.00001 16.0001H23.0001C23.271 16.0001 23.5053 16.099 23.7033 16.297C23.9012 16.4949 24.0001 16.7293 24.0001 17.0001ZM24.0001 9.00005V11.0001C24.0001 11.2709 23.9012 11.5053 23.7033 11.7032C23.5053 11.9011 23.271 12.0001 23.0001 12.0001H1.00001C0.729171 12.0001 0.494794 11.9011 0.296877 11.7032C0.0989589 11.5053 0 11.2709 0 11.0001V9.00005C0 8.72922 0.0989589 8.49484 0.296877 8.29692C0.494794 8.099 0.729171 8.00004 1.00001 8.00004H23.0001C23.271 8.00004 23.5053 8.099 23.7033 8.29692C23.9012 8.49484 24.0001 8.72922 24.0001 9.00005ZM24.0001 1.00001V3.00002C24.0001 3.27085 23.9012 3.50523 23.7033 3.70315C23.5053 3.90106 23.271 4.00002 23.0001 4.00002H1.00001C0.729171 4.00002 0.494794 3.90106 0.296877 3.70315C0.0989589 3.50523 0 3.27085 0 3.00002V1.00001C0 0.729171 0.0989589 0.494794 0.296877 0.296877C0.494794 0.0989589 0.729171 0 1.00001 0H23.0001C23.271 0 23.5053 0.0989589 23.7033 0.296877C23.9012 0.494794 24.0001 0.729171 24.0001 1.00001Z" fill="currentColor"/></svg>'
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
      lg.addEventListener('click', function(){ location.href='home.html?subject='+subject()+'&sem='+semKey(); }); }
    var mb=document.getElementById('menuBtn') || document.querySelector('[data-drawer-open]');
    if(mb) mb.addEventListener('click', function(e){ e.preventDefault(); open(); });
    // 공지사항 아이콘 → 공지 목록
    var nb=document.getElementById('noticeBtn');
    if(nb && !nb.__go){ nb.__go=1; nb.addEventListener('click', function(){ location.href='notice.html'; }); }
    // 공용 모드 탭 네비게이션
    var gos=document.querySelectorAll('[data-go]');
    for(var i=0;i<gos.length;i++){ (function(b){ if(b.__go) return; b.__go=1;
      b.addEventListener('click', function(){ var u=b.getAttribute('data-go'); if(u) location.href=u; }); })(gos[i]); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  window.RMDrawer = { open:open, close:close, toast:toast_ };
})();
