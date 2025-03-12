'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { useEffect, useState } from 'react'

export default function ProductsList({ filters, selectedSort }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // ساخت URL با فیلترها
        const params = new URLSearchParams()

        if (filters?.selectedCategory?.length) {
          params.append('category', filters.selectedCategory.join(','))
        }

        if (filters?.selectedBrand?.length) {
          params.append('brands', filters.selectedBrand.join(','))
        }

        if (filters?.priceRange?.length === 2) {
          params.append('minPrice', filters.priceRange[0])
          params.append('maxPrice', filters.priceRange[1])
        }

        if (selectedSort) {
          params.append('sort', selectedSort)
        }

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'مشکلی در دریافت محصولات وجود دارد.')
        }

        setProducts(data)
      } catch (error) {
        console.error('❌ خطا در دریافت محصولات:', error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters, selectedSort]) // ارسال دوباره درخواست به API در صورت تغییر فیلترها یا مرتب‌سازی

  return (
    <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
      ) : error ? (
        <p className="text-center text-red-500 col-span-3">{error}</p>
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard1 key={product._id} product={product} />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-3">محصولی یافت نشد.</p>
      )}
    </div>
  )
}
