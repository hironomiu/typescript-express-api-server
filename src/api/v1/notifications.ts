import { Router } from 'express'
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

// TODO エラー処理
notifications.route('/').put(
  [checkNotificationIdIsEmpty, checkNotificationIdIsNumber],
  validator,
  // TODO 型
  async (req: any, res: any) => {
    const rows = await updateIsConfirmedById(req.body.id)
    console.log(rows)
    res.json({
      isSuccess: true,
      message: 'success',
    })
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
