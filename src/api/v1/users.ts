import { Router } from 'express'
import promisePool from '../../database'

const users = Router()

users.route('/').get(async (req, res) => {
  res.json({ message: 'api/v1/users' })
})

export default users
