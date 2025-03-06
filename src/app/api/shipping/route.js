'use server'

import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Shipping from '../../../../models/Shipping'

// دریافت هزینه ارسال
export async function GET(req) {
  try {
    // بررسی وجود داده برای هزینه ارسال
    const shippingData = await Shipping.findOne()

    if (!shippingData) {
      // در صورتی که داده ای وجود نداشته باشد، مقدار پیش‌فرض را ارسال کنید
      return new Response(
        JSON.stringify({ shippingCost: 50000 }), // 50000 تومان به عنوان پیش‌فرض
        { status: 200 }
      )
    }

    // استفاده از shippingCost به جای cost
    return new Response(
      JSON.stringify({ shippingCost: shippingData.shippingCost }),
      {
        status: 200,
      }
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
  await connectDB()
  const { shippingCost } = await request.json()
  const shippingInfo = await Shipping.findOne()

  if (!shippingInfo) {
    const newShipping = new Shipping({ shippingCost })
    await newShipping.save()
  } else {
    shippingInfo.shippingCost = shippingCost
    await shippingInfo.save()
  }

  return NextResponse.json({ message: 'Shipping cost updated successfully' })
}
