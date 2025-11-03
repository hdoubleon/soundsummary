# soundsummary
# 🎧 강의 녹음 요약 AI (Frontend)

브라우저에서 **실시간 녹음** 혹은 **오디오 파일 업로드**를 통해 강의나 회의 내용을 요약하고, 로컬 폴더에 자동 저장할 수 있는 웹 애플리케이션입니다.  
VSCode 스타일의 사이드바 UI와 탭 시스템을 갖추고 있으며, 로컬 파일 탐색기 및 단축키를 제공합니다.  
구성 파일: `index.html`, `script.js`, `styles.css`  [oai_citation:0‡index.html](sediment://file_000000007fa0720786aa5f92600c3630) [oai_citation:1‡styles.css](sediment://file_0000000076b871fa8a173ffe5daa0353) [oai_citation:2‡script.js](sediment://file_00000000a4d072079719d8255d0dd660)

---

## 🚀 주요 기능

- 🎙 **실시간 녹음 / 파일 업로드**
  - `MediaRecorder`로 브라우저 마이크 녹음
  - 오디오 파일(`.mp3`, `.wav`, `.webm` 등) 다중 업로드 가능
  - 요약 결과는 Markdown → HTML 렌더링

- 💾 **로컬 저장소 연동**
  - **File System Access API**로 실제 디렉토리에 저장  
    예: `summary/자료구조/1주차/summary.html`
  - 녹음, 요약, 화자 구분 데이터(`data.json`) 함께 저장

- 🧭 **탭 기반 인터페이스**
  - 각 요약 결과를 별도 탭으로 열람 가능  
  - 중복 열림 방지 및 탭 자동 전환 지원  [oai_citation:3‡script.js](sediment://file_00000000a4d072079719d8255d0dd660)

- 🗂 **사이드바 / 프로젝트 관리**
  - “요약 기록” & “로컬 디렉토리” 패널 전환
  - 드래그 앤 드롭으로 프로젝트 폴더에 요약 정리  [oai_citation:4‡script.js](sediment://file_00000000a4d072079719d8255d0dd660)

- ⌨️ **단축키**
  - `Ctrl/Cmd + N` : 새 세션 생성  
  - `Ctrl/Cmd + R` : 녹음 시작/중지  [oai_citation:5‡index.html](sediment://file_000000007fa0720786aa5f92600c3630)

