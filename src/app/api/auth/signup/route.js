'use server'

import bcrypt from 'bcryptjs'
import connectDB from '../../../../../lib/db'
import User from '../../../../../models/User'

export async function POST(req) {
  try {
    await connectDB() // اتصال به دیتابیس

    const { name, email, password, mobile } = await req.json()

    // بررسی اینکه تمامی فیلدها وارد شده باشند
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'لطفاً همه فیلدها را پر کنید' }),
        { status: 400 }
      )
    }

    // چک کردن اینکه آیا کاربر قبلاً ثبت‌نام کرده یا نه
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'این ایمیل قبلاً ثبت شده است' }),
        { status: 400 }
      )
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10)

    // ایجاد کاربر جدید
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // ذخیره پسورد هش شده
      mobile, // ذخیره شماره موبایل در صورت موجود بودن
    })

    return new Response(
      JSON.stringify({ message: 'ثبت‌نام موفقیت‌آمیز بود' }),
      { status: 201 }
    )
  } catch (error) {
    console.error('خطا در ثبت‌نام:', error.message)
    return new Response(
      JSON.stringify({
        message: error.message || 'مشکلی در ارتباط با سرور پیش آمده است',
      }),
      { status: 500 }
    )
  }
}
