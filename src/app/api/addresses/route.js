import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import User from '../../../../models/User'

await connectDB() // اتصال به دیتابیس

// دریافت آدرس‌های کاربر
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')?.trim()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.addresses, { status: 200 })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// ایجاد آدرس جدید
export async function POST(req) {
  try {
    const { userId, address } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!userId || !address) {
      return NextResponse.json(
        { message: 'userId and address are required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.addresses.push(address)
    await user.save()

    return NextResponse.json(user.addresses, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// ویرایش آدرس
export async function PUT(req) {
  try {
    const { userId, addressId, updatedAddress } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!userId || !addressId || !updatedAddress) {
      return NextResponse.json(
        { message: 'userId, addressId, and updatedAddress are required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    )
    if (addressIndex === -1) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      )
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...updatedAddress,
    }
    await user.save()

    return NextResponse.json(user.addresses, { status: 200 })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// حذف آدرس
export async function DELETE(req) {
  try {
    const { userId, addressId } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!userId || !addressId) {
      return NextResponse.json(
        { message: 'userId and addressId are required' },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    )
    await user.save()

    return NextResponse.json(user.addresses, { status: 200 })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
