# skkubot

RAG 기반 AI 채팅 봇

# 실행 법

## devcontainer로 열기
- Rebuild and reopen in container
- app 선택

## scrapper 실행 법

- `cd scrapper`
- `node scrapper.js`
- `python3 inverter.py`

## 웹 실행법

### openai key
- .env 파일만들고 안에 OPENAI_API_KEY="my key"

### 포트 연결
- 만약 포트 3000 자동으로 연결 안된다면
  - vscode 터미널 옆에 포트에 3000 추가

### 서버 실행
- npm start
- browser에서 localhost:3000 접속
  
### DB 추가
- vscode에서 scapper 폴더 내부 txt파일을 우클릭-> 상대 경로 추출
- 브라우저 빈칸에 복붙

### 질문하기
- 브라우저 빈칸에 질문 입력하기


### DB 내용 확인
- app 폴더의 chromatest.js 실행(10개만 나옴)

### 주의 사항
- db에 아무것도 없는 상태로 질문하면 오류남
- 컨테이너 자동으로 안꺼지니 수동으로 직접 끄기



### 필요한 기능 컨트롤러 디렉에 넣을 예정