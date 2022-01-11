import { Express, NextFunction, Response } from 'express'
import { RowDataPacket } from 'mysql2'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import promisePool from './database'

const authPassport = (app: Express) => {
  app.use(passport.initialize())
  app.use(passport.session())

  // TODO 呼ばれるタイミングを確認する
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user)
  })

  // TODO 呼ばれるタイミングを確認する
  // TODO userの型について
  passport.deserializeUser((user: any, done) => {
    console.log('deserializeUser')
    done(null, user)
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        const [rows, fields]: [RowDataPacket[number], any] =
          await promisePool.query(
            'select id,name,password from users where name = ?',
            [username]
          )
        if (!rows)
          return done(null, { isSuccess: false, message: '認証エラー' })
        if (username !== rows[0].name) {
          return done(null, { isSuccess: false, message: '認証エラー' })
        } else if (password !== rows[0].password) {
          return done(null, { isSuccess: false, message: '認証エラー' })
        } else {
          // return done(null, { isSuccess: true, message: '認証成功' })
          return done(null, {
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
          })
        }
        return done(null, { isSuccess: false, message: '認証エラー' })
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
  if (req.session.userId) {
    console.log('認証済み')
    next()
  } else {
    res.status(400).json({ isLogin: false })
  }
}
export default authPassport
