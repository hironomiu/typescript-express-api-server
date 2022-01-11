import { RowDataPacket } from 'mysql2'
import promisePool from '../database'

export const getUser = async (id: number) => {
  const [rows, fields]: [RowDataPacket[number], any] = await promisePool.query(
    'select id,name,email from users where id = ?',
    [id]
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
