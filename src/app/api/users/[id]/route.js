import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import User from '../../../../../models/User'

// دریافت اطلاعات کاربر
export async function GET(request, { params }) {
  const { id } = params
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await User.findById(id).select('-password')

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    // فقط مدیر یا خود کاربر می‌تواند اطلاعات را دریافت کند
    if (session.user.role !== 'admin' && session.user.id !== id) {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
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

// ویرایش اطلاعات کاربر
export async function PUT(request, { params }) {
  const { id } = params
  const { name, mobile, addresses, password } = await request.json()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    // فقط مدیر یا خود کاربر می‌تواند اطلاعات را ویرایش کند
    if (session.user.role !== 'admin' && session.user.id !== id) {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }

    // به‌روزرسانی اطلاعات کاربر
    if (name) user.name = name
    if (mobile && /^\d{10,15}$/.test(mobile)) user.mobile = mobile
    if (addresses) user.addresses = addresses
    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user info:', error)
    return NextResponse.json(
      { message: 'خطا در به‌روزرسانی اطلاعات' },
      { status: 500 }
    )
  }
}
