import { Express, NextFunction, Response } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { findByEmailAuth } from './models/User'
import { UserAuth } from './types'
import { Session } from 'inspector'

const authPassport = (app: Express) => {
  app.use(passport.initialize())
  app.use(passport.session())

  // TODO 呼ばれるタイミングを確認する
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user)
  })

  // TODO 呼ばれるタイミングを確認する
  passport.deserializeUser((user: Express.User, done) => {
    console.log('deserializeUser')
    done(null, user)
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const row: UserAuth = await findByEmailAuth(email)
          const isValid = await new Promise((resolve, reject) =>
            bcrypt.compare(password, row.password, (err, isValid) => {
              resolve(isValid)
            })
          )
          if (!row)
            return done(null, { isSuccess: false, message: '認証エラー' })
          if (email !== row.email) {
            return done(null, { isSuccess: false, message: '認証エラー' })
          } else if (!isValid) {
            return done(null, { isSuccess: false, message: '認証エラー' })
          } else {
            return done(null, {
              isSuccess: true,
              id: row.id,
              nickname: row.nickname,
              email: row.email,
            })
          }
          // DBエラーをキャッチ
        } catch (err) {
          console.log(err)
          return done(null, { isSuccess: false, message: '認証エラー' })
        }
      }
    )
  )
}

// TODO reqの型は以下では定義できなかった
// interface User {}
// interface AuthenticatedRequest extends Request {
//   user: User
// }

export const checkAuthentication = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // TODO req.isAuthenticated()では常にfalseになる理由について
  // if (req.isAuthenticated()) {
  if (req.session.userId) {
    next()
  } else {
    res.status(400).json({ isSuccess: false, message: 'false' })
  }
}
export default authPassport
