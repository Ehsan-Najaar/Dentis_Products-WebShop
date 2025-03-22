'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function SearchContent({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

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
    <div className="w-full space-y-6">
      {/* فیلد جستجو */}
      <div className="bg-lightGray rounded-lg pr-4 flex items-center gap-4">
        <span className="text-gray-400">
          <FiSearch size={24} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو در محصولات ما ..."
          className="input bg-lightGray"
          aria-label="جستجو"
        />
      </div>

      {/* نمایش لودینگ یا نتایج */}
      {loading ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 gap-12 lg:h-96 lg:max-h-96 lg:overflow-auto p-4 -mr-5">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 gap-12 lg:h-96 lg:max-h-96 lg:overflow-auto p-4 -mr-5">
          {searched && results.length === 0 ? (
            <div className="col-span-4 w-full h-12 flex items-center justify-center text-gray-500">
              <p>محصولی یافت نشد.</p>
            </div>
          ) : (
            results.map((product, index) => (
              <div
                key={product._id}
                className={`${
                  index === 0 || index === 1 ? 'mt-0' : 'mt-16 lg:mt-0'
                } ${index === 2 ? 'sm:mt-0' : ''}`}
              >
                <ProductCard1 product={product} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
