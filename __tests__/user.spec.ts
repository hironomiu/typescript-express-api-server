import supertest from 'supertest'
import { sessionStore, setUp } from '../src/app'

let app = setUp()

afterAll(() => {
  sessionStore.close()
})

describe('users', () => {
  it('', async () => {
    const response = await supertest(app).get('/api/v1/users')
    const data = JSON.parse(response.text)
    console.log(data)
  })
})
