import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full fixed top-0 right-0 flex items-center justify-between p-2 bg-lightGray shadow-md z-40">
      <section className="flex items-center gap-4">
        {/* لوگو */}
        <Image
          src="/images/logo.webp"
          alt="لوگو"
          width={50}
          height={50}
          className="rounded-md"
        />
        <h3 className="h3">Bionam</h3>
      </section>

      {/* منو آیکن */}
      <button onClick={() => setIsOpen(true)} className="p-2">
        <Menu size={28} className="text-gray-700" />
      </button>

      {/* منو کشویی */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-64 bg-white h-full shadow-lg p-4 fixed top-0 left-0 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsOpen(false)} className="self-end p-2">
              <X size={28} className="text-gray-700" />
            </button>

            <nav className="flex flex-col mt-4 space-y-4">
              <Link
                href="/about"
                className="text-lg text-gray-700 hover:text-blue-600"
              >
                درباره ما
              </Link>
              <Link
                href="/contact"
                className="text-lg text-gray-700 hover:text-blue-600"
              >
                ارتباط با ما
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
