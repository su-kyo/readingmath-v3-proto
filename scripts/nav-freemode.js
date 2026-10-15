/* nav/freemode.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  /* ============ 데이터 ============ */
  var UNIV = {
    elem: { name:'초등 우주', planets:[
      {key:'elem-3-1',label:'초등 3학년 1학기',prog:48},{key:'elem-3-2',label:'초등 3학년 2학기',prog:12},
      {key:'elem-4-1',label:'초등 4학년 1학기',prog:0},{key:'elem-4-2',label:'초등 4학년 2학기',prog:0},
      {key:'elem-5-1',label:'초등 5학년 1학기',prog:0},{key:'elem-5-2',label:'초등 5학년 2학기',prog:0},
      {key:'elem-6-1',label:'초등 6학년 1학기',prog:0},{key:'elem-6-2',label:'초등 6학년 2학기',prog:0}
    ]},
    mid: { name:'중고등 우주', planets:[
      {key:'mid-1-1',label:'중등 1학년 1학기',prog:100},{key:'mid-1-2',label:'중등 1학년 2학기',prog:86},
      {key:'mid-2-1',label:'중등 2학년 1학기',prog:54},{key:'mid-2-2',label:'중등 2학년 2학기',prog:30},
      {key:'mid-3-1',label:'중등 3학년 1학기',prog:8},{key:'mid-3-2',label:'중등 3학년 2학기',prog:0},
      {key:'high-1-1',label:'통합과학 1',prog:0},{key:'high-1-2',label:'통합과학 2',prog:0}
    ]}
  };
  var STRANDS = {
    elem: [ {key:'suyeon',label:'수와 연산',prog:52},{key:'dohyeong',label:'도형',prog:20},{key:'cheukjeong',label:'측정',prog:8},{key:'gyuchik',label:'규칙성',prog:0},{key:'jaryo',label:'자료와 가능성',prog:0} ],
    mid: [ {key:'munja',label:'문자와 식',prog:44},{key:'hamsu',label:'함수',prog:12},{key:'giha',label:'기하',prog:0},{key:'hwakryul',label:'확률과 통계',prog:0},{key:'byeonhwa',label:'변화와 관계',prog:0},{key:'dohyeong-cheukjeong',label:'도형과 측정',prog:0} ]
  };
  // 과목 계통 태그색 — 계통 전용 토큰(--subj-*, 채도 있는 400스텝) 사용 (curriculum과 동일)
  var F_TAGCOLOR = { '수와 연산':'var(--subj-num)','도형':'var(--subj-geo)','규칙성':'var(--subj-rel)','측정':'var(--subj-geo)','자료와 가능성':'var(--subj-data)',
    '문자와 식':'var(--subj-num)','함수':'var(--subj-rel)','기하':'var(--subj-geo)','확률과 통계':'var(--subj-data)','변화와 관계':'var(--subj-num)','도형과 측정':'var(--subj-geo)',
    '물리':'var(--subj-phys)','화학':'var(--subj-chem)','지구과학':'var(--subj-data)','생명과학':'var(--subj-bio)' };
  var F_TNAME = { concept:'개념 훈련', type:'유형 훈련', essay:'서술형 훈련' };
  var F_TGO   = { concept:'concept/learn.html', type:'type/quiz.html', essay:'essay/basics-v2.html' };
  var CHAL_GO = 'type/quiz.html';

  // 소단원 = { no, title, done, t:{concept,type,essay}, challenge:[6칩] }
  // 훈련 = { round: 지금 해야 할 라운드, grade: 최고 등급('s'|'a'|'b'|'c'|null) }
  function G(round,grade){ return {round:round,grade:grade||null}; }
  function sub(no,title,done,c,t,e,chal){ return {no:no,title:title,done:done,t:{concept:c,type:t,essay:e},challenge:chal}; }
  var CH = {
    a:['understood','supplement','none','none','none','none'],
    b:['mastered','understood','relearn','none','none','none'],
    c:['none','none','none','none','none','none'],
    d:['relearn','supplement','understood','mastered','pending','none']
  };
  // 학기별 커리큘럼 (데모)
  var SEM_UNITS = {
    'elem-3-1':[
      {no:1,name:'덧셈과 뺄셈',tag:'수와 연산',subs:[
        sub(1,'받아올림이 없는 세 자리 수의 덧셈',true,  G(3,'a'),G(3,'a'),G(3,'b'), CH.d),
        sub(2,'받아올림이 있는 세 자리 수의 덧셈',false, G(3,'b'),G(2,'b'),G(1,'c'), CH.b),
        sub(3,'받아내림이 없는 세 자리 수의 뺄셈',false, G(2,'a'),G(1,'c'),G(1,null), CH.a),
        sub(4,'받아내림이 있는 세 자리 수의 뺄셈',false, G(1,'b'),G(1,null),G(1,null), CH.a)
      ]},
      {no:2,name:'평면도형',tag:'도형',subs:[
        sub(1,'선분, 직선, 반직선',false, G(1,'s'),G(2,'a'),G(1,null), CH.a),
        sub(2,'각과 직각',false,          G(1,'b'),G(1,null),G(1,null), CH.a),
        sub(3,'직각삼각형',false,          G(1,null),G(1,null),G(1,null), CH.c),
        sub(4,'직사각형과 정사각형',false, G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:3,name:'나눗셈',tag:'수와 연산',subs:[
        sub(1,'똑같이 나누어 보기',false,       G(2,'b'),G(1,'c'),G(1,null), CH.b),
        sub(2,'곱셈과 나눗셈의 관계',false,      G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'나눗셈의 몫 구하기',false,        G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:4,name:'곱셈',tag:'수와 연산',subs:[
        sub(1,'(몇십)×(몇)',false,             G(1,'b'),G(1,null),G(1,null), CH.a),
        sub(2,'(몇십몇)×(몇)',false,           G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'올림이 있는 (몇십몇)×(몇)',false, G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:5,name:'길이와 시간',tag:'측정',subs:[
        sub(1,'1mm를 알아볼까요',false,     G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'1km를 알아볼까요',false,     G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'시간의 합과 차',false,       G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:6,name:'분수와 소수',tag:'수와 연산',subs:[
        sub(1,'분수를 알아볼까요',false,            G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'분모가 같은 분수의 크기 비교',false, G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'소수를 알아볼까요',false,            G(1,null),G(1,null),G(1,null), CH.c)
      ]}
    ],
    'elem-3-2':[
      {no:1,name:'곱셈',tag:'수와 연산',subs:[
        sub(1,'(세 자리 수)×(한 자리 수)',false, G(1,'c'),G(1,null),G(1,null), CH.a),
        sub(2,'(몇십)×(몇십)',false,            G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'(몇십몇)×(몇십몇)',false,        G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:2,name:'나눗셈',tag:'수와 연산',subs:[
        sub(1,'(몇십)÷(몇)',false,            G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'나머지가 있는 나눗셈',false,     G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:3,name:'원',tag:'도형',subs:[
        sub(1,'원의 중심, 반지름, 지름',false, G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'원 그리기',false,               G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:4,name:'분수',tag:'수와 연산',subs:[
        sub(1,'분수로 나타내기',false,     G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'진분수, 가분수, 대분수',false, G(1,null),G(1,null),G(1,null), CH.c),
        sub(3,'분수의 크기 비교',false,     G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:5,name:'들이와 무게',tag:'측정',subs:[
        sub(1,'들이의 단위 (L, mL)',false, G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'무게의 단위 (kg, g)',false, G(1,null),G(1,null),G(1,null), CH.c)
      ]},
      {no:6,name:'자료의 정리',tag:'자료와 가능성',subs:[
        sub(1,'표에서 알 수 있는 내용',false, G(1,null),G(1,null),G(1,null), CH.c),
        sub(2,'그림그래프',false,             G(1,null),G(1,null),G(1,null), CH.c)
      ]}
    ]
  };
  var GENERIC = [
    {no:1,name:'큰 수',tag:'수와 연산',subs:[
      sub(1,'다섯 자리 수',false,       G(1,'b'),G(1,null),G(1,null), CH.a),
      sub(2,'십만, 백만, 천만',false,   G(1,null),G(1,null),G(1,null), CH.c),
      sub(3,'억과 조',false,            G(1,null),G(1,null),G(1,null), CH.c),
      sub(4,'뛰어 세기와 수의 크기 비교',false, G(1,null),G(1,null),G(1,null), CH.c)
    ]},
    {no:2,name:'각도',tag:'측정',subs:[
      sub(1,'각의 크기 재기',false,     G(1,null),G(1,null),G(1,null), CH.c),
      sub(2,'예각과 둔각',false,        G(1,null),G(1,null),G(1,null), CH.c),
      sub(3,'각도의 합과 차',false,     G(1,null),G(1,null),G(1,null), CH.c)
    ]},
    {no:3,name:'곱셈과 나눗셈',tag:'수와 연산',subs:[
      sub(1,'(세 자리 수)×(몇십)',false, G(1,null),G(1,null),G(1,null), CH.c),
      sub(2,'(몇백몇십)÷(몇십)',false,   G(1,null),G(1,null),G(1,null), CH.c)
    ]},
    {no:4,name:'평면도형의 이동',tag:'도형',subs:[
      sub(1,'점의 이동',false,     G(1,null),G(1,null),G(1,null), CH.c),
      sub(2,'평면도형 밀기·뒤집기·돌리기',false, G(1,null),G(1,null),G(1,null), CH.c)
    ]}
  ];
  function unitsFor(key){ return SEM_UNITS[key] || GENERIC; }
  function unitsForStrand(semKey, tag){
    var hit = unitsFor(semKey).filter(function(u){ return u.tag===tag; });
    return hit.length ? hit : [{no:1,name:tag+' 단원',tag:tag,subs:[ sub(1,'대표 소단원',false,G(1,null),G(1,null),G(1,null),CH.c) ]}];
  }
  // 계통 상세: 학기별 그룹
  function strandGroups(strandKey, strandLabel){
    var base = state.u==='elem'
      ? [['elem-3-1','3학년 1학기'],['elem-3-2','3학년 2학기'],['elem-4-1','4학년 1학기']]
      : [['mid-1-1','1학년 1학기'],['mid-1-2','1학년 2학기'],['mid-2-1','2학년 1학기']];
    var S = [
      [ {no:1,name:'덧셈과 뺄셈',tag:strandLabel,subs:[ sub(1,'세 자리 수의 덧셈',true,G(3,'a'),G(2,'b'),G(1,'c'),CH.b) ]},
        {no:3,name:'나눗셈',tag:strandLabel,subs:[ sub(1,'똑같이 나누어 보기',false,G(1,null),G(1,null),G(1,null),CH.c) ]} ],
      [ {no:1,name:'곱셈',tag:strandLabel,subs:[ sub(1,'(몇십)×(몇)',false,G(1,'b'),G(1,null),G(1,null),CH.a) ]} ],
      [ {no:2,name:'큰 수',tag:strandLabel,subs:[ sub(1,'다섯 자리 수',false,G(1,null),G(1,null),G(1,null),CH.c) ]} ]
    ];
    return base.map(function(b,idx){ return { semKey:b[0], semLabel:b[1], units:S[idx%S.length] }; });
  }

  var STEP = 186 + 70;   // planet width + gap
  var state = { u:'elem', i:0, view:'semester', all:false };
  var lastSem = 'elem-3-1';   // 허브로 넘길 현재 학기 키
  var track = document.getElementById('track');
  var detailEl = document.getElementById('detail');
  var trackX = 0, dragMoved = false;

  function curList(){ return state.view==='strand' ? STRANDS[state.u] : UNIV[state.u].planets; }
  function curDir(){ return state.view==='strand' ? 'assets/img/strands/' : 'assets/img/planets/'; }

  /* ============ 캐러셀 ============ */
  function render(){
    var arr = curList(), dir = curDir();
    track.innerHTML='';
    arr.forEach(function(p,idx){
      var el = document.createElement('div');
      el.className = 'planet' + (idx===state.i?' is-center':'');
      el.innerHTML =
        '<img class="planet__img" src="'+dir+p.key+'.webp" alt="'+p.label+'">' +
        '<button class="planet__hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>목록 보기</button>' +
        '<div class="planet__label">'+p.label+'</div>' +
        '<div class="planet__prog"><div class="planet__pct">'+p.prog+'% 진행했어요!</div><div class="bar"><div class="bar__f" style="width:'+p.prog+'%"></div></div></div>';
      el.addEventListener('click', function(){ if(dragMoved) return;
        if(idx===state.i) openPlanet(arr[idx]); else { state.i=idx; position(); } });
      el.querySelector('.planet__hint').addEventListener('click', function(ev){ ev.stopPropagation(); state.i=idx; position(); openPlanet(arr[idx]); });
      track.appendChild(el);
    });
    position();
    updateChrome();
  }
  function position(){
    var vpW = document.querySelector('.viewport').clientWidth;
    trackX = vpW/2 - (state.i*STEP) - 93;
    track.style.transform = 'translate('+trackX+'px, -50%)';
    var kids = track.children;
    for(var k=0;k<kids.length;k++) kids[k].classList.toggle('is-center', k===state.i);
    document.getElementById('prevBtn').disabled = state.i===0;
    document.getElementById('nextBtn').disabled = state.i===curList().length-1;
    if(detailEl.classList.contains('is-open')) fillDetail(curList()[state.i]);   // 상세 열려있으면 동기화
  }
  function updateChrome(){
    var vname = (state.view==='semester'?'학기별':'계통별');
    document.getElementById('univLabel').innerHTML = '<b>'+UNIV[state.u].name+'</b> · '+vname+' 보기';
    document.getElementById('univBtnL').textContent = state.u==='elem' ? '중고등 우주로' : '초등 우주로';
  }

  /* ============ unit 렌더 ============ */
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var GOARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  // ---- 등급 별 (색=등급): A금 B은 C동 · S프리즘(무지개)
  var GCOL = { s:'var(--art-grade-s)', a:'var(--art-grade-a)', b:'var(--art-grade-b)', c:'var(--art-grade-c)' };
  (function(){ if(document.getElementById('rmStarDefs')) return;
    var d=document.createElement('div'); d.className='svg-defs';
    d.innerHTML='<svg id="rmStarDefs" aria-hidden="true"><defs><linearGradient id="rmPrism" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0" stop-color="var(--art-planet-1)"/><stop offset=".38" stop-color="var(--art-planet-2)"/>'
      + '<stop offset=".72" stop-color="var(--art-planet-3)"/><stop offset="1" stop-color="var(--art-planet-4)"/></linearGradient></defs></svg>';
    document.body.appendChild(d);
  })();
  function miniStar(g){
    var c = g ? (g==='s' ? 'url(#rmPrism)' : GCOL[g]) : '';
    return '<svg viewBox="2 2 20 20" width="19" height="19" '
      + (g ? 'fill="'+c+'" stroke="'+c+'" stroke-width="2.8"' : 'fill="none" stroke="var(--hw-key)" stroke-width="2.4"')
      + ' stroke-linejoin="round" stroke-linecap="round" role="img" aria-label="'+(g?g.toUpperCase()+'등급':'미획득')
      + '"><path d="M12 4.2 14.7 8.7 19.8 9.6 16.3 13.4 16.9 18.6 12 16.4 7.1 18.6 7.7 13.4 4.2 9.6 9.3 8.7Z"/></svg>';
  }
  function gradeStarImg(g){ var a=g?'star-'+g:'star-b'; return '<span class="hyc__star"><img class="'+(g?'':'x')+'" src="assets/icons/star/'+a+'.svg" alt="'+(g?g.toUpperCase()+'등급':'미획득')+'"></span>'; }
  // {round(지금 할 라운드), grade(최고)} → 3라운드 세그
  function fmBar(rg){ rg=rg||{round:1,grade:null}; var segs=[]; for(var i=1;i<=3;i++){ segs.push(i<rg.round?'done':(i===rg.round?(rg.grade?'done':'cur'):'todo')); } return { best:rg.grade, segs:segs }; }
  // 흐름 B: 훈련 선택 → curriculum 허브(해당 탭 켜진 채)
  function goHub(tk){ location.href='nav/curriculum.html?sem='+encodeURIComponent(lastSem)+'&tab='+tk; }

  function buildUnitEl(u){
    var unit=document.createElement('div'); unit.className='unit';
    var col=F_TAGCOLOR[u.tag]||'var(--text-muted)';
    var ttl=document.createElement('div'); ttl.className='unit__ttl';
    ttl.innerHTML='<span class="tag" style="--tag-c:'+col+'">'+u.tag+'</span>'+u.no+'단원 · '+u.name;
    unit.appendChild(ttl);
    u.subs.forEach(function(s,si){
      var sb=document.createElement('div'); sb.className='sub';  // 기본: 모두 닫힘
      var cb=fmBar(s.t.concept), tb=fmBar(s.t.type), eb=fmBar(s.t.essay);
      // 접힘 요약 = 작은 아이콘 별(색=등급) + (완료 시) 배지
      var head=document.createElement('div'); head.className='sub__head';
      head.innerHTML='<span class="sub__no">('+s.no+')</span><span class="sub__title">'+s.title+'</span>'
        +(s.done?'<span class="sub__done2">✓ 완료</span>':'')
        +'<span class="sub__mini">'+miniStar(cb.best)+miniStar(tb.best)+miniStar(eb.best)+'</span>'
        +'<span class="sub__chev">'+CHEV+'</span>';
      head.addEventListener('click', function(){ sb.classList.toggle('is-open'); });
      sb.appendChild(head);
      // 펼침 = C 하이브리드(등급 별 + 라운드 미니바) → 타일 클릭 시 curriculum 허브로
      var body=document.createElement('div'); body.className='sub__body';
      var hyb=document.createElement('div'); hyb.className='hyb';
      [['concept','개념',cb],['type','유형',tb],['essay','서술형',eb]].forEach(function(p){
        var tk=p[0], nm=p[1], bar=p[2];
        var seg=bar.segs.map(function(st){ return '<i class="'+(st==='todo'?'':st)+'"></i>'; }).join('');
        var c=document.createElement('div'); c.className='hyc';
        c.innerHTML='<span class="hyc__lab">'+nm+'</span>'+gradeStarImg(bar.best)+'<span class="rbar">'+seg+'</span>';
        c.addEventListener('click', function(){ goHub(tk); });
        hyb.appendChild(c);
      });
      body.appendChild(hyb);
      // (시험대비 크로스링크 제거 — freemode 드로어 = 커리큘럼 좌측 목록. 시험대비는 시험대비 모드에서 진입해서 봄)
      sb.appendChild(body); unit.appendChild(sb);
    });
    return unit;
  }

  /* ============ 슬라이드인 상세 ============ */
  function fillDetail(item){
    if(state.view==='semester') lastSem = item.key;
    document.getElementById('detailTtl').textContent = item.label;
    var host=document.getElementById('detailList'); host.innerHTML='';
    if(state.view==='semester'){
      unitsFor(item.key).forEach(function(u,ui){ host.appendChild(buildUnitEl(u)); });
    } else {
      strandGroups(item.key, item.label).forEach(function(grp,gi){
        var hd=document.createElement('div'); hd.className='semhd';
        hd.innerHTML='<img class="semhd__img" src="assets/img/planets/'+grp.semKey+'.webp" alt=""><span class="semhd__t">'+grp.semLabel+'</span>';
        host.appendChild(hd);
        grp.units.forEach(function(u,ui){ host.appendChild(buildUnitEl(u)); });
      });
    }
    // 목록 교체 페이드 재생(애니메이션 재시작을 위해 클래스 토글 + reflow)
    host.classList.remove('is-swap'); void host.offsetWidth; host.classList.add('is-swap');
  }
  function openPlanet(item){ fillDetail(item); document.querySelector('.fm').classList.add('is-detail'); detailEl.classList.add('is-open'); }
  function closeDetail(){ document.querySelector('.fm').classList.remove('is-detail'); detailEl.classList.remove('is-open'); }
  document.getElementById('detailX').addEventListener('click', closeDetail);

  /* ============ 대단원 모달 ============ */
  function openUnitModal(title, u){
    var m=document.getElementById('uModal');
    m.querySelector('.umodal__ttl').textContent=title;
    var body=document.getElementById('uModalList'); body.innerHTML=''; body.appendChild(buildUnitEl(u));
    m.classList.add('is-open');
  }
  (function(){ var m=document.getElementById('uModal');
    document.getElementById('uModalX').addEventListener('click', function(){ m.classList.remove('is-open'); });
    m.addEventListener('click', function(e){ if(e.target===m) m.classList.remove('is-open'); });
  })();

  /* ============ 모두보기 ============ */
  function ucardEl(planetKey, label, units){
    var c=document.createElement('div'); c.className='ucard';
    var img=document.createElement('img'); img.className='ucard__img'; img.src='assets/img/planets/'+planetKey+'.webp'; img.alt='';
    var body=document.createElement('div'); body.className='ucard__body';
    body.innerHTML='<div class="ucard__nm">'+label+'</div>';
    units.forEach(function(u){
      var b=document.createElement('button'); b.className='ubtn';
      b.innerHTML='<span class="ubtn__no">'+u.no+'단원</span><span class="ubtn__t">'+u.name+'</span>'
        +(u.subs.every(function(s){return s.done;})?'<span class="ubtn__done">완료</span>':'');
      b.addEventListener('click', function(){ openUnitModal(label+' · '+u.no+'단원 '+u.name, u); });
      body.appendChild(b);
    });
    c.appendChild(img); c.appendChild(body); return c;
  }
  function renderAll(){
    var host=document.getElementById('allView'); host.innerHTML='';
    if(state.view==='semester'){
      var cols=document.createElement('div'); cols.className='allcols';
      var ps=UNIV[state.u].planets;
      for(var i=0;i<ps.length;i+=2){
        var colEl=document.createElement('div'); colEl.className='allcol';
        [ps[i],ps[i+1]].forEach(function(p){ if(!p) return; colEl.appendChild(ucardEl(p.key,p.label,unitsFor(p.key))); });
        cols.appendChild(colEl);
      }
      host.appendChild(cols);
    } else {
      STRANDS[state.u].forEach(function(s){
        var blk=document.createElement('div'); blk.className='strandblk';
        blk.innerHTML='<div class="strandblk__hd"><img class="strandblk__img" src="assets/img/strands/'+s.key+'.webp" alt=""><div class="strandblk__t">'+s.label+'</div></div>';
        var grid=document.createElement('div'); grid.className='strandgrid';
        UNIV[state.u].planets.forEach(function(p){ grid.appendChild(ucardEl(p.key,p.label,unitsForStrand(p.key,s.label))); });
        blk.appendChild(grid); host.appendChild(blk);
      });
    }
  }
  function applyAll(){
    var on=state.all;
    document.getElementById('allView').classList.toggle('is-on', on);
    document.querySelector('.carousel').style.display = on?'none':'';
    document.getElementById('univLabel').style.display = on?'none':'';
    if(on){ closeDetail(); renderAll(); }
  }

  /* ============ 네비게이션 ============ */
  document.getElementById('prevBtn').addEventListener('click', function(){ if(state.i>0){ state.i--; position(); } });
  document.getElementById('nextBtn').addEventListener('click', function(){ if(state.i<curList().length-1){ state.i++; position(); } });
  document.getElementById('univBtn').addEventListener('click', function(){ state.u = state.u==='elem'?'mid':'elem'; state.i=0;
    if(state.all){ renderAll(); updateChrome(); } else { render(); } });
  document.getElementById('segmented').addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    state.view=b.dataset.v; state.i=0;
    Array.prototype.forEach.call(this.children, function(c){ c.classList.toggle('is-on', c===b); });
    if(state.all){ renderAll(); updateChrome(); } else { render(); }
  });
  var allSw=document.getElementById('allSwitch');
  allSw.addEventListener('click', function(){ state.all=!state.all; allSw.classList.toggle('is-on', state.all); applyAll(); });

  /* ============ 드래그 ============ */
  var vp=document.getElementById('viewport'); var dg={on:false,sx:0,base:0};
  vp.addEventListener('pointerdown', function(e){
    if(state.all || detailEl.classList.contains('is-open')) return;
    dg.on=true; dg.sx=e.clientX; dg.base=trackX; dragMoved=false;
    track.style.transition='none'; vp.classList.add('is-drag');
  });
  window.addEventListener('pointermove', function(e){
    if(!dg.on) return; var dx=e.clientX-dg.sx; if(Math.abs(dx)>5) dragMoved=true;
    track.style.transform='translate('+(dg.base+dx)+'px, -50%)';
  });
  window.addEventListener('pointerup', function(e){
    if(!dg.on) return; dg.on=false; track.style.transition=''; vp.classList.remove('is-drag');
    var dx=e.clientX-dg.sx; var steps=Math.round(-dx/STEP);
    state.i=Math.min(Math.max(state.i+steps,0), curList().length-1); position();
    setTimeout(function(){ dragMoved=false; }, 30);
  });

  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){ var m=document.getElementById('uModal');
      if(m.classList.contains('is-open')) m.classList.remove('is-open'); else closeDetail(); }
    if(detailEl.classList.contains('is-open') || state.all) return;
    if(e.key==='ArrowLeft' && state.i>0){ state.i--; position(); }
    if(e.key==='ArrowRight' && state.i<curList().length-1){ state.i++; position(); }
  });
  window.addEventListener('resize', function(){ if(!state.all) position(); });

  var toastEl=document.getElementById('toast'), tt;
  function toast(m){ toastEl.textContent=m; toastEl.classList.add('is-on'); clearTimeout(tt); tt=setTimeout(function(){toastEl.classList.remove('is-on');},1800); }

  render();
})();
