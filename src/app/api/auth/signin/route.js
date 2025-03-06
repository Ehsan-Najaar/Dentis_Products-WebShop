import bcrypt from 'bcryptjs'
import connectDB from '../../../../../lib/db'
import User from '../../../../../models/User'

export async function POST(req) {
  const { email, password } = await req.json()

  // اتصال به دیتابیس
  await connectDB()

  // یافتن کاربر بر اساس ایمیل
  const user = await User.findOne({ email })
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'کاربری با این ایمیل پیدا نشد' }),
      { status: 400 }
    )
  }

  // مقایسه رمز عبور وارد شده با رمز عبور ذخیره‌شده
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: 'رمز عبور اشتباه است' }), {
      status: 400,
    })
  }

  // ورود موفق
  return new Response(JSON.stringify({ message: 'ورود موفقیت‌آمیز بود' }), {
    status: 200,
  })
}
