import supertest from 'supertest'
import { sessionStore, setUp } from '../src/app'

let app = setUp()

beforeEach(() => {})

afterAll(() => {
  sessionStore.close()
})

describe('users', () => {
  it('GET', async () => {
    const response = await supertest(app).get('/api/v1/users')
    const data = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(data.isSuccess).toBe(true)
    console.log(data)
  })
})
