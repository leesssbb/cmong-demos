/* 레이아웃 개략도 — layouts.json 의 sections 배열을 SVG 와이어프레임으로 그린다.
   Design read: design-taste-frontend — 장식 없음. 도형은 currentColor + 투명도만 쓴다.

   섹션 이름이 130종이라 하나씩 그릴 수 없다. 이름 규칙으로 형태군에 넣고,
   그 군의 모양을 그린다. 규칙에 안 걸리면 밋밋한 띠로 떨어진다(틀린 그림보다 낫다).

   좌표계는 viewBox "0 0 100 H". 가로 100 중 양옆 8 을 여백으로 두고 84 를 쓴다.
*/
const M = 8, W = 84;                       // 여백 / 내용 폭

const r = (x, y, w, h, o = .16, rx = 1) =>
  `<rect x="${+x.toFixed(2)}" y="${+y.toFixed(2)}" width="${+w.toFixed(2)}" ` +
  `height="${+h.toFixed(2)}" rx="${rx}" fill="currentColor" opacity="${o}"/>`;

const line = (y, w = W, o = .3, h = 1.4) => r(M, y, w, h, o);

/** 이름 → 형태군. 앞쪽 규칙이 이긴다. */
export function kind(n) {
  if (/^hero/.test(n)) return 'hero';
  if (/(^|-)(cards?|catalog|business|signature|triple)-?\d?$/.test(n)) return 'cards';
  if (/masonry/.test(n)) return 'masonry';
  if (/grid$|cards$/.test(n)) return 'grid';
  if (/table$/.test(n)) return 'table';
  if (/form$|calendar-picker/.test(n)) return 'form';
  if (/^zigzag|split$|-2col$|feature-split|fixed-left|scroll-right/.test(n)) return 'split';
  if (/timeline|iso-diagram|org-chart/.test(n)) return 'timeline';
  if (/stat|kpi|chart-band|trust-band/.test(n)) return 'stats';
  if (/cta|newsletter|promo|recruit-band/.test(n)) return 'cta';
  if (/accordion|faq/.test(n)) return 'accordion';
  if (/sidebar|toc/.test(n)) return 'sidebar';
  if (/map|transit/.test(n)) return 'map';
  if (/logos?|logo-wall|brand-row|category-(row|rail|tabs)|quick-menu|board-tabs|pagination|search-row|filter-row|strip$/.test(n)) return 'pills';
  if (/list$|-col$|rail$/.test(n)) return 'list';
  if (/intro|quote|article|about-1col|lightbox|compare-slider|fullscreen/.test(n)) return 'text';
  if (/^footer/.test(n)) return 'footer';
  return 'band';
}

/** 형태군별 높이 */
const H = {
  hero: 30, cards: 20, grid: 24, masonry: 24, table: 20, form: 22, split: 22,
  timeline: 14, stats: 12, cta: 14, accordion: 18, sidebar: 22, map: 20,
  pills: 8, list: 20, text: 14, footer: 9, band: 12,
};

