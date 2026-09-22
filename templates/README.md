# templates/ — 디자인 체계

핀터레스트 레퍼런스 670개에서 뽑아 정리한 레이아웃·템플릿·색 체계다.
데모 사이트를 만들 때는 여기서 템플릿 하나를 고르는 것으로 시작한다.

## 열람

서버는 **C:/cmong 루트**로 띄운다. 스튜디오가 `demos/` 사진팩과 `_refs-repo/` 수집 데이터를
읽어야 하기 때문이다. templates 루트로 띄우면 사진과 수집 목록이 빈다.

```
python templates/_build/serve.py
→ http://127.0.0.1:8790/templates/studio.html
```

`python -m http.server 8790 --directory C:/cmong` 로도 열람은 되지만 "작업 시작" 의 주문서 저장이 안 된다.

## 조합 스튜디오 (`studio.html`)

레이아웃·색·폰트·사진을 고르면 iframe 에 `:root` 토큰과 폰트 link 를 주입해 **리로드 없이**
바로 반영한다. 레퍼런스의 색도 클릭 한 번으로 입힌다.

| 컨트롤 | 수 | 비고 |
|---|---|---|
| 레이아웃 | 55 | `‹ ›` 로 순차 이동. "55개 개략도로 고르기" 로 격자 선택 |
| 색 스킴 | 32 | 대비 미달(본문 4.5:1 · 포인트 3:1)이면 경고 |
| 레퍼런스 디자인 | 색 112 · 프로파일 121 | 고르면 색 + 폰트 계열 + 모서리·테두리·그림자·전환·제목 굵기까지 입힌다. 주소를 직접 넣어 분석할 수도 있다. `↗` 는 원본 |
| 폰트 | 한글 38 + 라틴 9 | 분류별 묶음. 라이선스가 항상 보인다 |
| 사진팩 | 30 | |
| 페이지 | 홈·소개·서비스·오시는 길 | 색·폰트·사진이 하위페이지에도 따라간다 |

- 조합은 URL 해시(`#L21,service,R012,...`)에 남아 링크로 공유·북마크된다.
- "스펙 복사" 가 `_specs/<폴더>.json` 에 넣을 조각(layout·tokens·fonts·imagePack)을 클립보드로 준다.
- **주입하는 이미지 경로는 절대경로여야 한다.** iframe 문서(`/templates/blocks/`) 기준으로 풀리기 때문.

## 작업 시작 버튼과 주문서

스튜디오 오른쪽 위 **작업 시작** 을 누르면 지금 고른 조합에 상호·폴더명·사실(주소·전화·시간)·메모를 더해
`demos/_orders/<YYYY-MM-DD-NNN>.json` 으로 저장하고, 채팅창에 붙여넣을 한 줄(`주문 2026-09-20-001 처리해`)을
클립보드에 담는다. 브라우저는 Claude Code 를 직접 깨울 수 없어서 이 한 줄이 방아쇠다.

서버는 `python templates/_build/serve.py` 여야 한다(8790, POST `/_order` 를 받는다).
`python -m http.server` 로 띄우면 저장이 안 되고, 그때는 주문서 전문이 클립보드로 넘어간다.

### 작업 대상
사이드바 맨 위 **작업 대상** 에서 "새 홈페이지 만들기" 나 기존 사이트 29곳 중 하나를 고른다.
목록은 `serve.py` 의 `GET /_sites` 가 `_specs/*.json`·`site.json` 을 그때그때 읽어 준다(사이트를 만들거나 승격하면 바로 반영).
기존 사이트를 고르면 업종 처방과 지금 레이아웃이 자동으로 잡히고, 상단의 **지금 사이트 보기** 로 실제 사이트와
뼈대 미리보기를 오갈 수 있다. **둘은 다른 것이다** — 뼈대는 `blocks/L##.html` 에 색·폰트·킷을 입힌 것이고 실제 사이트는
레퍼런스 실측으로 손수 짠 완성본이라 똑같이 나오지 않는다. 상단 안내 줄이 지금 무엇을 보는지 항상 밝힌다.
실제 사이트에는 **킷과 폰트만** 그 자리에서 입혀 볼 수 있다(색은 사이트마다 변수·명암 구조가 달라 못 입힌다).
주문서는 상호·주소·전화·시간이 미리 채워지고 폴더명은 잠긴다. `mode: "redesign"`, `target: <folder>` 가 붙는다.

