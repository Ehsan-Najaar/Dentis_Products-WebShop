import { Home, Package, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiShoppingCart } from 'react-icons/fi'

const navItems = [
  { href: '/', icon: Home, label: 'خانه' },
  { href: '/search', icon: Search, label: 'جستجو' },
  { href: '/products', icon: Package, label: 'محصولات' },
  { href: '/cart', icon: FiShoppingCart, label: 'سبد خرید' },
  { href: '/dashboard', icon: User, label: 'داشبورد' },
]

export default function BottomNavbar() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 right-0 w-full flex bg-lightGray border-t border-dark z-50">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col gap-1 items-center justify-center flex-1 p-2 text-dark ${
              isActive ? 'bg-light' : 'opacity-75'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
