// /app/api/products/route.js
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Product from '../../../../models/Product'

export async function GET(request) {
  await connectDB()

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')?.split(',')
  const brands = searchParams.get('brands')?.split(',')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort')

  let query = {}

  // فیلتر بر اساس دسته‌بندی
  if (category && category.length) {
    query.category = { $in: category }
  }

  // فیلتر بر اساس برندها
  if (brands && brands.length) {
    query.brand = { $in: brands }
  }

  // فیلتر بر اساس قیمت
  if (minPrice && maxPrice) {
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) }
  }

  try {
    let products = await Product.find(query)

    // مرتب‌سازی
    if (sort === 'price-asc') {
      products = products.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      products = products.sort((a, b) => b.price - a.price)
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: 'خطایی رخ داد', error: error.message },
      { status: 500 }
    )
  }
}
