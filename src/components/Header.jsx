'use client'

import AuthModal from '@/components/AuthModal'
import UserDropdownMenu from '@/components/UserDropdownMenu'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import SearchModal from './SearchModal'

const navLinks = [
  { title: 'خانه', path: '/' },
  { title: 'محصولات', path: '/products' },
  { title: 'درباره ما', path: '/about' },
  { title: 'ارتباط با ما', path: '/contact' },
  { title: 'admin', path: '/admin/products' },
]

export default function Header() {
  const pathName = usePathname()
  const { isLoggedIn } = useAppContext()
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const [isSearchModalOpen, setSearchModalOpen] = useState(false)

  // ایجاد ارجاع برای onClose
  const searchModalCloseRef = useRef(() => setSearchModalOpen(false))

  useEffect(() => {
    // اطمینان از اینکه ارجاع درست است
    searchModalCloseRef.current = () => setSearchModalOpen(false)
  }, [])

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

      <nav className="mr-16">
        <ul className="flex items-center gap-8">
          {navLinks.map((link, index) => {
            const isActive =
              link.path === '/'
                ? pathName === '/'
                : pathName.startsWith(link.path)
            return (
              <li key={index}>
                <Link
                  href={link.path}
                  className={`text-dark px-4 py-2 rounded-lg transition-all duration-300 font-normal relative ${
                    isActive ? 'font-extrabold text-dark' : ''
                  }`}
                >
                  {link.title}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-[3px] bg-primary"></span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <figure
          className="p-3 rounded-full cursor-pointer bg-light hover:bg-accent transition-all duration-300"
          onClick={() => setSearchModalOpen(true)} // باز کردن مودال جستجو
        >
          <Image src="/icons/Search.png" alt="جستجو" width={24} height={24} />
        </figure>

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={searchModalCloseRef.current} // استفاده از ارجاع به onClose
        />

        {isLoggedIn ? (
          <>
            <UserDropdownMenu />
            <Link
              href="/cart"
              className={`p-3 rounded-full hover:bg-accent transition-all duration-300 ${
                pathName === '/cart' ? 'bg-accent' : 'bg-light'
              }`}
            >
              <Image
                src="/icons/Bag.png"
                alt="سبد خرید"
                width={24}
                height={24}
              />
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
