import dotenv from 'dotenv'
dotenv.config()

export const SERVER_PORT = process.env.SERVER_PORT || 5555
export const PRODUCTION_MODE = process.env.PRODUCTION_MODE || 'dev'
export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PORT = process.env.DB_PORT
