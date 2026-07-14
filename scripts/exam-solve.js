/* =========================================================================
   시험대비 문제 풀이 (exam-solve) — Editorial
   흐름: 새 문제 → 보기 선택 → 제출하기 → 채점(정답 초록/오답 빨강 + 해설) → 다음 문제
   피그마 3유형 반영: 조건 박스 단답 / 텍스트 객관식(이미지) / 이미지수식 객관식(단열)
   ========================================================================= */
(function () {
  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1-1 2H9c0-1-.3-1.4-1-2A6 6 0 0 1 12 3z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H9L3 12l6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM17 9l-5 6M12 9l5 6"/></svg>'
  };

  // ── 문항 데이터 ───────────────────────────────────────────────────
  var QUESTIONS = [
    { // 1) 조건 박스 단답형 (reference-box)
      tag: '단답형 · 부등식',
      q: '다음 조건을 모두 만족하는 자연수 x 중에서 가장 큰 수를 구하시오.',
      conditions: ['x는 10 미만의 자연수이다.', '부등식 4x + 7 > 6x − 3 을 만족한다.'],
      layout: 'grid', options: ['1', '2', '3', '4', '5'], answer: 3,
      explain: '4x + 7 > 6x − 3 → 10 > 2x → x < 5. 조건(10 미만의 자연수)에서 x < 5를 만족하는 가장 큰 수는 4입니다.'
    },
    { // 2) 주관식 (단답 입력) — 몇십몇 × 몇의 활용
      type: 'short', tag: '주관식 · 곱셈',
      q: '민서는 매일 12쪽씩 4일 동안 위인전을 읽었습니다. 민서가 4일 동안 읽은 위인전은 모두 몇 쪽인지 구하시오.',
      unit: '쪽', answer: '48',
      explain: '(하루에 읽은 쪽수) × (읽은 날수) = 12 × 4 = 48(쪽) 입니다.'
    },
    { // 3) 텍스트 객관식 + 이미지 (원뿔)
      tag: '객관식 · 부피',
      q: '밑면의 넓이가 4π인 원뿔이 있다. 이 원뿔의 부피가 12π 이상이 되기 위한 높이 h의 범위를 구하시오.',
      image: true, layout: 'grid',
      options: ['h ≥ 3', 'h ≥ 6', 'h ≥ 9', 'h ≥ 12', 'h ≥ 15'], answer: 2,
      explain: '원뿔의 부피 = 밑면의 넓이 × 높이 ÷ 3 입니다. 4π × h ÷ 3 ≥ 12π → h ÷ 3 ≥ 3 → h ≥ 9.'
    },
    { // 4) 이미지수식형 객관식 (단열)
      tag: '객관식 · 일차방정식',
      q: '다음 보기 중 일차방정식이 아닌 것을 고르세요.',
      layout: 'col',
      options: ['2x + 3 = 7', 'x − 5 = 2x', 'x² − 1 = 0', '3x = x + 4', '5(x − 1) = 2x'], answer: 2,
      explain: 'x² − 1 = 0 은 미지수 x의 최고 차수가 2차이므로 일차방정식이 아닙니다. 나머지는 모두 정리하면 (일차식)=0 꼴입니다.'
    }
  ];

  var qarea = document.getElementById('qarea');
  var primaryBtn = document.getElementById('primaryBtn');
  var footHint = document.getElementById('footHint');
  var idx = 0, selected = null, submitted = false;
  function setHint(t) { if (footHint) footHint.textContent = t; }

  function num(i, state) {
    if (state === 'correct') return ICON.check;
    if (state === 'wrong') return ICON.x;
    if (state === 'selected') return ICON.check;
    return String(i + 1);
  }

  function render() {
    var Q = QUESTIONS[idx];
    var html = '<div class="qmeta"><span class="qcount">' + (idx + 1) + ' / ' + QUESTIONS.length + '</span>' +
      '<span class="qtag">' + Q.tag + '</span></div>' +
      '<h1 class="qtitle">' + Q.q + '</h1>';

    if (Q.conditions) {
      html += '<div class="refbox"><span class="refbox__cap">조건</span><ul>' +
        Q.conditions.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div>';
    }
    if (Q.image) {
      html += '<div class="qimg">' + ICON.img + '</div>';
    }

    if (Q.type === 'short') {
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
      var keypad = keys.map(function (k) {
        var fn = k === 'back' || k === 'clear';
        var label = k === 'back' ? ICON.back : k === 'clear' ? 'C' : k;
        return '<button class="kp' + (fn ? ' kp--fn' : '') + '" data-k="' + k + '">' + label + '</button>';
      }).join('');
      html += '<div class="short"><span class="short__label">답</span>' +
        '<div class="short__field" id="shortField">' +
        '<input class="short__input" id="shortInput" readonly placeholder="키패드로 입력" autocomplete="off" />' +
        (Q.unit ? '<span class="short__unit">' + Q.unit + '</span>' : '') +
        '<span class="short__icon" id="shortIcon"></span></div>' +
        '<span class="short__answer" id="shortAnswer" style="display:none"></span>' +
        '<div class="keypad" id="keypad">' + keypad + '</div></div>';
    } else {
      html += '<div class="opts opts--' + Q.layout + '" id="opts">' +
        Q.options.map(function (opt, i) {
          return '<button class="opt" data-i="' + i + '"><span class="opt__num">' + (i + 1) + '</span>' +
            '<span class="opt__txt">' + opt + '</span></button>';
        }).join('') + '</div>';
    }

    html += '<div class="explain" id="explain"><span class="explain__cap">' + ICON.bulb + '해설</span>' +
      '<p class="explain__body">' + Q.explain + '</p></div>';

    qarea.innerHTML = html;
    qarea.scrollTop = 0;
    selected = null; submitted = false;
    setPrimary('제출하기', true, false);
    setHint(Q.type === 'short' ? '키패드로 정답을 입력하세요.' : '보기를 선택하고 제출하세요.');
  }

  function setPrimary(label, disabled, withArrow) {
    primaryBtn.innerHTML = label + (withArrow ? ICON.arrow : '');
    primaryBtn.disabled = disabled;
  }

  // 보기 선택
  qarea.addEventListener('click', function (e) {
    if (submitted) return;
    var opt = e.target.closest('.opt'); if (!opt) return;
    selected = +opt.dataset.i;
    qarea.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('is-selected', o === opt); });
    var n = opt.querySelector('.opt__num');
    qarea.querySelectorAll('.opt__num').forEach(function (el, i) { el.innerHTML = String(i + 1); });
    n.innerHTML = num(selected, 'selected');
    setPrimary('제출하기', false, false);
    setHint((selected + 1) + '번 선택됨 · 제출할 수 있어요.');
  });

  // 주관식 키패드
  function updateShort() {
    var inp = document.getElementById('shortInput'); if (!inp) return;
    var v = (inp.value || '').trim();
    selected = v === '' ? null : v;
    setPrimary('제출하기', selected == null, false);
    setHint(selected == null ? '키패드로 정답을 입력하세요.' : '입력됨 · 제출할 수 있어요.');
  }
  qarea.addEventListener('click', function (e) {
    if (submitted) return;
    var k = e.target.closest('.kp'); if (!k) return;
    var inp = document.getElementById('shortInput'); var key = k.dataset.k;
    if (key === 'back') inp.value = inp.value.slice(0, -1);
    else if (key === 'clear') inp.value = '';
    else if (inp.value.length < 7) inp.value += key;
    updateShort();
  });

  // 제출 → 채점
  function grade() {
    var Q = QUESTIONS[idx];
    submitted = true;
    var correct;

    if (Q.type === 'short') {
      var field = document.getElementById('shortField'), inp = document.getElementById('shortInput');
      inp.disabled = true;
      var kp = document.getElementById('keypad'); if (kp) kp.classList.add('is-locked');
      correct = String(inp.value).trim() === String(Q.answer).trim();
      field.classList.add(correct ? 'is-correct' : 'is-wrong');
      document.getElementById('shortIcon').innerHTML = correct ? ICON.check : ICON.x;
      if (!correct) {
        var ans = document.getElementById('shortAnswer');
        ans.style.display = ''; ans.innerHTML = '정답 <b>' + Q.answer + (Q.unit || '') + '</b>';
      }
    } else {
      qarea.querySelector('#opts').classList.add('is-locked');
      qarea.querySelectorAll('.opt').forEach(function (o, i) {
        o.classList.remove('is-selected');
        var n = o.querySelector('.opt__num');
        if (i === Q.answer) { o.classList.add('is-correct'); n.innerHTML = num(i, 'correct'); }
        else if (i === selected) { o.classList.add('is-wrong'); n.innerHTML = num(i, 'wrong'); }
        else { n.innerHTML = String(i + 1); }
      });
      correct = selected === Q.answer;
    }

    qarea.querySelector('#explain').classList.add('show');
    setHint(correct ? '정답이에요 · 해설을 확인하세요.' : '아쉬워요 · 해설을 확인하세요.');
    var last = idx === QUESTIONS.length - 1;
    setPrimary(last ? '유형 상세로' : '다음 문제', false, true);
  }

  // 기본 버튼: 상태에 따라 제출 / 다음
  primaryBtn.addEventListener('click', function () {
    if (primaryBtn.disabled) return;
    if (!submitted) { if (selected != null) grade(); return; }
    if (idx < QUESTIONS.length - 1) { idx++; render(); }
    else { window.location.href = 'exam-home.html'; }   // 마지막: 유형 상세(데모→홈)
  });

  render();
})();
