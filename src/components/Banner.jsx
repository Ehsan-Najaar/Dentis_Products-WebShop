import Image from 'next/image'

export default function Banner() {
  return (
    <section
      aria-label="بنر تبلیغاتی سایت"
      className="max-w-7xl h-[600px] mx-auto"
    >
      {/* در اینجا می‌توانید تصویر یا متن دلخواه اضافه کنید */}
      <Image
        src={'/images/Banner.webp'}
        alt="بنر"
        width={1182}
        height={600}
        className="w-full h-full"
      />
    </section>
  )
}
