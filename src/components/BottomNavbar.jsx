import { Home, Package, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useAppContext } from '../../context/AppContext'

const navItems = [
  { href: '/', icon: Home, label: 'خانه', exact: true },
  { href: '/search', icon: Search, label: 'جستجو' },
  { href: '/products', icon: Package, label: 'محصولات' },
  { href: '/cart', icon: FiShoppingCart, label: 'سبد خرید' },
  { href: '/dashboard', icon: User, label: 'داشبورد' },
]

export default function BottomNavbar() {
  const pathname = usePathname()
  const { cart, updateCart } = useAppContext()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          if (JSON.stringify(data.cart) !== JSON.stringify(cart)) {
            updateCart(data.cart)
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }

    fetchCart()
  }, [cart, updateCart])

  const uniqueProductCount = new Set(
    (Array.isArray(cart) ? cart : [])
      .filter((item) => item.productId && item.productId._id)
      .map((item) => item.productId._id)
  ).size

  return (
    <nav className="lg:hidden fixed bottom-0 right-0 w-full flex bg-lightGray border-t border-dark z-50">
      {navItems.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href) // جلوگیری از اکتیو شدن صفحه خانه در همه مسیرها
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-col gap-1 items-center justify-center flex-1 p-2 text-dark ${
              isActive ? 'bg-light' : 'opacity-75'
            }`}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {href === '/cart' && uniqueProductCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {uniqueProductCount}
                </span>
              )}
            </div>
            <span className="text-sm">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
