'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserInformaitno from '@/components/UserInformaitno'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function EditAccount() {
  const { data: session } = useSession()

  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo(data)
        })
        .catch((error) => {
          setError('خطا در دریافت اطلاعات کاربر')
        })
        .finally(() => setIsLoading(false))
    }
  }, [session])

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto flex gap-12">
        <DashboardPanelNavbar />
        <UserInformaitno
          userInfo={userInfo}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </ProtectedRoute>
  )
}
