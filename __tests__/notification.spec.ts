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
  it('PUT error case 1', async () => {
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
      .put('/api/v1/notifications')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie, signIncookie])
      .send({ id: '' })
    const obj = JSON.parse(response.text)
    expect(obj.isSuccess).toBe(false)
    expect(obj.message).toBe('idは必須項目です。')
    // console.log(response.text)
  })
  it('PUT error case 2', async () => {
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
      .put('/api/v1/notifications')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie, signIncookie])
      .send({ id: 'a' })
    const obj = JSON.parse(response.text)
    expect(obj.isSuccess).toBe(false)
    expect(obj.message).toBe('idは数値です。')
    console.log(response.text)
  })
})
