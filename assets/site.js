/* Project 93 for Justice - mockup behaviour
   1. Activities lightbox (open, cycle with arrows, close with X / Esc)
   2. Campaigns progress rail
   Written plain so it is readable, and so nothing depends on a library. */

(function () {
  'use strict';

  /* ============ 0. COVER FALLBACK ============
     Open Library redirects each cover to an archive.org storage node. An individual
     node can be down or serve a bad certificate, so a cover can fail through no fault
     of ours. Rather than show a broken-image icon, degrade to a readable text card.
     Uses capture, because 'error' on <img> does not bubble. */
  document.addEventListener('error', function (ev) {
    var img = ev.target;
    if (!img || img.tagName !== 'IMG') return;
    var poster = img.closest('.poster');
    if (!poster || poster.classList.contains('textcard')) return;

    var title = img.dataset.title || img.alt || '';
    poster.classList.add('textcard');
    poster.querySelectorAll('img').forEach(function (n) { n.remove(); });

    var art = document.createElement('span');
    art.className = 'tc-title';
    art.textContent = title;
    var note = document.createElement('span');
    note.className = 'tc-note';
    note.textContent = 'Cover unavailable';
    poster.appendChild(art);
    poster.appendChild(note);
  }, true);

  /* ============ 1. ACTIVITIES LIGHTBOX ============ */
  var lb = document.getElementById('lb');
  if (lb) {
    var items   = Array.prototype.slice.call(document.querySelectorAll('.poster-item'));
    var frame   = document.getElementById('lb-frame');
    var capT    = document.getElementById('lb-title');
    var capS    = document.getElementById('lb-sub');
    var count   = document.getElementById('lb-count');
    var current = 0;
    var lastFocus = null;

    function show(i) {
      /* wrap around both ways so the arrows never dead-end */
      current = (i + items.length) % items.length;
      var item = items[current];
      /* the poster artwork lives in the button; clone it into the lightbox */
      var art = item.querySelector('svg');
      frame.innerHTML = '';
      if (art) frame.appendChild(art.cloneNode(true));
      capT.textContent = item.dataset.title || '';
      capS.textContent = item.dataset.sub || '';
      count.textContent = (current + 1) + ' / ' + items.length;
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('lb-close').focus();
    }

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
    });

    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(current + 1); });

    /* click the backdrop (not the poster) to close */
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ============ 2. CAMPAIGNS PROGRESS RAIL ============ */
  var rail = document.getElementById('rail');
  if (rail) {
    var dots = Array.prototype.slice.call(rail.querySelectorAll('button'));
    var secs = dots.map(function (d) { return document.querySelector(d.dataset.go); });

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var t = document.querySelector(d.dataset.go);
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var i = secs.indexOf(e.target);
            dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
          }
        });
      }, { threshold: 0.55 });
      secs.forEach(function (s) { if (s) io.observe(s); });
    }

    var hint = document.getElementById('hint');
    if (hint) {
      window.addEventListener('scroll', function () {
        hint.style.opacity = window.scrollY > 120 ? '0' : '1';
      }, { passive: true });
    }
  }
})();
