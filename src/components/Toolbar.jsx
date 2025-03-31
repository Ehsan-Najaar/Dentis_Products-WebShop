import { useState } from 'react'
import { FaChevronDown, FaSortAmountDown } from 'react-icons/fa'

const Toolbar = ({ sortOptions, selectedSort, onSortChange, products }) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

  const toggleSortMenu = () => {
    setIsSortMenuOpen((prev) => !prev)
  }

  return (
    <div className="flex items-center justify-between bg-lightGray px-4 py-2 rounded-md shadow text-right z-30">
      <div className="flex items-center gap-4">
        <label className="hidden sm:flex items-center gap-2 text-[#333333]">
          <FaSortAmountDown className="w-4 lg:w-6 h-4 lg:h-6" />
          <span className="text-sm">مرتب‌سازی:</span>
        </label>

        <div className="sm:hidden relative">
          <button
            onClick={toggleSortMenu}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded transition-all bg-[#DDDDDD] text-[#333333] hover:bg-[#D3CFF2]"
          >
            مرتب‌سازی
            <FaChevronDown className="w-4 h-4 text-[#333333]" />
          </button>

          {isSortMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#FFFFFF] shadow-md rounded-md">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    setIsSortMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-all ${
                    selectedSort === option.value
                      ? 'bg-[#5B52A3] text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] text-[#333333] hover:bg-[#D3CFF2]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-1 text-sm rounded transition-all ${
                selectedSort === option.value
                  ? 'bg-[#5B52A3] text-[#FFFFFF]'
                  : 'bg-[#DDDDDD] text-[#333333] hover:bg-[#D3CFF2]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <small className="text-gray-500">{products.length} محصول</small>
    </div>
  )
}

export default Toolbar
