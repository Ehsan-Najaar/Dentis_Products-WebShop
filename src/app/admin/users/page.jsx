'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import UserTable from '@/components/UserTable'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('Users fetched:', users) // لیست کامل کاربران
    users.forEach((user) => {
      console.log(`User: ${user.name}, Created At:`, user.createdAt) // تاریخ ایجاد
    })
  }, [users])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('خطا در دریافت لیست کاربران')
        }
        const data = await response.json()
        console.log('Users fetched:', data) // بررسی داده‌ها
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex p-6 gap-12">
      {/* نوار کناری */}
      <AdminPanelNavbar />

      {/* مین کانتنت */}
      <div className="w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg space-y-16">
        <div className="flex items-center justify-between mb-4">
          <div className="w-56 flex items-center gap-2">
            <h2 className="h3">لیست کاربران</h2>
            <small>({filteredUsers.length}) کاربر</small>
          </div>
          <div className="w-1/3 flex items-center gap-2 px-4 py-2 bg-light shadow-sm rounded-full">
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

        {/* جدول کاربران */}
        <UserTable users={filteredUsers} error={error} loading={loading} />
      </div>
    </div>
  )
}
