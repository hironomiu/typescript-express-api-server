import { app } from './app'
import { SERVER_PORT } from './config'

// Server Listen
app.listen(SERVER_PORT, () => {
  console.log(`express listening on *:${SERVER_PORT}`)
})
