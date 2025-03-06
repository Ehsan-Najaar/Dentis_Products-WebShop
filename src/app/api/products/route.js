import { NextResponse } from 'next/server'
import slugify from 'slugify' // حتماً نصبش کن
import connectDB from '../../../../lib/db'
import Product from '../../../../models/Product'

// 📌 دریافت محصولات با فیلتر و جستجو (GET)
export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') // 🔹 مقدار جستجو
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const brands = searchParams.get('brands')?.split(',')
    const origins = searchParams.get('origins')?.split(',')
    const category = searchParams.get('category')

    const filter = {}

    // 🔹 افزودن جستجو در نام محصول
    if (search) {
      filter.name = { $regex: search, $options: 'i' } // جستجو بدون حساسیت به حروف بزرگ و کوچک
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

    const products = await Product.find(filter)

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

    const body = await req.json()
    console.log('📥 دریافت داده در API:', body)

    // بررسی مقدار `name`
    if (!body.name) {
      return NextResponse.json(
        { message: 'نام محصول الزامی است' },
        { status: 400 }
      )
    }

    // ایجاد مقدار `slug` بهینه‌شده
    let slug = slugify(body.name, {
      lower: true,
      strict: true,
      replacement: '-', // فاصله‌ها به خط تیره تبدیل می‌شوند
      locale: 'fa', // تنظیم زبان به فارسی برای تبدیل بهتر کاراکترها
    })

    // بررسی یکتا بودن `slug`
    let existingProduct = await Product.findOne({ slug })
    let count = 1

    while (existingProduct) {
      slug = `${slug}-${count}`
      existingProduct = await Product.findOne({ slug })
      count++
    }

    const newProduct = new Product({
      ...body,
      slug, // مقدار `slug` را اضافه کن
      view: 0, // مقدار `views` رو اصلاح کردم
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
