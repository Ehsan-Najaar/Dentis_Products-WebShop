import jalaali from 'jalaali-js'
import { useEffect, useState } from 'react'
import { FaCrown, FaUser } from 'react-icons/fa'

export default function UserTable({ users, error, loading }) {
  const [userRoles, setUserRoles] = useState([])
  const [roleFilter, setRoleFilter] = useState('all') // نمایش همه کاربران پیش‌فرض
  const [dateFilter, setDateFilter] = useState('desc') // پیش‌فرض: جدیدترین کاربران

  useEffect(() => {
    if (users) {
      // ادمین‌ها را بالای لیست نگه می‌دارد
      const sortedUsers = [...users].sort((a, b) =>
        a.role === 'admin' && b.role !== 'admin' ? -1 : 1
      )
      setUserRoles(sortedUsers)
    }
  }, [users])

  const handleRoleChange = async (userId, newRole) => {
    try {
      const roleInEnglish = newRole === 'کاربر' ? 'customer' : 'admin'
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleInEnglish }),
      })

      if (!response.ok) throw new Error('خطا در ویرایش سطح دسترسی')

      const updatedUser = await response.json()

      setUserRoles(
        (prevUsers) =>
          [...prevUsers]
            .map((user) =>
              user._id === updatedUser._id
                ? { ...user, role: updatedUser.role }
                : user
            )
            .sort((a, b) => (a.role === 'admin' && b.role !== 'admin' ? -1 : 1)) // ادمین‌ها همیشه بالا
      )
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const filteredUsers = userRoles
    .filter(
      (user) =>
        roleFilter === 'all' ||
        user.role === (roleFilter === 'admin' ? 'admin' : 'customer')
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateFilter === 'asc' ? dateA - dateB : dateB - dateA
    })

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between p-4 bg-light rounded-lg">
        <span className="w-1/4 text-center">نام</span>
        <span className="w-1/4 text-center">ایمیل</span>

        <span className="w-1/4 text-center flex items-center justify-center gap-4">
          <span>نقش:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-[50%] rounded-md p-2 focus:outline-none cursor-pointer"
          >
            <option value="all">همه</option>
            <option value="admin">ادمین</option>
            <option value="customer">کاربر</option>
          </select>
        </span>

        <span className="w-1/4 text-center flex items-center justify-center gap-4">
          <span>تاریخ عضویت:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[50%] rounded-md p-2 focus:outline-none cursor-pointer"
          >
            <option value="desc">جدیدترین</option>
            <option value="asc">قدیمی‌ترین</option>
          </select>
        </span>
      </section>

      <section className="space-y-4">
        {filteredUsers.map((user) => {
          let formattedDate = 'تاریخ نامعتبر'

          if (user.createdAt) {
            try {
              const gregorianDate = new Date(user.createdAt)
              if (!isNaN(gregorianDate.getTime())) {
                const jalaliDate = jalaali.toJalaali(
                  gregorianDate.getFullYear(),
                  gregorianDate.getMonth() + 1,
                  gregorianDate.getDate()
                )
                formattedDate = `${jalaliDate.jy}/${jalaliDate.jm}/${jalaliDate.jd}`
              }
            } catch (error) {
              console.error('خطا در تبدیل تاریخ:', error)
            }
          }

          return (
            <div
              key={user._id}
              className={`flex justify-between items-center rounded-lg p-4 border-2 ${
                user.role === 'admin'
                  ? 'bg-yellow-100 border-yellow-500'
                  : 'bg-light border-light'
              }`}
            >
              <div className="w-1/4 flex items-center gap-3">
                <figure
                  className={`p-3 rounded-full ${
                    user.role === 'admin' ? 'bg-yellow-200' : 'bg-bg'
                  }`}
                >
                  {user.role === 'admin' ? (
                    <FaCrown size={24} />
                  ) : (
                    <FaUser size={24} />
                  )}
                </figure>
                <p className="w-full truncate">{user.name}</p>
              </div>
              <p className="w-1/4 text-center">{user.email}</p>
              <div className="w-1/4 text-center">
                <select
                  value={user.role === 'admin' ? 'ادمین' : 'کاربر'}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="w-52 p-2 rounded-lg border border-dark cursor-pointer"
                >
                  <option value="کاربر">کاربر</option>
                  <option value="ادمین">ادمین</option>
                </select>
              </div>
              <p className="w-1/4 text-center">{formattedDate}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
