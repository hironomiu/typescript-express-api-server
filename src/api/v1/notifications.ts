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
    // [
    //   { title: 'test1', notification: 'test1testtest' },
    //   { title: 'test2', notification: 'test2testtest' },
    //   { title: 'test3', notification: 'test3testtest' },
    //   { title: 'test4', notification: 'test4testtest' },
    // ],
  })
})

export default notifications
