import { Router, Request, Response } from 'express'
import { findAll, updateIsConfirmedById } from '../../models/Notifications'
import {
  validator,
  checkNotificationIdIsEmpty,
  checkNotificationIdIsNumber,
} from '../../middlewares/validator'
const notifications = Router()

notifications.get('/', async (req, res) => {
  if (!req.session.userId) {
    res.json({
      isSuccess: false,
      message: 'access error',
    })
  } else {
    const rows = await findAll(parseInt(req.session.userId))
    res.json({
      isSuccess: true,
      message: 'api/v1/notifications',
      data: rows,
    })
  }
})

notifications
  .route('/')
  .put(
    [checkNotificationIdIsEmpty, checkNotificationIdIsNumber],
    validator,
    async (req: Request, res: Response) => {
      try {
        // TODO 存在チェック
        const rows = await updateIsConfirmedById(req.body.id)
        console.log('Success:', rows)
        res.json({
          isSuccess: true,
          message: 'success',
        })
      } catch (error) {
        // TODO ログの出力先
        console.log('Error:', error)
        res.json({
          isSuccess: false,
          message: 'update error',
        })
      }
    }
  )

// TODO 登録の正式実装
notifications.route('/').post(async (req, res) => {
  res.json({
    isSuccess: true,
    message: 'success',
  })
})
export default notifications
