import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import slugify from 'slugify'
import connectDB from '../../../../../lib/db'
import Product from '../../../../../models/Product'

// 📌 بررسی احراز هویت
async function checkAdminSession() {
  const session = await getServerSession(authOptions)

  console.log('📌 session:', session) // لاگ بگیر ببین مقدار role چی برمی‌گرده

  if (!session || session.user.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return session
}

// 📌 دریافت یک محصول بر اساس ID و افزایش بازدید
export async function GET(req, { params }) {
  try {
    await connectDB()

    // بررسی احراز هویت
    await checkAdminSession()

    const { id } = params

    // پیدا کردن محصول و افزایش `views` همزمان
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!product) {
      return NextResponse.json({ message: 'محصول پیدا نشد' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error('خطا در دریافت محصول:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { message: 'خطا در دریافت محصول', error: error.message },
      { status: 500 }
    )
  }
}

// 📌 حذف یک محصول بر اساس ID
export async function DELETE(req, { params }) {
  try {
    await connectDB()

    // بررسی دسترسی فقط برای ادمین‌ها
    await checkAdminSession()

    const { id } = params

    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return NextResponse.json({ message: 'محصول پیدا نشد' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'محصول با موفقیت حذف شد', productId: id },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ خطا در حذف محصول:', error)
    if (error.message === 'Forbidden') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }
    return NextResponse.json(
      { message: 'خطا در حذف محصول', error: error.message },
      { status: 500 }
    )
  }
}

// 📌 ویرایش اطلاعات یک محصول بر اساس ID
export async function PUT(request, { params }) {
  try {
    await connectDB()

    // بررسی دسترسی فقط برای ادمین‌ها
    await checkAdminSession()

    const { id } = params
    const updateData = await request.json()

    // دریافت محصول قدیمی
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return NextResponse.json({ message: 'محصول پیدا نشد' }, { status: 404 })
    }

    // تولید `slug` جدید فقط در صورتی که `name` تغییر کند
    if (updateData.name && updateData.name !== existingProduct.name) {
      let newSlug = slugify(updateData.name, {
        lower: true,
        strict: true,
        replacement: '-',
        locale: 'fa',
      })

      // بررسی یکتا بودن `slug`
      let slugExists = await Product.findOne({
        slug: newSlug,
        _id: { $ne: id },
      })
      let count = 1

      while (slugExists) {
        newSlug = `${newSlug}-${count}`
        slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: id } })
        count++
      }

      updateData.slug = newSlug
    }

    // به‌روزرسانی محصول
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error('❌ خطا در ویرایش محصول:', error)
    if (error.message === 'Forbidden') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }
    return NextResponse.json(
      { message: 'خطا در ویرایش محصول', error: error.message },
      { status: 500 }
    )
  }
}
