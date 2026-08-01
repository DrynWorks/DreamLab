/* ============================================================
   DREAMLAB — menu lateral compartilhado
   Preenche todo host [data-nav] com a mesma lista de navegação.
   HOME/GALLERY/LINKS/ABOUT carregam dentro do iframe central
   (name="dreamlab-content"); GUESTBOOK é externo e abre em nova aba.
   ============================================================ */
(function () {
  'use strict';

  var FRAME_TARGET = 'dreamlab-content';

  var ITEMS = [
    { id: 'home', label: 'HOME', href: 'pages/home.html' },
    { id: 'gallery', label: 'GALLERY', href: 'pages/gallery.html' },
    { id: 'links', label: 'LINKS', href: 'pages/links.html' },
    { id: 'guestbook', label: 'GUESTBOOK', href: 'https://dryn.atabook.org', external: true },
    { id: 'about', label: 'ABOUT', href: 'pages/about.html' }
  ];

  function build() {
    var hosts = document.querySelectorAll('[data-nav]');
    if (!hosts.length) return;

    var current = document.body.getAttribute('data-page');

    for (var h = 0; h < hosts.length; h++) {
      var host = hosts[h];
      host.innerHTML = '';

      var ul = document.createElement('ul');
      ul.className = 'nav-list';

      for (var i = 0; i < ITEMS.length; i++) {
        var item = ITEMS[i];

        var a = document.createElement('a');
        a.href = item.href;
        a.className = 'nav-item' + (item.id === current ? ' active' : '');
        a.setAttribute('data-nav-id', item.id);

        if (item.external) {
          a.target = '_blank';
          a.rel = 'noopener';
        } else {
          a.target = FRAME_TARGET;
        }

        var icon = document.createElement('span');
        icon.className = 'nav-icon';
        icon.textContent = '>';

        a.appendChild(icon);
        a.appendChild(document.createTextNode(' ' + item.label));

        var li = document.createElement('li');
        li.appendChild(a);
        ul.appendChild(li);
      }

      host.appendChild(ul);
    }
  }

  /* Itens que carregam no iframe não recarregam a página, então o
     estado "active" é atualizado na hora do clique */
  function bindClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.nav-item[data-nav-id]') : null;
      if (!a || a.target !== FRAME_TARGET) return;

      var items = document.querySelectorAll('.nav-item[data-nav-id]');
      for (var i = 0; i < items.length; i++) items[i].classList.remove('active');
      a.classList.add('active');
    });
  }

  function init() {
    build();
    bindClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
