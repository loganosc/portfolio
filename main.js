(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Intro: plays once per session, Restart replays it ---------- */

  var intro = document.getElementById('intro');
  var scroll = document.getElementById('scroll');

  function markPlayed() {
    try { sessionStorage.setItem('logan-os:intro', '1'); } catch (e) {}
  }

  intro.addEventListener('animationend', function (e) {
    if (e.target !== intro) return;
    root.classList.remove('is-intro');
    markPlayed();
  });

  if (root.classList.contains('is-intro')) markPlayed();

  document.getElementById('restart').addEventListener('click', function () {
    scroll.scrollTop = 0;
    if (reduceMotion.matches || root.classList.contains('no-intro')) return;
    root.classList.remove('is-intro');
    void intro.offsetWidth; // restart the CSS animations
    root.classList.add('is-intro');
  });

  /* ---------- Modernize: retro <-> modern (modern.css), remembered per browser ---------- */

  var themeToggle = document.getElementById('theme-toggle');

  function setModern(on) {
    root.classList.toggle('is-modern', on);
    themeToggle.textContent = on ? 'Retro mode' : 'Modernize';
  }
  setModern(root.classList.contains('is-modern'));

  themeToggle.addEventListener('click', function () {
    var on = !root.classList.contains('is-modern');
    root.classList.remove('is-intro'); // no zoom into the monitor in modern mode
    setModern(on);
    try { localStorage.setItem('logan-os:theme', on ? 'modern' : 'retro'); } catch (e) {}
  });

  // Mode-switch tip under Logan Info: its button flips the mode, × hides it for good in the current mode.
  var promoGo = document.getElementById('promo-go');
  promoGo.addEventListener('click', function () {
    themeToggle.click();
    // The tip stays unless it was dismissed in the new mode; if it's gone, keep focus on the same switch.
    if (!promoGo.offsetParent) themeToggle.focus();
  });
  document.getElementById('promo-close').addEventListener('click', function () {
    var mode = root.classList.contains('is-modern') ? 'modern' : 'retro';
    root.classList.add('promo-dismissed-' + mode);
    try { localStorage.setItem('logan-os:promo-' + mode, 'dismissed'); } catch (e) {}
    themeToggle.focus(); // the tip is gone; the same switch lives in the taskbar
  });

  /* ---------- Menu (collapsed under 768px) ---------- */

  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menubar')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Info dialog: General / Contact ---------- */

  var infoTabs = document.querySelectorAll('.infotab');
  infoTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      infoTabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-pressed', on ? 'true' : 'false');
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  /* ---------- Project filter ---------- */

  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.card');
  var countLabel = document.getElementById('count-label');
  var liveLabel = document.getElementById('live-label');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filter;
      var shown = 0;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      cards.forEach(function (card) {
        var match = cat === 'all' || card.dataset.cat === cat;
        card.hidden = !match;
        if (match) shown++;
      });
      countLabel.textContent = shown + (shown === 1 ? ' item' : ' items');
      liveLabel.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's');
    });
  });

  /* ---------- Case study viewer ---------- */

  var viewer = document.getElementById('viewer');
  var viewerBar = viewer.querySelector('.viewer__bar');
  var viewerTitle = document.querySelector('#viewer-title span');
  var viewerBody = document.getElementById('viewer-body');
  var viewerScroll = document.getElementById('viewer-scroll');
  var viewerMeta = document.getElementById('viewer-meta');
  var viewerPage = document.getElementById('viewer-page');
  var CATEGORY = { ux: 'Product & UX', media: 'Media & Graphics' };

  document.querySelectorAll('.openbtn[data-case]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Let modified clicks (new tab/window) go straight to the page.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var tpl = document.getElementById('cs-' + link.dataset.case);
      if (!tpl || typeof viewer.showModal !== 'function') return;
      e.preventDefault();

      var card = link.closest('.card');
      var bar = card.querySelectorAll('.card__bar span');
      var host = link.hostname.indexOf('behance.net') !== -1 ? 'Behance'
        : link.hostname.indexOf('github.com') !== -1 ? 'GitHub' : null;

      viewerBar.style.setProperty('--tb', getComputedStyle(card).getPropertyValue('--bar'));
      viewerTitle.textContent = 'C:\\Logan\\Interactive_Works\\' + bar[0].textContent;
      viewerMeta.textContent = bar[1].textContent + ' · ' + CATEGORY[card.dataset.cat] + ' · Esc to close';
      viewerPage.href = link.href;
      viewerPage.textContent = (host ? 'View on ' + host : 'Open as page') + ' ↗';
      viewerBody.replaceChildren(tpl.content.cloneNode(true));
      enableZoom(viewerBody);
      viewer.showModal();
      viewerScroll.scrollTop = 0;
    });
  });

  // About me reuses the viewer, sized to its short content.
  document.getElementById('about-open').addEventListener('click', function () {
    if (typeof viewer.showModal !== 'function') return;
    viewer.classList.add('viewer--fit');
    viewerBar.style.setProperty('--tb', 'var(--yellow)');
    viewerTitle.textContent = 'C:\\Logan\\About_Me.txt';
    viewerMeta.textContent = 'About · Esc to close';
    viewerPage.href = 'assets/Logan_Oscher_Resume.pdf';
    viewerPage.textContent = 'Resume.pdf ↗';
    viewerBody.replaceChildren(document.getElementById('cs-about').content.cloneNode(true));
    viewer.showModal();
    viewerScroll.scrollTop = 0;
  });

  viewer.addEventListener('click', function (e) {
    // Clicks on the backdrop land on the <dialog> itself.
    if (e.target === viewer || e.target.closest('[data-close]')) viewer.close();
  });
  viewer.addEventListener('close', function () {
    viewerBody.replaceChildren(); // stops embedded video and prototypes
    viewer.classList.remove('viewer--fit');
  });

  /* ---------- Image lightbox: gallery images open large, and you can scroll through the gallery ---------- */

  var lightbox = document.getElementById('lightbox');
  var lbTitle = document.querySelector('#lightbox-title span');
  var lbTrack = document.getElementById('lightbox-track');
  var lbCaption = document.getElementById('lightbox-caption');
  var lbCount = document.getElementById('lightbox-count');
  var lbPrev = document.getElementById('lightbox-prev');
  var lbNext = document.getElementById('lightbox-next');
  var lbItems = [];
  var lbIndex = 0;
  var lbFolder = '';

  // Wrap every image in a gallery grid in a button, grouped by the grid it sits in.
  function enableZoom(container) {
    container.querySelectorAll('.case-grid').forEach(function (grid) {
      var imgs = [].slice.call(grid.querySelectorAll('.case-figure img'));
      if (!imgs.length) return;
      var section = grid.closest('section');
      var heading = section && section.querySelector('h2');
      var folder = heading ? heading.textContent.trim().replace(/\s+/g, '_') : 'Gallery';
      var items = imgs.map(function (img) {
        var caption = img.closest('figure').querySelector('figcaption');
        return { src: img.getAttribute('src'), alt: img.alt, caption: caption ? caption.textContent.trim() : img.alt };
      });
      imgs.forEach(function (img, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cs-zoom';
        btn.setAttribute('aria-label', 'Enlarge image ' + (i + 1) + ' of ' + imgs.length + ': ' + img.alt);
        img.replaceWith(btn);
        btn.appendChild(img);
        btn.addEventListener('click', function () { openLightbox(items, i, folder); });
      });
    });
  }

  function slideWidth() { return lbTrack.clientWidth || 1; }

  function showIndex(i) {
    lbIndex = i;
    var item = lbItems[i];
    lbTitle.textContent = 'C:\\Logan\\' + lbFolder + '\\' + item.src.split('/').pop();
    lbCount.textContent = (i + 1) + ' / ' + lbItems.length;
    lbCaption.textContent = item.caption;
    lbPrev.disabled = i === 0;
    lbNext.disabled = i === lbItems.length - 1;
  }

  function goTo(i, smooth) {
    i = Math.max(0, Math.min(lbItems.length - 1, i));
    lbTrack.scrollTo({ left: i * slideWidth(), behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto' });
    showIndex(i);
  }

  function openLightbox(items, index, folder) {
    lbItems = items;
    lbFolder = folder;
    lbTrack.replaceChildren.apply(lbTrack, items.map(function (item) {
      var slide = document.createElement('div');
      slide.className = 'lightbox__slide';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      slide.appendChild(img);
      return slide;
    }));
    lightbox.showModal();
    goTo(index, false);
  }

  // Keep the counter and caption in step with swipes and trackpad scrolling.
  var scrollTick;
  lbTrack.addEventListener('scroll', function () {
    cancelAnimationFrame(scrollTick);
    scrollTick = requestAnimationFrame(function () {
      var i = Math.round(lbTrack.scrollLeft / slideWidth());
      if (i !== lbIndex && lbItems[i]) showIndex(i);
    });
  });

  lbPrev.addEventListener('click', function () { goTo(lbIndex - 1, true); });
  lbNext.addEventListener('click', function () { goTo(lbIndex + 1, true); });

  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(lbIndex - 1, true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(lbIndex + 1, true); }
  });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.closest('[data-close]')) lightbox.close();
  });
  lightbox.addEventListener('close', function () { lbTrack.replaceChildren(); });
  window.addEventListener('resize', function () {
    if (lightbox.open) lbTrack.scrollLeft = lbIndex * slideWidth();
  });

  /* ---------- Email links: also copy the address ---------- */

  // mailto: silently does nothing when no mail app is set up, so copy the address too.
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(text) {
    toast.textContent = text;
    clearTimeout(toastTimer);
    if (toast.showPopover) {
      if (toast.matches(':popover-open')) toast.hidePopover();
      toast.showPopover(); // re-show so it lands above any open dialog
    } else {
      toast.classList.add('is-open');
    }
    toastTimer = setTimeout(function () {
      if (toast.hidePopover && toast.matches(':popover-open')) toast.hidePopover();
      toast.classList.remove('is-open');
    }, 3000);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="mailto:"]');
    if (!link) return;
    var email = link.getAttribute('href').slice(7).split('?')[0];
    var copy = navigator.clipboard ? navigator.clipboard.writeText(email) : Promise.reject();
    copy.then(
      function () { showToast('Email copied: ' + email); },
      function () { showToast('Email me at ' + email); }
    );
  });

  /* ---------- Taskbar clock ---------- */

  var clock = document.getElementById('clock');
  var fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

  function tick() {
    var now = new Date();
    clock.textContent = fmt.format(now);
    clock.setAttribute('datetime', now.toISOString());
    setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
  }
  tick();
})();
