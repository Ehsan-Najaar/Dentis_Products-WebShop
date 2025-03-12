// app/api/upload/route.js

import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// پیکربندی Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// بررسی احراز هویت و نقش کاربر
async function checkSession() {
  const session = await getServerSession()
  if (!session || !session.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

// **آپلود تصویر**
export async function POST(req) {
  try {
    await checkSession() // بررسی احراز هویت

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // بررسی فرمت فایل (فقط تصویر)
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedFormats.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'product_images' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    return NextResponse.json({ url: result.secure_url }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// **حذف تصویر**
export async function DELETE(req) {
  try {
    await checkSession() // بررسی احراز هویت

    const { public_id } = await req.json()

    if (!public_id) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      )
    }

    const result = await cloudinary.uploader.destroy(public_id)

    if (result.result === 'ok') {
      return NextResponse.json(
        { message: 'Image deleted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
