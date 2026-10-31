window.MathJax = {
  tex: {
    tags: 'none',
    macros: { bm: ['\\boldsymbol{#1}', 1], Bar: '\\bar', sig: ['\\lceil #1\\rfloor^{#2}', 2], norm: ['\\lVert #1\\rVert', 1], sgn: '\\operatorname{sign}', R: '\\mathbb{R}', sign: '\\operatorname{sign}', diago: '\\operatorname{diag}', sen: '\\operatorname{sen}',
              co: '\\operatorname{c}', se: '\\operatorname{s}', atan: '\\operatorname{atan}', tanhh: '\\operatorname{tanh}' }
  },
  svg: { fontCache: 'global' },
  options: { processHtmlClass: 'math', ignoreHtmlClass: 'tex2jax_ignore' }
};
document.addEventListener('click', function (e) {
  var b = e.target.closest('button[data-copy]');
  if (!b) return;
  var el = document.getElementById(b.getAttribute('data-copy'));
  var txt = el ? el.innerText : '';
  var done = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1500); };
  if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(done, function () {}); }
  else { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges(); done(); }
});
