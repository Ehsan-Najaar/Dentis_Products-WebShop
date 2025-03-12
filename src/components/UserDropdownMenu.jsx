'use client'

import { ListChecks } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiChevronLeft, FiLogOut, FiMap, FiSettings } from 'react-icons/fi'
import { useAppContext } from '../../context/AppContext'

export default function UserDropdownMenu({ pathName }) {
  const { logout, showToast } = useAppContext() // دریافت showToast از context
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) return null

  const handleLogout = async () => {
    await logout()
    showToast('شما با موفقیت از حساب خود خارج شدید.', 'success') // نمایش پیام موفقیت
    router.push('/')
  }

  const dashboardLink = '/dashboard/edit-account'

  return (
    <div className="relative inline-block text-right z-40">
      <div className="group">
        <div
          className={`p-3 rounded-full hover:bg-accent transition-all duration-300 cursor-pointer ${
            pathName.startsWith('/dashboard') ? 'bg-accent' : 'bg-light'
          }`}
        >
          <Image
            src="/icons/User.png"
            alt="حساب کاربری"
            width={24}
            height={24}
          />
        </div>

        <div className="absolute -left-16 mt-2 w-44 rounded-lg bg-white ring-1 ring-dark ring-opacity-0 overflow-hidden max-h-0 group-hover:max-h-[500px] transition-all duration-300 z-10">
          <div className="border-b">
            <Link href={dashboardLink}>
              <h3 className="flex items-center justify-between body-text hover:bg-gray-100 px-4 py-2">
                {session.user.name || 'کاربر'}
                <FiChevronLeft size={20} />
              </h3>
            </Link>
          </div>
          <ul>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link
                href="/dashboard/my-orders"
                className="flex items-center gap-2 w-full body-text"
              >
                <ListChecks size={20} />
                <span>سفارشات من</span>
              </Link>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link
                href="/dashboard/addresses"
                className="flex items-center gap-2 w-full body-text"
              >
                <FiMap size={20} />
                <span>آدرس‌های من</span>
              </Link>
            </li>

            {session.user.role === 'admin' && (
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 w-full body-text"
                >
                  <FiSettings size={20} />
                  <span>پنل ادمین</span>
                </Link>
              </li>
            )}

            <li className="border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-red-500 px-4 py-2 hover:bg-gray-100 body-text"
              >
                <FiLogOut size={20} />
                خروج از حساب
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
