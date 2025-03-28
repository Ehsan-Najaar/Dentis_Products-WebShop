import Image from 'next/image'
import { FiChevronLeft } from 'react-icons/fi'

export default function Banner() {
  return (
    <section
      aria-label="بنر تبلیغاتی سایت"
      className="relative max-w-7xl lg:h-[600px] mx-auto px-6 xl:px-0"
    >
      {/* در اینجا می‌توانید تصویر یا متن دلخواه اضافه کنید */}
      <Image
        src="/images/Banner.webp"
        alt="بنر"
        width={1182}
        height={600}
        style={{ width: 'auto', height: 'auto' }}
        className="object-contain"
      />

      <button className="absolute hidden lg:flex top-60 right-10 btn-primary py-4 bg-dark">
        <span>مشاهده محصولات</span>
        <FiChevronLeft />
      </button>
    </section>
  )
}
