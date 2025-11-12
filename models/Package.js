import mongoose from 'mongoose'

const PackageSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  gameName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  popular: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
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

PackageSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Package || mongoose.model('Package', PackageSchema)
