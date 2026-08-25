import mongoose from 'mongoose'
import { Complaint, Counter, type ComplaintDocument } from '../models/Complaint.js'
import { ApiError } from '../utils/ApiError.js'
import type { z } from 'zod'
import type {
  createComplaintSchema,
  listComplaintsQuerySchema,
  timelineSchema,
  updateComplaintSchema,
  updateStatusSchema,
} from '../validators/complaint.validator.js'

type AuthUser = { id: string; role: string }

async function nextComplaintId(): Promise<string> {
  const counter = await Counter.findByIdAndUpdate(
    'complaint',
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  )
  const seq = counter?.seq ?? 1843
  return `CF-${seq}`
}

function canManage(complaint: ComplaintDocument, auth: AuthUser): boolean {
  if (auth.role === 'admin') return true
  if (auth.role === 'authority') {
    return complaint.assignedTo?.toString() === auth.id
  }
  return false
}

export async function createComplaint(
  auth: AuthUser,
  input: z.infer<typeof createComplaintSchema>,
) {
  const complaintId = await nextComplaintId()
  const complaint = await Complaint.create({
    complaintId,
    title: input.title,
    description: input.description,
    category: input.category,
    severity: input.severity,
    priority: input.priority ?? input.severity,
    location: input.location,
    reportedBy: auth.id,
    department: input.department ?? '',
    images: input.images ?? [],
    status: 'reported',
    timeline: [
      {
        status: 'reported',
        message: 'Complaint submitted by citizen.',
        updatedBy: auth.id,
        timestamp: new Date(),
      },
    ],
  })
  return complaint
}

export async function listComplaints(auth: AuthUser, query: z.infer<typeof listComplaintsQuerySchema>) {
  const { page, limit, status, severity, category, search, sort, scope } = query
  const filter: Record<string, unknown> = {}

  if (auth.role === 'citizen') {
    if (scope === 'public') {
      filter.status = { $ne: 'rejected' }
    } else {
      filter.reportedBy = auth.id
    }
  } else if (auth.role === 'authority') {
    if (scope === 'all' || scope === 'public') {
      filter.status = { $ne: 'rejected' }
    } else {
      filter.assignedTo = auth.id
    }
  }

  if (status) filter.status = status
  if (severity) filter.severity = severity
  if (category) filter.category = category
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { complaintId: { $regex: search, $options: 'i' } },
    ]
  }

  const sortSpec: Record<string, 1 | -1> = {}
  const sortKey = sort.startsWith('-') ? sort.slice(1) : sort
  sortSpec[sortKey || 'createdAt'] = sort.startsWith('-') ? -1 : 1

  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    Complaint.find(filter as never)
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email role department')
      .populate('timeline.updatedBy', 'name role'),
    Complaint.countDocuments(filter as never),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

export async function getComplaint(auth: AuthUser, id: string) {
  const complaint = await Complaint.findOne(idFilter(id))
    .populate('reportedBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('timeline.updatedBy', 'name role')
  if (!complaint) throw ApiError.notFound('Complaint not found')

  if (auth.role === 'citizen') {
    const owner = complaint.reportedBy && typeof complaint.reportedBy === 'object' && '_id' in complaint.reportedBy
      ? String((complaint.reportedBy as { _id: { toString(): string } })._id)
      : String(complaint.reportedBy)
    if (owner !== auth.id && complaint.status === 'rejected') {
      throw ApiError.forbidden()
    }
  }
  return complaint
}

export async function updateComplaint(
  auth: AuthUser,
  id: string,
  input: z.infer<typeof updateComplaintSchema>,
) {
  const complaint = await Complaint.findOne(idFilter(id))
  if (!complaint) throw ApiError.notFound('Complaint not found')
  if (!canManage(complaint, auth)) throw ApiError.forbidden()
  Object.assign(complaint, input)
  await complaint.save()
  return complaint
}

export async function updateComplaintStatus(
  auth: AuthUser,
  id: string,
  input: z.infer<typeof updateStatusSchema>,
) {
  const complaint = await Complaint.findOne(idFilter(id))
  if (!complaint) throw ApiError.notFound('Complaint not found')
  if (!canManage(complaint, auth)) throw ApiError.forbidden()
  complaint.status = input.status
  complaint.timeline.push({
    status: input.status,
    message: input.message ?? defaultStatusMessage(input.status),
    updatedBy: new mongoose.Types.ObjectId(auth.id),
    timestamp: new Date(),
  } as unknown as (typeof complaint.timeline)[number])
  await complaint.save()
  return complaint
}

export async function addTimelineEntry(
  auth: AuthUser,
  id: string,
  input: z.infer<typeof timelineSchema>,
) {
  const complaint = await Complaint.findOne(idFilter(id))
  if (!complaint) throw ApiError.notFound('Complaint not found')
  if (!canManage(complaint, auth)) throw ApiError.forbidden()
  const status = input.status ?? complaint.status
  complaint.status = status
  complaint.timeline.push({
    status,
    message: input.message,
    updatedBy: new mongoose.Types.ObjectId(auth.id),
    timestamp: new Date(),
  } as unknown as (typeof complaint.timeline)[number])
  await complaint.save()
  return complaint
}

export async function deleteComplaint(auth: AuthUser, id: string) {
  if (auth.role !== 'admin') throw ApiError.forbidden()
  const complaint = await Complaint.findOneAndDelete(idFilter(id))
  if (!complaint) throw ApiError.notFound('Complaint not found')
  return { deleted: true, complaintId: complaint.complaintId }
}

function idFilter(id: string) {
  if (id.startsWith('CF-')) return { complaintId: id }
  return { _id: id }
}

function defaultStatusMessage(status: string): string {
  switch (status) {
    case 'under-review':
      return 'Complaint reviewed by authority.'
    case 'assigned':
      return 'Complaint assigned to a department.'
    case 'in-progress':
      return 'Repair work has started.'
    case 'resolved':
      return 'Issue has been resolved.'
    case 'rejected':
      return 'Complaint was rejected.'
    default:
      return 'Complaint submitted by citizen.'
  }
}
