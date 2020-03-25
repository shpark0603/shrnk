# shrnk

MERN stack(MongoDB, Express, React, NodeJS)으로 제작한 url 단축 웹사이트입니다.

회원은 단축 url을 만들고, 불러오고, 업데이트하고, 삭제할 수 있습니다.
비회원 또한 단축 url을 만들 수 있지만, 이는 브라우저의 localStorage에 저장되고, 생성 후 일주일이 지나면 데이터베이스에서 삭제됩니다.

아래와 같은 제삼자 패키지를 사용하였습니다.

1. mongoose ODM을 사용합니다.
2. jsonwebtoken으로 사용자 인증을 합니다.
3. express-validator로 사용자가 입력한 정보를 sanitize합니다.
4. shortid로 기존의 url에 매핑하기 위한 hash string을 만듭니다.
5. bcrypt로 사용자 비밀번호를 hash합니다.
6. cookie-parser로 쿠키를 파싱하여 토큰을 도출합니다.

## Getting Started

아래의 명령어를 입력하여 디펜던시들을 설치합니다.

```
npm install
```

이 프로젝트는 MongoDB를 사용합니다. 프로젝트의 루트 디렉토리에 _.env_ 라는 이름의 파일을 생성하고 아래의 정보를 입력해주세요.

```
# .env

MONGO_URI=YOUR_MONGO_URI
BASE_URL=YOUR_BASE_URL
JWT_SALT=YOUR_JWT_SALT
```

아래와 같은 명령어를 입력하여 nodemon을 구동할 수 있습니다.

```
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Todo

1. 비밀번호 변경 이메일 보내기
2. graphql 도입?
