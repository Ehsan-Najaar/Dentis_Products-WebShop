import mongoose from 'mongoose'
import slugify from 'slugify'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// تولید خودکار `slug` قبل از ذخیره شدن
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
