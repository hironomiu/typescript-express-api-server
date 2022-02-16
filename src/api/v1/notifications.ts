import { Router, Request } from 'express'
import { findAll } from '../../models/Notifications'

const notifications = Router()

notifications.route('/').get(async (req: any, res) => {
  const rows = await findAll(req.session.userId)
  console.log(req.session)
  console.log('rows:', rows)

  res.json({
    isSuccess: true,
    message: 'api/v1/notifications',
    data: rows,
  })
})

export default notifications
