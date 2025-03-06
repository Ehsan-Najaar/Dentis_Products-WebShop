import mongoose from 'mongoose'

const ShippingSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'default', // یک ID ثابت برای جلوگیری از ایجاد چندین سند
  },
  shippingCost: {
    type: Number,
    required: true,
  },
})

// بررسی اینکه مدل از قبل تعریف نشده باشد
const Shipping =
  mongoose.models.Shipping || mongoose.model('Shipping', ShippingSchema)

export default Shipping
