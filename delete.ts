import promisePool from './src/database'

const hoge = async () => {
  const ret = await promisePool.query('delete from users')
  console.log(ret)
}

hoge()
