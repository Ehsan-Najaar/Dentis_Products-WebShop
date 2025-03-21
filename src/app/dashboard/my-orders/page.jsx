'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { FiChevronLeft } from 'react-icons/fi'

export default function MyOrders() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto lg:flex gap-12 px-6 lg:px-0">
        <DashboardPanelNavbar />

        {/* هدر موبایل */}
        <div className="lg:hidden flex items-center justify-between bg-lightGray rounded-lg shadow p-2 mb-4">
          <h2 className="h4">سفارشات من</h2>
          <Link href="/dashboard">
            <FiChevronLeft size={32} />
          </Link>
        </div>

        <div className="lg:h-auto lg:w-4/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-6 shadow-lg gap-4"></div>
      </div>
    </ProtectedRoute>
  )
}
