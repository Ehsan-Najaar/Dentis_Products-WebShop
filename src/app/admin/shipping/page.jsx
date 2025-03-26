'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { useAppContext } from '../../../../context/AppContext'

// تابع برای فرمت‌دهی قیمت
const formatCurrency = (value) => {
  if (!value) return ''
  return Number(value).toLocaleString()
}

// تابع برای حذف کاماها و نگه‌داشتن فقط اعداد
const removeCommas = (value) => {
  return value.replace(/,/g, '')
}

function AdminShipping() {
  const { showToast } = useAppContext()
  const [shippingCost, setShippingCost] = useState('')
  const [formData, setFormData] = useState({ shippingCost: '' })

  // دریافت هزینه ارسال از API
  const fetchShippingCost = async () => {
    try {
      const res = await fetch('/api/shipping')
      const data = await res.json()
      if (data.shippingCost) {
        const formattedCost = formatCurrency(data.shippingCost)
        setShippingCost(formattedCost)
        setFormData({ shippingCost: formattedCost })
      }
    } catch (error) {
      console.error('Error fetching shipping cost:', error)
    }
  }

  // تغییر هزینه ارسال
  const updateShippingCost = async () => {
    const numericValue = Number(removeCommas(formData.shippingCost)) // تبدیل به عدد
    if (isNaN(numericValue) || numericValue < 0) {
      showToast('لطفا مقدار معتبر وارد کنید', '')
      return
    }

    const res = await fetch('/api/shipping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingCost: numericValue }),
    })

    if (res.ok) {
      showToast('هزینه ارسال با موفقیت ویرایش شد', '')
      fetchShippingCost() // مقدار جدید را دریافت کن
    }
  }

  useEffect(() => {
    fetchShippingCost()
  }, [])

  // کنترل تغییرات در فرم
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'shippingCost') {
      let numericValue = removeCommas(value)

      // فقط اعداد را بپذیرد
      if (!/^\d*$/.test(numericValue)) return

      const formattedValue = numericValue ? formatCurrency(numericValue) : ''
      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex p-6 gap-12">
        {/* نوار کناری */}
        <AdminPanelNavbar />

        <div className="w-full lg:w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg space-y-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = '/admin')}
              className="lg:hidden p-2 rounded-full bg-bg hover:bg-gray-300"
            >
              <FiArrowRight size={24} />
            </button>
            <h2 className="h3">ویرایش هزینه ارسال</h2>
          </div>
          <div className="md:w-2/3 xl:w-1/3 input flex items-center justify-between">
            <input
              name="shippingCost"
              placeholder="قیمت"
              value={formData.shippingCost}
              onChange={handleChange}
              className="bg-transparent focus:outline-none"
            />
            <span className="ml-2 text-gray-400">تومان</span>
          </div>
          <button onClick={updateShippingCost} className="btn-primary">
            ویرایش
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AdminShipping
