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

  // TODO DDLでデータ消去するとテストがタイムアウトする
  // connection.query('truncate table users')

  // トランザクション開始の宣言不要？
  // connection.connect()

  connection.query('delete from users')
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
  resetUsers()

  let app = setUp()
  const response = await supertest(app).get('/api/v1/csrf-token')
  const obj = JSON.parse(response.text)
  const data = response.headers['set-cookie'][0]
  const text = data.split(';')
  cookie = text[0]
  csrfToken = obj.csrfToken
})

describe('POST /api/v1/auth/signup', () => {
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

    console.log('signup:', response.text)
    expect(response.status).toBe(200)
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

    console.log('signup:', response.text)
    expect(response.status).toBe(422)
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
    console.log('signin:' + response.text)
    expect(response.status).toBe(200)
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
    console.log('signin:' + response.text)
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(422)
    expect(obj.message).toBe('emailは必須項目です。')
    expect(obj.isSuccess).toBe(false)
  })
})
