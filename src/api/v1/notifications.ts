import { Router } from 'express'
import { findAll, updateIsConfirmedById } from '../../models/Notifications'

const notifications = Router()

notifications.route('/').get(async (req, res) => {
  if (!req.session.userId) {
    res.json({
      isSuccess: false,
      message: 'access error',
    })
  } else {
    const rows = await findAll(parseInt(req.session.userId))
    console.log(req.session)
    console.log('rows:', rows)

    res.json({
      isSuccess: true,
      message: 'api/v1/notifications',
      data: rows,
    })
  }
})

notifications.route('/').put(async (req, res) => {
  console.log(req.body)
  const rows = await updateIsConfirmedById(req.body.id)

  res.json({
    isSuccess: true,
    message: 'success',
  })
})

export default notifications
