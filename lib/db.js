import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in environment variables')
}

// کش اتصال برای جلوگیری از چندین اتصال در Next.js (ویژه App Router)
let cached = global.mongoose || { conn: null, promise: null }

const connectDB = async () => {
  if (cached.conn) {
    console.log('✅ Already connected to MongoDB')
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI) // حذف useNewUrlParser و useUnifiedTopology
      .then((mongoose) => {
        console.log('🚀 MongoDB connected')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ Error connecting to MongoDB:', error)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

// ذخیره اتصال در `global` برای جلوگیری از چندین اتصال در حالت توسعه
global.mongoose = cached

export default connectDB
