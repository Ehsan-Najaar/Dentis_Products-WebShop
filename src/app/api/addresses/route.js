import { NextResponse } from 'next/server'
import User from '../../../../models/User'

// دریافت آدرس‌ها
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.addresses)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// ایجاد آدرس جدید
export async function POST(req) {
  const { userId, address } = await req.json()

  if (!userId || !address) {
    return NextResponse.json(
      { message: 'userId and address are required' },
      { status: 400 }
    )
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // اضافه کردن آدرس به آرایه addresses
    user.addresses.push(address)
    await user.save() // ذخیره تغییرات در پایگاه داده

    return NextResponse.json(user.addresses) // ارسال آدرس‌های به‌روز‌شده
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// ویرایش آدرس
export async function PUT(req) {
  const { userId, addressId, updatedAddress } = await req.json()

  if (!userId || !addressId || !updatedAddress) {
    return NextResponse.json(
      { message: 'userId, addressId, and updatedAddress are required' },
      { status: 400 }
    )
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // استفاده از _id به جای id
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId // تغییر به _id
    )
    if (addressIndex === -1) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      )
    }

    user.addresses[addressIndex] = updatedAddress
    await user.save()

    return NextResponse.json(user.addresses)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// حذف آدرس
export async function DELETE(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const addressId = searchParams.get('addressId')

  if (!userId || !addressId) {
    return NextResponse.json(
      { message: 'userId and addressId are required' },
      { status: 400 }
    )
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // فیلتر کردن آدرس‌ها و حذف آدرس موردنظر
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    )

    await user.save()

    return NextResponse.json(user.addresses)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
