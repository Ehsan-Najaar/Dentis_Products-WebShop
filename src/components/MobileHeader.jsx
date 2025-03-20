import { Info, Mail, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NavItem = ({ href, icon: Icon, text, onClick }) => (
  <Link
    href={href}
    className="flex items-center gap-2 text-lg text-gray-700 bg-lightGray p-4 rounded-lg hover:bg-accent"
    onClick={onClick}
  >
    <Icon size={22} />
    {text}
  </Link>
)

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="w-full lg:hidden fixed top-0 right-0 flex items-center justify-between py-2 px-6 bg-lightGray shadow-md z-40">
      <section className="flex items-center gap-4">
        <Image
          src="/images/logo.webp"
          alt="لوگو"
          width={50}
          height={50}
          className="rounded-md"
        />
        <h3 className="h3">Bionam</h3>
      </section>

      <button onClick={() => setIsOpen(true)} className="p-2">
        <Menu size={28} className="text-gray-700" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 bg-bg h-full shadow-lg py-2 px-6 fixed top-0 left-0 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsOpen(false)} className="self-end p-2">
              <X size={28} className="text-gray-700" />
            </button>
            <nav className="flex flex-col mt-4 space-y-4">
              <NavItem
                href="/about"
                icon={Info}
                text="درباره ما"
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                href="/contact"
                icon={Mail}
                text="ارتباط با ما"
                onClick={() => setIsOpen(false)}
              />
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
