'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserAddresses from '@/components/UserAddresses'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'

export default function Addresses() {
  const { session } = useAppContext()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id)
    }
  }, [session])

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto flex gap-12">
        <DashboardPanelNavbar />
        <div className="h-auto w-4/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-6 shadow-lg gap-4">
          <UserAddresses userId={userId} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
