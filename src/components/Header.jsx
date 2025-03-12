'use client'

import AuthModal from '@/components/AuthModal'
import SearchModal from '@/components/SearchModal'
import UserDropdownMenu from '@/components/UserDropdownMenu'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { generateSlug } from '../../utils/slugify'

const navLinks = [
  { title: 'خانه', path: '/' },
  { title: 'محصولات', path: '/products', hasDropdown: true },
  { title: 'درباره ما', path: '/about' },
  { title: 'ارتباط با ما', path: '/contact' },
]

export default function Header() {
  const pathName = usePathname()
  const { isLoggedIn, cart, updateCart } = useAppContext()
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const [isSearchModalOpen, setSearchModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // شبیه‌سازی بارگذاری وضعیت کاربر
    setUserLoading(true)
    setTimeout(() => {
      setUserLoading(false) // زمانی که وضعیت کاربر بارگذاری شد
    }, 500) // این مقدار را با مقدار مناسب تنظیم کنید
  }, [isLoggedIn])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          // به‌روزرسانی سبد خرید تنها در صورتی که داده‌های جدید با داده‌های قبلی متفاوت باشند
          if (JSON.stringify(data.cart) !== JSON.stringify(cart)) {
            updateCart(data.cart) // استفاده از updateCart برای بروزرسانی سبد خرید در context
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }

    fetchCart()
  }, [cart, updateCart]) // وابستگی به cart برای جلوگیری از فراخوانی دوباره لوپ

  // محاسبه تعداد محصولات منحصر به فرد در سبد خرید
  const uniqueProductCount = new Set(
    (Array.isArray(cart) ? cart : []).map((item) => item.productId._id)
  ).size

  return (
    <header className="max-w-7xl mx-auto hidden lg:flex items-center justify-between pt-10">
      <Link href={'/'}>
        <Image
          src="/images/logo.webp"
          alt="لوگوی سایت"
          width={150}
          height={150}
          priority
          className="w-16 h-16 rounded-lg"
        />
      </Link>

      <nav className="mr-16 bg-lightGray rounded-lg shadow">
        <ul className="flex items-center relative">
          {navLinks.map((link, index) => {
            const isActive =
              link.path === '/'
                ? pathName === '/'
                : pathName.startsWith(link.path)
            return (
              <li key={index} className="relative group">
                <Link
                  href={link.path}
                  className={`block w-32 body-text text-center p-4 rounded-lg transition-all duration-300 font-normal relative ${
                    isActive ? 'bg-light font-extrabold text-dark' : ''
                  }`}
                >
                  {link.title}
                </Link>

                {link.hasDropdown && (
                  <ul className="absolute -left-6 mt-2 w-44 rounded-lg bg-white ring-1 ring-dark ring-opacity-0 overflow-hidden max-h-0 group-hover:max-h-[500px] transition-all duration-300 z-10">
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link
                          href={`/products?category=${generateSlug(
                            category.name
                          )}`}
                          className="block px-4 py-2 hover:bg-gray-100 text-dark"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <figure
          className={`p-3 rounded-full cursor-pointer hover:bg-accent transition-all duration-300 ${
            isSearchModalOpen ? 'bg-accent' : 'bg-light'
          }`}
          onClick={() => setSearchModalOpen(true)}
        >
          <Image src="/icons/Search.png" alt="جستجو" width={24} height={24} />
        </figure>

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />

        {/* اسکلتون در صورتی که هنوز وضعیت کاربر بارگذاری نشده باشد */}
        {loading || userLoading ? (
          <div className="flex gap-4">
            <div className="w-28 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-md"></div>
          </div>
        ) : isLoggedIn ? (
          <>
            <UserDropdownMenu pathName={pathName} />
            <Link
              href="/cart"
              className={`relative p-3 rounded-full hover:bg-accent transition-all duration-300 ${
                pathName === '/cart' ? 'bg-accent' : 'bg-light'
              }`}
            >
              <Image
                src="/icons/Bag.png"
                alt="سبد خرید"
                width={24}
                height={24}
              />
              {/* نمایش تعداد محصولات منحصر به فرد */}
              {uniqueProductCount > 0 && (
                <span className="absolute -bottom-1 -right-1 text-xs bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {uniqueProductCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn-primary py-3"
          >
            ورود / ثبت‌نام
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  )
}
