import { Router } from 'express'
import passport from 'passport'

const auth = Router()

// ユーザ登録
auth.post('signup', (req, res, next) => {})

// ログイン
auth.post('/signin', (req: any, res, next) => {
  console.log('post /:', req.session)
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      // infoではなく別途メッセージをレスポンス
      return res.json({ isSuccess: false, message: '認証エラー' })
    }
    // TODO reqに埋め込む値をusersから取得したものに切り替える
    // req.user = 'fuga'
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
