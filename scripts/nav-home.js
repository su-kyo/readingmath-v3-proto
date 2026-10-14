/* nav/home.html 전용 스크립트 — HTML 안에 있던 것을 옮겼다 (마감 회차 2026-10-12). */
(function(){
  /* 학기 16종 × 과목 2종 = 홈 32화면. 학기 선택은 공용 드로어(gnb-drawer.js)에 있다. */
  var SEMS = ['elem-3-1','elem-3-2','elem-4-1','elem-4-2','elem-5-1','elem-5-2','elem-6-1','elem-6-2',
              'mid-1-1','mid-1-2','mid-2-1','mid-2-2','mid-3-1','mid-3-2','high-1-1','high-1-2'];

  var qs = new URLSearchParams(location.search);
  var subject = qs.get('subject') === 'science' ? 'science' : 'math';
  var sem = qs.get('sem');
  if(SEMS.indexOf(sem) < 0) sem = 'elem-3-1';
  var sc = (subject === 'science') ? 'sci' : 'math';
  var key = sc + '-' + sem;
  var dir = 'assets/img/home/' + key;
  try{ localStorage.setItem('rm-subject', subject); localStorage.setItem('rm-sem', sem); }catch(e){}

  /* 배치는 과목당 한 벌로 고정한다. 학기가 바뀌어도 좌표는 그대로고 그림만 갈아끼운다.
     좌표 = safe 기준 % (cx/cy=중심, w=너비%). 원본의 자리 규칙은 32학기가 모두 같다:
     1=중앙 큰 것, 2·3=좌우 중단, 4·5=좌우 하단, 6=공중에 뜬 작은 것. */
  var LAYOUT = {
    math: { ratio:'960 / 670', hero:31.25, objects:[
      { n:1, cx:50.0, cy:39.4, w:49.4 }, { n:2, cx:19.4, cy:48.4, w:35.8 }, { n:3, cx:83.3, cy:48.9, w:34.2 },
      { n:4, cx:17.7, cy:77.8, w:32.4 }, { n:5, cx:81.4, cy:78.1, w:31.5 }, { n:6, cx:76.4, cy:17.4, w:22.7, float:true }
    ] },
    sci:  { ratio:'1280 / 670', hero:25, objects:[
      { n:1, cx:50.0, cy:40.8, w:32.1 }, { n:2, cx:26.6, cy:56.5, w:23.5 }, { n:3, cx:75.0, cy:54.3, w:23.4 },
      { n:4, cx:26.1, cy:78.1, w:25.1 }, { n:5, cx:73.5, cy:80.3, w:23.1 }, { n:6, cx:69.6, cy:17.4, w:14.9, float:true }
    ] }
  };

  /* ── 단원 진행 ────────────────────────────────────────────────────
     세그먼트 한 칸 = 소단원 하나이고, 칸은 3단계다: 미진행 · 진행중(반칸) · 완료.
     「완료한 소단원 수 / 전체」로만 세면 소단원이 1개뿐인 단원은 0%↔100%밖에
     없어서 세그먼트가 의미를 잃는다 — 중간 단계를 두어 그 문제를 없앴다.
     값은 nav/curriculum.html의 UNITS를 소단원 단위로 요약한 것과 같은 모델이다:
     개념·유형·서술형 3훈련이 전부 끝나면 '완료', 하나라도 손댔으면 '진행중'.
     단원의 소단원이 전부 완료면 그 단원이 완료 — 오브젝트가 실물이 된다. */
  var UNITS = {
    'math-elem-3-1': [
      { name:'덧셈과 뺄셈',   subs:['doing','todo'] },
      { name:'평면도형',     subs:['done'] },
      { name:'나눗셈',       subs:['todo'] },
      { name:'길이와 시간',   subs:['todo'] },
      { name:null,           subs:['todo','todo'] },
      { name:null,           subs:['doing','todo'] }
    ]
  };
  /* 나머지 31학기는 소단원 문구·개수 데이터가 아직 없다. 단원 번호만 세우고
     진행 형태는 같게 둬서 32학기를 나란히 비교할 수 있게 한다. */
  var UNITS_FALLBACK = [
    { name:null, subs:['doing','todo'] }, { name:null, subs:['done'] },
    { name:null, subs:['todo'] },         { name:null, subs:['todo'] },
    { name:null, subs:['todo','todo'] },  { name:null, subs:['doing','todo'] }
  ];

  /* 실제 소단원명이 확정된 학기만 문구를 갖는다. 나머지는 학기명으로 안내한다. */
  var MSG = {
    'math-elem-3-1':'<b>(1) 받아올림이 없는 세 자리 수의 덧셈</b>의 <b>개념 훈련</b>을 시작해보세요!',
    'math-mid-3-1' :'<b>(1) 제곱근과 실수</b>의 <b>개념 훈련</b>을 시작해보세요!',
    'math-mid-3-2' :'<b>(1) 삼각비</b>의 <b>개념 훈련</b>을 시작해보세요!',
    'sci-elem-3-1' :'<b>(1) 물체를 밀거나 당기기, 수평 잡기</b>의 <b>유형 훈련</b>을 시작해보세요!',
    'sci-mid-3-1'  :'<b>(1) 화학 반응의 규칙</b>의 <b>유형 훈련</b>을 시작해보세요!',
    'sci-mid-3-2'  :'<b>(1) 역학적 에너지</b>의 <b>개념 훈련</b>을 시작해보세요!'
  };
  /* 캐릭터가 있는 학기 — 2026-08-25에 16학기 전부 채워졌다(교체될 수 있음).
     학기당 한 명이고 수학·과학이 같은 그림이라 키가 항상 두 개씩 늘어난다.
     비어 있는 학기가 생기면 여기서 키를 빼면 말풍선만 서는 화면으로 돌아간다. */
  var HAS_CHAR = {};
  ['elem-3-1','elem-3-2','elem-4-1','elem-4-2','elem-5-1','elem-5-2','elem-6-1','elem-6-2',
   'mid-1-1','mid-1-2','mid-2-1','mid-2-2','mid-3-1','mid-3-2','high-1-1','high-1-2']
    .forEach(function(s){ HAS_CHAR['math-' + s] = HAS_CHAR['sci-' + s] = 1; });

  var LVL = { elem:'초등', mid:'중등', high:'고등' };
  function semLabel(s){
    var p = s.split('-');
    return LVL[p[0]] + ' ' + p[1] + '학년 ' + p[2] + '학기';
  }

  var cfg = LAYOUT[sc];

  var stage = document.getElementById('stage');
  var safe = document.getElementById('safe');
  safe.style.aspectRatio = cfg.ratio;
  stage.style.backgroundImage = 'url("' + dir + '/bg.webp")';

  /* 캐릭터 파일은 앞으로 학기별로 계속 교체된다. 파일명이 그대로면 브라우저가
     옛 그림을 계속 써서 「바꿨는데 안 바뀐다」가 된다 — 교체할 때 이 숫자를 올린다. */
  var CHAR_V = 4;
  var hero = safe.querySelector('.hero');
  hero.style.setProperty('--hero-w', cfg.hero + '%');
  if(HAS_CHAR[key]) document.getElementById('char').src = dir + '/character.webp?v=' + CHAR_V;
  else hero.classList.add('is-nochar');

  var bub = document.getElementById('bubble');
  bub.dataset.subject = subject;   // 강조 글자색은 nav-home.css 가 과목으로 고른다 (RM-JS-01)
  bub.innerHTML = MSG[key] || ('<b>' + semLabel(sem) + '</b> 학습을 시작해보세요!');

  /* ── 오브젝트 세우기 ─────────────────────────────────────────────── */
  var units = UNITS[key] || UNITS_FALLBACK;
  var SEG = subject === 'science' ? 'var(--teal-500)' : 'var(--blue-500)';
  var objs = [];

  function isDone(u){ return u.subs.every(function(x){ return x === 'done'; }); }

  function plaqueHTML(n, u){
    var label = n + '단원' + (u.name ? ' · ' + u.name : '');
    var inner = isDone(u)
      ? '<span class="plaque__done">✓ 완료</span>'
      : '<span class="plaque__segs">' + u.subs.map(function(x){
          return '<i class="' + (x === 'done' ? 'on' : x === 'doing' ? 'half' : '') + '"></i>';
        }).join('') + '</span>';
    return '<span class="plaque"><span class="plaque__name">' + label + '</span>' + inner + '</span>';
  }

  /* 명판 층 — 오브젝트 전부보다 위, 캐릭터보다 아래 */
  var plaques = document.createElement('div');
  plaques.className = 'plaques';
  safe.insertBefore(plaques, hero);

  function build(list){
    objs.forEach(function(el){ el.remove(); });
    objs = []; hot = null;
    plaques.innerHTML = '';
    cfg.objects.forEach(function(o){
      var u = list[o.n - 1] || { name:null, subs:['todo'] };
      var src = dir + '/obj-' + o.n + '.webp';
      var el = document.createElement('div');
      el.className = 'obj' + (o.float ? ' obj--float' : '') + (isDone(u) ? ' is-done' : '');
      el.style.left = o.cx + '%'; el.style.top = o.cy + '%';
      el.style.width = o.w + '%';
      el.style.setProperty('--m', 'url("' + new URL(src, document.baseURI).href + '")');   // 그늘·빛줄기가 몸체 모양을 따라가게. 변수 속 url() 은 CSS 파일 기준으로 풀리므로 절대 주소로 넣는다
      el.style.setProperty('--d', (o.n * 0.85).toFixed(2) + 's');   // 여섯이 한꺼번에 밝아지지 않게
      el.innerHTML = '<span class="obj__img" style="background-image:url(\'' + src + '\')"></span>'
        + '<span class="obj__sweep"><i></i></span>';
      safe.insertBefore(el, plaques);   // 명판 층·캐릭터보다 뒤(먼저 그려짐)
      objs.push(el);
      loadAlpha(el, src);

      /* 명판이 매달릴 빈 상자 — 오브젝트와 똑같은 자리·크기(뜬 것은 같이 뜬다) */
      var pl = document.createElement('div');
      pl.className = 'pl' + (o.float ? ' obj--float' : '');
      pl.style.left = o.cx + '%'; pl.style.top = o.cy + '%';
      pl.style.width = o.w + '%';
      pl.style.setProperty('--seg', SEG);
      pl.innerHTML = plaqueHTML(o.n, u);
      plaques.appendChild(pl);
      el._pl = pl;
    });
  }

  /* ── 눌리는 자리를 그림 모양대로 ──────────────────────────────────
     오브젝트 그림은 네모난 파일이라 로켓 옆 빈 공간까지 상자에 들어간다.
     그대로 두면 아무것도 없는 곳을 눌러도 명판이 떠서 오작동으로 읽힌다.
     그래서 그림을 한 번 64×64로 줄여 「어디가 칠해져 있는지」 표를 만들어 두고,
     누른 지점이 표에서 비어 있으면 무시한다. 표는 그림당 한 번만 만든다.
     홈의 오브젝트 원본은 32학기 192장이 모두 정사각이고 상자도 정사각이라
     (background-size:contain) 상자 안 좌표가 그림 좌표와 그대로 일치한다. */
  var G = 64;
  function loadAlpha(el, src){
    var im = new Image();
    im.onload = function(){
      try{
        var c = document.createElement('canvas'); c.width = c.height = G;
        var x = c.getContext('2d');
        x.drawImage(im, 0, 0, G, G);
        var d = x.getImageData(0, 0, G, G).data;
        var raw = new Uint8Array(G * G), i;
        for(i = 0; i < G * G; i++) raw[i] = d[i * 4 + 3] > 90 ? 1 : 0;
        /* 손가락은 정확하지 않다 — 칠해진 자리를 한 칸(약 1.6%)씩 넓혀 가장자리를 너그럽게 */
        var m = new Uint8Array(G * G);
        for(var y = 0; y < G; y++) for(var xx = 0; xx < G; xx++){
          if(!raw[y * G + xx]) continue;
          for(var dy = -1; dy <= 1; dy++) for(var dx = -1; dx <= 1; dx++){
            var ny = y + dy, nx = xx + dx;
            if(ny >= 0 && ny < G && nx >= 0 && nx < G) m[ny * G + nx] = 1;
          }
        }
        el._alpha = m;
      }catch(e){ el._alpha = null; }   /* 못 읽으면 상자 전체를 누른 것으로 본다 */
    };
    im.src = src;
  }

  function hitTest(cx, cy){
    for(var i = objs.length - 1; i >= 0; i--){   // 뒤에 그린 것이 위에 있다
      var el = objs[i], b = el.getBoundingClientRect();
      if(cx < b.left || cx > b.right || cy < b.top || cy > b.bottom) continue;
      if(!el._alpha) return el;
      var gx = Math.min(G - 1, Math.floor((cx - b.left) / b.width * G));
      var gy = Math.min(G - 1, Math.floor((cy - b.top) / b.height * G));
      if(el._alpha[gy * G + gx]) return el;
    }
    return null;
  }

  /* 마우스는 지나가면 뜨고, 손가락은 탭했을 때만 뜬다(지나간 자리에 명판이 남지 않게) */
  var hot = null, lastMove = 0;
  function syncBubble(){
    safe.classList.toggle('is-plaque',
      safe.classList.contains('is-allplaque') || !!plaques.querySelector('.pl.is-hot, .pl.is-peek'));
  }
  /* 켜고 끄는 것은 오브젝트가 아니라 그 오브젝트의 명판이다 —
     오브젝트끼리의 앞뒤는 절대 바뀌지 않는다. */
  function setHot(el){
    if(hot === el) return;
    if(hot) hot._pl.classList.remove('is-hot');
    hot = el;
    if(hot) hot._pl.classList.add('is-hot');
    safe.classList.toggle('is-hit', !!hot);
    syncBubble();
  }
  safe.addEventListener('pointermove', function(e){
    if(e.pointerType && e.pointerType !== 'mouse') return;
    var t = e.timeStamp || 0;               /* 초당 30번까지만 — 마우스는 그보다 자주 움직인다 */
    if(t - lastMove < 30) return;
    lastMove = t;
    setHot(hitTest(e.clientX, e.clientY));
  });
  safe.addEventListener('pointerleave', function(){ setHot(null); });

  document.addEventListener('click', function(e){
    var inSafe = e.target.closest && e.target.closest('.safe') && !e.target.closest('.hero');
    var el = inSafe ? hitTest(e.clientX, e.clientY) : null;
    var was = el && el.classList.contains('is-peek');
    objs.forEach(function(x){ x.classList.remove('is-peek'); x._pl.classList.remove('is-peek'); });
    if(el && !was){ el.classList.add('is-peek'); el._pl.classList.add('is-peek'); }
    syncBubble();
  });

  build(units);

  /* ?debug=1 — 32학기 검수용. 손으로 학습하지 않고 완료 상태를 오갈 수 있다 */
  function variant(state){
    return units.map(function(u){
      return { name:u.name, subs:u.subs.map(function(){ return state; }) };
    });
  }
  window.RMDebug && window.RMDebug.register({
    title: '행성 홈',
    actions: [
      { label:'전부 미완료 (홀로그램)', run: function(){ build(variant('todo')); } },
      { label:'중반 (기본)',           run: function(){ build(units); } },
      { label:'전부 완료 (실물)',      run: function(){ build(variant('done')); } },
      { label:'명판 전부 펴기',        run: function(){ safe.classList.toggle('is-allplaque'); syncBubble(); } }
    ]
  });

  var toast = document.getElementById('toast'), tt;
  function showToast(m){ toast.textContent=m; toast.classList.add('is-on');
    clearTimeout(tt); tt=setTimeout(function(){ toast.classList.remove('is-on'); },1900); }

  document.querySelectorAll('[data-go]').forEach(function(b){
    b.addEventListener('click', function(){ location.href = b.getAttribute('data-go'); });
  });
  document.getElementById('ctaBtn').addEventListener('click', function(){
    location.href = 'nav/curriculum.html?subject=' + subject + '&sem=' + sem;
  });
  // 메뉴 → 공용 사이드 드로어 (gnb-drawer.js가 #menuBtn에 자동 바인딩)
})();
