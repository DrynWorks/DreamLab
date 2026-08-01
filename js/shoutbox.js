/* ============================================================
   DREAMLAB — shoutbox flutuante
   Alterna entre aberto/minimizado e lembra o estado no localStorage.
   Não toca no conteúdo do iframe (domínio externo do iShoutbox),
   só na moldura da janela.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dreamlab-shoutbox-minimized';

  function isMinimized() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function save(minimized) {
    try {
      localStorage.setItem(STORAGE_KEY, minimized ? '1' : '0');
    } catch (e) { /* modo privado / storage bloqueado */ }
  }

  function setState(win, btn, minimized) {
    win.classList.toggle('is-minimized', minimized);
    btn.textContent = minimized ? '□' : '_';
    btn.setAttribute('aria-label', minimized ? 'Restaurar Shoutbox' : 'Minimizar Shoutbox');
    btn.setAttribute('aria-expanded', minimized ? 'false' : 'true');
  }

  function init() {
    var win = document.getElementById('shoutbox-window');
    var btn = document.getElementById('shoutbox-toggle');
    if (!win || !btn) return;

    setState(win, btn, isMinimized());

    btn.addEventListener('click', function () {
      var minimized = !win.classList.contains('is-minimized');
      setState(win, btn, minimized);
      save(minimized);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
