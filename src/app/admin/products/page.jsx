'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import AdminProductsList from '@/components/AdminProducstList'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus, FiSearch } from 'react-icons/fi'
import { useAppContext } from '../../../../context/AppContext'

export default function ProductsManagment() {
  const { showToast } = useAppContext()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('default')

  // دریافت لیست محصولات
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        setError('خطا در دریافت محصولات')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // دریافت لیست دسته‌بندی‌ها
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        showToast('خطا در دریافت دسته بندی ها', 'error')
      }
    }
    fetchCategories()
  }, [showToast])

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      setProducts((prev) => prev.filter((product) => product._id !== id))
      showToast('محصول با موفقیت حذف شد', 'success')
    } catch (error) {
      showToast('خطا در حذف محصول', 'error')
    }
  }

  // فیلتر و مرتب‌سازی محصولات
  const filteredAndSortedProducts = products
    .filter((product) => !categoryFilter || product.category === categoryFilter)
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (!statusFilter) return true
      if (statusFilter === 'available') return product.quantity > 0
      if (statusFilter === 'unavailable') return product.quantity === 0
      if (statusFilter === 'low-stock')
        return product.quantity > 0 && product.quantity <= 3
      return true
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price
      if (sortOrder === 'desc') return b.price - a.price
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <ProtectedRoute>
      <div className="min-h-screen lg:h-[710px] lg:flex p-6 gap-12">
        <AdminPanelNavbar />

        <div className="w-full lg:w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-0">
            <div className="w-full lg:w-1/3 flex items-center gap-2">
              <button
                onClick={() => (window.location.href = '/admin')}
                className="lg:hidden p-2 rounded-full bg-bg hover:bg-gray-300"
              >
                <FiArrowRight size={24} />
              </button>
              <h2 className="h3">لیست محصولات</h2>
              <small>({filteredAndSortedProducts.length}) محصول</small>
            </div>

            <div className="w-full lg:w-1/3 flex items-center gap-2">
              <div className="w-full flex items-center gap-2 px-4 py-2 bg-light shadow-sm rounded-full">
                <input
                  type="text"
                  placeholder="جستجو نام محصول..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                />
                <FiSearch size={24} className="text-gray-500" />
              </div>

              <Link
                href={'/admin/products/add-product'}
                className="lg:hidden btn-primary rounded-full shadow-sm"
              >
                <FiPlus size={24} />
              </Link>
            </div>

            <Link
              href={'/admin/products/add-product'}
              className="hidden lg:flex btn-primary rounded-full shadow-sm"
            >
              افزودن محصول <FiPlus size={24} />
            </Link>
          </div>

          <div className="flex items-center justify-between lg:mt-16 mt-8 mb-6">
            <h3 className="hidden xl:block h3">فیلتر و مرتب‌سازی محصولات</h3>
            <div className="w-full lg:w-max flex flex-col sm:flex-row items-center gap-6">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full lg:w-52 bg-light p-4 rounded-lg"
              >
                <option value="">همه دسته‌بندی‌ها</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full lg:w-52 bg-light p-4 rounded-lg"
              >
                <option value="default">جدیدترین</option>
                <option value="asc">ارزان‌ترین</option>
                <option value="desc">گران‌ترین</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full lg:w-52 bg-light p-4 rounded-lg"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="available">موجود</option>
                <option value="unavailable">ناموجود</option>
                <option value="low-stock">در حال اتمام</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && filteredAndSortedProducts.length === 0 && (
            <p className="text-center text-gray-600">هیچ محصولی یافت نشد.</p>
          )}
          {!loading && !error && filteredAndSortedProducts.length > 0 && (
            <AdminProductsList
              products={filteredAndSortedProducts}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
