'use client'

import FilterSidebar from '@/components/FilterSidebar'
import ProductsList from '@/components/ProductsList'
import Toolbar from '@/components/Toolbar'
import { useEffect, useMemo, useState } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([]) // همه محصولات از API
  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedBrand: [],
    selectedCategory: [],
  })
  const [selectedSort, setSelectedSort] = useState('price-asc')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (res.ok) {
          setProducts(data)
        }
      } catch (error) {
        console.error('خطا در دریافت محصولات:', error)
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  )
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  )

  const priceMin = useMemo(
    () => (products.length ? Math.min(...products.map((p) => p.price)) : 0),
    [products]
  )
  const priceMax = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.price)) : 0),
    [products]
  )

  return (
    <div className="max-w-7xl mx-auto flex gap-12">
      {/* سایدبار فیلترها */}
      <section className="w-1/4 h-fit sticky top-4">
        <FilterSidebar
          categories={categories}
          brands={brands}
          priceMin={priceMin}
          priceMax={priceMax}
          onApplyFilters={(appliedFilters) => setFilters(appliedFilters)}
        />
      </section>

      {/* لیست محصولات */}
      <section className="w-3/4 space-y-4">
        <Toolbar
          sortOptions={[
            { label: 'ارزان‌ترین', value: 'price-asc' },
            { label: 'گران‌ترین', value: 'price-desc' },
          ]}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        <ProductsList filters={filters} selectedSort={selectedSort} />
      </section>
    </div>
  )
}
