'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function UserInformation({ userInfo, isLoading, error }) {
  const { showToast } = useAppContext()
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    phone: userInfo?.mobile || '', // اینجا به mobile تغییر داده شده است
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        phone: userInfo.mobile || '', // اینجا به mobile تغییر داده شده است
        password: '',
        confirmPassword: '',
      })
    }
  }, [userInfo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedUserData = {
      name: formData.name,
      mobile: formData.phone, // تغییر phone به mobile برای ارسال درست اطلاعات
      password: formData.password,
    }

    console.log('Updated user data:', updatedUserData)

    try {
      const res = await fetch(`/api/users/${userInfo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const updatedUser = await res.json()
      setFormData({
        name: updatedUser.name,
        phone: updatedUser.mobile, // دریافت و نمایش صحیح mobile
        password: '',
        confirmPassword: '',
      })

      // نمایش پیام موفقیت
      showToast('اطلاعات با موفقیت بروزرسانی شد', 'success')
    } catch (error) {
      console.error('Error updating user info:', error)
      // نمایش پیام خطا
      showToast('خطا در ذخیره بروزرسانی اطلاعات', 'success')
    }
  }

  if (isLoading) {
    return (
      <div className="h-auto w-4/5 bg-lightGray text-dark rounded-2xl shadow-lg grid place-items-center">
        <span className="loader"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-auto w-4/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-6 shadow-lg gap-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="h-auto w-4/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-6 shadow-lg gap-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          <input
            type="text"
            className="input"
            placeholder="نام"
            value={formData.name}
            name="name"
            onChange={handleChange}
            disabled={isLoading}
          />
          <input
            type="email"
            className="input"
            placeholder="ایمیل"
            value={userInfo?.email || ''}
            disabled
          />
          <input
            type="tel"
            className="input"
            dir="rtl"
            placeholder="شماره تلفن"
            value={formData.phone}
            name="phone" // نام ورودی به mobile تغییر کرده است
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="relative flex gap-4 mt-4">
          <input
            type="password"
            className="input"
            placeholder="رمز عبور"
            value={formData.password}
            name="password"
            onChange={handleChange}
            disabled={isLoading}
          />
          <small className="absolute right-2 -bottom-6 small-text text-yellow-600">
            اگر می‌خواهید رمز عبور خود را عوض کنید، این فیلد و فیلد بعدی را پر
            کنید.
          </small>
          <input
            type="password"
            className="input"
            placeholder="تکرار رمز عبور"
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary mt-20"
          disabled={isLoading}
        >
          ذخیره تغییرات
        </button>
      </form>
    </div>
  )
}