/** 히어로는 layouts.json 의 hero 필드로 모양이 갈린다. */
function hero(y, h, variant) {
  const b = [];
  const half = W / 2 - 1.5;
  switch (variant) {
    case 'split-5050':
      b.push(r(M, y, half, h, .1), r(M + half + 3, y, half, h, .26));
      b.push(line(y + h * .38, half * .8, .42, 2.6), line(y + h * .58, half * .55, .26));
      break;
    case 'type-only':
      b.push(line(y + h * .32, W * .9, .42, 3.4), line(y + h * .5, W * .62, .42, 3.4),
             line(y + h * .7, W * .4, .22));
      break;
    case 'slider':
      b.push(r(M, y, W, h, .18));
      b.push(r(M + W / 2 - 7, y + h - 4, 4, 1.4, .5), r(M + W / 2 - 1.5, y + h - 4, 4, 1.4, .24),
             r(M + W / 2 + 4, y + h - 4, 4, 1.4, .24));
      b.push(line(y + h * .45, W * .45, .42, 3));
      break;
    case 'offset-asymmetric':
      b.push(r(M + W * .3, y, W * .7, h, .2));
      b.push(r(M, y + h * .3, W * .42, h * .5, .34, 1));
      break;
    case 'dark-gradient':
      b.push(r(M, y, W, h, .34));
      b.push(line(y + h * .5, W * .5, .5, 3), line(y + h * .68, W * .34, .3));
      break;
    case 'stat-hero':
      b.push(line(y + h * .22, W * .7, .42, 3.2));
      b.push(...[0, 1, 2].map(i => r(M + i * (W / 3), y + h * .58, W / 3 - 3, h * .34, .2)));
      break;
    case 'product-shelf':
      b.push(line(y + h * .18, W * .5, .42, 3));
      b.push(...[0, 1, 2, 3].map(i => r(M + i * (W / 4), y + h * .42, W / 4 - 2.5, h * .5, .2)));
      break;
    case 'hero-search':
      b.push(r(M, y, W, h, .14));
      b.push(line(y + h * .34, W * .55, .42, 3));
      b.push(r(M + W * .1, y + h * .58, W * .6, 4.5, .34, 2.2));
      break;
    case 'map':
      b.push(r(M, y, W, h, .14));
      b.push(`<circle cx="${M + W / 2}" cy="${y + h / 2}" r="3" fill="currentColor" opacity=".45"/>`);
      break;
    case 'video':
      b.push(r(M, y, W, h, .24));
      b.push(`<path d="M${M + W / 2 - 2} ${y + h / 2 - 3} L${M + W / 2 + 3.5} ${y + h / 2} L${M + W / 2 - 2} ${y + h / 2 + 3} Z" fill="currentColor" opacity=".5"/>`);
      break;
    default:                                   // fullbleed-image
      b.push(r(M, y, W, h, .2));
      b.push(line(y + h * .56, W * .55, .5, 3.2), line(y + h * .74, W * .33, .3));
  }
  return b.join('');
}

