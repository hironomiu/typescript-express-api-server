import { RowDataPacket } from 'mysql2'
import promisePool from '../database'

export type Notifications = {
  title: string
  notification: string
}

export const findAll = async (id: number) => {
  const [rows, fields] = await promisePool.query(
    'select a.title,a.notification from user_notifications b inner join notifications a on a.id = b.notification_id where b.user_id = ?',
    [id]
  )
  return rows
}
