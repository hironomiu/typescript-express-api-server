import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import authPassport, { checkAuthentication } from './authPassport'
import * as expressSession from 'express-session'
import session from 'express-session'
import expressMySqlSession from 'express-mysql-session'
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  CORS_ALLOWED_ORIGIN,
  PRODUCTION_MODE,
  SESSION_SECRET,
} from './config'
import users from './api/v1/users'
import notifications from './api/v1/notifications'
import csrfToken from './api/v1/csrfToken'
import auth from './api/v1/auth'
import { findById } from './models/User'

export const setUp = () => {
  const app = express()

  const options = {
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  }
  const MySQLStore = expressMySqlSession(expressSession)
  const sessionStore = new MySQLStore(options)

  // POST時にJSONを受ける際に必要
  app.use(express.json())

  // 一旦x-www-form-urlencodedを受け取らない設定にする
  app.use(
    express.urlencoded({
      extended: false,
    })
  )

  // CORS
  app.use(
    cors({
      origin: CORS_ALLOWED_ORIGIN,
      credentials: true,
      optionsSuccessStatus: 200,
    })
  )

  app.use(cookieParser())

  // trust first proxy
  app.set('trust proxy', 1)
  // dev or production
  const isProduction = PRODUCTION_MODE === 'dev' ? false : true
  app.use(
    session({
      name: 'session',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // sessionの格納先をMySQLに設定
      store: sessionStore,
      // localhostではなくhttpsが使える環境の場合はPRODUCTION_MODEを変更しtrueで運用する
      cookie: { secure: isProduction },
    })
  )

  // CSRF sessionの設定後に設定する(先に設定すると'Error: misconfigured csrf'で怒られる)
  app.use(
    csrf({
      cookie: {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none',
      },
    })
  )

  authPassport(app)

  // 仮のリクエスト受付
  app.get('/', checkAuthentication, async (req: any, res) => {
    const row: any = await findById(req.session.userId)
    res.json({
      message: `hello username is ${row.name}`,
      id: row.id,
      name: row.name,
      email: row.email,
    })
  })

  // Routing
  app.use(
    '/api/v1',
    (() => {
      const router = express.Router()
      router.use('/users', users)
      router.use('/notifications', notifications)
      router.use('/csrf-token', csrfToken)
      router.use('/auth', auth)
      return router
    })()
  )

  // setUp を export し return で app を返し server.tsから import しHTTPサーバを起動するのはテストで supertest を利用する際に都度 app を初期化するため
  return app
}
