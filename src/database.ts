import mysql from 'mysql2'

// TODO dotenv
const pool = mysql.createPool({
  connectionLimit: 5,
  host: '127.0.0.1',
  user: 'root',
  password: 'mysql',
  database: 'test',
  port: 3306,
})

const promisePool = pool.promise()
export default promisePool
