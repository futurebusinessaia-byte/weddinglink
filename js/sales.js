/* =========================================================
   WeddingLink — Sales Page Logic
   ========================================================= */
(function(){
  'use strict';

  function track(event, data){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page: 'sales', ...(data||{}) });
    if (typeof gtag === 'function') gtag('event', event, data);
  }
  window.wlTrack = track;

  /* CTA auto-track */
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-cta]');
    if (!el) return;
    var cta = el.dataset.cta;
    var event = 'cta_click';
    if (cta.indexOf('plan-') === 0) event = 'pricing_interaction';
    else if (cta.indexOf('demo') > -1) event = 'demo_view';
    else if (cta.indexOf('whatsapp') > -1) event = 'whatsapp_click';
    else if (cta.indexOf('start') > -1 || cta.indexOf('checkout') > -1) event = 'start_order';
    track(event, { cta: cta });
  });

  /* FAQ tracking */
  var faqs = document.querySelectorAll('.faq-list details');
  faqs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if (d.open) {
        var q = d.querySelector('summary');
        track('faq_open', { question: q ? q.textContent : '' });
      }
    });
  });

  /* Pricing view tracking */
  var pricing = document.getElementById('pricing');
  if (pricing && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) {
          track('pricing_view', {});
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(pricing);
  }

  /* Currency toggle */
  (function(){
    var btns = document.querySelectorAll('.currency-btn');
    if (!btns.length) return;

    function setCurrency(cur){
      btns.forEach(function(b){
        b.classList.toggle('active', b.dataset.currency === cur);
      });
      document.querySelectorAll('[data-price-usd]').forEach(function(el){
        var key = 'price' + cur.charAt(0).toUpperCase() + cur.slice(1).toLowerCase();
        var price = el.dataset[key];
        if (!price) return;
        var small = el.querySelector('small');
        if (small) {
          el.innerHTML = price + small.outerHTML;
        } else {
          el.textContent = price;
        }
      });
      try { localStorage.setItem('wl_currency', cur); } catch(e) {}
      track('currency_switch', { currency: cur });
    }

    btns.forEach(function(b){
      b.addEventListener('click', function(){ setCurrency(b.dataset.currency); });
    });

    // Restore or auto-detect
    var saved;
    try { saved = localStorage.getItem('wl_currency'); } catch(e) {}
    if (saved && document.querySelector('[data-currency="' + saved + '"]')) {
      setCurrency(saved);
      return;
    }
    var locale = (navigator.language || 'en-US').toLowerCase();
    var detected = 'USD';
    if (locale.indexOf('in') > -1) detected = 'INR';
    else if (locale.indexOf('gb') > -1) detected = 'GBP';
    else if (locale.match(/de|fr|es|it|nl|pt|ie/)) detected = 'EUR';
    else if (locale.indexOf('ae') > -1) detected = 'AED';
    if (document.querySelector('[data-currency="' + detected + '"]')) {
      setCurrency(detected);
    }
  })();
})();
