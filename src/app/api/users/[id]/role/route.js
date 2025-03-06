import { NextResponse } from 'next/server'
import User from '../../../../../../models/User'

export async function PUT(request, { params }) {
  const { id } = params
  const { role } = await request.json()

  console.log('Received role:', role) // برای بررسی داده‌ها

  try {
    // اطمینان از وجود کاربر
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    // به روز رسانی نقش کاربر
    user.role = role
    await user.save()

    console.log('Updated user:', user) // برای بررسی خروجی بعد از بروزرسانی

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user role:', error) // چاپ خطا در سرور
    return NextResponse.json(
      { message: 'خطا در ویرایش سطح دسترسی' },
      { status: 500 }
    )
  }
}
