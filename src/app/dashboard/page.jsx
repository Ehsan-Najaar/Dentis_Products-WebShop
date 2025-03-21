'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && pathname === '/dashboard') {
        router.replace('/dashboard/edit-account')
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
    <div className="px-6 py-16">
      {/* منوی داشبورد */}
      <DashboardPanelNavbar />
    </div>
  )
}