### "주문 <id> 처리해" 를 받으면
0. `mode` 가 `redesign` 이면 **원본을 건드리지 않는다.** `<folder>-v2` 로 시안을 만들고, 승인받은 뒤에
   옛 사이트를 `demos/_legacy/<folder>-<날짜>/{src,out}` 로 백업하고 승격한다(cafe-ondo 가 선례).
   승격할 때 `verify.py`·`mkindex.py` 의 `LEGACY`/`PRE_LOGO`, `gallery/reshoot.py` 경로, `lead_check.py` 의 `NEW_SITES` 를 같이 고친다.
   기존 원고(`_specs/<folder>.json`)는 출발점으로 쓰되 규칙 21~26 에 맞게 다듬는다.
> **2026-09-21 개정.** 스튜디오는 **방향 가이드**다. 미리보기에 보이는 모양을 그대로 완성하지 않는다.
> 주문서에서 읽는 것은 업종·상호·사실(주소·전화·시간)·필요한 섹션·톤의 방향·사진팩까지다.
> L코드·킷·토큰·폰트·`reference.profile` 은 "이런 쪽"이라는 참고값이지 설계도가 아니다.

1. `demos/_orders/<id>.json` 을 읽어 업종과 방향을 파악한다.
2. **1차 관문 — 실존 국내 사이트 3곳 추천.** GDWEB 장르별 수상작(`research/gdweb/categories.json` 의 코드로
   `list.asp?Txt_fgbn=5&Txt_bcode1=<코드>`)에서 같은 업종을 찾고, 실제로 열어 본 뒤 3곳을 고른다.
   각 후보마다 원본 주소 · 캡처 · 어떤 점이 맞는지 · 옮길 때 바꿀 점을 적는다. 사용자가 1곳을 고를 때까지 멈춘다.
   주문서에 `reference` 가 있으면 그것도 후보에 넣되, 같은 업종의 국내 사이트가 우선이다.
3. **실측.** 고른 사이트를 Playwright 로 열어 섹션 순서, 타이포 스케일, 컨테이너 폭·여백, 색,
   버튼·카드·내비·폼·호버의 실제 CSS(computed style)를 잰다. 데스크톱과 모바일 둘 다. 캡처를 `research/gdweb/<이름>/` 에 남긴다.
4. `_specs/<folder>.json` 을 쓴다. 비어 있는 값은 현실적인 가상 값으로 채우고 **무엇을 지어냈는지 보고한다.** 원고는 `tone-guide.md`.
5. `design/<folder>.py` — **이미지만 빼고 디자인은 최대한 동일하게** 다시 짠다(소스 코드·문구·로고·이미지는 가져오지 않는다).
   UI/UX 는 살짝 바꾼다: 업종 필수 요소(학원 등록번호·교습비, 의료 비급여 등), 오시는 길·푸터 사업자 정보, 접근성.
   버튼·카드 같은 컴포넌트는 그 레퍼런스의 것을 재현하고, 변형이 필요하면 21st.dev Magic 에서 찾는다. 킷으로 일괄 통일하지 않는다.
   작성 전 `design-taste-frontend`·`awesome-design-html`, 빌드 후 `web-design-guidelines` 감사.
6. index 시안까지만 빌드하고 **레퍼런스와 나란히 놓은 비교 캡처** + 미리보기 링크 2개를 보고한다(2차 관문). `status` 를 `draft` 로.
7. 승인받으면 하위페이지 → humanize-korean → 검사 6종(`hero_check`·`verify`·`tone`·`lead_check`·`label_check`·`check.html`) → `done`.

## UI 킷 · 업종 처방 (`ui.html`)

킷 **14종**이 **모양·밀도·구조·호버**를 바꾼다 — 모서리·그림자·테두리·버튼 형태·섹션 여백·격자 열수.
근거는 수상작 **121개 사이트 CSS 실측**(radius·shadow·border·transition·uppercase 분포).

2차로 6종을 더한 이유는 실측과 대조해 빈 축이 보여서다 — 그림자(실측 90%인데 킷은 3/8),
4열·비대칭 격자 없음, radius 3px·5px 미사용, **호버가 8종 전부 같은 translateY**.
지금은 호버가 5종(들림·확대·밑줄·어두워짐·없음)이고 격자는 1·2·3·4열 + 비대칭(첫 항목 2칸)이다.

