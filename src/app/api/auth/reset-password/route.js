import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/db'
import User from '../../../../../models/User'

export async function POST(req) {
  try {
    await connectDB()
    const { email, newPassword } = await req.json()

    // بررسی وجود ایمیل
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد!' },
        { status: 404 }
      )
    }

    // هش کردن پسورد جدید
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد!',
    })
  } catch (error) {
    console.error('خطا در ریست پسورد:', error)
    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور!', error: error.message },
      { status: 500 }
    )
  }
}
