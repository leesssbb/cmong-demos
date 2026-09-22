/* 공용 모션 로더 — Motion One(CDN) 위에서 도는 최소 패턴 3개.
   Design read: CLAUDE.md '모션 기준' + ~/.claude/skills/animate/references/easing-and-timing.md

   kit.layout(motion=True) 인 사이트에만 붙는다. 사이트 고유 모션은
   design/<site>.py 가 자기 인라인 <script type="module"> 로 따로 쓴다.

   규칙(절제):
     - 기본은 Subtle 티어. 페이지당 Bold 1개 이하.
     - prefers-reduced-motion 이면 라이브러리를 아예 안 받아온다.
     - 초기 숨김은 .js-motion 이 붙은 뒤에만 걸린다(JS 없으면 그냥 다 보임).

   마크업 계약:
     [data-mo-reveal]          진입 시 페이드+상승. data-mo-reveal="24" 로 거리(px) 조절.
     [data-mo-stagger]  자식들을 차례로. data-mo-stagger="60" 으로 간격(ms).
     [data-mo-parallax]        스크롤에 따라 y 이동. data-mo-parallax="120" 으로 폭(px).
*/
var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
// head 의 인라인 스크립트가 js-motion 을 안 달았으면(캡처 모드 ?export=1·?guide=1, reduce 설정)
// 여기서도 아무것도 하지 않는다. 숨긴 적이 없으니 드러낼 것도 없다.
var ARMED = document.documentElement.classList.contains('js-motion');

if (!REDUCE && ARMED) {
  import('https://cdn.jsdelivr.net/npm/motion@13/+esm').then(function (M) {
    var animate = M.animate, inView = M.inView, scroll = M.scroll;
    // head 의 안전망에게 "내가 살아 있다"고 알린다. 이게 없으면 1.8초 뒤 숨김이 풀린다.
    window.__moReady = 1;
    // 이미 안전망이 돌아 내용이 드러났으면 진입 연출은 건너뛴다(드러난 걸 다시 숨겼다 켜면 깜빡인다).
    if (window.__moFallback) { parallax(); return; }

    // 진입 이징·수치는 ui-ux-pro-max motion.csv 'Scroll Reveal / Subtle' 을 따른다.
    //   y 8~16px · 300~400ms · power1.out  (GSAP power1.out ≈ 아래 베지어)
    //   y 를 크게 주면 페이드가 아니라 '슬라이드'로 읽혀서 AI 티가 난다.
    var OUT = [0.25, 0.46, 0.45, 0.94];

    inView('[data-mo-reveal]', function (el) {
      var d = parseFloat(el.dataset.moReveal) || 12;
      animate(el, { opacity: [0, 1], transform: ['translateY(' + d + 'px)', 'none'] },
              { duration: 0.35, easing: OUT });
      return function () {};   // 한 번만. 되돌아올 때 다시 숨기지 않는다.
    }, { margin: '0px 0px -12% 0px' });

    inView('[data-mo-stagger]', function (el) {
      var gap = (parseFloat(el.dataset.moStagger) || 60) / 1000;
      var kids = Array.prototype.slice.call(el.children);
      // 9번째부터는 마지막 항목이 굼떠 보인다(motion.csv Don't). 지연을 더 주지 않는다.
      kids.forEach(function (k, i) {
        animate(k, { opacity: [0, 1], transform: ['translateY(12px)', 'none'] },
                { duration: 0.35, delay: Math.min(i, 7) * gap, easing: OUT });
      });
      return function () {};
    }, { margin: '0px 0px -12% 0px' });

    // 패럴랙스는 Bold 티어. 히어로 한 곳에만 쓴다. 안전망이 돌았어도 이건 그대로 건다.
    function parallax() {
      document.querySelectorAll('[data-mo-parallax]').forEach(function (el) {
        var d = parseFloat(el.dataset.moParallax) || 120;
        scroll(animate(el, { transform: ['translateY(0px)', 'translateY(' + d + 'px)'] },
                       { easing: 'linear' }),
               { target: el.closest('section') || el, offset: ['start end', 'end start'] });
      });
    }
    parallax();
  }).catch(function () {
    // CDN 이 죽어도 페이지는 멀쩡해야 한다. 숨겨둔 것만 도로 보이게.
    document.documentElement.classList.remove('js-motion');
  });
}
