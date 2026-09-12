/* =========================================================
   WeddingLink — Wedding Site Logic
   ========================================================= */
(function(){
  'use strict';
  var W = window.WEDDING || {};

  function track(event, data){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
    if (typeof gtag === 'function') gtag('event', event, data);
  }
  window.wlTrack = track;

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  var scrollTicking = false;
  window.addEventListener('scroll', function(){
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function(){
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
      scrollTicking = false;
    });
  }, { passive: true });

  if (navToggle) {
    navToggle.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Field injection ---------- */
  document.querySelectorAll('[data-field]').forEach(function(el){
    var key = el.dataset.field;
    if (W[key] != null) el.textContent = W[key];
  });
  document.querySelectorAll('[data-field-href]').forEach(function(el){
    var key = el.dataset.fieldHref;
    if (W[key]) el.href = W[key];
  });

  /* ---------- Story ---------- */
  var storyGrid = document.getElementById('storyGrid');
  if (storyGrid && Array.isArray(W.story)) {
    storyGrid.innerHTML = W.story.map(function(s){
      return '<article class="story-card"><h3>' + s.title + '</h3><p>' + s.body + '</p></article>';
    }).join('');
  }

  /* ---------- Events ---------- */
  var eventsGrid = document.getElementById('eventsGrid');
  if (eventsGrid && Array.isArray(W.events)) {
    eventsGrid.innerHTML = W.events.map(function(e){
      return '<article class="event-card">' +
        '<h3 class="event-name">' + e.name + '</h3>' +
        '<p class="event-meta"><strong>' + e.date + '</strong> · ' + e.time + '</p>' +
        '<p class="event-desc">' + e.description + '</p>' +
        '<p class="event-meta" style="margin-top:14px;margin-bottom:0">' + e.venue + '</p>' +
        '<a class="event-map" href="' + e.map + '" target="_blank" rel="noopener" data-cta="event-map">Google Maps</a>' +
        '</article>';
    }).join('');
  }

  /* ---------- Gallery ---------- */
  var galleryFilters = document.getElementById('galleryFilters');
  var galleryGrid = document.getElementById('galleryGrid');
  var categories = ['All'].concat(W.gallery_categories || []);

  function renderGallery(filter) {
    if (!galleryGrid) return;
    var items = (W.gallery_images || []).filter(function(img){
      return filter === 'All' || img.category === filter;
    });
    galleryGrid.innerHTML = items.map(function(img){
      var imgTag = img.src ? '<img src="' + img.src + '" alt="' + (img.alt || '') + '" loading="lazy" />' : '';
      return '<figure class="gallery-item">' + imgTag + '<span>' + (img.alt || img.category) + '</span></figure>';
    }).join('');
  }

  if (galleryFilters) {
    galleryFilters.innerHTML = categories.map(function(c, i){
      return '<button class="filter-pill ' + (i === 0 ? 'active' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('');
    galleryFilters.addEventListener('click', function(e){
      var btn = e.target.closest('.filter-pill');
      if (!btn) return;
      galleryFilters.querySelectorAll('.filter-pill').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      renderGallery(btn.dataset.cat);
    });
  }
  renderGallery('All');

  /* ---------- Countdown ---------- */
  var cd = document.getElementById('countdown');
  var intervalId = null;
  if (cd) {
    var target = new Date(cd.dataset.weddingDate).getTime();
    var els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-mins'),
      s: document.getElementById('cd-secs')
    };
    var pad = function(n){ return String(n).padStart(2, '0'); };

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        els.d.textContent = '00';
        els.h.textContent = '00';
        els.m.textContent = '00';
        els.s.textContent = '00';
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
        return;
      }
      var s = Math.floor(diff / 1000);
      els.d.textContent = pad(Math.floor(s / 86400));
      els.h.textContent = pad(Math.floor((s % 86400) / 3600));
      els.m.textContent = pad(Math.floor((s % 3600) / 60));
      els.s.textContent = pad(s % 60);
    }
    tick();
    intervalId = setInterval(tick, 1000);
  }

  /* ---------- RSVP ---------- */
  var form = document.getElementById('rsvpForm');
  var success = document.getElementById('rsvpSuccess');
  var successMsg = document.getElementById('rsvpSuccessMsg');
  var again = document.getElementById('rsvpAgain');

  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        guests: form.guests.value,
        attendance: form.attendance.value,
        message: form.message.value.trim(),
        wedding: (W.couple_name_1 || '') + ' & ' + (W.couple_name_2 || ''),
        submitted_at: new Date().toISOString()
      };
      if (!data.name) {
        form.name.focus();
        form.name.classList.add('error');
        return;
      }
      form.name.classList.remove('error');

      var submitBtn = form.querySelector('button[type=submit]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      var ok = false;

      function finish(successFlag) {
        track('rsvp_submit', { attendance: data.attendance, guests: data.guests });
        if (successFlag) {
          form.hidden = true;
          success.hidden = false;
          successMsg.textContent = data.attendance === 'yes'
            ? 'Thank you, ' + data.name.split(' ')[0] + ". We can't wait to celebrate with you."
            : 'Thank you for letting us know, ' + data.name.split(' ')[0] + ". You'll be missed.";
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm Attendance';
          alert('Something went wrong. Please try again.');
        }
      }

      if (W.rsvp_endpoint) {
        fetch(W.rsvp_endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function(res){
          finish(res.ok);
        }).catch(function(){
          finish(false);
        });
      } else {
        try {
          var key = 'weddinglink_rsvp';
          var all = JSON.parse(localStorage.getItem(key) || '[]');
          all.push(data);
          localStorage.setItem(key, JSON.stringify(all));
          finish(true);
        } catch (err) {
          finish(false);
        }
      }
    });

    form.name.addEventListener('input', function(){
      form.name.classList.remove('error');
    });
  }

  if (again) {
    again.addEventListener('click', function(){
      form.reset();
      form.hidden = false;
      success.hidden = true;
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = false;
      btn.textContent = 'Confirm Attendance';
    });
  }

  /* ---------- Share ---------- */
  var shareBtn = document.getElementById('shareWhatsApp');
  var copyBtn = document.getElementById('copyLink');
  var shareUrlEl = document.getElementById('shareUrl');
  var weddingUrl = W.wedding_url || (window.location.origin + window.location.pathname);
  if (shareUrlEl) shareUrlEl.textContent = weddingUrl;

  if (shareBtn) {
    shareBtn.addEventListener('click', function(){
      var msg = (W.whatsapp_message || '') + '\n\n' + weddingUrl;
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
      track('whatsapp_click', { source: 'wedding_site' });
    });
  }
  if (copyBtn) {
    copyBtn.addEventListener('click', function(){
      if (navigator.clipboard) {
        navigator.clipboard.writeText(weddingUrl).then(function(){
          copyBtn.textContent = 'Copied ✓';
          setTimeout(function(){ copyBtn.textContent = 'Copy link'; }, 2000);
        }).catch(function(){
          prompt('Copy this link:', weddingUrl);
        });
      } else {
        prompt('Copy this link:', weddingUrl);
      }
    });
  }

  /* ---------- Live Stream ---------- */
  if (W.live_stream_enabled && W.live_stream_url) {
    var liveSection = document.getElementById('live');
    var navLive = document.getElementById('navLive');
    var liveVideoBox = document.getElementById('liveVideoBox');
    var liveStreamDate = document.getElementById('liveStreamDate');
    var liveStreamNote = document.getElementById('liveStreamNote');
    if (liveSection) liveSection.hidden = false;
    if (navLive) navLive.hidden = false;
    if (liveStreamDate && W.live_stream_starts) liveStreamDate.textContent = W.live_stream_starts;
    if (liveStreamNote && W.live_stream_note) liveStreamNote.textContent = W.live_stream_note;
    if (liveVideoBox) {
      liveVideoBox.innerHTML = '<iframe src="' + W.live_stream_url + '" title="Live wedding stream" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    }
  }

  /* ---------- Gifts ---------- */
  if (W.gifts_enabled) {
    var giftsSection = document.getElementById('gifts');
    var navGifts = document.getElementById('navGifts');
    var giftsNote = document.getElementById('giftsNote');
    if (giftsSection) giftsSection.hidden = false;
    if (navGifts) navGifts.hidden = false;
    if (giftsNote && W.gifts_note) giftsNote.textContent = W.gifts_note;

    var method = (W.gifts_type || 'upi').toLowerCase();
    var methodBox = document.getElementById('giftsMethod');
    if (methodBox) {
      if (method === 'upi' && W.upi_id) {
        var upiLink = 'upi://pay?pa=' + W.upi_id + '&pn=' + encodeURIComponent(W.upi_payee_name || '') + '&cu=INR';
        methodBox.innerHTML =
          '<div class="gifts-qr"><div id="giftsQrBox" class="qr-box"></div><p class="qr-label">Scan with any UPI app</p></div>' +
          '<div class="gifts-info">' +
          '<p class="blessing-label">UPI ID</p>' +
          '<p class="blessing-id" id="upiIdDisplay">' + W.upi_id + '</p>' +
          '<a href="' + upiLink + '" class="btn btn-primary btn-full" data-cta="upi-pay">Open UPI app</a>' +
          '<button type="button" class="btn btn-ghost btn-full" id="copyUpiBtn" data-cta="upi-copy">Copy UPI ID</button>' +
          '<p class="blessing-apps">GPay · PhonePe · Paytm · BHIM · any UPI app</p>' +
          '</div>';

        var copyBtn2 = document.getElementById('copyUpiBtn');
        if (copyBtn2) {
          copyBtn2.addEventListener('click', function(){
            if (navigator.clipboard) {
              navigator.clipboard.writeText(W.upi_id).then(function(){
                copyBtn2.textContent = 'Copied ✓';
                setTimeout(function(){ copyBtn2.textContent = 'Copy UPI ID'; }, 2000);
              }).catch(function(){ prompt('Copy this UPI ID:', W.upi_id); });
            } else {
              prompt('Copy this UPI ID:', W.upi_id);
            }
          });
        }

        var box = document.getElementById('giftsQrBox');
        if (box) {
          var renderUpiQr = function(){
            if (typeof QRCode === 'undefined') return;
            box.innerHTML = '';
            new QRCode(box, {
              text: upiLink, width: 200, height: 200,
              colorDark: '#2E211B', colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
          };
          if ('IntersectionObserver' in window && giftsSection) {
            var io = new IntersectionObserver(function(entries){
              entries.forEach(function(en){
                if (en.isIntersecting) { renderUpiQr(); io.disconnect(); }
              });
            }, { threshold: 0.1 });
            io.observe(giftsSection);
          } else {
            window.addEventListener('load', renderUpiQr);
          }
        }
      } else if (method === 'stripe' && W.gifts_stripe_link) {
        methodBox.innerHTML =
          '<div class="gifts-info" style="grid-column:1/-1">' +
          '<p class="blessing-label">Send a gift</p>' +
          '<p style="color:var(--ink-soft);margin-bottom:20px">Your gift will be sent securely to the couple.</p>' +
          '<a href="' + W.gifts_stripe_link + '" class="btn btn-primary btn-full" data-cta="gift-pay">Send a gift</a>' +
          '</div>';
      } else if (method === 'paypal' && W.gifts_paypal_link) {
        methodBox.innerHTML =
          '<div class="gifts-info" style="grid-column:1/-1">' +
          '<p class="blessing-label">Send a gift</p>' +
          '<p style="color:var(--ink-soft);margin-bottom:20px">Your gift will be sent securely to the couple.</p>' +
          '<a href="' + W.gifts_paypal_link + '" class="btn btn-primary btn-full" data-cta="gift-pay">Send a gift</a>' +
          '</div>';
      } else {
        giftsSection.hidden = true;
        if (navGifts) navGifts.hidden = true;
      }
    }
  }

  /* ---------- Main QR ---------- */
  function initQR() {
    var box = document.getElementById('qrcode');
    if (!box) return;
    if (typeof QRCode === 'undefined') {
      setTimeout(initQR, 200);
      return;
    }
    box.innerHTML = '';
    new QRCode(box, {
      text: weddingUrl, width: 200, height: 200,
      colorDark: '#2E211B', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    track('demo_view', { source: 'wedding_site' });
  }
  if (document.readyState === 'complete') {
    initQR();
  } else {
    window.addEventListener('load', initQR);
  }

  /* ---------- Sticky CTA ---------- */
  var sticky = document.getElementById('stickyCta');
  var rsvpSection = document.getElementById('rsvp');
  if (sticky && rsvpSection && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        sticky.classList.toggle('visible', window.scrollY > 500 && !en.isIntersecting);
      });
    }, { threshold: 0 });
    io2.observe(rsvpSection);
  }

  /* ---------- CTA auto-track ---------- */
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    track('cta_click', { cta: el.dataset.cta, page: 'wedding_site' });
  });
})();
