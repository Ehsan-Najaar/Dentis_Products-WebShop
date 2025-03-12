'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyOrders() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto flex gap-12">
        <DashboardPanelNavbar />
        <div className="h-auto w-4/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-6 shadow-lg gap-4"></div>
      </div>
    </ProtectedRoute>
  )
}
