'use client'

import SearchContent from '@/components/SearchContent'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function SearchModal({ isOpen, onClose }) {
  const pathname = usePathname()

  // بستن مودال هنگام تغییر مسیر
  useEffect(() => {
    if (pathname.startsWith('/products/')) {
      onClose()
    }
  }, [pathname, onClose])

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

        {/* محتوای جستجو */}
        <SearchContent />
      </div>
    </div>
  )
}
