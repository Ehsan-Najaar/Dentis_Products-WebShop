'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'

const CategoriesAndProducts = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true) // اضافه کردن وضعیت لودینگ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories').then((res) => res.json()),
          fetch('/api/products').then((res) => res.json()),
        ])

        const formattedCategories = [
          { _id: 'all', name: 'همه' },
          ...categoriesRes.map((cat) => ({
            ...cat,
            _id: String(cat._id),
          })),
        ]

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
      } finally {
        setLoading(false) // پس از دریافت داده‌ها، لودینگ را غیرفعال کن
      }
    }

    fetchData()
  }, [])

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
    <section className="max-w-7xl mx-auto space-y-6 px-6 xl:px-0 pb-24 lg:pb-0">
      <header className="flex items-center justify-between">
        <h2 className="lg:h2 h4">دسته‌بندی محصولات ما</h2>
        <Link href="/products">
          <button className="btn-primary rounded-full text-sm whitespace-nowrap">
            <span>مشاهده همه</span>
            <FiArrowLeft size={20} />
          </button>
        </Link>
      </header>

      <div className="relative flex items-center gap-6 mb-6 border-b p-4 overflow-x-auto whitespace-nowrap md:flex-wrap">
        {categories.map((category) => (
          <span
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`relative cursor-pointer transition-all px-2 pb-2 body-text ${
              activeCategory === category._id
                ? 'text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            {category.name}
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

      {/* نمایش اسکلتون در هنگام لودینگ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className={`${
                index === 0 || index === 1 ? 'mt-0' : 'mt-24 lg:mt-0'
              } ${index === 2 ? 'md:mt-0' : ''}`}
            >
              <ProductCard1 product={product} />
            </div>
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
