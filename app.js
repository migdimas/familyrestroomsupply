// En-tête qui se solidifie, menu mobile, onglets des modèles, apparitions, formulaire de soumission (mailto).
(function () {
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('solid', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.burger');
  burger.addEventListener('click', function () {
    var open = top.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', function () { top.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });

  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) {
        var on = x === b, panel = document.getElementById('m-' + x.dataset.tab);
        x.setAttribute('aria-selected', on);
        panel.hidden = !on; panel.classList.toggle('on', on);
      });
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });

  var form = document.getElementById('qform');
  // un clic sur « Quote this model » ou sur une catégorie coche la bonne case
  document.querySelectorAll('[data-model],[data-cat]').forEach(function (a) {
    a.addEventListener('click', function () {
      var cat = a.dataset.cat || form.querySelector('[name=products]').value;
      form.querySelectorAll('[name=products]').forEach(function (c) { if (c.value === cat) c.checked = true; });
      if (a.dataset.model) { var q = form.querySelector('[name=qty]'); if (q.value.indexOf(a.dataset.model) < 0) q.value = (q.value ? q.value + ', ' : '') + a.dataset.model + ' x '; }
    });
  });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(form), lines = [];
    form.querySelectorAll('label').forEach(function (l) {
      var i = l.querySelector('input:not([type=checkbox]),select,textarea');
      if (i && i.value) lines.push(l.firstChild.textContent.trim() + ': ' + i.value);
    });
    var prods = d.getAll('products');
    if (prods.length) lines.push(form.querySelector('legend').textContent + ': ' + prods.join(', '));
    var subject = form.dataset.subject + ' | ' + (d.get('company') || d.get('name'));
    location.href = 'mailto:' + form.dataset.to + '?cc=' + encodeURIComponent(form.dataset.cc) + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