**킷 하나에 업종이 몰리면 안 된다.** 처음엔 매칭 안 된 업종 10개가 전부 K02 로 떨어져 다시
단조로워졌다. 지금은 업종 성격별로 기본값을 나눠 14종이 전부 쓰이고 최다 킷이 7건이다.
킷의 `best` 목록에 같은 업종을 두 번 넣지 말 것 — 앞선 킷이 먼저 잡아 뒤 킷이 영영 안 쓰인다.

- 블록 220장이 Tailwind 유틸리티를 인라인으로 쓴다. 마크업을 고치면 220장을 다시 만들어야 하므로
  킷은 CSS 한 장을 얹는 방식이다. 그래서 **`!important` 가 필수**다.
- 구조 규칙은 `@media(min-width:768px)` 안에 있다. 좁은 미리보기에선 안 걸리므로
  보드는 900px 로 렌더한 뒤 `transform:scale()` 로 축소해 보여준다.
- 스튜디오에서 **업종을 고르면 처방(킷·모션·안티패턴)이 자동 적용**되고, 킷 select 로 덮어쓸 수 있다.

### 외국 처방을 그대로 옮기지 말 것
`ui-reasoning.csv` 는 미국 기준이라 의료 업종에 **후기를 넣으라**고 조언한다.
한국에서는 **의료법 56조 위반**이다. `CONFLICT` 정규식으로 그 조각을 떼고, 뗀 이유를 처방 표에 남긴다.

### 데모에 적용하기
`kit.layout(..., ui_kit="K02")` 한 줄이면 `<html data-uikit="K02">` + `assets/ui-kits.css` 가 붙는다.
데모는 Tailwind 가 아니라 사이트별 손수 쓴 CSS 지만 명명 규칙이 일관돼서 접미사를 훅으로 쓸 수 있다
(25개 전수: `-btn` 25/25 · `-sec` 25/25 · `-h2` 25/25 · `-list` 24/25 · `-cards` 17/25).

**기존 24개에는 일부러 안 걸었다.** 각자 특정 레퍼런스의 실측을 재현한 것이라 일반 킷을 덮으면
그 차별화가 지워진다. 실제로 재보니 radius 가 0px~999px, 그림자 0~11개로 이미 충분히 갈려 있다.
단조로운 건 스튜디오 블록이지 데모가 아니다. 새 사이트에서 출발점으로 쓰라고 만든 장치다.

### 단조로움의 출처
실측상 **79%가 uppercase 라벨**을 쓰지만 우리 기준은 영문 라벨을 억제한다.
억제는 유지하되 그 차이를 모서리·밀도·구조로 만든다.

## 레퍼런스 디자인 반영 (2026-09-20)

스튜디오에서 레퍼런스를 고르면 색만이 아니라 **디자인 프로파일**까지 입는다. 체크박스 '디자인까지 반영'(기본 켜짐)으로 끈다.

- 측정: `_refs-repo/collect/refprofile.py` 가 단일 출처. CSS 에서 가장 자주 나온 값을 잰다.
  `fonts{headRaw,bodyRaw,headClass,bodyClass}` · `radius` · `pill` · `border` · `thick` · `shadow`(+`shadowCss`) ·
  `dur` · `ease` · `headWeight` · `headLs` · `upper` · `n`(표본 수. 작으면 믿지 말 것).
  `font-family:var(--font-serif)` 같은 변수는 풀어서 읽는다(Tailwind 사이트가 이걸로 통째로 빠졌었다).
- 폰트: 레퍼런스 폰트는 대부분 유료·한글 없음 → **계열만 재서** 한글 폰트로 옮긴다. 표는 `studio.html` 의 `KRFONT` 한 곳.
  세리프=Noto Serif KR/Maru Buri · 그로테스크=Pretendard · 지오메트릭=SUIT · 둥근=Gowun Dodum · 좁은=Gmarket Sans(제목만).
  레퍼런스가 이미 우리 목록의 한글 폰트를 쓰면 그대로 쓴다. 고른 뒤 폰트 select 로 덮어쓸 수 있다(사용자가 이긴다).
