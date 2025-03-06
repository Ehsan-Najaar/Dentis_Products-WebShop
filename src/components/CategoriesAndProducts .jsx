'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

const CategoriesAndProducts = () => {
  // وضعیت‌های ذخیره دسته‌بندی‌ها، محصولات و محصولات فیلتر شده
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')

  // دریافت داده‌های دسته‌بندی و محصولات از API هنگام بارگذاری صفحه
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories').then((res) => res.json()),
          fetch('/api/products').then((res) => res.json()),
        ])

        // تبدیل `_id` به رشته و اضافه کردن گزینه "همه"
        const formattedCategories = [
          { _id: 'all', name: 'همه' },
          ...categoriesRes.map((cat) => ({
            ...cat,
            _id: String(cat._id),
          })),
        ]

        // تبدیل `_id` و `category` محصولات به رشته برای جلوگیری از مشکلات مقایسه‌ای
        const formattedProducts = productsRes.map((product) => ({
          ...product,
          category: String(product.category),
          _id: String(product._id),
        }))

        setCategories(formattedCategories)
        setProducts(formattedProducts)
        setFilteredProducts(formattedProducts.slice(0, 8))
      } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error)
      }
    }

    fetchData()
  }, [])

  // مدیریت کلیک روی دسته‌بندی و فیلتر محصولات
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)

    if (categoryId === 'all') {
      setFilteredProducts(products.slice(0, 8))
    } else {
      const filtered = products.filter(
        (product) => product.category === categoryId
      )
      setFilteredProducts(filtered.slice(0, 8))
    }
  }

  return (
    <section
      className="max-w-7xl mx-auto space-y-6"
      aria-labelledby="categories-products"
    >
      {/* هدر بخش محصولات */}
      <header
        className="flex items-center justify-between"
        id="categories-products"
      >
        <h2 className="h2">دسته‌بندی محصولات ما</h2>
        <Link href="/products">
          <button
            className="btn-primary rounded-full flex items-center gap-2"
            aria-label="مشاهده محصولات بیشتر"
          >
            دیدن محصولات بیشتر
            <FiArrowLeft size={24} />
          </button>
        </Link>
      </header>

      {/* لیست دسته‌بندی‌ها */}
      <div
        className="relative flex items-center flex-wrap gap-6 mb-6 border-b pb-2"
        aria-live="polite"
      >
        {categories.map((category) => (
          <span
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`relative cursor-pointer transition-all px-2 pb-2 body-text ${
              activeCategory === category._id
                ? 'text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            aria-current={activeCategory === category._id ? 'true' : 'false'}
          >
            {category.name}
            {/* انیمیشن خط اکتیو (از راست به چپ) */}
            {activeCategory === category._id && (
              <motion.div
                layoutId="underline"
                className="absolute right-0 bottom-0 h-1 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%', right: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </span>
        ))}
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-4 gap-6" aria-live="polite">
        {filteredProducts.filter((product) => product.quantity > 0).length >
        0 ? (
          filteredProducts
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <ProductCard1 key={product._id} product={product} />
            ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">
            محصولی یافت نشد
          </p>
        )}
      </div>
    </section>
  )
}

export default CategoriesAndProducts
