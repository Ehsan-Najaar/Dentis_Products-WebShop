'use client'

import FilterSidebar from '@/components/FilterSidebar'
import ProductsList from '@/components/ProductsList'
import Toolbar from '@/components/Toolbar'
import { useEffect, useMemo, useState } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([]) // همه محصولات از API
  const [brands, setBrands] = useState([]) // برندها
  const [origins, setOrigins] = useState([]) // کشورها
  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedBrand: [],
    selectedCategory: [],
  })
  const [selectedSort, setSelectedSort] = useState('price-asc')

  // ارسال درخواست به API و دریافت برندها و کشورها
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const res = await fetch('/api/products') // درخواست برای برندها و کشورها
        const data = await res.json()

        if (res.ok) {
          setBrands(data.brands)
          setOrigins(data.origins)
        }
      } catch (error) {
        console.error('خطا در دریافت داده‌های فیلتر:', error)
      }
    }

    fetchFiltersData()
  }, []) // اجرا هنگام بارگذاری صفحه

  // ارسال درخواست به API برای دریافت محصولات با فیلترهای فعال
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()

        if (filters.selectedCategory.length) {
          params.append('category', filters.selectedCategory.join(','))
        }

        if (filters.selectedBrand.length) {
          params.append('brands', filters.selectedBrand.join(','))
        }

        if (filters.priceRange[0] > 0 || filters.priceRange[1] > 0) {
          params.append('minPrice', filters.priceRange[0])
          params.append('maxPrice', filters.priceRange[1])
        }

        if (selectedSort) {
          params.append('sort', selectedSort)
        }

        // ارسال درخواست به API با فیلترها
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()

        if (res.ok) {
          setProducts(data)
        }
      } catch (error) {
        console.error('خطا در دریافت محصولات:', error)
      }
    }

    fetchProducts()
  }, [filters, selectedSort]) // اجرا هنگام تغییر فیلترها یا مرتب‌سازی

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
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
    <div className="max-w-7xl mx-auto flex gap-12 px-6 lg:px-0">
      {/* سایدبار فیلترها */}
      <section className="hidden lg:block w-1/4 h-fit sticky top-4">
        <FilterSidebar
          categories={categories}
          brands={brands} // ارسال برندها به فیلتر سایدبار
          origins={origins} // ارسال کشورها به فیلتر سایدبار
          priceMin={priceMin}
          priceMax={priceMax}
          onApplyFilters={(appliedFilters) => setFilters(appliedFilters)}
        />
      </section>

      {/* لیست محصولات */}
      <section className="w-full lg:w-3/4 space-y-4 pb-24 lg:pb-0">
        <Toolbar
          sortOptions={[
            { label: 'ارزان‌ترین', value: 'price-asc' },
            { label: 'گران‌ترین', value: 'price-desc' },
          ]}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        <ProductsList products={products} />
      </section>
    </div>
  )
}
