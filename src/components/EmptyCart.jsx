import Image from 'next/image'
import Link from 'next/link'

export default function EmptyCart() {
  return (
    <div className="text-center h-max mx-auto my-32">
      <div className="relative w-72 h-72 mx-auto">
        <Image
          src="/images/empty-cart.webp"
          alt="سبد خرید خالی"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-gray-500 text-lg mb-4">سبد خرید شما خالی است.</p>
      <Link
        href="/products"
        className="btn-primary text-center inline-block py-2 px-6 rounded-lg"
      >
        شروع خرید
      </Link>
    </div>
  )
}
