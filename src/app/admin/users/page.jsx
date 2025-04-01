'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserTable from '@/components/UserTable'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiSearch } from 'react-icons/fi'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('خطا در دریافت لیست کاربران')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // مرتب کردن کاربرانی که role آنها "admin" است در بالای لیست
      if (a.role === 'admin' && b.role !== 'admin') {
        return -1
      }
      if (a.role !== 'admin' && b.role === 'admin') {
        return 1
      }
      return 0
    })

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex p-6 gap-12">
        {/* نوار کناری */}
        <AdminPanelNavbar />

        {/* مین کانتنت */}
        <div className="w-full lg:w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 lg:hidden mb-8">
            <button
              onClick={() => (window.location.href = '/admin')}
              className="p-2 rounded-full bg-bg hover:bg-gray-300"
            >
              <FiArrowRight size={24} />
            </button>
            <h2 className="h3">لیست کاربران</h2>
            <small>({filteredUsers.length}) کاربر</small>
          </div>

          <div className="flex items-center justify-between lg:mb-16 mb-8">
            <div className="hidden w-56 lg:flex items-center gap-2">
              <h2 className="h3">لیست کاربران</h2>
              <small>({filteredUsers.length}) کاربر</small>
            </div>
            <div className="w-full lg:w-1/3 flex items-center gap-2 px-4 py-2 bg-light shadow-sm rounded-full">
              <input
                type="text"
                placeholder="جستجو نام یا ایمیل کاربر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
              <FiSearch size={24} className="text-gray-500" />
            </div>
          </div>

          {/* نمایش لودر در صورت بارگذاری */}
          {loading ? (
            <div className="h-96 grid place-items-center">
              <span className="loader"></span>
            </div>
          ) : (
            // جدول کاربران
            <UserTable users={filteredUsers} error={error} loading={loading} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
