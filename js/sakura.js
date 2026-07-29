// Sakura plugin — pétalas caindo (compartilhado entre páginas internas)
(function ($) {
  var lastTime = 0;
  var vendors = ['webkit', 'o', 'ms', 'moz', ''];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (cb) {
      var now = new Date().getTime();
      var wait = Math.max(0, 16 - (now - lastTime));
      var id = window.setTimeout(function () { cb(now + wait); }, wait);
      lastTime = now + wait;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) { clearTimeout(id); };

  $.fn.prefixedEvent = function (type, cb) {
    for (var x = 0; x < vendors.length; ++x) {
      var t = vendors[x] ? vendors[x] + type : type.toLowerCase();
      (this instanceof jQuery ? this[0] : this).addEventListener(t, cb, false);
    }
    return this;
  };

  function inViewport(el) {
    if (el instanceof jQuery) el = el[0];
    var r = el.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 &&
      r.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      r.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  function rndArr(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  $.fn.sakura = function (event, options) {
    var target = this.selector === '' ? $('body') : this;
    var defaults = {
      blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
      className: 'sakura', fallSpeed: 1, maxSize: 14, minSize: 10, newOn: 300,
      swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
    };
    options = $.extend({}, defaults, options);

    if (typeof event === 'undefined' || event === 'start') {
      target.css('overflow-x', 'hidden');
      var creator = function () {
        if (target.data('sakura-anim-id')) {
          setTimeout(function () { requestAnimationFrame(creator); }, options.newOn);
        }
        var blow = rndArr(options.blowAnimations);
        var sway = rndArr(options.swayAnimations);
        var fallTime = ((document.documentElement.clientHeight * 0.007) + Math.round(Math.random() * 5)) * options.fallSpeed;
        var anims =
          'fall ' + fallTime + 's linear 0s 1, ' +
          blow + ' ' + (((fallTime > 30 ? fallTime : 30) - 20) + rndInt(0, 20)) + 's linear 0s infinite, ' +
          sway + ' ' + rndInt(2, 4) + 's linear 0s infinite';
        var petal = $('<div class="' + options.className + '"/>');
        var h = rndInt(options.minSize, options.maxSize);
        var w = h - Math.floor(rndInt(0, options.minSize) / 3);
        // 'fall' roda uma vez e não tem fill-mode: ao terminar, o top volta a
        // 'auto' e a pétala salta para a posição estática, ficando presa na
        // tela. Terminou de cair, some — independente de estar na viewport.
        petal.prefixedEvent('AnimationEnd', function (ev) {
          if (ev.animationName === 'fall' || !inViewport(this)) $(this).remove();
        })
          .prefixedEvent('AnimationIteration', function (ev) {
            if (($.inArray(ev.animationName, options.blowAnimations) !== -1 ||
              $.inArray(ev.animationName, options.swayAnimations) !== -1) && !inViewport(this)) $(this).remove();
          })
          .css({
            animation: anims, '-webkit-animation': anims,
            'border-radius': rndInt(options.maxSize, options.maxSize + Math.floor(Math.random() * 10)) + 'px ' + rndInt(1, Math.floor(w / 4)) + 'px',
            height: h + 'px', width: w + 'px',
            left: (Math.random() * document.documentElement.clientWidth - 100) + 'px',
            'margin-top': -(Math.floor(Math.random() * 20) + 15) + 'px'
          });
        target.append(petal);
      };
      target.data('sakura-anim-id', requestAnimationFrame(creator));
    } else if (event === 'stop') {
      var id = target.data('sakura-anim-id');
      if (id) { cancelAnimationFrame(id); target.data('sakura-anim-id', null); }
      setTimeout(function () { $('.' + options.className).remove(); }, options.newOn + 50);
    }
  };
}(jQuery));

$(document).ready(function () { $('body').sakura(); });
