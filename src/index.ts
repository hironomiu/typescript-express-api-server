import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import csrf from 'csurf'
import promisePool from './database'
import { RowDataPacket } from 'mysql2'
import authPassport, { checkAuthentication } from './authPassport'
import session from 'express-session'
import users from './api/v1/users'
import csrfToken from './api/v1/csrfToken'
import auth from './api/v1/auth'

const PORT = 5555
const app = express()
const server = http.createServer(app)

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
    origin: ['http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(cookieParser())

// trust first proxy
app.set('trust proxy', 1)
// TODO dotenv
const isProduction = false
app.use(
  session({
    name: 'session',
    secret: 'yoursecretkeyword',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction },
  })
)

// CSRF sessionの設定後に設定する(先に設定すると'Error: misconfigured csrf'で怒られる)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
  },
})
app.use(csrfProtection)

authPassport(app)

// 仮のリクエスト受付
app.get('/', checkAuthentication, async (req, res) => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select * from users'
  )
  console.log(rows[0])
  res.json({
    message: `hello username is ${rows[0].name}`,
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
  })
})

// ルーティング
app.use(
  '/api/v1',
  (() => {
    const router = express.Router()
    router.use('/users', users)
    router.use('/csrf-token', csrfToken)
    router.use('/auth', auth)
    return router
  })()
)

// サーバリッスン
server.listen(PORT, () => {
  console.log(`express listening on *:${PORT}`)
})
