'use client'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function FilterSidebar({ onApplyFilters, setFiltersOpen }) {
  const [priceRange, setPriceRange] = useState([0, 7500000])
  const [selectedBrand, setSelectedBrand] = useState([])
  const [selectedOrigin, setSelectedOrigin] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const pathname = usePathname()

  const [brands, setBrands] = useState([])
  const [origins, setOrigins] = useState([])
  const [categories, setCategories] = useState([])

  const [isOpen, setIsOpen] = useState({
    categories: false,
    brands: false,
    origins: false,
    price: false,
  })

  // دریافت برندها و کشورهای تولیدکننده
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/filters')
        const data = await res.json()
        if (res.ok) {
          setBrands(data.brands)
          setOrigins(data.origins)
        }
      } catch (error) {
        console.error('خطا در دریافت فیلترها:', error)
      }
    }
    fetchFilters()
  }, [])

  // دریافت دسته‌بندی‌ها
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

  // دریافت دسته‌بندی فعال از مسیر URL
  useEffect(() => {
    const category = pathname.split('/').pop()
    setSelectedCategory(category)
  }, [pathname])

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value
    let updatedSelection = []

    if (type === 'brand') {
      updatedSelection = selectedBrand.includes(value)
        ? selectedBrand.filter((item) => item !== value)
        : [...selectedBrand, value]
      setSelectedBrand(updatedSelection)
    } else if (type === 'origin') {
      updatedSelection = selectedOrigin.includes(value)
        ? selectedOrigin.filter((item) => item !== value)
        : [...selectedOrigin, value]
      setSelectedOrigin(updatedSelection)
    }
  }

  const applyFilters = () => {
    const filters = {
      priceRange,
      selectedBrand,
      selectedOrigin,
      selectedCategory,
    }

    console.log('اعمال فیلترها:', filters)

    onApplyFilters(filters)

    setFiltersOpen && setFiltersOpen(false)
  }

  const clearFilters = () => {
    setPriceRange([0, 7500000])
    setSelectedBrand([])
    setSelectedOrigin([])
    setSelectedCategory('')
    onApplyFilters({
      priceRange: [0, 7500000],
      selectedBrand: [],
      selectedOrigin: [],
      selectedCategory: '',
    })
  }

  const toggleSection = (section) => {
    setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const FilterCheckbox = ({
    label,
    values,
    selectedValues,
    handleChange,
    type,
    sectionKey,
  }) => (
    <div className="mb-6">
      <div
        className={`flex items-center justify-between cursor-pointer p-2 rounded-lg bg-bg ${
          isOpen[sectionKey] ? 'rounded-b-none' : ''
        }`}
        onClick={() => toggleSection(sectionKey)}
      >
        <h3 className="body-text">{label}</h3>
        {isOpen[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen[sectionKey] && (
        <ul className="space-y-2 max-h-48 overflow-y-auto bg-bg p-4">
          {values.map((value, index) => (
            <li key={index}>
              <div className="flex items-center gap-2">
                <input
                  id={`${type}-checkbox-${value}`}
                  type="checkbox"
                  value={value}
                  checked={selectedValues.includes(value)}
                  onChange={(e) => handleChange(e, type)}
                  className="cursor-pointer w-4 h-4 accent-primary"
                />
                <label
                  htmlFor={`${type}-checkbox-${value}`}
                  className="text-sm cursor-pointer"
                >
                  {value}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="bg-lightGray p-6 rounded-2xl text-dark shadow-lg w-full max-w-xs">
      <h2 className="text-xl font-bold pb-2 border-b border-gray-400 mb-6">
        فیلترها
      </h2>

      {/* دکمه‌های حذف و اعمال فیلتر */}
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

      {/* دسته‌بندی‌ها */}
      <div className="mb-6">
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg bg-bg ${
            isOpen.categories ? 'rounded-b-none' : ''
          }`}
          onClick={() => toggleSection('categories')}
        >
          <h3 className="body-text">دسته‌بندی‌ها</h3>
          {isOpen.categories ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isOpen.categories && (
          <ul className="space-y-2 max-h-48 overflow-y-auto bg-bg p-4">
            {categories.map((category, index) => {
              const isActive =
                category.slug === selectedCategory ||
                (category.slug === 'all' && pathname === '/store')

              return (
                <li key={index}>
                  <Link
                    href={`/store/${category.slug}`}
                    className={`${
                      isActive ? 'bg-gray-300' : ''
                    } flex items-center justify-between text-sm p-2 rounded-xl text-gray-700 hover:bg-gray-300 transition-all`}
                  >
                    {category.name}
                    <FaArrowLeft
                      size={20}
                      className="border border-gray-400 p-1 rounded-full"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* برندها */}
      <FilterCheckbox
        label="برندها"
        values={brands}
        selectedValues={selectedBrand}
        handleChange={handleCheckboxChange}
        type="brand"
        sectionKey="brands"
      />

      {/* کشور تولیدکننده */}
      <FilterCheckbox
        label="کشور سازنده"
        values={origins}
        selectedValues={selectedOrigin}
        handleChange={handleCheckboxChange}
        type="origin"
        sectionKey="origins"
      />

      {/* محدوده قیمت */}
      <div>
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded-lg bg-bg ${
            isOpen.price ? 'rounded-b-none' : ''
          }`}
          onClick={() => toggleSection('price')}
        >
          <h1 className="body-text">محدوده قیمت</h1>
          {isOpen.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isOpen.price && (
          <Box sx={{ width: '100%' }} className="bg-bg mx-auto p-6 w-full">
            <Slider
              value={priceRange}
              onChange={handleSliderChange}
              min={0}
              max={7500000}
              step={1000}
              sx={{ color: '#5B52A3' }}
              // className="mr-5 mt-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span className="font-semibold">
                {priceRange[1].toLocaleString()} تومان
              </span>
              <span className="font-semibold">
                {priceRange[0].toLocaleString()} تومان
              </span>
            </div>
          </Box>
        )}
      </div>
    </div>
  )
}
