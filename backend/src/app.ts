import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { loadEnv } from './config/env.js'
import { isDatabaseConnected } from './config/database.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { notFoundMiddleware } from './middleware/notFound.middleware.js'
import { authRouter } from './routes/auth.routes.js'
import { complaintRouter } from './routes/complaint.routes.js'
import { userRouter } from './routes/user.routes.js'

export function createApp() {
  const env = loadEnv()
  const app = express()

  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(
    cors({
      origin(origin, callback) {
        const allowed = allowedOrigins(env.CLIENT_URL, env.NODE_ENV)
        if (!origin || allowed.includes(origin)) {
          callback(null, true)
          return
        }
        callback(new Error('Origin not allowed by CORS'))
      },
      credentials: true,
    }),
  )
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
      skip: () => env.NODE_ENV === 'test',
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  }

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'CivicFix API is running',
      timestamp: new Date().toISOString(),
      data: {
        database: isDatabaseConnected() ? 'connected' : 'disconnected',
      },
    })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/complaints', complaintRouter)

  app.use(notFoundMiddleware)
  app.use(errorMiddleware)
  return app
}

function allowedOrigins(clientUrl: string, nodeEnv: string): string[] {
  const configured = clientUrl.split(',').map((value) => value.trim()).filter(Boolean)
  if (nodeEnv === 'production') return configured
  return [...new Set([...configured, 'http://localhost:5173', 'http://127.0.0.1:5173'])]
}
