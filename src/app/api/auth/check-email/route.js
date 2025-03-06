// /src/app/api/check-email/route.js
import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/db'
import User from '../../../../../models/User'

export async function POST(req) {
  try {
    const body = await req.json()
    if (!body.email) {
      return NextResponse.json(
        { error: 'ایمیل ارسال نشده است' },
        { status: 400 }
      )
    }

    await connectDB() // اتصال به دیتابیس

    const user = await User.findOne({ email: body.email })
    return NextResponse.json({ exists: !!user }) // اگر کاربر وجود دارد، exists: true
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'مشکلی در ارتباط با سرور پیش آمده است' },
      { status: 500 }
    )
  }
}
