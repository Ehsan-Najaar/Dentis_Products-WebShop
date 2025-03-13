'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const pathname = usePathname()

  // بستن مودال هنگام تغییر مسیر
  useEffect(() => {
    if (pathname.startsWith('/products/')) {
      onClose()
    }
  }, [pathname, onClose])

  // پاک کردن وضعیت‌ها هنگام بسته شدن مودال
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setResults([])
      setSearched(false)
    }
  }, [isOpen])

  // جستجو در محصولات
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearched(true)
      const fetchResults = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/products?search=${searchTerm}`)
          const data = await response.json()
          setResults(data || [])
        } catch (error) {
          console.error('Error fetching data:', error)
          setResults([])
        }
        setLoading(false)
      }

      fetchResults()
    } else {
      setResults([])
      setSearched(false)
    }
  }, [searchTerm])

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center items-center transition-all duration-300 z-50 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded-lg w-[1280px] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن مودال */}
        <button
          onClick={onClose}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-light rounded-full p-2"
          aria-label="بستن جستجو"
        >
          <FiX size={24} />
        </button>

        {/* فیلد جستجو */}
        <div className="bg-bg rounded-lg pr-4 flex items-center gap-4">
          <span className="text-gray-400">
            <FiSearch size={24} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در محصولات ما ..."
            className="input"
            aria-label="جستجو"
            autoComplete="off" // غیرفعال کردن autofill
            name="search_input" // اضافه کردن name برای جلوگیری از autofill
            id="search_input" // اضافه کردن id برای شفافیت بیشتر
          />
        </div>

        {/* نمایش لودینگ یا نتایج */}
        {loading ? (
          <div className="w-full grid grid-cols-4 gap-4 h-96 max-h-96 overflow-auto p-4">
            {/* نمایش اسکللتون به عنوان لودینگ */}
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full grid grid-cols-4 gap-4 h-96 max-h-96 overflow-auto p-4">
            {/* نمایش نتایج یا پیام "محصولی یافت نشد" */}
            {searched && results.length === 0 ? (
              <div className="col-span-4 w-full h-12 flex items-center justify-center text-gray-500">
                <p>محصولی یافت نشد.</p>
              </div>
            ) : (
              results.map((product) => (
                <div key={product._id}>
                  <ProductCard1 product={product} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
