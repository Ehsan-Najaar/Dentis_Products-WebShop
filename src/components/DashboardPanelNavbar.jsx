import { ListChecks, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiEdit, FiMap } from 'react-icons/fi'

export default function DashboardPanelNavbar() {
  const pathname = usePathname()

  const Tabs = [
    {
      name: 'ویرایش اطلاعات',
      icon: <FiEdit size={24} />,
      route: '/dashboard/edit-account',
    },
    {
      name: 'سفارشات من',
      icon: <ListChecks size={24} />,
      route: '/dashboard/my-orders',
    },
    {
      name: 'آدرس ها',
      icon: <FiMap size={24} />,
      route: '/dashboard/addresses',
    },
  ]

  return (
    <div className="h-96 w-1/5 bg-lightGray text-dark rounded-2xl flex flex-col items-center p-4 shadow-lg">
      <figure className="p-4 bg-bg rounded-full mb-4">
        <User size={40} />
      </figure>

      <nav className="w-full space-y-4">
        {Tabs.map((item, index) => (
          <Link
            key={index}
            href={item.route}
            className={`flex items-center gap-2 p-3 w-full rounded-lg transition ${
              pathname === item.route
                ? 'bg-primary text-white'
                : 'hover:bg-bg hover:pr-6 transition-all duration-300'
            }`}
          >
            {item.icon}
            <span className="body-text">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
