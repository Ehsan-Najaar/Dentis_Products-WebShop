'use server'

import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Shipping from '../../../../models/Shipping'

// دریافت هزینه ارسال
export async function getServerSideProps() {
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
  await connectDB()

  const { shippingCost } = await request.json()

  // بررسی مقدار معتبر بودن عدد
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

  let shippingInfo = await Shipping.findOne()

  if (!shippingInfo) {
    shippingInfo = new Shipping({ shippingCost })
  } else {
    shippingInfo.shippingCost = shippingCost
  }

  await shippingInfo.save()

  return NextResponse.json({ message: 'Shipping cost updated successfully' })
}
