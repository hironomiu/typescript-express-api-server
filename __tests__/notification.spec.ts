import supertest from 'supertest'
import { setUp, sessionStore } from '../src/app'

// jest.setTimeout(20 * 1000)

let csrfToken = ''
let cookie = ''
let app = setUp()
const signInUser = {
  email: 'taro@example.com',
  password: 'password',
}
beforeEach(async () => {
  const response = await supertest(app).get('/api/v1/csrf-token')
  const obj = JSON.parse(response.text)
  const data = response.headers['set-cookie'][0]
  const text = data.split(';')
  cookie = text[0]
  csrfToken = obj.csrfToken
})

afterAll(() => {
  sessionStore.close()
})

describe('notifications', () => {
  it('GET', async () => {
    const signinPostResponse = await supertest(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(signInUser)
    const data = signinPostResponse.headers['set-cookie'][0]
    const text = data.split(';')
    const signIncookie = text[0]

    const response = await supertest(app)
      .get('/api/v1/notifications')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie, signIncookie])
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(obj.isSuccess).toBe(true)
    // console.log(obj)
  })
  it('PUT', () => {
    // TODO 実装
  })
})
