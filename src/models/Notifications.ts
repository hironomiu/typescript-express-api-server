import { RowDataPacket } from 'mysql2'
import promisePool from '../database'

export type Notifications = {
  title: string
  notification: string
  is_confirmed: boolean
}

export const findAll = async (id: number) => {
  const [rows, fields] = await promisePool.query(
    'select b.id,a.title,a.notification,b.is_confirmed from user_notifications b inner join notifications a on a.id = b.notification_id where b.user_id = ?',
    [id]
  )
  return rows
}

export const updateIsConfirmedById = async (id: number) => {
  const [rows, fields] = await promisePool.query(
    'update user_notifications set is_confirmed = 1 where id = ?',
    [id]
  )
  return rows
}
