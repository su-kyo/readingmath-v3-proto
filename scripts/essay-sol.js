/* =========================================================================
   서술형 본문 읽개 (essay-sol) — 서술형 화면 넷이 같이 쓴다 (2026-10-15 과목 두 벌)
   기초 기르기 · 실력 키우기(essay-basics-v2.js) · 기본 다지기(essay-drill-v2.js) · 그 해설(essay-drill-review.js).

   실서비스 서술형 콘텐츠는 「풀이 문장 안의 빈칸」이다. 데이터 파일(essay-*-data-*.js)에는
   실서비스 글을 그대로 두고, 이 파일이 그것을 화면 조각으로 읽는다.

   글 기호 (실서비스 그대로):
     $…$            수식(KaTeX)            **…**        굵게
     ${[n]}          n번 빈칸의 칸 하나      ${[n--]}     대시 개수 = 빈칸 너비 힌트
     ${[n]/[n]}      n번 빈칸의 분수 칸      #{[n-k]}     n번 빈칸 k번째 칸의 값을 다시 보여 주는 자리
     [IMG 주소]      그림                    [TABLE i]    표(문항의 tables[i] · 실서비스 HTML 표를 옮긴 것)
     \n              문단                    //           실서비스 줄바꿈 = 끊어읽기 구간 경계
   같은 번호가 여러 번 나오면 그 빈칸의 칸이 차례로 여러 개다(키패드 답 K[...]의 원소 하나 = 칸 하나,
   분수 칸 하나 = [분자, 분모] 원소 하나). 순서 맞추기는 같은 번호 자리 하나 = 조각 하나.

   데이터의 빈칸(blanks[n-1]):
     { type: 'choice', choices: [...], answer: '고른 값' }       고르기(빈칸 선지 창)
     { type: 'key', answer: ['12', ['12','5'], …] }              키패드 · 칸마다 하나(배열 = 분수)
     { type: 'order', pieces: [...실서비스 순서], answer: [...정답 순서] }   순서 맞추기
   ========================================================================= */
