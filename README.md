# typescript-express-passport

TypeScript + Express + Passport + mysql2 での API サーバ

## serve

```
npm run serve
```

## Database & Table & Dummy Data

`taro`のパスワード(平文)は`password`

```
create database express_api;

drop table users;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

insert into users(name,email,password) values('taro','taro@example.com','$2b$10$wFi8RBzI3EpHt6XxqxLdLO41437B8RniV6ytM6NAACNPdFbjPj3je');

```

## Install Memo

### TypeScript

```
npm install -D typescript @types/node ts-node
```

### Packages

```
npm install express mysql2 cors jsonwebtoken cookie-parser csurf express-validator express-session bcrypt

npm install -D @types/express types/mysql2# @types/cors @types/jsonwebtoken @types/cookie-parser @types/csurf @types/express-validator @types/express-session @types/cookie-session @types/bcrypt
```

### passport

```
npm install passport passport-local

npm install -D @types/passport @types/passport-local
```

### TypreScript Initialize

初期化後の設定内容は`tsconfig.json`を参照

```
npx tsc --init
```
