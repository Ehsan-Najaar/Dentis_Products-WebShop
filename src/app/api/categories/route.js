import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import connectDB from '../../../../lib/db'
import Category from '../../../../models/Category'

export async function GET() {
  await connectDB()

  try {
    const categories = await Category.find({})
    return new Response(JSON.stringify(categories), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'خطا در دریافت دسته‌بندی‌ها' }),
      { status: 500 }
    )
  }
}

export async function POST(req) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
    })
  }

  // تست مقدار req.body قبل از پارس کردن JSON
  console.log('دریافت req.body در POST:', req.body)

  try {
    const rawBody = await req.text() // دریافت متن خام درخواست
    console.log('داده خام درخواست:', rawBody)

    const data = JSON.parse(rawBody) // تبدیل به JSON
    console.log('داده‌های پردازش‌شده:', data)

    if (!data.name) {
      return new Response(
        JSON.stringify({ message: 'نام دسته‌بندی اجباری است' }),
        { status: 400 }
      )
    }

    const newCategory = new Category({ name: data.name })
    await newCategory.save()
    return new Response(JSON.stringify(newCategory), { status: 201 })
  } catch (error) {
    console.error('خطا در پردازش JSON:', error)
    return new Response(JSON.stringify({ message: 'خطا در پردازش داده‌ها' }), {
      status: 400,
    })
  }
}

export async function DELETE(req) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
    })
  }

  const { id } = await req.json()
  if (!id) {
    return new Response(
      JSON.stringify({ message: 'ID دسته‌بندی اجباری است' }),
      { status: 400 }
    )
  }

  try {
    const deletedCategory = await Category.findByIdAndDelete(id)
    if (!deletedCategory) {
      return new Response(JSON.stringify({ message: 'دسته‌بندی پیدا نشد' }), {
        status: 404,
      })
    }
    return new Response(JSON.stringify(deletedCategory), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'خطا در حذف دسته‌بندی' }), {
      status: 500,
    })
  }
}

export async function PUT(req) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
    })
  }

  const { id, name } = await req.json()

  console.log('دریافت داده‌ها در PUT:', { id, name }) // اضافه کردن لاگ برای بررسی داده‌ها

  if (!id || !name) {
    return new Response(
      JSON.stringify({ message: 'ID و نام دسته‌بندی اجباری است' }),
      { status: 400 }
    )
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    )

    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: 'دسته‌بندی پیدا نشد' }), {
        status: 404,
      })
    }

    console.log('دسته‌بندی ویرایش شده:', updatedCategory) // لاگ داده‌ها برای بررسی

    return new Response(JSON.stringify(updatedCategory), { status: 200 })
  } catch (error) {
    console.error('خطا در ویرایش دسته‌بندی:', error)
    return new Response(
      JSON.stringify({ message: 'خطا در ویرایش دسته‌بندی' }),
      { status: 500 }
    )
  }
}
