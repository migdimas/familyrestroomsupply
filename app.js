// En-tête qui se solidifie, menu mobile, onglets des modèles Klimbo, apparitions, formulaire de soumission (mailto).
(function () {
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('solid', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.burger');
  burger.addEventListener('click', function () {
    var open = top.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

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
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });

  var form = document.getElementById('qform');
  if (!form) return;
  // ?p=<catégorie> coche le produit, ?m=<modèle> l'inscrit au message, ?mk=<marché> choisit le marché
  var q = new URLSearchParams(location.search);
  if (q.get('p')) form.querySelectorAll('[name=products]').forEach(function (c) { if (c.value === q.get('p')) c.checked = true; });
  if (q.get('mk')) form.elements['market'].value = q.get('mk');
  if (q.get('m')) form.elements['msg'].value = 'Klimbo ' + q.get('m') + ' x ';
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var lines = [];
    form.querySelectorAll('label').forEach(function (l) {
      var i = l.querySelector('input:not([type=checkbox]),select,textarea');
      if (i && i.value) lines.push(l.firstChild.textContent.trim() + ': ' + (i.tagName === 'SELECT' ? i.options[i.selectedIndex].text : i.value));
    });
    var prods = [].map.call(form.querySelectorAll('[name=products]:checked'), function (c) { return c.dataset.label; });
    if (prods.length) lines.push(form.querySelector('legend').textContent + ': ' + prods.join(', '));
    var subject = form.dataset.subject + ' | ' + (form.elements['company'].value || form.elements['name'].value);
    location.href = 'mailto:' + form.dataset.to + '?cc=' + encodeURIComponent(form.dataset.cc) + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
