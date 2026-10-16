/* util/payment.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  var SUBJ={ math:'리딩수학', science:'리딩과학', both:'수학+과학 통합' };
  var BEN={
    math:['초3 ~ 중1까지 개념·유형·서술형 균형 잡힌 <b>리딩수학 학습</b> 진행','복습과 정리를 위한 매주 <b>주간 학습 기록과 오답노트</b> 제공','매월 학습 현황을 확인하는 <b>월간보고서</b> 제공','사고력 기반 <b>수리 문해력 종합진단평가</b> 제공','월 1회 학습 매니저 상담으로 <b>성취도 및 진도 관리</b>'],
    science:['초3 ~ 중1까지 개념·탐구·서술형 <b>리딩과학 학습</b> 진행','실생활 현상 기반의 <b>과학 문해력</b> 훈련 제공','매주 <b>주간 학습 기록과 오답노트</b> 제공','매월 <b>월간보고서</b> 및 종합진단평가 제공','월 1회 학습 매니저 상담으로 <b>성취도 및 진도 관리</b>'],
    both:['<b>리딩수학 + 리딩과학</b>을 하나의 이용권으로 통합 학습','수학·과학 <b>주간 학습 기록·오답노트</b> 통합 제공','매월 <b>통합 월간보고서</b> 및 종합진단평가 제공','두 과목 <b>교차 성취 분석</b> 리포트 제공','월 1회 학습 매니저 상담으로 <b>성취도 및 진도 관리</b>']
  };
  function mk(k,nm,days,list,price){ return {k:k,nm:nm,days:days,list:list,price:price,off:Math.round((1-price/list)*100),mo:Math.round(price/k)}; }
  var PLANS={
    math:[ mk(1,'1개월','30일',70000,70000), mk(3,'3개월','90일',210000,195000), mk(6,'6개월','180일',420000,360000), mk(12,'12개월','365일',840000,600000) ],
    science:[ mk(1,'1개월','30일',66000,66000), mk(3,'3개월','90일',198000,184000), mk(6,'6개월','180일',396000,336000), mk(12,'12개월','365일',792000,564000) ],
    both:[ mk(1,'1개월','30일',119000,119000), mk(3,'3개월','90일',357000,330000), mk(6,'6개월','180일',714000,606000), mk(12,'12개월','365일',1428000,996000) ]
  };
  var CARD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>';
  var BANK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22" /><line x1="6" x2="6" y1="18" y2="11" /><line x1="10" x2="10" y1="18" y2="11" /><line x1="14" x2="14" y1="18" y2="11" /><line x1="18" x2="18" y1="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg>';
  var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>';
  var BANG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>';
  var PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>';

  var state={ subj:'math', plan:null, method:'card', coupon:0, cpOpen:false, cpMsg:'', cpValue:'' };

  function won(n){ return n.toLocaleString('ko-KR')+'원'; }
  function pad(n){ return (n<10?'0':'')+n; }
  function fmt(d){ return d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate()); }
  /* 이용 종료일 — 오늘 + 이용 일수. 새 데이터가 아니라 기존 일수에서 나오는 파생값 */
  function endDate(daysLabel){ var n=parseInt(daysLabel,10); var d=new Date(); d.setDate(d.getDate()+n); return fmt(d); }

  var subjEl=document.getElementById('subjList'), benEl=document.getElementById('benefits'),
      planEl=document.getElementById('planList'), methodEl=document.getElementById('methodList'),
      cpEl=document.getElementById('couponArea'), payBtn=document.getElementById('payBtn'),
      agreeBox=document.getElementById('agree'), agreeWrap=document.getElementById('agreeWrap');

  function renderSubj(){
    subjEl.innerHTML=Object.keys(SUBJ).map(function(k){
      return '<button class="'+(state.subj===k?'is-on':'')+'" data-subj="'+k+'">'+SUBJ[k]+'</button>';
    }).join('');
    benEl.innerHTML=BEN[state.subj].map(function(t){ return '<li>'+CHECK+'<span>'+t+'</span></li>'; }).join('');
  }
  /* 기간 타일 — 월 환산가가 큰 숫자(비교축), 총 결제금액을 그 아래 함께 적는다 */
  function renderPlans(){
    planEl.innerHTML=PLANS[state.subj].map(function(p,i){
      return '<button class="u-tile'+(state.plan===i?' is-on':'')+'" data-plan="'+i+'">'
        +'<span class="u-tile__nm">'+p.nm+'</span>'
        +(p.off>0?'<span class="u-tile__off">−'+p.off+'%</span>':'')
        +'<span class="u-tile__mo">'+won(p.mo)+'<small>/월</small></span>'
        +'<span class="u-tile__tot">총 '+won(p.price)+' · '+p.days+'</span></button>';
    }).join('');
  }
  function renderMethods(){
    methodEl.innerHTML=
       '<button class="u-tile u-tile--m'+(state.method==='card'?' is-on':'')+'" data-m="card">'+CARD+'<span class="u-tile__nm">신용카드</span></button>'
      +'<button class="u-tile u-tile--m'+(state.method==='vbank'?' is-on':'')+'" data-m="vbank">'+BANK+'<span class="u-tile__nm">가상계좌</span></button>';
  }
  /* 쿠폰은 기본 접힘 — 쿠폰 없는 사람에게 입력창은 노이즈다 */
  function renderCoupon(){
    if(!state.cpOpen){ cpEl.innerHTML='<button class="u-cpToggle" id="cpToggle">'+PLUS+'쿠폰 등록</button>'; return; }
    cpEl.innerHTML='<div class="u-cp"><input class="u-field'+(state.cpMsg==='bad'?' is-bad':'')+'" id="coupon" placeholder="쿠폰 번호" value="'+state.cpValue.replace(/"/g,'&quot;')+'">'
      +'<button class="u-cp__btn" id="couponBtn">적용</button></div>'
      +(state.cpMsg==='bad'?'<div class="u-cp__msg is-bad">'+BANG+'사용할 수 없는 쿠폰이에요.</div>':'')
      +(state.cpMsg==='ok'?'<div class="u-cp__msg is-ok">'+CHECK+'웰컴 쿠폰 적용</div>':'');
  }
  function renderSummary(){
    var p = state.plan!==null ? PLANS[state.subj][state.plan] : null;
    var planOff = p ? (p.list-p.price) : 0;
    var total = p ? Math.max(0, p.price-state.coupon) : 0;
    var saved = planOff + (p?state.coupon:0);

    document.getElementById('sumWhat').innerHTML = SUBJ[state.subj]+' · '+(p?p.nm:'<em>—</em>');
    document.getElementById('sumWhen').textContent = p ? fmt(new Date())+' – '+endDate(p.days) : '';
    set('sumList', p?won(p.list):'—', !!p);
    set('sumOff', planOff>0?'−'+won(planOff):'—', planOff>0);
    set('sumCoupon', (p&&state.coupon>0)?'−'+won(state.coupon):'—', p&&state.coupon>0);
    document.getElementById('sumMethod').textContent = state.method==='card'?'신용카드':'가상계좌';

    document.getElementById('total').textContent = won(total);
    document.getElementById('totalMo').textContent = p ? '월 '+won(p.mo)+' × '+p.nm : '';
    document.getElementById('totalSave').textContent = saved>0 ? '−'+won(saved) : '';

    payBtn.textContent = p ? won(total)+' 결제' : '결제';
    payBtn.disabled = !p || !agreeBox.checked;
  }
  function set(id,txt,filled){
    var el=document.getElementById(id);
    el.textContent=txt;
    el.className='u-sum__v'+(filled?'':' is-ph');
  }
  function renderAll(){ renderSubj(); renderPlans(); renderMethods(); renderCoupon(); renderSummary(); }

  subjEl.addEventListener('click', function(e){
    var b=e.target.closest('[data-subj]'); if(!b) return;
    state.subj=b.dataset.subj; renderAll();
  });
  planEl.addEventListener('click', function(e){
    var b=e.target.closest('[data-plan]'); if(!b) return;
    state.plan=parseInt(b.dataset.plan,10); renderPlans(); renderSummary();
  });
  methodEl.addEventListener('click', function(e){
    var b=e.target.closest('[data-m]'); if(!b) return;
    state.method=b.dataset.m; renderMethods(); renderSummary();
  });
  cpEl.addEventListener('click', function(e){
    if(e.target.closest('#cpToggle')){ state.cpOpen=true; renderCoupon(); document.getElementById('coupon').focus(); return; }
    if(e.target.closest('#couponBtn')){
      var v=document.getElementById('coupon').value.trim();
      state.cpValue=v;
      if(!v){ toast('쿠폰 번호를 입력해 주세요.'); return; }
      /* 데모: WELCOME으로 시작하면 10,000원 할인, 아니면 실패 */
      if(/^WELCOME/i.test(v)){ state.coupon=10000; state.cpMsg='ok'; }
      else { state.coupon=0; state.cpMsg='bad'; }
      renderCoupon(); renderSummary();
    }
  });
  agreeBox.addEventListener('change', function(){
    agreeWrap.classList.remove('is-bad'); renderSummary();
  });
  payBtn.addEventListener('click', function(){
    toast('결제는 데모 화면입니다. 실제 결제는 진행되지 않아요.');
  });

  var toastEl=document.getElementById('toast'), tt;
  function toast(m){ toastEl.textContent=m; toastEl.classList.add('is-on'); clearTimeout(tt);
    tt=setTimeout(function(){ toastEl.classList.remove('is-on'); },2000); }

  renderAll();
})();
