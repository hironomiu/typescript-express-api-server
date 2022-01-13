import supertest from 'supertest'
import mysql from 'mysql2'
import { app } from '../src/app'

const resetUsers = async () => {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'express_api',
    port: 3306,
  })
  connection.connect()
  connection.query('truncate table users')
  connection.end()
}

describe('/api/v1/auth', () => {
  let csrfToken = ''
  let cookie = ''

  jest.setTimeout(10 * 1000)

  beforeEach(async () => {
    resetUsers()

    const response = await supertest(app).get('/api/v1/csrf-token')
    const obj = JSON.parse(response.text)
    const data = response.headers['set-cookie'][0]
    const text = data.split(';')
    cookie = text[0]
    console.log(cookie)
    csrfToken = obj.csrfToken
  })
  it('POST /signup', async () => {
    const user = {
      username: 'hoge',
      email: 'hoge@hoge.com',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      // .send(JSON.stringify(user))
      .send(user)

    console.log('response:', response.text)

    expect(response.status).toBe(200)
  })
  it('get signin', async () => {
    const response = await supertest(app).get('/api/v1/auth/signin')
    expect(response.status).toBe(200)
  })
})
