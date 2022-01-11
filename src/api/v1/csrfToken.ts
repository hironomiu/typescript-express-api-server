import Router from 'express'
const csrfToken = Router()

csrfToken.get('/', (req, res) => {
  const csrfToken = req.csrfToken()
  res.json({ csrfToken: csrfToken })
})

export default csrfToken
