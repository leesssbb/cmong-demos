/* 크몽 포트폴리오 데모 공통 스크립트
 * - 모바일 메뉴 토글: [data-menu-btn] / [data-menu]
 * - 스크롤 등장: .reveal (JS가 켜질 때만 숨김 → 기본은 항상 보임)
 * - 가이드 모드: ?guide=1 → [data-photo] 요소 위에 "교체할 실제 사진" 라벨 표시
 * - 데모 폼: form[data-demo] 제출 시 전송 대신 안내 토스트
 * - 탭: [data-tabs] 안의 [data-tab] 버튼 ↔ [data-panel]
 */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  if (/[?&]full=1/.test(location.search)) doc.classList.add('fullshot');

  // 모바일 메뉴
  document.querySelectorAll('[data-menu-btn]').forEach(function (btn) {
    var menu = document.querySelector(btn.getAttribute('data-menu-btn'));
    if (!menu) return;
    btn.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); });
    });
  });

  // 스크롤 등장
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  var still = params.has('export') || params.has('guide');
  var items = document.querySelectorAll('.reveal');
  if (!reduce && !still && 'IntersectionObserver' in window) {
    doc.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // 가이드 모드
  if (params.has('guide')) {
    var n = 0;
    document.querySelectorAll('[data-photo]').forEach(function (el) {
      n++;
      el.classList.add('guide-slot');
      var tag = document.createElement('span');
      tag.className = 'guide-tag';
      tag.textContent = n + '. ' + el.getAttribute('data-photo');
      el.appendChild(tag);
    });
    var bar = document.createElement('div');
    bar.className = 'guide-bar';
    bar.textContent = '가이드 모드 · 실제 사진 교체 필요 ' + n + '곳 (주소에서 ?guide=1 을 지우면 일반 화면)';
    document.body.appendChild(bar);
  }

  // 데모 폼
  var toast;
  function showToast(msg) {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'demo-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      showToast(f.getAttribute('data-demo') || '데모 페이지라 실제로 전송되지 않습니다.');
      f.reset();
    });
  });

  // 탭
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var btns = wrap.querySelectorAll('[data-tab]');
    function select(key) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-tab') === key;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      wrap.querySelectorAll('[data-panel]').forEach(function (p) {
        if (p.getAttribute('data-panel') === key) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { select(b.getAttribute('data-tab')); }); });
    if (btns[0]) select(btns[0].getAttribute('data-tab'));
  });

  // 연도
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
