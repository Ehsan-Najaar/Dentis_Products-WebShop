'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { useEffect, useState } from 'react'

export default function ProductsList({ filters, selectedSort }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const res = await fetch('/api/products')
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
  }, [])

  if (loading)
    return <p className="text-center text-gray-500">در حال بارگذاری...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  // فیلتر کردن محصولات
  let filteredProducts = products.filter((product) => product.quantity > 0)

  if (filters?.selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === filters.selectedCategory
    )
  }

  if (filters?.selectedBrand?.length) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.selectedBrand.includes(product.brand)
    )
  }

  if (filters?.priceRange?.length === 2) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    )
  }

  // مرتب‌سازی در فرانت‌اند
  if (selectedSort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (selectedSort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard1 key={product._id} product={product} />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-3">محصولی یافت نشد.</p>
      )}
    </div>
  )
}
