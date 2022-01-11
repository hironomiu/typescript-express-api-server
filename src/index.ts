import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import csrf from 'csurf'
import authPassport, { checkAuthentication } from './authPassport'
import session from 'express-session'
import users from './api/v1/users'
import csrfToken from './api/v1/csrfToken'
import auth from './api/v1/auth'
import './config'
import { PRODUCTION_MODE, SERVER_PORT } from './config'
import { getUser } from './models/User'

console.log(PRODUCTION_MODE)
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
// dev or production
const isProduction = PRODUCTION_MODE === 'dev' ? false : true
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
app.get('/', checkAuthentication, async (req: any, res) => {
  const row: any = await getUser(req.session.userId)
  console.log('row:', row)
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
    router.use('/csrf-token', csrfToken)
    router.use('/auth', auth)
    return router
  })()
)

// Server Listen
server.listen(SERVER_PORT, () => {
  console.log(`express listening on *:${SERVER_PORT}`)
})
