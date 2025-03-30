'use client'

import FilterSidebar from '@/components/FilterSidebar'
import ProductsList from '@/components/ProductsList'
import Toolbar from '@/components/Toolbar'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState(() => ({
    priceRange: [0, 20000000],
    selectedBrand: [],
    selectedCategory: [],
    selectedOrigin: [],
  }))

  const [selectedSort, setSelectedSort] = useState('price-asc')
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()

        if (res.ok) {
          setAllProducts(data) // ذخیره همه محصولات یکبار
        }
      } catch (error) {
        console.error('خطا در دریافت داده‌های فیلتر:', error)
      }
    }

    fetchFiltersData()
  }, [])

  const brands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand?.trim()).filter(Boolean))],
    [allProducts]
  )

  const origins = useMemo(
    () => [
      ...new Set(allProducts.map((p) => p.origin?.trim()).filter(Boolean)),
    ],
    [allProducts]
  )

  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.category))],
    [allProducts]
  )

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (filters.selectedCategory?.length) {
          params.append(
            'category',
            filters.selectedCategory.map((c) => c.trim()).join(',')
          )
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

    fetchProducts()
  }, [filters, selectedSort])

  const handleApplyFilters = useCallback((appliedFilters) => {
    setFilters({ ...appliedFilters })
  }, [])

  return (
    <div className="max-w-7xl mx-auto flex gap-12 px-6 lg:px-0">
      <section className="hidden lg:block w-1/4 h-fit sticky top-4">
        <FilterSidebar
          categories={categories}
          brands={brands}
          origins={origins}
          priceMin={0}
          priceMax={20000000}
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
        />
      </section>

      <section className="w-full lg:w-3/4 space-y-4 pb-24 lg:pb-0">
        <Toolbar
          sortOptions={[
            { label: 'ارزان‌ترین', value: 'price-asc' },
            { label: 'گران‌ترین', value: 'price-desc' },
          ]}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        <ProductsList products={products} error={error} loading={loading} />
      </section>
    </div>
  )
}
