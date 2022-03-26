// use models/User
export type User = {
  id: number
  nickname: string
  email: string
  created_at: Date
  updated_at: Date
}

// use models/User authPassport
export type UserAuth = {
  id: number
  nickname: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}
