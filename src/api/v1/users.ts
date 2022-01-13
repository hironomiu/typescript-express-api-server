import { Router } from 'express'

const users = Router()

users.route('/').get(async (req: any, res) => {
  console.log(req.session.userId)
  res.json({ message: 'api/v1/users' })
})

users.route('/:id').get(async (req, res) => {
  console.log(req.params.id)
  res.json({ message: req.params.id })
})

export default users
