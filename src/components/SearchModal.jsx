'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiLoader, FiSearch, FiX } from 'react-icons/fi'

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/products/')) {
      onClose()
    }
  }, [pathname, onClose])

  // پاک کردن ورودی جستجو و نتایج در صورت بسته شدن مودال
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setResults([])
    }
  }, [isOpen])

  // دریافت نتایج جستجو از API زمانی که searchTerm تغییر می‌کند
  useEffect(() => {
    if (searchTerm.trim()) {
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
          />
        </div>

        {/* نمایش لودینگ یا نتایج */}
        {loading ? (
          <div className="h-96 grid place-items-center text-gray-500">
            <FiLoader size={48} />
          </div>
        ) : (
          <div className="w-full grid grid-cols-4 gap-4 h-96 max-h-96 overflow-auto p-4">
            {/* نمایش محصولات یا پیام "محصولی یافت نشد" */}
            {results.length > 0 ? (
              results.map((product) => (
                <div key={product._id}>
                  <ProductCard1 product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-4 w-full h-12 flex items-center justify-center text-gray-500">
                <p>محصولی یافت نشد.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
