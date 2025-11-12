import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
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

GameSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Game || mongoose.model('Game', GameSchema)
