import mysql from 'mysql2'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config'

let port = 3306
if (typeof DB_PORT === 'string') {
  port = parseInt(DB_PORT)
}
const pool = mysql.createPool({
  connectionLimit: 5,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: port,
})

const promisePool = pool.promise()
export default promisePool
