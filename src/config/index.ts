import dotenv from 'dotenv'
dotenv.config()

export const SERVER_PORT = process.env.SERVER_PORT || 5555
export const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN?.split(
  ' '
) || ['http://localhost:3001']
export const PRODUCTION_MODE = process.env.PRODUCTION_MODE || 'dev'
export const DB_HOST = process.env.DB_HOST || '127.0.0.1'
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'mysql'
export const DB_DATABASE = process.env.DB_DATABASE || 'express_api'
export const DB_PORT = process.env.DB_PORT || '3306'
