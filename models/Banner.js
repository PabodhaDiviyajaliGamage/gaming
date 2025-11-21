import mongoose from 'mongoose'

const BannerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'footer', 'sidebar', 'slider'],
    default: 'header',
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

BannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema)
