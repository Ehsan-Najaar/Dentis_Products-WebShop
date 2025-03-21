'use client'

import DashboardPanelNavbar from '@/components/DashboardPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserInformaitno from '@/components/UserInformaitno'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'

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
      <div className="max-w-7xl mx-auto lg:flex gap-12 px-6 lg:px-0">
        <DashboardPanelNavbar />

        {/* هدر موبایل */}
        <div className="lg:hidden flex items-center justify-between bg-lightGray rounded-lg shadow p-2 mb-4">
          <h2 className="h4">ویرایش اطلاعات</h2>
          <Link href="/dashboard">
            <FiChevronLeft size={32} />
          </Link>
        </div>

        <UserInformaitno
          userInfo={userInfo}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </ProtectedRoute>
  )
}
