import supertest from 'supertest'
import mysql from 'mysql2'
import { setUp } from '../src/app'
import dotenv from 'dotenv'

jest.setTimeout(20 * 1000)

dotenv.config()

const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
}

const resetUsers = () => {
  const connection = mysql.createConnection(databaseConfig)

  // TODO beforeEachだとDDLでデータ消去するとテストがタイムアウトする
  connection.query('truncate table users')

  // TODO コネクションの生成？トランザクション開始？の宣言不要？
  // connection.connect()

  // connection.query('delete from users')
  connection.query('insert into users(name,email,password) values(?,?,?)', [
    '太郎',
    'taro@example.com',
    '$2b$10$wFi8RBzI3EpHt6XxqxLdLO41437B8RniV6ytM6NAACNPdFbjPj3je',
  ])
  connection.query('insert into users(name,email,password) values(?,?,?)', [
    '花子',
    'hanako@example.com',
    '$2b$10$OaDQnNzHPyS4RKihI3loxuCQPogfuBz5/WYDEtvBpV0B2FTR4l0MW',
  ])
  connection.query('insert into users(name,email,password) values(?,?,?)', [
    'Mike',
    'mike@example.com',
    '$2b$10$migKeKnsy06FXJYlbWlW5eVDplNyvQDDGWmaqSHce88ceT1z3QGwm',
  ])
  connection.end()
}

let csrfToken = ''
let cookie = ''
let app = setUp()

beforeEach(async () => {
  let app = setUp()
  const response = await supertest(app).get('/api/v1/csrf-token')
  const obj = JSON.parse(response.text)
  const data = response.headers['set-cookie'][0]
  const text = data.split(';')
  cookie = text[0]
  csrfToken = obj.csrfToken

  resetUsers()

  console.log('beforeEach called')
})

describe('POST /api/v1/auth/signup', () => {
  // beforeEach(() => {
  // beforeAll(() => {
  //   resetUsers()
  // })

  // afterAll(() => {
  //   resetUsers()
  // })

  it('POST /signup', async () => {
    const user = {
      username: 'test',
      email: 'test@example.com',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)

    const obj = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(obj.isSuccess).toBe(true)
    expect(obj.message).toBe('success')
  })

  it('POST /signup validation Error', async () => {
    const user = {
      username: 'test',
      email: 'test',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)

    const obj = JSON.parse(response.text)
    expect(response.status).toBe(422)
    expect(obj.isSuccess).toBe(false)
    expect(obj.message).toBe('emailのフォーマットではありません。')
  })
})

describe('POST /api/v1/auth/signin', () => {
  it('POST signin', async () => {
    const user = {
      email: 'taro@example.com',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(obj.isSuccess).toBe(true)
    expect(obj.name).toBe('太郎')
    expect(obj.email).toBe('taro@example.com')
  })

  it('POST signin Validation Error', async () => {
    const user = {
      email: '',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(422)
    expect(obj.message).toBe('emailは必須項目です。')
    expect(obj.isSuccess).toBe(false)
  })
})

describe('GET /api/v1/auth/signin', () => {
  it('GET signin', async () => {
    const user = {
      email: 'taro@example.com',
      password: 'password',
    }
    const signinPostResponse = await supertest(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)
    const data = signinPostResponse.headers['set-cookie'][0]
    const text = data.split(';')
    const signIncookie = text[0]

    const response = await supertest(app)
      .get('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie, signIncookie])
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(obj.isSuccess).toBe(true)
    expect(obj.message).toBe('success')
  })
})
