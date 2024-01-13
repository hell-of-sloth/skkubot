# skkubot

RAG 기반 AI 채팅 봇

# 서버 실행 법

## 필요한 모듈 다운

- npm install

## 로컬에서 서버 실행

- npm start

# 필요한 기능 컨트롤러 디렉에 넣을 예정

# scrapper 실행 법

## 필요한 라이브러리 설치

- **각 local machine에 맞는 chromedriver 설치**
- `npm install`

## 실행

- `cd scrapper`
- `node scrapper.js`

# AI 실행법

## chromadb 설치
출처: https://github.com/ahmedmusawir/chroma-db-installation-docker/blob/main/README.md

Clone the Chroma repository:
```
git clone https://github.com/chroma-core/chroma
cd chroma
docker-compose up -d --build
```

Test with Docker to ensure the server is running:
```
docker ps
```

You should see `chroma-server-1` running.

## openai key
.env 파일만들고 안에 OPENAI_API_KEY="my key"

## 사용
db에 아무것도 없는 상태로 질문하면 오류남
example.txt, example1.txt, example2.txt
중 하나는 DB에 추가하고 질문하기

