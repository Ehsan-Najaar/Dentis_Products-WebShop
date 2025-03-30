import Image from 'next/image'

export default function Banner() {
  return (
    <section
      aria-label="بنر تبلیغاتی سایت"
      className="relative rounded-[55px] max-w-7xl lg:h-[600px] mx-auto px-6 xl:px-0"
      style={{ width: 'auto', height: 'auto' }}
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
    </section>
  )
}
