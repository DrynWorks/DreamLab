/* ============================================================
   DREAMLAB — sistema de temas
   Carregado no <head> (sem defer) para aplicar o tema antes
   da primeira pintura e evitar piscar de cor.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dreamlab-theme';
  var DEFAULT_THEME = 'black';

  /* a / b = cores da amostra mostrada no seletor */
  var THEMES = [
    { id: 'black',  label: 'BLACK',  a: '#2b2b2b', b: '#000000' },
    { id: 'dark',   label: 'DARK',   a: '#5a626e', b: '#101216' },
    { id: 'purple', label: 'PURPLE', a: '#ece2f6', b: '#4a1a70' },
    { id: 'blue',   label: 'BLUE',   a: '#d8e4f0', b: '#0a2a6a' },
    { id: 'red',    label: 'RED',    a: '#eddfdf', b: '#6e1414' },
    { id: 'green',  label: 'GREEN',  a: '#dcecdf', b: '#14562a' }
  ];

  function isValid(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return true;
    }
    return false;
  }

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(id) {
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) { /* modo privado / storage bloqueado */ }
  }

  function markActive(id) {
    var buttons = document.querySelectorAll('.theme-swatch');
    for (var i = 0; i < buttons.length; i++) {
      var on = buttons[i].getAttribute('data-set-theme') === id;
      buttons[i].classList.toggle('is-active', on);
      buttons[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function apply(id, persist) {
    if (!isValid(id)) id = DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', id);
    if (persist) save(id);
    markActive(id);
  }

  /* Aplica imediatamente (antes do body existir) */
  var current = stored();
  if (!isValid(current)) current = DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', current);

  function build() {
    var hosts = document.querySelectorAll('[data-theme-switcher]');

    for (var h = 0; h < hosts.length; h++) {
      var host = hosts[h];
      host.innerHTML = '';
      host.classList.add(host.hasAttribute('data-compact') ? 'theme-bar' : 'theme-grid');

      for (var i = 0; i < THEMES.length; i++) {
        var t = THEMES[i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-swatch';
        btn.setAttribute('data-set-theme', t.id);
        btn.title = t.label;
        btn.setAttribute('aria-label', 'Tema ' + t.label);

        var sw = document.createElement('span');
        sw.className = 'sw';
        sw.style.setProperty('--sw-a', t.a);
        sw.style.setProperty('--sw-b', t.b);

        var label = document.createElement('span');
        label.className = 'label';
        label.textContent = t.label;

        btn.appendChild(sw);
        btn.appendChild(label);
        host.appendChild(btn);
      }
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-set-theme]') : null;
      if (!btn) return;
      apply(btn.getAttribute('data-set-theme'), true);
    });

    markActive(document.documentElement.getAttribute('data-theme'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  window.DreamLabTheme = { apply: apply, themes: THEMES };
})();
