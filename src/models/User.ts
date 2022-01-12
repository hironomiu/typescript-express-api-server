import { RowDataPacket } from 'mysql2'
import promisePool from '../database'

export type User = {
  id: number
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

export const getUser = async (id: number): Promise<User> => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,name,email,created_at,updated_at from users where id = ?',
    [id]
  )

  return rows[0]
}

export type UserAuth = {
  id: number
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

export const getUserAuth = async (email: string): Promise<UserAuth> => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,name,email,password,created_at,updated_at from users where email = ?',
    [email]
  )

  return rows[0]
}

export const createUser = async (
  name: string,
  email: string,
  hashPassword: string
) => {
  // TODO 型について　is not assignable to type 'ResultSetHeader'.
  const ret: any = await promisePool.query(
    'insert into users(name,email,password) values(?,?,?)',
    [name, email, hashPassword]
  )

  return ret
}