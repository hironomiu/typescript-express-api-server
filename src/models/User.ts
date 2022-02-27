import { RowDataPacket } from 'mysql2'
import promisePool from '../database'

export type User = {
  id: number
  nickname: string
  email: string
  created_at: Date
  updated_at: Date
}

export const findById = async (id: number): Promise<User> => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,nickname,email,created_at,updated_at from users where id = ?',
    [id]
  )

  return rows[0]
}

export type UserAuth = {
  id: number
  nickname: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

// passwordを取得するSQLは末尾にAuthを付ける
export const findByEmailAuth = async (email: string): Promise<UserAuth> => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,nickname,email,password,created_at,updated_at from users where email = ?',
    [email]
  )

  return rows[0]
}

export const createUser = async ({
  nickname,
  email,
  hashPassword,
}: {
  nickname: string
  email: string
  hashPassword: string
}) => {
  // TODO 型について　is not assignable to type 'ResultSetHeader'.
  const ret: any = await promisePool.query(
    'insert into users(nickname,email,password) values(?,?,?)',
    [nickname, email, hashPassword]
  )

  return ret
}
