# 데모 포트폴리오 사이트 5종 (멀티페이지)

크몽 갤러리·포트폴리오용 가상 브랜드 사이트. 브랜드·후기·수치는 모두 예시, 사진은 AI 생성(Higgsfield 나노바나나 Pro 2K).

## 보는 법
```
python -m http.server 8787 --bind 127.0.0.1 --directory "C:/cmong/demos"
```
- 목록: http://127.0.0.1:8787/
- PC·모바일 나란히: `preview.html?s=<폴더>` (`&wide=1` PC 1420px, `&y=픽셀` 스크롤 위치)
- 캡처용(모션 끔): 페이지 주소 뒤 `?export=1` · 사진 자리 표시: `?guide=1`

## 수정·빌드 (결과 HTML을 직접 고치지 말 것 — 빌드 시 덮어씀)
```
python _build/build.py              # 전체
python _build/build.py cafe-ondo    # 사이트 하나
```
- `_src/<사이트>/site.json` : 상호·메뉴(2단)·게시판 글·치환 변수
- `_src/<사이트>/layout.html` : 헤더·푸터·퀵메뉴 등 공통 틀
- `_src/<사이트>/pages/*.html` : 첫 줄 `<!--{json}-->` 머리말(title, desc, sub 배너, overlay 등) + 본문
- `_src/_shared/` : 404 · 개인정보처리방침 · 공지 목록/상세 (모든 사이트 공통)
- 빌드 결과: 각 사이트 폴더의 `*.html`, `sitemap.xml`, `robots.txt`
- 점검: `_build/check.html` 을 브라우저로 열면 58페이지를 375px로 돌며 가로 넘침·깨진 이미지를 `window.__report`에 기록

## 공통 자산
- `assets/site.css` : 헤더/GNB, 전체화면 메뉴, 서브 비주얼·경로·LNB, 게시판, 푸터, 퀵메뉴, 커튼, 모션 유틸
- `assets/site.js` : 헤더 상태, 전체 메뉴, 프리로더(세션 1회)+페이지 전환, Lenis 스무스 스크롤, 줄 리빌(`data-split`), 카운트업(`data-count`), 패럴랙스(`data-parallax`), 커서(`body.has-cursor`)
- `assets/demo.css`·`demo.js` : 스크롤 리빌(`.reveal`), 탭, 데모 폼 토스트, 가이드 모드
- `assets/img/` : 이미지 생성 기록(jobs.tsv, urls.txt)과 다운로드 스크립트(fetch_imgs.py), 모아보기(sheet.py)

## 페이지 수
카페 11 · 네일 10 · 필라테스 11 · 제조 13 · 치과 13 = 58
