import { Router, Request } from 'express'

const users = Router()

// TODO 実装
users.route('/').get(async (req: Request, res) => {
  console.log(req.session.userId)
  res.json({ isSuccess: true, message: 'api/v1/users' })
})

users.route('/:id').get(async (req, res) => {
  console.log(req.params.id)
  res.json({ isSuccess: true, message: req.params.id })
})

export default users
