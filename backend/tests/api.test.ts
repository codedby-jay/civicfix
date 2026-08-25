import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { resetEnvCache } from '../src/config/env.js'
import { connectDatabase, disconnectDatabase } from '../src/config/database.js'

process.env.NODE_ENV = 'test'
process.env.PORT = '5001'
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/civicfix-test'
process.env.JWT_SECRET = 'civicfix-test-secret-key'
process.env.JWT_EXPIRES_IN = '15m'
process.env.CLIENT_URL = 'http://localhost:5173'
resetEnvCache()

const { createApp } = await import('../src/app.js')
const { User } = await import('../src/models/User.js')

let memory: MongoMemoryServer
const app = createApp()
const agent = request.agent(app)

describe('CivicFix API', () => {
  beforeAll(async () => {
    memory = await MongoMemoryServer.create()
    await connectDatabase(memory.getUri('civicfix-test'))
  })

  afterAll(async () => {
    await disconnectDatabase()
    await memory.stop()
  })

  it('returns health with database status', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.database).toBe('connected')
  })

  it('rejects invalid registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'bad',
      password: 'short',
    })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('registers a citizen', async () => {
    const res = await agent.post('/api/auth/register').send({
      name: 'Maya Chen',
      email: 'maya.chen@civicfix.dev',
      password: 'CivicFix123!',
      location: 'Harbor District',
    })
    expect(res.status).toBe(201)
    expect(res.body.data.email).toBe('maya.chen@civicfix.dev')
    expect(res.body.data.password).toBeUndefined()
    expect(res.body.data.role).toBe('citizen')
    expect(res.headers['set-cookie']).toBeTruthy()
  })

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Maya Chen',
      email: 'maya.chen@civicfix.dev',
      password: 'CivicFix123!',
    })
    expect(res.status).toBe(409)
  })

  it('returns the current user', async () => {
    const res = await agent.get('/api/auth/me')
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe('maya.chen@civicfix.dev')
    expect(res.body.data.password).toBeUndefined()
  })

  it('creates a complaint', async () => {
    const res = await agent.post('/api/complaints').send({
      title: 'Open pothole at bus stop',
      description: 'A deep cavity has opened at the curb lane of the southbound stop.',
      category: 'pothole',
      severity: 'high',
      location: { address: 'Maple Ave & 4th St', city: 'Harbor District' },
    })
    expect(res.status).toBe(201)
    expect(res.body.data.complaintId).toMatch(/^CF-/)
    expect(res.body.data.status).toBe('reported')
  })

  it('lists own complaints with pagination', async () => {
    const res = await agent.get('/api/complaints?page=1&limit=5')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination.page).toBe(1)
    expect(res.body.pagination.limit).toBe(5)
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(1)
    expect(res.body.pagination.totalPages).toBeGreaterThanOrEqual(1)
  })

  it('returns the authenticated profile from /api/users/me', async () => {
    const res = await agent.get('/api/users/me')
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe('maya.chen@civicfix.dev')
    expect(res.body.data.password).toBeUndefined()
  })

  it('filters complaints by category', async () => {
    const res = await agent.get('/api/complaints?category=pothole&search=bus')
    expect(res.status).toBe(200)
    expect(res.body.data[0].category).toBe('pothole')
  })

  it('gets a complaint by public id', async () => {
    const list = await agent.get('/api/complaints')
    const id = list.body.data[0].complaintId as string
    const res = await agent.get(`/api/complaints/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.data.complaintId).toBe(id)
  })

  it('forbids a citizen from updating status', async () => {
    const list = await agent.get('/api/complaints')
    const id = list.body.data[0].complaintId as string
    const res = await agent.patch(`/api/complaints/${id}/status`).send({
      status: 'resolved',
    })
    expect(res.status).toBe(403)
  })

  it('rejects unauthenticated complaint list', async () => {
    const res = await request(app).get('/api/complaints')
    expect(res.status).toBe(401)
  })

  it('rejects an invalid JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-token')
    expect(res.status).toBe(401)
  })

  it('uses a generic error for bad login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'maya.chen@civicfix.dev',
      password: 'wrong-password',
    })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid email or password')
    const missing = await request(app).post('/api/auth/login').send({
      email: 'nobody@civicfix.dev',
      password: 'CivicFix123!',
    })
    expect(missing.body.message).toBe('Invalid email or password')
  })

  it('logs in, refreshes, and logs out', async () => {
    const session = request.agent(app)
    const login = await session.post('/api/auth/login').send({
      email: 'maya.chen@civicfix.dev',
      password: 'CivicFix123!',
    })
    expect(login.status).toBe(200)
    const refresh = await session.post('/api/auth/refresh')
    expect(refresh.status).toBe(200)
    const logout = await session.post('/api/auth/logout')
    expect(logout.status).toBe(200)
    const me = await session.get('/api/auth/me')
    expect(me.status).toBe(401)
  })

  it('lets an admin assign and update a complaint', async () => {
    const admin = await User.create({
      name: 'Chris Brooks',
      email: 'chris.brooks@civicfix.dev',
      password: 'CivicFix123!',
      role: 'admin',
    })
    const authority = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@civicfix.dev',
      password: 'CivicFix123!',
      role: 'authority',
    })
    const adminAgent = request.agent(app)
    await adminAgent.post('/api/auth/login').send({
      email: 'chris.brooks@civicfix.dev',
      password: 'CivicFix123!',
    })
    const list = await agent.get('/api/complaints')
    const id = list.body.data[0].complaintId as string
    const assigned = await adminAgent.patch(`/api/complaints/${id}`).send({
      assignedTo: authority._id.toString(),
      department: 'Road & Infrastructure',
    })
    expect(assigned.status).toBe(200)
    const status = await adminAgent.patch(`/api/complaints/${id}/status`).send({
      status: 'assigned',
      message: 'Complaint assigned to Road & Infrastructure.',
    })
    expect(status.status).toBe(200)
    expect(status.body.data.status).toBe('assigned')
    const authorityAgent = request.agent(app)
    await authorityAgent.post('/api/auth/login').send({
      email: 'alex.rivera@civicfix.dev',
      password: 'CivicFix123!',
    })
    const authorityStatus = await authorityAgent.patch(`/api/complaints/${id}/status`).send({
      status: 'in-progress',
      message: 'Repair work has started.',
    })
    expect(authorityStatus.status).toBe(200)
    expect(authorityStatus.body.data.status).toBe('in-progress')
    const timeline = await adminAgent.post(`/api/complaints/${id}/timeline`).send({
      status: 'in-progress',
      message: 'Crew on site.',
    })
    expect(timeline.status).toBe(200)
    expect(timeline.body.data.timeline.length).toBeGreaterThan(1)
    const removed = await adminAgent.delete(`/api/complaints/${id}`)
    expect(removed.status).toBe(200)
    expect(admin.email).toBe('chris.brooks@civicfix.dev')
  })
})
