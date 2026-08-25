import bcrypt from 'bcrypt'
import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

export const USER_ROLES = ['citizen', 'authority', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const locationSchema = new Schema(
  {
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, trim: true, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  { _id: false },
)

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: 'citizen' },
    phone: { type: String, trim: true, default: '' },
    location: { type: locationSchema, default: () => ({}) },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true },
)

userSchema.pre('save', function syncGeo() {
  if (this.location?.longitude != null && this.location?.latitude != null) {
    this.location.geo = {
      type: 'Point',
      coordinates: [this.location.longitude, this.location.latitude],
    }
  }
})

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.index({ 'location.geo': '2dsphere' })

userSchema.set('toJSON', {
  transform(_doc, ret) {
    const value = ret as Record<string, unknown>
    value.id = String(value._id)
    delete value.password
    delete value.tokenVersion
    delete value.__v
    return value
  },
})

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId
}

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>('User', userSchema)
