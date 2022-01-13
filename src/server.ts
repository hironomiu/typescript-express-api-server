import { setUp } from './app'
import { SERVER_PORT } from './config'

const app = setUp()
// Server Listen
app.listen(SERVER_PORT, () => {
  console.log(`express listening on *:${SERVER_PORT}`)
})
