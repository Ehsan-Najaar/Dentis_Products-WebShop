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
      className="lg:w-max lg:flex grid grid-cols-2 items-center gap-6 mx-auto px-6 xl:px-0"
    >
      {services.map((service) => (
        <article
          key={service.id}
          className="lg:w-64 flex flex-col gap-2 items-center lg:p-4 p-2 bg-light shadow-md rounded-lg"
          aria-labelledby={`service-title-${service.id}`}
        >
          <Image
            src={service.image}
            alt={service.alt}
            width={50} // اندازه پیش‌فرض کوچک‌تر
            height={30}
            className="lg:w-[110px] lg:h-[75px]" // در حالت‌های بزرگ‌تر، تصویر بزرگ‌تر می‌شود
            aria-hidden="true"
          />
          <p
            id={`service-title-${service.id}`}
            className="small-text text-dark lg:text-lg"
          >
            {service.title}
          </p>
        </article>
      ))}
    </section>
  )
}
