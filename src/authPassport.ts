import { Express, NextFunction, Response } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

// TODO MySQLからusersを取得、bcryptでパスワードをハッシュ化する
const User1 = { username: 'taro', password: 'password' }

const authPassport = (app: Express) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, User1.username)
  })

  passport.deserializeUser((user, done) => {
    console.log('deserializeUser')
    done(null, User1.username)
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        if (username !== User1.username) {
          return done(null, { isSuccess: false, message: '認証エラー' })
        } else if (password !== User1.password) {
          return done(null, { isSuccess: false, message: '認証エラー' })
        } else {
          // return done(null, { isSuccess: true, message: '認証成功' })
          return done(null, username)
        }
      }
    )
  )
}

// reqの型は以下では定義できなかった
// interface User {}
// interface AuthenticatedRequest extends Request {
//   user: User
// }
export const checkAuthentication = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // if (req.isAuthenticated()) {
  if (req.session.user) {
    console.log('認証済み')
    next()
  } else {
    res.status(400).json({ isLogin: false })
  }
}
export default authPassport
