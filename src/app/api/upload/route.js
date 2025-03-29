import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// تنظیمات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// **آپلود تصویر**
export async function POST(req) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // بررسی فرمت فایل (پشتیبانی از jpg, png, webp)
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp']
    if (!file.type || !allowedFormats.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // آپلود به Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'product_images' }, (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        })
        .end(buffer)
    })

    return NextResponse.json({ url: result.secure_url }, { status: 200 })
  } catch (error) {
    console.error('Error in POST (Upload Image):', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// **حذف تصویر**
export async function DELETE(req) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { public_id } = await req.json()
    if (!public_id || typeof public_id !== 'string') {
      return NextResponse.json({ error: 'Invalid public_id' }, { status: 400 })
    }

    // حذف تصویر از Cloudinary
    const result = await cloudinary.uploader.destroy(public_id.trim())

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
    console.error('Error in DELETE (Remove Image):', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
