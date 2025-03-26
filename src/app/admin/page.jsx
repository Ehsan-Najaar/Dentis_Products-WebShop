'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const pathname = useParams()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && pathname === '/admin') {
        router.replace('/admin/products')
      }
    }

    // بررسی وضعیت صفحه در هنگام بارگذاری اولیه
    handleResize()

    // افزودن لیسنر برای تغییر اندازه پنجره
    window.addEventListener('resize', handleResize)

    // پاکسازی لیسنر هنگام ترک کامپوننت
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [pathname, router]) // وابسته به تغییر مسیر و router

  return (
    <ProtectedRoute>
      <div className="min-h-screen h-[710px] flex p-6 gap-12">
        <AdminPanelNavbar />
      </div>
    </ProtectedRoute>
  )
}