function body(y, h, k, name) {
  const b = [];
  const head = () => b.push(line(y + 2, W * .3, .38, 2.2));
  const cols = m => (W - (m - 1) * 3) / m;
  const n = (name.match(/-(\d)$/) || [])[1];

  switch (k) {
    case 'cards': {
      head();
      const m = +n || 3, w = cols(m);
      for (let i = 0; i < m; i++) b.push(r(M + i * (w + 3), y + 7, w, h - 9, .17));
      break;
    }
    case 'grid': {
      head();
      const w = cols(3), ch = (h - 10) / 2 - 1.5;
      for (let i = 0; i < 6; i++)
        b.push(r(M + (i % 3) * (w + 3), y + 7 + Math.floor(i / 3) * (ch + 3), w, ch, .17));
      break;
    }
    case 'masonry': {
      head();
      const w = cols(3);
      b.push(r(M, y + 7, w, h - 9, .17), r(M + w + 3, y + 7, w, (h - 9) * .55, .17),
             r(M + w + 3, y + 7 + (h - 9) * .6, w, (h - 9) * .4, .17),
             r(M + 2 * (w + 3), y + 7, w, (h - 9) * .42, .17),
             r(M + 2 * (w + 3), y + 7 + (h - 9) * .47, w, (h - 9) * .53, .17));
      break;
    }
    case 'table':
      head();
      b.push(r(M, y + 7, W, 3.4, .26));
      for (let i = 0; i < 3; i++) b.push(line(y + 12.5 + i * 3.4, W, .14, 2.4));
      break;
    case 'form':
      head();
      for (let i = 0; i < 3; i++) {
        b.push(line(y + 7.5 + i * 4.4, W * .16, .3, 1.6));
        b.push(r(M + W * .2, y + 7 + i * 4.4, W * .8, 3, .14));
      }
      b.push(r(M + W * .2, y + h - 5, W * .22, 4, .36, 1.4));
      break;
    case 'split':
      b.push(r(M, y + 1, W * .46, h - 3, .2));
      b.push(line(y + h * .34, W * .38, .38, 2.4), line(y + h * .52, W * .44, .16));
      // 두 번째 줄은 좌우를 뒤집어 지그재그임을 보인다
      break;
    case 'timeline':
      b.push(r(M, y + h / 2, W, 1, .2));
      for (let i = 0; i < 4; i++)
        b.push(`<circle cx="${M + 4 + i * ((W - 8) / 3)}" cy="${y + h / 2 + .5}" r="2" fill="currentColor" opacity=".38"/>`);
      break;
    case 'stats': {
      const w = cols(4);
      for (let i = 0; i < 4; i++) {
        b.push(line(y + 3, 0, 0));
        b.push(r(M + i * (w + 3), y + 2.5, w * .55, 4, .4, 1));
        b.push(r(M + i * (w + 3), y + 8, w * .8, 1.6, .18));
      }
      break;
    }
    case 'cta':
      b.push(r(M, y, W, h - 2, .1));
      b.push(r(M + W * .22, y + 3.5, W * .56, 2.6, .34, 1));
      b.push(r(M + W * .38, y + 8.5, W * .24, 4, .42, 1.6));
      break;
    case 'accordion':
      head();
      for (let i = 0; i < 3; i++) {
        b.push(r(M, y + 7 + i * 4, W, 3, .12));
        b.push(r(M + W - 4, y + 8.2, 1.6, 1.6, .34, .6));
      }
      break;
    case 'sidebar':
      b.push(r(M, y + 1, W * .26, h - 3, .14));
      head();
      for (let i = 0; i < 4; i++) b.push(line(y + 7 + i * 3.6, 0, 0));
      for (let i = 0; i < 4; i++) b.push(r(M + W * .3, y + 4 + i * 4.2, W * .7, 3, .16));
      break;
    case 'map':
      b.push(r(M, y + 1, W, h - 3, .12));
      b.push(`<circle cx="${M + W * .42}" cy="${y + h / 2}" r="2.6" fill="currentColor" opacity=".42"/>`);
      b.push(r(M + W * .62, y + h / 2 - 4, W * .3, 8, .18));
      break;
    case 'pills': {
      const w = (W - 5 * 2.5) / 6;
      for (let i = 0; i < 6; i++) b.push(r(M + i * (w + 2.5), y + 2, w, 4, .18, 2));
      break;
    }
    case 'list':
      head();
      for (let i = 0; i < 4; i++) {
        b.push(r(M, y + 7.5 + i * 3.4, W * .42, 1.8, .26));
        b.push(r(M + W * .84, y + 7.5 + i * 3.4, W * .16, 1.8, .16));
      }
      break;
    case 'text':
      b.push(line(y + 3, W * .78, .3, 2), line(y + 6.6, W * .9, .18),
             line(y + 9.4, W * .62, .18));
      break;
    case 'footer':
      b.push(r(M, y, W, h - 1, .1));
      b.push(line(y + 2.5, W * .2, .28), line(y + 5.5, W * .34, .14));
      break;
    default:
      b.push(r(M, y + 2, W, h - 5, .1));
      b.push(line(y + 4, W * .28, .24));
  }
  return b.join('');
}

/**
 * @param {{sections:string[], hero?:string}} L  layouts.json 의 한 항목
 * @param {{w?:number}} o
 * @returns {string} inline SVG
 */
export function wire(L, o = {}) {
  const secs = L.sections || [];
  let y = 2, out = '';
  let zig = 0;
  secs.forEach(s => {
    const k = kind(s);
    const h = H[k] || H.band;
    if (k === 'hero') out += hero(y, h, L.hero || 'fullbleed-image');
    else if (k === 'split') {
      // 지그재그는 줄마다 좌우를 바꾼다
      const flip = zig++ % 2 === 1;
      const imgX = flip ? M + W * .54 : M;
      const txtX = flip ? M : M + W * .54;
      out += r(imgX, y + 1, W * .46, h - 3, .2);
      out += r(txtX, y + h * .32, W * .38, 2.4, .38);
      out += r(txtX, y + h * .48, W * .42, 1.6, .16);
    } else out += body(y, h, k, s);
    y += h + 2.5;
  });
  const H2 = y;
  const w = o.w || 100;
  return `<svg class="wire" viewBox="0 0 100 ${H2.toFixed(1)}" width="${w}" ` +
    `preserveAspectRatio="xMidYMin meet" role="img" ` +
    `aria-label="${secs.join(', ')} 순서의 레이아웃 개략도">` +
    `<rect width="100" height="${H2.toFixed(1)}" fill="currentColor" opacity=".03"/>${out}</svg>`;
}
