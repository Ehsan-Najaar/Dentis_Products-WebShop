import mongoose from 'mongoose'

const ShippingSchema = new mongoose.Schema({
  shippingCost: {
    type: Number,
    required: true,
  },
})

const Shipping =
  mongoose.models.Shipping || mongoose.model('Shipping', ShippingSchema)

export default Shipping
