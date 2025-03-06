import Image from 'next/image'

const services = [
  {
    id: 4,
    title: 'ضمانت اصالت کالا',
    image: '/icons/services-4.png',
    alt: 'آیکون ضمانت اصالت کالا',
  },
  {
    id: 3,
    title: 'پشتیبانی 24/7',
    image: '/icons/services-3.png',
    alt: 'آیکون پشتیبانی 24/7',
  },
  {
    id: 2,
    title: 'ارسال سراسری',
    image: '/icons/services-2.png',
    alt: 'آیکون ارسال سراسری',
  },
  {
    id: 1,
    title: 'خرید آسان',
    image: '/icons/services-1.png',
    alt: 'آیکون خرید آسان',
  },
]

export default function Services() {
  return (
    <section
      aria-label="خدمات وب‌سایت"
      className="w-max flex items-center gap-6 mx-auto"
    >
      {services.map((service) => (
        <article
          key={service.id}
          className="w-64 flex flex-col items-center p-4 bg-light shadow-md rounded-lg"
          aria-labelledby={`service-title-${service.id}`}
        >
          <Image
            src={service.image}
            alt={service.alt}
            width={110}
            height={75}
            className=""
            aria-hidden="true" // این ویژگی باعث می‌شود که تصویر فقط برای نمایش باشد و به موتورهای جستجو نارسایی ایجاد نکند.
          />
          <p
            id={`service-title-${service.id}`}
            className="mt-2 text-sm font-semibold text-dark"
          >
            {service.title}
          </p>
        </article>
      ))}
    </section>
  )
}
