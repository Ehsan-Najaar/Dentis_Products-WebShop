import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import Product from '../../../../models/Product'

export async function GET(request) {
  await connectDB()

  const { searchParams } = new URL(request.url)

  // دریافت و پردازش فیلترها
  const category =
    searchParams
      .get('category')
      ?.split(',')
      .map((c) => c.trim()) || []
  const brand = searchParams.get('brand')?.trim() || ''
  const brands =
    searchParams
      .get('brands')
      ?.split(',')
      .map((b) => b.trim()) || []
  const origins =
    searchParams
      .get('origins')
      ?.split(',')
      .map((o) => o.trim()) || []
  const minPrice = Number(searchParams.get('minPrice')) || 0
  const maxPrice = Number(searchParams.get('maxPrice')) || Infinity
  const sort = searchParams.get('sort')

  // ساخت کوئری
  let query = {}

  if (category.length) {
    query.category = { $in: category }
  }

  if (brand) {
    query.brand = new RegExp(`^${brand}$`, 'i') // بررسی دقیق برند با حساسیت غیرفعال روی حروف بزرگ و کوچک
  }

  if (brands.length) {
    query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) }
  }

  if (origins.length) {
    query.origin = { $in: origins }
  }

  query.price = { $gte: minPrice, $lte: maxPrice }

  console.log('✅ کوئری نهایی برای MongoDB:', query)

  try {
    let sortQuery = {}
    if (sort === 'price-asc') sortQuery.price = 1
    if (sort === 'price-desc') sortQuery.price = -1

    let products = await Product.find(query).sort(sortQuery)

    console.log('📡 تعداد محصولات پیدا شده:', products.length)

    return NextResponse.json(products)
  } catch (error) {
    console.error('❌ خطا در دریافت محصولات:', error.message)
    return NextResponse.json(
      { message: 'خطایی رخ داد', error: error.message },
      { status: 500 }
    )
  }
}