window.RMEssay = (function () {
  'use strict';

  var TOK = /\$\{\[(\d+)(-*)\](\/\[\d+\])?\}|#\{\[(\d+)-(\d+)\]\}|\[IMG ([^\]]+)\]|\[TABLE (\d+)\]|\*\*/g;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tex(src) {
    if (!window.katex) return esc(src);
    try { return window.katex.renderToString(src, { throwOnError: false }); } catch (e) { return esc(src); }
  }
  /* 글 한 토막(기호 없는 글 + $수식$) → HTML */
  function inline(s) {
    var parts = String(s).split('$'), out = '';
    parts.forEach(function (p, i) { out += (i % 2) ? tex(p) : esc(p); });
    return out;
  }
  function imgHTML(src, alt) { return '<img src="' + esc(src.trim()) + '" alt="' + (alt || '문제 그림') + '" />'; }
  function tableHTML(rows) {
    return '<table class="etable"><tbody>' + rows.map(function (r) {
      return '<tr>' + r.map(function (c) {
        var o = typeof c === 'object' ? c : { t: c };
        return '<td' + (o.rs ? ' rowspan="' + o.rs + '"' : '') + (o.cs ? ' colspan="' + o.cs + '"' : '') + '>' + inline(o.t) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
  }

  /* 값 하나(선지 · 답) → HTML. '$…$' 수식 · '[IMG …]' 그림 · 그 밖은 글 */
  function value(v) {
    if (v == null) return '';
    if (Array.isArray(v)) return tex('\\dfrac{' + v[0] + '}{' + v[1] + '}');
    var m = /^\[IMG ([^\]]+)\]$/.exec(v);
    if (m) return '<span class="eimg">' + imgHTML(m[1], '선택한 그림') + '</span>';
    return inline(v);
  }
  /* 빈칸 선지 창(blank-pop.js)에 넘길 선지 — 수식은 { tex }, 그림은 { img } */
  function choice(c) {
    var m = /^\$([^$]+)\$$/.exec(c);
    if (m) return { tex: m[1], val: c };
    m = /^\[IMG ([^\]]+)\]$/.exec(c);
    if (m) return { img: m[1].trim(), val: c, label: '그림' };
    if (c.indexOf('$') >= 0) return { html: inline(c), val: c };
    return c;
  }

  /* 글 한 덩어리 → 토큰 [{t:'html'} | {t:'blank', f} | {t:'echo', f} | {t:'img'} | {t:'table'}] */
  function tokens(str, p, count) {
    var out = [], last = 0, m, bold = false, ph = [], buf = '';
    TOK.lastIndex = 0;
    /* 기호를 자리표시(\u0001i\u0002)로 바꿔 두고 $ 로 수식을 가른다 — 빈칸이 수식 사이에 끼어 있다 */
    while ((m = TOK.exec(str))) {
      buf += str.slice(last, m.index); last = TOK.lastIndex;
      var tk;
      if (m[0] === '**') { bold = !bold; tk = { t: 'raw', h: bold ? '<b>' : '</b>' }; }
      else if (m[1]) {
        var n = +m[1]; count[n] = (count[n] || 0) + 1;
        tk = { t: 'blank', f: n + '-' + count[n], w: m[2].length, frac: !!m[3] };
      }
      else if (m[4]) tk = { t: 'echo', f: m[4] + '-' + m[5] };
      else if (m[6]) tk = { t: 'img', src: m[6].trim() };
      else tk = { t: 'table', rows: (p.tables || [])[+m[7]] || [] };
      buf += '\u0001' + ph.length + '\u0002'; ph.push(tk);
    }
    buf += str.slice(last);
    var segs = buf.split('$');
    segs.forEach(function (s, i) {
      /* 자리표시를 품은 토막은 자리표시 앞뒤로 다시 가른다 */
      s.split(/(\u0001\d+\u0002)/).forEach(function (piece) {
        var pm = /^\u0001(\d+)\u0002$/.exec(piece);
        if (pm) { var tk = ph[+pm[1]]; out.push(tk.t === 'raw' ? { t: 'html', h: tk.h } : tk); return; }
        if (piece === '') return;
        out.push({ t: 'html', h: (i % 2) ? tex(piece) : esc(piece) });
      });
    });
    return out;
  }

  /* 문항 하나 → { fields, lines } · lines = 문단[구간[토큰]] (빈 구간은 버린다) */
  function parse(p, src) {
    var count = {}, fields = {};
    var text = src != null ? src : p.sol;
    var lines = String(text).split('\n').map(function (para) {
      return para.split('//').map(function (c) { return tokens(c, p, count); })
        .filter(function (tk) { return tk.some(function (t) { return t.t !== 'html' || t.h.replace(/&nbsp;|\s|​/g, '') !== ''; }); });
    }).filter(function (l) { return l.length; });
    /* 칸 정보 */
    Object.keys(count).forEach(function (n) {
      var b = (p.blanks || [])[n - 1] || {}, many = count[n] > 1;
      for (var k = 1; k <= count[n]; k++) {
        var id = n + '-' + k, f = { id: id, n: +n, k: k, type: b.type || 'choice', label: many ? id : String(n) };
        if (b.type === 'choice') { f.choices = b.choices; f.answer = b.answer; }
        else if (b.type === 'key') f.answer = b.answer[k - 1];
        else if (b.type === 'order') { f.answer = b.answer[k - 1]; f.pieces = b.pieces; }
        fields[id] = f;
      }
    });
    lines.forEach(function (l) { l.forEach(function (c) { c.forEach(function (t) {
      if (t.t === 'blank') { fields[t.f].frac = t.frac; fields[t.f].w = t.w; }
    }); }); });
    return { fields: fields, lines: lines };
  }

  /* 기본 빈칸 마크업 — 칸형(RM-PART-08). 분수 칸은 분자 · 분모 두 칸(.efrac) */
  function blankHTML(f, cls) {
    var w = f.w ? ' data-w="' + Math.min(f.w, 5) + '"' : '';
    function one(part) {
      return '<span class="blank' + (cls ? ' ' + cls : '') + '" data-blank="' + f.id + '"' + (part ? ' data-part="' + part + '"' : '') + w + '>' +
        '<span class="blank__ans"></span><span class="blank__badge">' + f.label + '</span></span>';
    }
    if (f.frac) return '<span class="efrac">' + one('n') + '<span class="efrac__bar"></span>' + one('d') + '</span>';
    return one('');
  }
  function echoHTML(id, label) {
    return '<span class="blank blank--echo" data-echo="' + id + '"><span class="blank__ans"></span><span class="blank__badge">' + label + '</span></span>';
  }

  /* 토큰 → HTML. o.blank(f, token) 를 주면 그걸로 빈칸을 그린다(해설 · 순서 맞추기) */
  function html(toks, P, o) {
    o = o || {};
    return toks.map(function (t) {
      if (t.t === 'html') return t.h;
      if (t.t === 'blank') return o.blank ? o.blank(P.fields[t.f], t) : blankHTML(P.fields[t.f]);
      if (t.t === 'echo') {
        var f = P.fields[t.f];
        if (o.echo) return o.echo(f, t);
        return echoHTML(t.f, f ? f.label : t.f);
      }
      if (t.t === 'img') return '<span class="eimg eimg--block">' + imgHTML(t.src) + '</span>';
      if (t.t === 'table') return tableHTML(t.rows);
      return '';
    }).join('');
  }

  /* 칸에 값 넣기 — 다시 보여 주는 자리(#{[n-k]})도 같이 */
  function setVal(el, v) {
    var a = el.querySelector('.blank__ans');
    a.innerHTML = value(v);
    el.classList.add('is-filled');
  }
  function syncEcho(root, id, v) {
    root.querySelectorAll('[data-echo="' + id + '"]').forEach(function (el) { setVal(el, v); });
  }

  /* 문제문 — 글 줄(// 를 띄어쓰기로)과 그림 · 표를 가른다 */
  function statement(p) {
    var P = parse(p, p.q), text = [], media = [];
    P.lines.forEach(function (l) {
      var flat = [];
      l.forEach(function (c) { flat = flat.concat(c); flat.push({ t: 'html', h: ' ' }); });
      var body = flat.filter(function (t) { return t.t !== 'img' && t.t !== 'table'; });
      flat.filter(function (t) { return t.t === 'img' || t.t === 'table'; }).forEach(function (t) { media.push(html([t], P)); });
      var h = html(body, P).trim();
      if (h) text.push(h);
    });
    return { text: text, media: media, parsed: P };
  }

  /* ── 2단계(기본 다지기 · 답안 완성하기)와 그 해설이 같이 쓰는 조각 나누기 ── */
  /* 데이터 문항 → 화면 조각
     statement: [문단] — 문단 = [구간 HTML…] 또는 { media: HTML }(그림 · 표)
     chunks:    빈칸 맞추기 [문단[구간 HTML…]] (구간 HTML 안에 빈칸) · { media } 구간은 그림 하나
     arrange:   [{ text } | { media } | { parts: [HTML | { slot: 정답 조각, f: 칸 }], blocks: [조각…] }]
     o = html() 에 넘길 그리기 함수(해설 화면의 채점 빈칸) */
  function isMedia(c) { return c.length && c.every(function (t) { return t.t === 'img' || t.t === 'table' || (t.t === 'html' && !t.h.replace(/\s|&nbsp;|\u200b/g, '')); }) && c.some(function (t) { return t.t === 'img' || t.t === 'table'; }); }
  function mediaHTML(c, P) { return c.filter(function (t) { return t.t !== 'html'; }).map(function (t) {
    return t.t === 'img' ? '<img src="' + esc(t.src) + '" alt="문제 그림" />' : tableHTML(t.rows); }).join(''); }
  function hasOrder(line, P) { return line.some(function (c) { return c.some(function (t) { return t.t === 'blank' && P.fields[t.f].type === 'order'; }); }); }
  function drill(p, o) {
    var Q = parse(p, p.q), P = parse(p);
    var statement = Q.lines.map(function (line) {
      var out = [];
      line.forEach(function (c) { out.push(isMedia(c) ? { media: mediaHTML(c, Q) } : html(c, Q)); });
      return out;
    });
    var cut = P.lines.length;
    for (var i = 0; i < P.lines.length; i++) if (hasOrder(P.lines[i], P)) { cut = i; break; }
    var chunks = P.lines.slice(0, cut).map(function (line) {
      return line.map(function (c) { return isMedia(c) ? { media: mediaHTML(c, P) } : html(c, P, o); });
    });
    var arrange = [];
    P.lines.slice(cut).forEach(function (line) {
      if (!hasOrder(line, P)) {
        line.forEach(function (c) { arrange.push(isMedia(c) ? { media: mediaHTML(c, P) } : { text: html(c, P, o) }); });
        return;
      }
      var parts = [], blocks = null;
      line.forEach(function (c, ci) {
        if (ci) parts.push(' ');
        c.forEach(function (t) {
          if (t.t === 'blank' && P.fields[t.f].type === 'order') { var f = P.fields[t.f]; parts.push({ slot: f.answer, f: f }); blocks = f.pieces; }
          else parts.push(html([t], P, o));
        });
      });
      arrange.push({ parts: parts, blocks: blocks });
    });
    return { statement: statement, chunks: chunks, arrange: arrange, fields: P.fields, parsed: P };
  }


  /* ── 3단계 탐구활동 보고서(과학) — 보고서 칸 하나의 글 → HTML ──
     빈칸 없는 줄은 모아 .rt-text 한 덩어리, 빈칸 든 줄은 .rt-span 한 줄, 표는 .rt-table.
     o = html() 에 넘길 그리기 함수(해설 화면의 채점 빈칸) */
  function reportCell(p, text, o) {
    var P = parse(p, text), out = '', buf = [];
    function flush() { if (buf.length) out += '<div class="rt-text">' + buf.join('<br>') + '</div>'; buf = []; }
    P.lines.forEach(function (line) {
      var flat = [];
      line.forEach(function (c, i) { if (i) flat.push({ t: 'html', h: ' ' }); flat = flat.concat(c); });
      var tb = flat.filter(function (t) { return t.t === 'table'; });
      if (tb.length) { flush(); tb.forEach(function (t) { out += '<div class="rt-table">' + tableHTML(t.rows) + '</div>'; }); return; }
      if (flat.some(function (t) { return t.t === 'blank'; })) { flush(); out += '<div class="rt-span">' + html(flat, P, o) + '</div>'; return; }
      buf.push(html(flat, P));
    });
    flush();
    return { html: out, fields: P.fields };
  }

  return {
    drill: drill, reportCell: reportCell,
    esc: esc, tex: tex, inline: inline, value: value, choice: choice,
    parse: parse, html: html, blankHTML: blankHTML, echoHTML: echoHTML,
    setVal: setVal, syncEcho: syncEcho, statement: statement, table: tableHTML
  };
})();
