'use client'

import AuthModal from '@/components/AuthModal'
import { Loader } from '@/components/Loader'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession()
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      setAuthModalOpen(true)
    }
  }, [status])

  if (status === 'loading') {
    return <Loader />
  }

  // اگر کاربر لاگین نکرده باشد، نمایش مودال ورود
  if (!session) {
    return (
      <div className="absolute grid place-items-center top-0 right-0 w-screen bg-bg min-h-[calc(100vh+250px)] lg:min-h-screen">
        <div className="flex items-center gap-4 -mt-24 lg:mt-0">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn-primary"
          >
            ورود
          </button>
          <Link href={'/'} className="btn-outline">
            بازگشت به سایت
          </Link>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    )
  }

  // بررسی مسیر `/admin/*`
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute && session.user.role !== 'admin') {
    // اگر مسیر `/admin/*` باشد ولی کاربر ادمین نباشد، ریدایرکت شود
    router.push('/')
    return null
  }

  return children
}

export default ProtectedRoute
