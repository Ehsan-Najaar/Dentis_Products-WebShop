'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import { useEffect, useState } from 'react'

// تابع برای فرمت‌دهی قیمت
const formatCurrency = (value) => {
  if (!value) return ''
  // تبدیل به عدد و سپس فرمت‌دهی به کاما
  return Number(value).toLocaleString()
}

// تابع برای پاک کردن کاماها و فقط نگه داشتن اعداد
const removeCommas = (value) => {
  return value.replace(/,/g, '')
}

function AdminShipping() {
  const [shippingCost, setShippingCost] = useState(0)
  const [formData, setFormData] = useState({ shippingCost: '' })

  // دریافت هزینه ارسال از API
  const fetchShippingCost = async () => {
    try {
      const res = await fetch('/api/shipping')
      const data = await res.json()
      // اگر هزینه ارسال موجود باشد
      if (data.shippingCost) {
        setShippingCost(data.shippingCost)
        setFormData({ shippingCost: formatCurrency(data.shippingCost) }) // فرمت‌دهی قیمت
      }
    } catch (error) {
      console.error('Error fetching shipping cost:', error)
    }
  }

  // تغییر هزینه ارسال
  const updateShippingCost = async () => {
    const numericValue = removeCommas(formData.shippingCost) // حذف کاماها برای ارسال به سرور
    const res = await fetch('/api/shipping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingCost: numericValue }),
    })
    if (res.ok) {
      alert('هزینه ارسال با موفقیت ویرایش شد!')
    }
  }

  useEffect(() => {
    fetchShippingCost() // زمانی که کامپوننت بارگذاری می‌شود، هزینه ارسال را دریافت می‌کنیم
  }, [])

  // کنترل تغییرات در فرم
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'shippingCost') {
      let numericValue = removeCommas(value) // فقط اعداد را بپذیرید

      // اگر عدد وارد شده خالی نباشد
      if (numericValue) {
        // فرمت‌دهی به قیمت
        const formattedValue = formatCurrency(numericValue)
        setFormData({
          ...formData,
          [name]: formattedValue, // به روزرسانی فرم‌دیتا با فرمت جدید
        })
      } else {
        setFormData({
          ...formData,
          [name]: '',
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex p-6 gap-12">
      {/* نوار کناری */}
      <AdminPanelNavbar />

      <div className="w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg space-y-16">
        <h3 className="h3">هزینه ارسال</h3>
        <div className="w-1/3 input flex items-center justify-between">
          <input
            name="shippingCost"
            placeholder="قیمت"
            value={formData.shippingCost} // اینجا مقدار shippingCost از state گرفته می‌شود
            onChange={handleChange} // هر بار که ورودی تغییر کند، فرمت جدید اعمال می‌شود
            className="bg-transparent focus:outline-none"
          />
          <span className="ml-2 text-gray-400">تومان</span>
        </div>
        <button onClick={updateShippingCost} className="btn-primary">
          ویرایش هزینه ارسال
        </button>
      </div>
    </div>
  )
}

export default AdminShipping