- 킷과의 관계: 레퍼런스 CSS 를 **킷 뒤에** 주입한다. 모양(모서리·테두리·그림자·전환)은 레퍼런스가, 밀도·열 수는 킷이 정한다.
- 주소 직접 넣기: `POST /_ref {"url"}` → `collect.analyze` 로 그 자리에서 분석 → `data/ref_user.json` 에 쌓인다(목록 맨 위 '직접').
  사이트가 봇을 막거나 CSS 에 색이 3개 미만이면 실패한다. 내부 주소는 거부한다.
- 배경 판정: `palette.bg_hint` 가 body·html 배경 선언을 먼저 본다(선언 없으면 흰색을 약한 근거로). 그래도 틀리면
  스튜디오의 **명암 뒤집기**. 주문서에 `reference.flipped` 로 남는다.
- **주문 처리 때**: `applyDesign` 이 참이면 `design/<folder>.py` 의 `:root` 에 `--radius`·`--bd`·`--ez`·`--dur` 를 profile 값으로 두고,
  버튼(pill)·카드 테두리(thick)·그림자(shadowCss)·제목 굵기/자간을 그대로 쓴다. `uiKit` 과 부딪히면 모양은 profile 이 이긴다.
  profile 에 없는 것(호버 방식·여백 리듬·사진 처리·질감)은 `captured/<id>` 나 원본 주소를 직접 열어 보고 옮긴다.
  접근성(대비·포커스)과 한국 관습(GNB·푸터·오시는 길)은 여전히 레퍼런스보다 위다.

## 생성기

```
python _build/blocks.py        # layouts.json → blocks/L##.html (홈 55장)
python _build/subpages.py      # → blocks/L##-{about,service,contact}.html (165장)
python _build/ref_palettes.py  # captured CSS → data/ref_palettes.json (122중 112 성공)
python _build/ref_profiles.py  # captured CSS → data/ref_profiles.json (디자인 프로파일 121개)
python _build/fonts.py         # → data/fonts.json (CSS URL 검증 포함)
python _build/ui_kits.py       # → data/ui_kits.json · ui_rx.json (실측 121개 기반)
```

### 하위페이지
섹션은 **그 레이아웃이 이미 쓰는 것을 우선** 고른다(L21 서비스=menu-list, L09=product-grid).
그래야 하위페이지가 홈과 따로 놀지 않는다. 페이지별 섹션은 `data/subpages.json` 에 남는다.

### 개략도 (`wire.js`)
섹션 이름이 130종이라 개별로 못 그린다. 이름 규칙으로 18개 형태군에 넣는다(`kind()`).
새 섹션 이름은 기존 접미사(`*-grid`·`*-list`·`*-table`·`*-form`·`cards-N`)에 맞출 것.
안 맞으면 밋밋한 띠로 떨어진다. 히어로는 `hero` 필드 11종으로 갈린다.

### 팔레트
`refs.json` 의 colors 는 손기록이라 147중 48개만 쓸 만해서 캡처 CSS 에서 직접 뽑는다.
빈도·밝기 휴리스틱이라 **포인트색이 가끔 틀린다.** 눈으로 보고 아니면 색 스킴 32종을 쓴다.

### 폰트
구글 한글 폰트는 19종이 천장이라 나머지 17종은 jsdelivr CDN(Pretendard·SUIT·Maru Buri 등).
**CSS URL 이 200 + `@font-face` 여야 담는다** — 죽은 폰트를 목록에 남기지 않는다.
**궁서체 금지**: 붓글씨·필기는 `BRUSH` 정규식, 빠져나가는 장식 과다는 `BLOCK` 이름표.
라이선스는 스튜디오에 항상 노출된다. **'무료'와 '제한 없음'은 다르다** —
고객 사이트에 쓰기 전 출처 표기 의무·재판매 금지 조건을 확인할 것.

- `boards/layouts.html` — 레이아웃 55종. 자체 렌더 SVG 와이어프레임, 히어로·밀도·업종 필터, 근거 핀 링크.
- `boards/templates.html` — 템플릿 65종. 색 스킴이 적용된 실제 축소 미리보기(iframe), 업종·이미지팩 필터.
- `boards/colors.html` — 색 스킴 32종. HEX 클릭 복사, 대비비, 다크모드 대응.
- `blocks/L##.html` — 레이아웃 블록 실물. `?cs=CS07` 을 붙이면 색 스킴이 바뀐다.
- `preview/T##.html` — 템플릿 전체 보기.

