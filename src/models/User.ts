import { RowDataPacket, ResultSetHeader } from 'mysql2'
import promisePool from '../database'
import { User, UserAuth } from '../types'

export const findById = async (id: number): Promise<User> => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,nickname,email,created_at,updated_at from users where id = ?',
    [id]
  )

  return rows[0]
}

// passwordを取得するSQLは末尾にAuthを付ける
export const findByEmailAuth = async (email: string): Promise<UserAuth> => {
  const [rows]: [RowDataPacket[number], any] = await promisePool.query(
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
  const ret = await promisePool.query<ResultSetHeader>(
    'insert into users(nickname,email,password) values(?,?,?)',
    [nickname, email, hashPassword]
  )
  return ret
}
