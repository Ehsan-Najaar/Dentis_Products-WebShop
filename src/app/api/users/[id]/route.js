import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import User from '../../../../../models/User'

export async function GET(request, { params }) {
  const { id } = params // شناسه کاربر از URL گرفته می‌شود

  try {
    const user = await User.findById(id) // استفاده از _id به جای id
    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user info:', error)
    return NextResponse.json(
      { message: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  const { name, mobile, addresses, password } = await request.json()

  console.log('Received update data:', { name, mobile, addresses, password })

  try {
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    // به‌روزرسانی اطلاعات کاربر
    if (name) user.name = name
    if (mobile) user.mobile = mobile // تغییر فیلد phone به mobile
    if (addresses) user.addresses = addresses
    if (password) {
      // رمزنگاری رمز عبور جدید
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    await user.save()

    return NextResponse.json(user) // بازگشت اطلاعات به‌روز شده کاربر
  } catch (error) {
    console.error('Error updating user info:', error)
    return NextResponse.json(
      { message: 'خطا در به‌روزرسانی اطلاعات' },
      { status: 500 }
    )
  }
}
