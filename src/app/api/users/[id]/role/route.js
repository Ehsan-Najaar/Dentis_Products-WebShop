import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import User from '../../../../../../models/User'

export async function PUT(request, { params }) {
  const session = await getServerSession()

  // بررسی اینکه کاربر لاگین کرده باشد
  if (!session || !session.user) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
  }

  // بررسی اینکه فقط ادمین‌ها اجازه تغییر نقش دارند
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { message: 'شما مجاز به انجام این عملیات نیستید' },
      { status: 403 }
    )
  }

  const { id } = params
  const { role } = await request.json()

  try {
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    // جلوگیری از تغییر نقش ادمین اصلی (اختیاری)
    if (user.role === 'admin' && session.user.email === user.email) {
      return NextResponse.json(
        { message: 'نمی‌توانید نقش خود را تغییر دهید' },
        { status: 403 }
      )
    }

    user.role = role
    await user.save()

    return NextResponse.json({ message: 'نقش کاربر با موفقیت تغییر کرد', user })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { message: 'خطا در ویرایش سطح دسترسی' },
      { status: 500 }
    )
  }
}
