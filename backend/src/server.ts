import 'dotenv/config'
import { loadEnv } from './config/env.js'
import { connectDatabase } from './config/database.js'
import { createApp } from './app.js'
async function resolveMongoUri(configured: string): Promise<{ uri: string; memory?: { stop: () => Promise<boolean> } }> {
  if (configured !== 'memory') {
    return { uri: configured }
  }
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const memory = await MongoMemoryServer.create()
  return { uri: memory.getUri('civicfix'), memory }
}

async function main() {
  const env = loadEnv()
  const { uri, memory } = await resolveMongoUri(env.MONGODB_URI)
  try {
    await connectDatabase(uri)
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
    process.exit(1)
  }

  const app = createApp()
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`CivicFix API listening on http://localhost:${env.PORT}`)
  })

  const shutdown = async () => {
    server.close()
    const { disconnectDatabase } = await import('./config/database.js')
    await disconnectDatabase()
    await memory?.stop()
    process.exit(0)
  }
  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())
}

void main()
