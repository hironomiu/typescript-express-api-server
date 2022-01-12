import { Router, Request } from 'express'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { createUser } from '../../models/User'
import { checkAuthentication } from '../../authPassport'

const auth = Router()

// ユーザ登録
auth.post('/signup', async (req: Request, res, next) => {
  try {
    const saltRounds = 10
    const hashPassword: string = await new Promise((resolve, reject) =>
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) reject({ message: 'hashed error', err: err })
        resolve(hash)
      })
    )
    const ret = await createUser(
      req.body.username,
      req.body.email,
      hashPassword
    )
    res.json({ message: 'success', insertId: ret[0].insertId })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'fail' })
  }
})

// ログイン状態確認
auth.get('/signin', checkAuthentication, (req, res) => {
  res.json({ message: 'success' })
})

// ログイン
auth.post('/signin', (req: any, res, next) => {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      // infoではなく別途メッセージをレスポンス
      return res.status(400).json({ isSuccess: false, message: '認証エラー' })
    }
    // TODO ログイン後の状態を持つのに妥当か確認
    req.session.userId = user.id
    req.session.username = user.name
    req.session.email = user.email
    return res.json(user)
  })(req, res, next)
})

// ログアウト
auth.post('/signout', (req: any, res, next) => {
  req.session.user = ''
  res.clearCookie('session')
  res.json({ message: 'signouted' })
})
export default auth
