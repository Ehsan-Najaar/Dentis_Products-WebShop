'use client'

import { Package, ShoppingCart, Tag, Truck, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'

const AdminPanelNavbar = () => {
  const pathname = usePathname()

  // آرایه لینک‌ها همراه با آیکون‌ها
  const navLinks = [
    {
      name: 'محصولات',
      href: '/admin/products',
      icon: <Package size={24} />,
    },
    {
      name: 'دسته‌بندی‌ها',
      href: '/admin/categories',
      icon: <Tag size={24} />,
    },
    {
      name: 'سفارشات',
      href: '/admin/orders',
      icon: <ShoppingCart size={24} />,
    },
    { name: 'کاربران', href: '/admin/users', icon: <Users size={24} /> },
    {
      name: 'هزینه ارسال',
      href: '/admin/shipping',
      icon: <Truck size={24} />,
    },
  ]

  return (
    <div
      className={`min-h-full w-full lg:w-1/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-4 shadow-lg ${
        pathname !== '/admin' ? 'hidden lg:flex' : ''
      }`}
    >
      {/* لوگو */}
      <Link href={'/'} className="text-lg font-bold mb-8">
        <Image
          src="/images/logo.webp"
          alt="لوگوی سایت"
          width={150}
          height={150}
          priority
          className="w-24 h-24 rounded-lg"
        />
      </Link>

      {/* منو */}
      <div className="flex flex-col space-y-4 w-full">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl bg-bg ${
                isActive
                  ? 'bg-primary text-light'
                  : 'lg:bg-transparent hover:bg-bg hover:pr-8 transition-all duration-300'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>

      {pathname === '/admin' && (
        <div className="w-full space-y-24 mt-24">
          <div className="h-px bg-dark"></div>
          <button
            onClick={() => {
              window.location.href = '/'
            }}
            className="w-full flex items-center gap-2 px-6 py-4 rounded-xl bg-bg lg:bg-transparent hover:bg-bg hover:pr-8 transition-all duration-300"
          >
            <FiArrowRight size={24} />
            بازگشت به سایت
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminPanelNavbar
