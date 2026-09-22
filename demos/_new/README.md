# 2026-09 신규 제작 사이트 모음

`python demos/_build/collect_new.py` 가 만드는 폴더입니다. **여기 있는 HTML 을 직접 고치지 마세요** — 다음 실행 때 덮어씁니다.

## 무엇이 들어 있나
- `index.html` — 16곳 목록(업종별, 첫 화면 캡처, 홈·소개·안내·오시는 길 링크)
- `<사이트>/` — 완성본 사본 8장(index·about·service·contact + notice·notice-view·privacy·404)
- `preview.html` — `preview.html?s=<사이트>` 로 PC·모바일을 나란히 본다
- `compare/` — 레퍼런스와 우리 사이트를 나란히 붙인 검수용 이미지 16장
- `thumbs/` — 목록용 캡처, `assets` — `demos/assets` 로 가는 정션(사진·공용 CSS·JS)
- `sites.json` — 사이트별 상호·업종·레퍼런스·색·이미지팩·지어낸 값 수·옛 사이트 백업 경로

## 보는 법
```
python -m http.server 8787 --bind 127.0.0.1 --directory C:/cmong/demos
```
→ `http://127.0.0.1:8787/_new/index.html`

## 고치는 법 (원본은 여기가 아니다)
| 무엇 | 어디 |
| --- | --- |
| 문구·가격·공지 | `demos/_src/_specs/<사이트>.json` |
| 마크업·CSS | `demos/_build/design/<사이트>.py` |
| 하위 3장 | `demos/_build/design/_sub_<이름>.py` |
| 옛 사이트 | `demos/_legacy/<사이트>-<날짜>/` |

고친 뒤 `python demos/_build/gen2.py <사이트> && python demos/_build/build.py <사이트>` → 검사
(`hero_check.py` · `verify.py` · `lead_check.py` · `label_check.py`) → `python demos/_build/collect_new.py`.

## 주의
- `assets` 는 정션이라 지울 때 안쪽 파일이 같이 지워질 수 있습니다. 폴더를 통째로 옮기거나 지울 때는 정션을 먼저 지우세요
  (`cmd /c rmdir demos\_new\assets`).
- 이 폴더는 `_` 로 시작해 `verify.py`·`gen2.py`·`mkindex.py` 의 사이트 목록에 잡히지 않습니다. 검사는 원본에서 돌립니다.
