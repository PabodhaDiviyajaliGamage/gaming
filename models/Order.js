import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    default: '',
  },
  game: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  gameId: {
    type: String,
    required: true,
  },
  playerNickname: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'ezcash'],
    required: true,
  },
  paymentSlip: {
    type: String,
    required: true,
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

OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
