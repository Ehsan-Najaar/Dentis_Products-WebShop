'use client'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function FilterSidebar({
  categories,
  brands,
  origins,
  priceMin,
  priceMax,
  filters = {},
  setFilters,
  onApplyFilters,
}) {
  const pathname = usePathname()
  const [tempFilters, setTempFilters] = useState({
    priceRange: filters.priceRange || [priceMin, priceMax],
    selectedBrand: filters.selectedBrand || [],
    selectedOrigin: filters.selectedOrigin || [],
  })
  const [isOpen, setIsOpen] = useState({
    brands: false,
    origins: false,
    price: false,
  })

  useEffect(() => {
    const categorySlug = decodeURIComponent(pathname.split('/').pop()).replace(
      /-/g,
      ' '
    )
    const matchedCategory = categories.find((cat) => cat.slug === categorySlug)
    setTempFilters((prev) => ({
      ...prev,
      selectedCategory: matchedCategory?._id || '',
    }))
  }, [pathname, categories])

  const handleCheckboxChange = (e, type) => {
    const { value } = e.target
    setTempFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }))
  }

  const handleSliderChange = (_, newValue) => {
    setTempFilters((prev) => ({ ...prev, priceRange: newValue }))
  }

  const clearFilters = () => {
    const resetFilters = {
      priceRange: [priceMin, priceMax],
      selectedBrand: [],
      selectedOrigin: [],
      selectedCategory: '',
    }
    setFilters(resetFilters)
    setTempFilters(resetFilters)
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    onApplyFilters?.(tempFilters)
  }

  const toggleSection = (section) => {
    setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="bg-lightGray p-6 rounded-2xl text-dark shadow-lg w-full max-w-xs">
      <h2 className="text-xl font-bold pb-2 border-b border-gray-400 mb-6">
        فیلترها
      </h2>
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={clearFilters}
          className="py-2 px-4 rounded-xl bg-gray-300 text-gray-700 text-sm w-full sm:w-auto transition hover:bg-gray-400"
        >
          حذف فیلتر
        </button>
        <button
          onClick={applyFilters}
          className="py-2 px-4 rounded-xl bg-primary text-light text-sm w-full sm:w-auto transition hover:bg-opacity-90"
        >
          اعمال فیلتر
        </button>
      </div>
      {[
        { key: 'selectedBrand', label: 'برندها', values: brands },
        { key: 'selectedOrigin', label: 'کشور سازنده', values: origins },
      ].map(({ key, label, values }) => (
        <div key={key} className="mb-6">
          <div
            className={`flex items-center justify-between cursor-pointer p-2 rounded-lg bg-bg ${
              isOpen ? 'rounded-b-none' : ''
            }`}
            onClick={() => toggleSection(key)}
          >
            <h3 className="body-text">{label}</h3>
            {isOpen[key] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isOpen[key] && (
            <ul className="space-y-2 max-h-48 overflow-y-auto bg-bg p-4">
              {values?.length ? (
                values.map((value) => (
                  <li key={value} className="flex items-center gap-2">
                    <input
                      id={`${key}-checkbox-${value}`}
                      type="checkbox"
                      value={value}
                      checked={tempFilters[key].includes(value)}
                      onChange={(e) => handleCheckboxChange(e, key)}
                      className="cursor-pointer w-4 h-4 accent-primary"
                    />
                    <label
                      htmlFor={`${key}-checkbox-${value}`}
                      className="text-sm cursor-pointer"
                    >
                      {value}
                    </label>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">داده‌ای یافت نشد</p>
              )}
            </ul>
          )}
        </div>
      ))}
      <div>
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg bg-bg ${
            isOpen ? 'rounded-b-none' : ''
          }`}
          onClick={() => toggleSection('price')}
        >
          <h3 className="body-text">محدوده قیمت</h3>
          {isOpen.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isOpen.price && (
          <Box sx={{ width: '100%' }} className="bg-bg mx-auto p-6 w-full">
            <Slider
              value={tempFilters.priceRange}
              onChange={handleSliderChange}
              min={priceMin}
              max={priceMax}
              step={1000}
              sx={{ color: '#5B52A3' }}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-semibold">
                {tempFilters.priceRange[1].toLocaleString()} تومان
              </span>
              <span className="font-semibold">
                {tempFilters.priceRange[0].toLocaleString()} تومان
              </span>
            </div>
          </Box>
        )}
      </div>
    </div>
  )
}
