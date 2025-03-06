import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import User from '../../../../models/User'

export async function GET() {
  try {
    await connectDB() // اتصال به MongoDB
    const users = await User.find({}, '_id name email role createdAt') // اضافه کردن createdAt

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error) // برای خطایابی بیشتر
    return NextResponse.json(
      { message: 'خطا در دریافت کاربران' },
      { status: 500 }
    )
  }
}
