# typescript-express-passport

[![Node.js CI](https://github.com/hironomiu/typescript-express-api-server/actions/workflows/node.js.yml/badge.svg)](https://github.com/hironomiu/typescript-express-api-server/actions/workflows/node.js.yml)

TypeScript + Express + Passport + mysql2 + bcrypt + express-validator + express-session + express-mysql-session + csurf での API サーバ

クライアントは[typescript-react-recoil-api-client](https://github.com/hironomiu/typescript-react-recoil-api-client)

## serve

```
npm run serve
```

## build

`cp .env ./build/.env`で`.env`をコピーしている点に注意

```
npm run build
```

## Testing

`__tests__`配下に`xx.spec.ts`で記述

```
npm test
```

## Database & Table & Dummy Data

[create_database](./sql/create_database.sql)

[crate_table](./sql/create_table.sql)

各ユーザのパスワード(平文)は`password`(bcrypt でハッシュ化済)

[insert_data](./sql/insert_data.sql)

## .env

`./.env`を環境に合わせて設定(以下例)
|変数名|設定値|
|:-|:-|
|SERVER_PORT|アプリが Listen する PORT|
|CORS_ALLOWED_ORIGIN|CORS を許可する URL、スペース区切りで複数可|
|SESSION_SECRET|セッション用のシークレット文字列|
|PRODUCTION_MODE|dev or prod|
|DB_HOST|接続する DB のホスト名|
|DB_USER|接続する DB のユーザ名|
|DB_PASSWORD|接続する DB のパスワード|
|DB_DATABASE|接続する DB の DB 名|
|DB_PORT|接続する DB の PORT|

```
SERVER_PORT=5555
CORS_ALLOWED_ORIGIN='http://localhost:3001 http://localhost:4000'
SESSION_SECRET=yoursecretkeyword
PRODUCTION_MODE=dev
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=mysql
DB_DATABASE=express_api
DB_PORT=3306
```

## Actions

## curl memo

```
curl --request POST \
  --url http://localhost:5555/api/v1/auth/signin \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --header 'CSRF-Token: IJQ0iR69-hur4jIuqAQCX8UQP_5cQwZzCBWA' \
  --cookie '_csrf=4vikgedSjAt6lTfBXKwnx1dH' \
  --data '{"email":"taro@example.com","username":"taro","password":"password"}'
```

## Install Memo

### TypeScript

```
npm install -D typescript @types/node ts-node
```

### Packages

```
npm install express mysql2 cors jsonwebtoken cookie-parser csurf express-validator express-session bcrypt dotenv express-validator morgan

npm install -D @types/express types/mysql2# @types/cors @types/jsonwebtoken @types/cookie-parser @types/csurf @types/express-validator @types/express-session @types/cookie-session @types/bcrypt @types/express-validator @types/morgan
```

### passport

```
npm install passport passport-local

npm install -D @types/passport @types/passport-local
```

### Jest

```
npm install -D jest ts-jest @types/jest supertest @types/supertest
```

### TypreScript Initialize

初期化後の設定内容は`tsconfig.json`を参照

```
npx tsc --init
```

### express-mysql-session

session はローカルのインメモリで管理せず MySQL で管理させる。設定値は`.env`の以下にて設定。作成されるテーブル名は`session`

| 変数名      | 設定値                   |
| :---------- | :----------------------- |
| DB_HOST     | 接続する DB のホスト名   |
| DB_USER     | 接続する DB のユーザ名   |
| DB_PASSWORD | 接続する DB のパスワード |
| DB_DATABASE | 接続する DB の DB 名     |
| DB_PORT     | 接続する DB の PORT      |

```
npm install express-mysql-session
npm install -D @types/express-mysql-session
```
