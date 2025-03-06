import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Product from '../../../../models/Product'

export async function GET() {
  await connectDB()

  try {
    const brands = await Product.distinct('brand')
    const origins = await Product.distinct('origin')

    return NextResponse.json({ brands, origins }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'خطایی رخ داد', error: error.message },
      { status: 500 }
    )
  }
}
