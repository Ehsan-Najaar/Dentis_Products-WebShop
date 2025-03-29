import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import User from '../../../../models/User'

export async function GET(req) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    console.log('Session:', session) // مقدار سشن را چاپ کن

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }

    const users = await User.find({}, '_id name email role createdAt')
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'خطا در دریافت کاربران' },
      { status: 500 }
    )
  }
}
