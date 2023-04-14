import mongoose from 'mongoose'

const orderModel = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: 'Products',
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: 'Users',
    },
    status: {
      type: String,
      default: 'Not Process',
      enum: ['Not Process', 'Processing', 'Shipped', 'delivered', 'cancel'],
    },
  },
  {timestamps: true}
)

export default mongoose.model('Order', orderModel)
