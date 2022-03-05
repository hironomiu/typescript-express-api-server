import supertest from 'supertest'
import { setUp, sessionStore } from '../src/app'

jest.setTimeout(20 * 1000)

let app = setUp()

afterAll(() => {
  sessionStore.close()
})

describe('', () => {
  it('GET', async () => {
    const response = await supertest(app).get('/api/v1/notifications')
    console.log(response)
  })
})
