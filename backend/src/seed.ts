import 'dotenv/config'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { loadEnv } from './config/env.js'
import {
  Complaint,
  Counter,
  type ComplaintCategory,
  type ComplaintPriority,
  type ComplaintSeverity,
  type ComplaintStatus,
} from './models/Complaint.js'
import { User } from './models/User.js'

const PASSWORD = 'CivicFix123!'

async function resolveUri(configured: string): Promise<{ uri: string; stop?: () => Promise<unknown> }> {
  if (configured !== 'memory') return { uri: configured }
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const memory = await MongoMemoryServer.create()
  return { uri: memory.getUri('civicfix'), stop: () => memory.stop() }
}

async function seed() {
  const env = loadEnv()
  const { uri, stop } = await resolveUri(env.MONGODB_URI)
  await connectDatabase(uri)

  await Promise.all([User.deleteMany({}), Complaint.deleteMany({}), Counter.deleteMany({})])

  const [maya, jordan, riley, sam, alex, priya, chris, taylor] = await Promise.all([
    User.create({
      name: 'Maya Chen',
      email: 'maya.chen@civicfix.dev',
      password: PASSWORD,
      role: 'citizen',
      location: { city: 'Harbor District', address: 'Maple Ave' },
    }),
    User.create({
      name: 'Jordan Patel',
      email: 'jordan.patel@civicfix.dev',
      password: PASSWORD,
      role: 'citizen',
      location: { city: 'Oak Court' },
    }),
    User.create({
      name: 'Riley Okonkwo',
      email: 'riley.okonkwo@civicfix.dev',
      password: PASSWORD,
      role: 'citizen',
      location: { city: 'Harbor District' },
    }),
    User.create({
      name: 'Sam Alvarez',
      email: 'sam.alvarez@civicfix.dev',
      password: PASSWORD,
      role: 'citizen',
      location: { city: 'Riverside' },
    }),
    User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@civicfix.dev',
      password: PASSWORD,
      role: 'authority',
      location: { city: 'Civic Center' },
    }),
    User.create({
      name: 'Priya Nair',
      email: 'priya.nair@civicfix.dev',
      password: PASSWORD,
      role: 'authority',
      location: { city: 'Civic Center' },
    }),
    User.create({
      name: 'Chris Brooks',
      email: 'chris.brooks@civicfix.dev',
      password: PASSWORD,
      role: 'admin',
      location: { city: 'Civic Center' },
    }),
    User.create({
      name: 'Taylor Kim',
      email: 'taylor.kim@civicfix.dev',
      password: PASSWORD,
      role: 'authority',
      location: { city: 'East Market' },
    }),
  ])

  if (!maya || !jordan || !riley || !sam || !alex || !priya || !chris || !taylor) {
    throw new Error('Failed to create seed users')
  }

  const complaints: Array<{
    complaintId: string
    title: string
    description: string
    category: ComplaintCategory
    severity: ComplaintSeverity
    status: ComplaintStatus
    priority: ComplaintPriority
    location: { address: string; city: string; latitude?: number; longitude?: number }
    reportedBy: (typeof maya)['_id']
    assignedTo?: (typeof maya)['_id']
    department: string
  }> = [
    {
      complaintId: 'CF-1843',
      title: 'Open pothole at bus stop',
      description:
        'A deep cavity has opened at the curb lane of the southbound stop. Buses are swinging wide.',
      category: 'pothole',
      severity: 'high',
      status: 'in-progress',
      priority: 'high',
      location: { address: 'Maple Ave & 4th St', city: 'Harbor District', latitude: 37.78, longitude: -122.42 },
      reportedBy: maya._id,
      assignedTo: alex._id,
      department: 'Road & Infrastructure',
    },
    {
      complaintId: 'CF-1821',
      title: 'Broken streetlight near community park',
      description: 'Lamp 7 on the park path has been dark for three evenings.',
      category: 'streetlight',
      severity: 'medium',
      status: 'assigned',
      priority: 'medium',
      location: { address: 'Elm Community Park', city: 'Harbor District', latitude: 37.781, longitude: -122.41 },
      reportedBy: maya._id,
      assignedTo: priya._id,
      department: 'Public Lighting',
    },
    {
      complaintId: 'CF-1798',
      title: 'Garbage accumulation on Maple Avenue',
      description: 'Bags have sat through two collection days outside 410–424 Maple.',
      category: 'garbage',
      severity: 'low',
      status: 'under-review',
      priority: 'low',
      location: { address: '410 Maple Avenue', city: 'Harbor District', latitude: 37.779, longitude: -122.418 },
      reportedBy: maya._id,
      department: 'Sanitation',
    },
    {
      complaintId: 'CF-1851',
      title: 'Blocked storm drain',
      description: 'Standing water at Harbor & Pine after light rain.',
      category: 'drainage',
      severity: 'critical',
      status: 'under-review',
      priority: 'critical',
      location: { address: 'Harbor & Pine', city: 'Harbor District', latitude: 37.776, longitude: -122.419 },
      reportedBy: riley._id,
      department: 'Water Services',
    },
    {
      complaintId: 'CF-1847',
      title: 'Streetlight out on river path',
      description: 'Lamp 12 is dark along a narrow stretch of the riverside walk.',
      category: 'streetlight',
      severity: 'medium',
      status: 'assigned',
      priority: 'medium',
      location: { address: 'Riverside Walk, lamp 12', city: 'Riverside', latitude: 37.784, longitude: -122.4 },
      reportedBy: sam._id,
      assignedTo: priya._id,
      department: 'Public Lighting',
    },
    {
      complaintId: 'CF-1833',
      title: 'Overflowing collection point',
      description: 'Public bins at East Market are full by mid-morning on market days.',
      category: 'garbage',
      severity: 'low',
      status: 'reported',
      priority: 'low',
      location: { address: 'East Market plaza', city: 'East Market', latitude: 37.775, longitude: -122.41 },
      reportedBy: jordan._id,
      department: 'Sanitation',
    },
    {
      complaintId: 'CF-1828',
      title: 'Water leaking at hydrant',
      description: 'Steady leak at the hydrant on Oak Court.',
      category: 'water-leakage',
      severity: 'high',
      status: 'assigned',
      priority: 'high',
      location: { address: '12 Oak Court', city: 'Oak Court', latitude: 37.77, longitude: -122.43 },
      reportedBy: jordan._id,
      assignedTo: alex._id,
      department: 'Water Services',
    },
    {
      complaintId: 'CF-1812',
      title: 'Failed pavement on service road',
      description: 'Longitudinal crack and settlement along the industrial service road.',
      category: 'road-damage',
      severity: 'high',
      status: 'in-progress',
      priority: 'high',
      location: { address: 'Yard access, Dock 3', city: 'Harbor District', latitude: 37.772, longitude: -122.4 },
      reportedBy: jordan._id,
      assignedTo: alex._id,
      department: 'Road & Infrastructure',
    },
    {
      complaintId: 'CF-1804',
      title: 'Traffic signal stuck on red',
      description: 'Northbound signal at Cedar & 9th remains red through several cycles.',
      category: 'traffic',
      severity: 'critical',
      status: 'in-progress',
      priority: 'critical',
      location: { address: 'Cedar & 9th', city: 'Civic Center', latitude: 37.786, longitude: -122.405 },
      reportedBy: riley._id,
      assignedTo: alex._id,
      department: 'Traffic Operations',
    },
    {
      complaintId: 'CF-1788',
      title: 'Damaged bench at river overlook',
      description: 'Slat broken on the east bench; exposed fastener.',
      category: 'public-property',
      severity: 'low',
      status: 'assigned',
      priority: 'low',
      location: { address: 'River overlook, east bench', city: 'Riverside', latitude: 37.788, longitude: -122.398 },
      reportedBy: sam._id,
      assignedTo: priya._id,
      department: 'Parks & Property',
    },
    {
      complaintId: 'CF-1770',
      title: 'Pothole closed on Oak approach',
      description: 'Temporary fill completed; monitoring for settlement.',
      category: 'pothole',
      severity: 'medium',
      status: 'resolved',
      priority: 'medium',
      location: { address: 'Oak approach, west bound', city: 'Oak Court', latitude: 37.774, longitude: -122.428 },
      reportedBy: maya._id,
      assignedTo: alex._id,
      department: 'Road & Infrastructure',
    },
    {
      complaintId: 'CF-1762',
      title: 'Missed collection — Market Street',
      description: 'Catch-up run completed the following morning.',
      category: 'garbage',
      severity: 'low',
      status: 'resolved',
      priority: 'low',
      location: { address: '200 Market Street', city: 'East Market', latitude: 37.777, longitude: -122.412 },
      reportedBy: jordan._id,
      department: 'Sanitation',
    },
  ]

  const extraTitles = [
    ['CF-1854', 'Faded crosswalk at school gate', 'traffic', 'medium'],
    ['CF-1855', 'Standing water after sprinkler leak', 'water-leakage', 'medium'],
    ['CF-1856', 'Graffiti on transit shelter', 'public-property', 'low'],
    ['CF-1857', 'Broken curb at library ramp', 'road-damage', 'high'],
    ['CF-1858', 'Dark alley behind clinic', 'streetlight', 'high'],
    ['CF-1859', 'Dumpster lids missing', 'garbage', 'low'],
    ['CF-1860', 'Pothole cluster on 2nd Street', 'pothole', 'critical'],
    ['CF-1861', 'Blocked inlet near school', 'drainage', 'high'],
    ['CF-1862', 'Bent stop sign at alley', 'traffic', 'medium'],
    ['CF-1863', 'Uneven sidewalk slabs', 'road-damage', 'medium'],
    ['CF-1864', 'Hydrant cap missing', 'water-leakage', 'high'],
    ['CF-1865', 'Playground lamp out', 'streetlight', 'medium'],
  ] as const

  const reporters = [maya, jordan, riley, sam]
  extraTitles.forEach((row, index) => {
    const reporter = reporters[index % reporters.length]
    if (!reporter) return
    complaints.push({
      complaintId: row[0],
      title: row[1],
      description: `${row[1]}. Filed during a neighborhood walk-through.`,
      category: row[2],
      severity: row[3],
      status: index % 3 === 0 ? 'reported' : 'under-review',
      priority: row[3],
      location: { address: `Site ${index + 1}`, city: 'Harbor District', latitude: 37.77 + index * 0.001, longitude: -122.41 },
      reportedBy: reporter._id,
      department: 'Public Works',
    })
  })

  await Complaint.insertMany(
    complaints.map((item) => ({
      ...item,
      timeline: [
        {
          status: 'reported',
          message: 'Complaint submitted by citizen.',
          updatedBy: item.reportedBy,
          timestamp: new Date(),
        },
      ],
    })),
  )

  await Counter.findByIdAndUpdate('complaint', { seq: 1900 }, { upsert: true })

  console.log(`Seeded ${await User.countDocuments()} users and ${await Complaint.countDocuments()} complaints.`)
  console.log('Demo password for all seed users: CivicFix123!')
  await disconnectDatabase()
  await stop?.()
}

void seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
