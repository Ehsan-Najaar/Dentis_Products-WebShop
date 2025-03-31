'use client'

import FilterSidebar from '@/components/FilterSidebar'
import ProductsList from '@/components/ProductsList'
import Toolbar from '@/components/Toolbar'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function ProductsListCategoryPage() {
  const { category } = useParams()
  const formattedCategoryName = decodeURIComponent(category).replace(/-/g, ' ')

  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState(() => ({
    priceRange: [0, 20000000],
    selectedBrand: [],
    selectedCategory: [formattedCategoryName],
    selectedOrigin: [],
  }))

  const [selectedSort, setSelectedSort] = useState('views-desc')
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (res.ok) {
          setCategories(data)
        }
      } catch (error) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const categoryData = categories.find(
          (c) => c.name === formattedCategoryName
        )
        const categoryId = categoryData ? categoryData._id : null

        const params = new URLSearchParams()
        if (categoryId) {
          params.append('category', categoryId)
        }
        if (filters.selectedBrand?.length) {
          params.append(
            'brands',
            filters.selectedBrand.map((b) => b.trim()).join(',')
          )
        }
        if (filters.selectedOrigin?.length) {
          params.append(
            'origins',
            filters.selectedOrigin.map((o) => o.trim()).join(',')
          )
        }
        if (filters.priceRange?.length === 2) {
          params.append('minPrice', filters.priceRange[0])
          params.append('maxPrice', filters.priceRange[1])
        }
        if (selectedSort) {
          params.append('sort', selectedSort)
        }

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (res.ok) {
          setProducts(data)
          setAllProducts(data)
        } else {
          setError(data.message || 'مشکلی در دریافت محصولات وجود دارد.')
        }
      } catch (error) {
        console.error('خطا در دریافت محصولات:', error)
        setError('خطا در دریافت محصولات')
      } finally {
        setLoading(false)
      }
    }

    if (categories.length > 0) {
      fetchProducts()
    }
  }, [formattedCategoryName, categories, filters, selectedSort])

  const handleApplyFilters = useCallback((appliedFilters) => {
    setFilters({ ...appliedFilters })
  }, [])

  return (
    <div className="max-w-7xl mx-auto flex gap-12 px-6 lg:px-0">
      <section className="hidden lg:block w-1/4 h-fit sticky top-4">
        <FilterSidebar
          categories={categories.map((c) => c.name)}
          brands={[
            ...new Set(allProducts.map((p) => p.brand?.trim()).filter(Boolean)),
          ]}
          origins={[
            ...new Set(
              allProducts.map((p) => p.origin?.trim()).filter(Boolean)
            ),
          ]}
          priceMin={0}
          priceMax={20000000}
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
        />
      </section>

      <section className="w-full lg:w-3/4 space-y-4 pb-24 lg:pb-0">
        <h1 className="text-xl font-bold">
          دسته‌بندی: {formattedCategoryName}
        </h1>

        <Toolbar
          sortOptions={[
            { label: 'پربازدیدترین', value: 'views-desc' },
            { label: 'ارزان‌ترین', value: 'price-asc' },
            { label: 'گران‌ترین', value: 'price-desc' },
          ]}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          products={products}
        />

        <ProductsList products={products} error={error} loading={loading} />
      </section>
    </div>
  )
}
