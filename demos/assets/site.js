/* 데모 사이트 공통 인터랙션 (demo.js 다음에 로드)
 * 헤더 스크롤 상태 · 전체화면 메뉴 · 프리로더/페이지 전환 커튼 · 스무스 스크롤(Lenis 있을 때)
 * 패럴랙스[data-parallax] · 카운트업[data-count] · 줄 단위 리빌[data-split] · TOP 버튼 · 커서[body.has-cursor]
 */
(function () {
  var html = document.documentElement;
  var params = new URLSearchParams(location.search);
  var still = params.has('export') || params.has('guide');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) html.classList.add('still', 'no-curtain');

  // 헤더
  var head = document.querySelector('.site-head');
  var topBtn = document.querySelector('.q-top');
  function onScroll() {
    var y = window.scrollY;
    if (head) head.classList.toggle('is-scrolled', y > 24);
    if (topBtn) topBtn.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  // 전체화면 메뉴
  var fm = document.querySelector('.full-menu');
  document.querySelectorAll('[data-fm-open]').forEach(function (b) {
    b.addEventListener('click', function () { fm.classList.add('is-open'); fm.removeAttribute('aria-hidden'); b.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; });
  });
  document.querySelectorAll('[data-fm-close]').forEach(function (b) {
    b.addEventListener('click', closeMenu);
  });
  function closeMenu() {
    if (!fm) return;
    fm.classList.remove('is-open'); fm.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    document.querySelectorAll('[data-fm-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // 프리로더(세션당 1회 로고) + 페이지 전환 커튼
  var curtain = document.querySelector('.curtain');
  if (curtain && !still && !reduce) {
    var seen = false;
    try { seen = sessionStorage.getItem('demo-seen-' + location.pathname.split('/')[1]) === '1'; } catch (e) {}
    if (seen) { var l = curtain.querySelector('.c-logo'); if (l) l.style.display = 'none'; }
    var delay = seen ? 150 : 900;
    window.addEventListener('load', function () { setTimeout(function () { curtain.classList.add('is-gone'); }, delay); });
    setTimeout(function () { curtain.classList.add('is-gone'); }, 2600); // 이미지 지연 대비
    try { sessionStorage.setItem('demo-seen-' + location.pathname.split('/')[1], '1'); } catch (e) {}
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href) || a.hasAttribute('download')) return;
      e.preventDefault();
      var lg = curtain.querySelector('.c-logo'); if (lg) lg.style.display = 'none';
      curtain.classList.add('is-enter'); curtain.classList.remove('is-gone');
      void curtain.offsetWidth;
      curtain.classList.remove('is-enter');
      setTimeout(function () { location.href = a.href; }, 520);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) curtain.classList.add('is-gone'); });
  }

  // 스무스 스크롤 (Lenis CDN이 로드된 경우)
  if (window.Lenis && !reduce && !still) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -90 }); }
      });
    });
  }

  // 줄 단위 리빌: <h1 data-split> 안의 <br>로 줄 구분
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(function (p, i) { return '<span class="split-line"><span style="--l:' + i + '">' + p + '</span></span>'; }).join('');
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('split-in'); }); });
  });

  // 카운트업
  var counters = document.querySelectorAll('[data-count]');
  function fmt(n, d) { return n.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  if (counters.length && 'IntersectionObserver' in window && !reduce && !still) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = parseFloat(el.getAttribute('data-count')), d = (el.getAttribute('data-count').split('.')[1] || '').length, t0 = null;
        (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1400, 1); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), d); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: .4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // 패럴랙스
  var px = document.querySelectorAll('[data-parallax]');
  if (px.length && !reduce && !still) {
    var ticking = false;
    function upd() {
      var vh = window.innerHeight;
      px.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var k = parseFloat(el.getAttribute('data-parallax')) || .12;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

})();
