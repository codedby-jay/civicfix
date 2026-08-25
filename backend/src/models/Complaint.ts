import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { locationSchema } from './User.js'

export const COMPLAINT_CATEGORIES = [
  'pothole',
  'garbage',
  'streetlight',
  'water-leakage',
  'road-damage',
  'drainage',
  'traffic',
  'public-property',
  'other',
] as const

export const COMPLAINT_SEVERITIES = ['critical', 'high', 'medium', 'low'] as const
export const COMPLAINT_STATUSES = [
  'reported',
  'under-review',
  'assigned',
  'in-progress',
  'resolved',
  'rejected',
] as const
export const COMPLAINT_PRIORITIES = ['critical', 'high', 'medium', 'low'] as const

export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number]
export type ComplaintSeverity = (typeof COMPLAINT_SEVERITIES)[number]
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number]
export type ComplaintPriority = (typeof COMPLAINT_PRIORITIES)[number]

const timelineSchema = new Schema(
  {
    status: { type: String, enum: COMPLAINT_STATUSES, required: true },
    message: { type: String, required: true, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
)

const complaintSchema = new Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: COMPLAINT_CATEGORIES, required: true },
    severity: { type: String, enum: COMPLAINT_SEVERITIES, required: true },
    status: { type: String, enum: COMPLAINT_STATUSES, default: 'reported' },
    priority: { type: String, enum: COMPLAINT_PRIORITIES, required: true },
    location: { type: locationSchema, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    department: { type: String, trim: true, default: '' },
    images: { type: [String], default: [] },
    timeline: { type: [timelineSchema], default: [] },
  },
  { timestamps: true },
)

complaintSchema.index({ 'location.geo': '2dsphere' })
complaintSchema.index({ status: 1, severity: 1, category: 1, createdAt: -1 })

complaintSchema.pre('save', function syncGeo() {
  if (this.location?.longitude != null && this.location?.latitude != null) {
    this.location.geo = {
      type: 'Point',
      coordinates: [this.location.longitude, this.location.latitude],
    }
  }
})

complaintSchema.set('toJSON', {
  transform(_doc, ret) {
    const value = ret as Record<string, unknown>
    value.id = String(value._id)
    delete value.__v
    return value
  },
})

export type ComplaintDocument = InferSchemaType<typeof complaintSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Complaint: Model<ComplaintDocument> =
  mongoose.models.Complaint ?? mongoose.model<ComplaintDocument>('Complaint', complaintSchema)

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1842 },
})

export const Counter =
  mongoose.models.Counter ?? mongoose.model('Counter', counterSchema)