## 폴더

| 경로 | 내용 |
|---|---|
| `data/layouts.json` | 레이아웃 55종. hero·nav·grid·sections·density·seen·refs |
| `data/templates.json` | 템플릿 65종. layout + colorScheme + type + components + imagePack |
| `data/color_schemes.json` | 색 스킴 32종. bg/surface/ink/mute/line/accent + darkMode + contrast |
| `data/images.json` | 업종별 이미지팩 대장(검색어, 사용한 사진 출처) |
| `data/image_sources.json` | 무료 이미지 출처 10곳 라이선스 조사 결과 |
| `data/_build_*.py` | 위 JSON 생성 스크립트 |
| `_build/blocks.py` | layouts.json → blocks/L##.html |
| `_build/boards.py` | 보드 3종 + 허브 + preview/T##.html |
| `_build/packs.py` | 이미지팩 폴더·대장·pack.css 생성 |
| `_build/fetch_packs.py` | 수집한 Unsplash 픽을 내려받아 팩을 채움 |

다시 만들 때는 `data/_build_colors.py` → `data/_build_layouts.py` → `data/_build_templates.py`
→ `_build/blocks.py` → `_build/packs.py` → `_build/boards.py` 순으로 돌린다.

## 이미지팩 교체 (업종에 따라 사진만 바꾸기)

현재 팩 30종이 전부 채워져 있다(Unsplash 240장, 팩당 8장). 대장은 `data/images.json`.

1. 사진은 `demos/assets/img/packs/<pack>/` 에 넣고, 같은 폴더의 `picks.json` 에
   `[{"file":"1-xxxx.jpg","source":"Unsplash","author":"...","license":"Unsplash License","pageUrl":"..."}]` 형태로 출처를 적는다.
2. `python templates/_build/packs.py` 를 돌리면 `pack.css` 가 만들어진다(`.ph-1 … .ph-N` 에 배경 이미지).
3. 사이트의 `demos/_src/<site>/site.json` 에서 **`imagePack` 값 하나만** 바꾸고 다시 빌드하면
   `layout.html` 이 링크하는 pack.css 가 바뀌어 그 사이트 사진이 통째로 교체된다.
4. 팩에 사진이 없으면 pack.css 가 없으므로 기본 톤 그라디언트가 그대로 보인다. 빌드는 깨지지 않는다.

새로 모을 때: Aside 로 `unsplash.com/s/photos/<검색어>` 를 열어 `figure` 에서 `photo-...` id 와 작가를 긁고
(유료인 Unsplash+ / @gettyimages 는 반드시 걸러낸다) `research/raw/unsplash_picks.json` 으로 저장한 뒤
`python templates/_build/fetch_packs.py` → `python templates/_build/packs.py` 순으로 돌린다.

**주의**: `pack.css` 링크는 페이지의 인라인 `<style>` **뒤에** 와야 한다. 앞에 두면 `.ph` 의
`background` 단축 속성이 배경 이미지를 지워서 사진이 한 장도 안 보인다(실제로 한 번 겪었다).

출처는 `data/image_sources.json` 에서 `verdict == "use"` 인 곳(Unsplash, Pexels, Burst)만 쓴다.
나머지는 상업적 이용 조건이 모호하거나 라이선스 페이지 확인에 실패해 쓰지 않는다.

## 저작권

- 수집한 핀 이미지는 `research/pinterest/img/` 에 분석용으로만 둔다. 보드·템플릿·완성 사이트 어디에도 게시하지 않는다.
- 보드에는 **핀 링크만** 건다. 카드에 보이는 와이어프레임은 직접 그린 SVG다.
- 레이아웃 하나마다 근거 핀 id 를 2개 이상 적어 두었다. 특정 작품을 베낀 것이 아니라
  여러 핀에서 반복 관찰된 구조를 추상화했다는 기록이다.
- 서체는 상업용 무료만 쓴다(Pretendard, Noto Sans KR, 나눔스퀘어네오, Geist).
  CLAUDE.md 금지 서체(Fraunces, Instrument Serif)는 쓰지 않는다.
