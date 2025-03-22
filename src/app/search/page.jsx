'use client'

import SearchContent from '@/components/SearchContent'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SearchPage() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && pathname === '/search') {
        router.replace('/')
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
    <div className="min-h-screen px-6 pb-24">
      <SearchContent />
    </div>
  )
}
