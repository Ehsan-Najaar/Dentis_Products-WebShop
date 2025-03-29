'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Shipping from '../../../../models/Shipping'

// دریافت هزینه ارسال
export async function GET(req) {
  try {
    await connectDB() // اتصال به دیتابیس

    const shippingData = await Shipping.findOne()

    if (!shippingData) {
      return new Response(JSON.stringify({ shippingCost: 50000 }), {
        status: 200,
      })
    }

    return new Response(
      JSON.stringify({ shippingCost: shippingData.shippingCost }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching shipping cost:', error)
    return new Response(
      JSON.stringify({ message: 'Error fetching shipping cost' }),
      { status: 500 }
    )
  }
}

// تغییر هزینه ارسال
export async function PUT(request) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const { shippingCost } = await request.json()

    // بررسی معتبر بودن مقدار
    if (
      typeof shippingCost !== 'number' ||
      isNaN(shippingCost) ||
      shippingCost < 0
    ) {
      return NextResponse.json(
        { message: 'Invalid shipping cost' },
        { status: 400 }
      )
    }

    // بررسی اینکه آیا مقدار قبلاً وجود داشته یا نه
    const shippingInfo = await Shipping.findOneAndUpdate(
      {},
      { shippingCost },
      { new: true, upsert: true }
    )

    return NextResponse.json({
      message: 'Shipping cost updated successfully',
      shippingCost: shippingInfo.shippingCost,
    })
  } catch (error) {
    console.error('Error updating shipping cost:', error)
    return NextResponse.json(
      { message: 'Error updating shipping cost', error: error.message },
      { status: 500 }
    )
  }
}
