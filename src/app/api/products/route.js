import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import slugify from 'slugify'
import connectDB from '../../../../lib/db'
import Product from '../../../../models/Product'

// 📌 دریافت محصولات با فیلتر، جستجو و مرتب‌سازی (GET)
export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brands = searchParams.get('brands')?.split(',')
    const origins = searchParams.get('origins')?.split(',')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') // مقدار مرتب‌سازی

    const filter = {}

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (brands?.length) {
      filter.brand = { $in: brands }
    }

    if (origins?.length) {
      filter.origin = { $in: origins }
    }

    if (category) {
      filter.category = category
    }

    // 📌 پردازش نوع مرتب‌سازی
    let sortQuery = {}

    if (sort === 'price-asc') {
      sortQuery = { price: 1 } // ارزان‌ترین اول
    } else if (sort === 'price-desc') {
      sortQuery = { price: -1 } // گران‌ترین اول
    } else if (sort === 'views-desc') {
      sortQuery = { views: -1 } // بیشترین بازدید
    }

    const products = await Product.find(filter).sort(sortQuery) // اضافه کردن مرتب‌سازی

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'خطا در دریافت محصولات' },
      { status: 500 }
    )
  }
}

// 📌 افزودن محصول جدید (POST)
export async function POST(req) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }

    // دریافت بدنه درخواست به عنوان متن خام
    const bodyText = await req.text()
    if (!bodyText) {
      return NextResponse.json(
        { message: 'بدنه درخواست خالی است' },
        { status: 400 }
      )
    }

    let body
    try {
      body = JSON.parse(bodyText)
    } catch (error) {
      return NextResponse.json(
        { message: 'فرمت JSON نامعتبر است' },
        { status: 400 }
      )
    }

    console.log('📥 دریافت داده در API:', body)

    if (!body.name) {
      return NextResponse.json(
        { message: 'نام محصول الزامی است' },
        { status: 400 }
      )
    }

    let slug = slugify(body.name, {
      lower: true,
      strict: true,
      replacement: '-',
      locale: 'fa',
    })

    let existingProduct = await Product.findOne({ slug })
    let count = 1

    while (existingProduct) {
      slug = `${slug}-${count}`
      existingProduct = await Product.findOne({ slug })
      count++
    }

    const newProduct = new Product({
      ...body,
      slug,
      view: 0,
    })

    await newProduct.save()

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('❌ خطا در ذخیره محصول:', error)
    return NextResponse.json(
      { message: 'خطا در افزودن محصول', error: error.message },
      { status: 500 }
    )
  }
}
