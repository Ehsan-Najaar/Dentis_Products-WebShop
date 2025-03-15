'use client'

import BottomNavbar from '@/components/BottomNavbar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Toast from '@/components/Toast'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AppProvider } from '../../context/AppContext'

export default function Layout({ children }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')
  const isCheckoutPage = pathname.startsWith('/checkout')

  return (
    <SessionProvider>
      <AppProvider>
        <main className="space-y-12">
          {/* اگر در مسیر "/admin" هستیم، هدر نمایش داده نشود */}
          {!(isAdminPage || isCheckoutPage) && <Header />}

          <BottomNavbar />

          {/* نمایش محتوا صفحات دیگر */}
          {children}

          <Toast />

          {/* فوتر */}
          {!isAdminPage && <Footer />}
        </main>
      </AppProvider>
    </SessionProvider>
  )
}
