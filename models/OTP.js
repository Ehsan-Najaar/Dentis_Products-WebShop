import mongoose from 'mongoose'

const otpsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
})

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpsSchema)

export default OTP
