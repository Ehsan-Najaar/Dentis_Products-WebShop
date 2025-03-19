import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FiInstagram, FiMail, FiSmartphone } from 'react-icons/fi'

// خدمات ارائه شده در وب‌سایت
const services = ['خرید آسان', 'ارسال سراسری', 'ضمانت اصالت کالا']

// لینک‌های مهم صفحات
const pages = [
  { name: 'محصولات', href: '/products' },
  { name: 'درباره ما', href: '/about' },
  { name: 'ارتباط با ما', href: '/contact' },
]

// لینک‌های راهنما و اطلاعات
const infoLinks = [
  { name: 'قوانین و مقررات', href: '/terms' },
  { name: 'سوالات متداول', href: '/terms' },
  { name: 'راهنمای خرید', href: '/terms' },
  { name: 'شرایط بازگشت کالا', href: '/terms' },
  { name: 'حریم خصوصی', href: '/terms' },
]

export default function Footer() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <footer className="bg-lightGray text-dark py-8 pb-24 lg:pb-0 px-6 xl:px-0 mt-12">
      <div className="flex flex-wrap items-start justify-between gap-12 max-w-7xl mx-auto">
        {/* بخش اطلاعات و شبکه‌های اجتماعی */}
        <section className="space-y-6 max-w-sm">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/images/logo.webp"
              alt="لوگوی سایت"
              width={120}
              height={40}
              priority
            />
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            با تجهیزات باکیفیت، مطب خود را حرفه‌ای تجهیز کنید و لبخندی ماندگار
            به بیماران هدیه دهید!
          </p>

          {/* آیکون‌های شبکه‌های اجتماعی */}
          <div
            className="flex space-x-3 rtl:space-x-reverse"
            aria-label="شبکه‌های اجتماعی"
          >
            {[
              { Icon: FaWhatsapp, title: 'WhatsApp' },
              { Icon: FaTelegramPlane, title: 'Telegram' },
              { Icon: FiInstagram, title: 'Instagram' },
            ].map(({ Icon, title }, index) => (
              <span
                key={index}
                className="bg-accent text-primary p-2 rounded-full cursor-pointer"
                title={title}
                aria-label={title}
              >
                <Icon size={24} />
              </span>
            ))}
          </div>

          {/* اطلاعات تماس */}
          <div className="space-y-2">
            {[
              { Icon: FiSmartphone, text: '+98 912 026 8538' },
              { Icon: FiMail, text: 'Namiizady@gmail.com' },
            ].map(({ Icon, text }, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <span className="bg-accent text-primary p-2 rounded-full">
                  <Icon size={24} />
                </span>
                <p className="text-sm text-gray-700" dir="ltr">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* بخش لینک‌های مهم */}
        <section className="grid grid-cols-2 sm:flex gap-8 sm:gap-12 w-full max-w-lg">
          {[
            { title: 'صفحات', items: pages },
            { title: 'خدمات', items: services },
            { title: 'راهنما و اطلاعات', items: infoLinks },
          ].map(({ title, items }, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm md:text-base font-semibold">{title}</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-500">
                {items.map((item, idx) => (
                  <li key={idx}>
                    {typeof item === 'string' ? (
                      item
                    ) : item.href ? (
                      <Link href={item.href} title={item.name}>
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {/* خط جداکننده */}
      <hr className="max-w-7xl mx-auto border-dark my-8" />

      {/* متن کپی‌رایت */}
      <p className="text-xs md:text-sm text-center">
        کلیه حقوق این وب‌سایت متعلق به بیونام می‌باشد و هرگونه کپی‌برداری از
        محتوا و محصولات بدون اجازه کتبی ممنوع است.
      </p>
    </footer>
  )
}
