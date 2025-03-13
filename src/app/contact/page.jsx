'use client'

import AuthModal from '@/components/AuthModal'
import { Loader2 } from '@/components/Loader'
import Image from 'next/image'
import { useState } from 'react'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FiInstagram, FiMail, FiSmartphone } from 'react-icons/fi'
import { useAppContext } from '../../../context/AppContext'

// اطلاعات تماس
const contactInfo = [
  {
    id: 1,
    icon: <FiSmartphone size={24} />,
    title: 'تلفن',
    value: '+ 98 912 026 8538',
  },
  {
    id: 2,
    icon: <FiMail size={24} />,
    title: 'ایمیل',
    value: 'info@bionam.ir',
  },
]

// شبکه‌های اجتماعی
const socialMedia = [
  {
    id: 3,
    icon: <FaWhatsapp size={24} />,
    name: 'واتساپ',
    link: '#',
  },
  {
    id: 1,
    icon: <FaTelegramPlane size={24} />,
    name: 'تلگرام',
    link: '#',
  },
  {
    id: 2,
    icon: <FiInstagram size={24} />,
    name: 'اینستاگرام',
    link: '#',
  },
]

export default function Contact() {
  const { showToast, isLoggedIn } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setAuthModalOpen(true)
      return
    }

    const formData = {
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    }

    try {
      setLoading(true)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        setLoading(false)
        showToast('پیام شما با موفقیت ارسال شد', 'success')
        e.target.reset()
      } else {
        setLoading(false)
        showToast('پیام شما با خطا مواجه شد', 'error')
      }
    } catch (error) {
      setLoading(false)
      console.error('Error:', error)
      showToast('مشکلی در ارسال پیام رخ داد', 'error')
    }
  }

  return (
    <>
      {loading && <Loader2 />} {/* لودر ۲ روی محتوای اصلی نمایش داده شود */}
      <section className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row justify-between gap-32">
          {/* بخش اطلاعات تماس */}
          <div className="flex flex-col gap-12">
            {/* عنوان و توضیحات */}
            <div className="space-y-4">
              <h3 className="font-semibold text-3xl text-dark">اطلاعات تماس</h3>
              <p className="text-dark leading-relaxed">
                اگر مشکل فنی دارید، می‌خواهید بازخورد ارسال کنید یا نیاز به
                جزئیات بیشتری در مورد خدمات ما دارید، به ما اطلاع دهید.
              </p>
            </div>

            {/* لیست اطلاعات تماس */}
            <ul className="space-y-8">
              {contactInfo.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <span className="text-primary p-3 rounded-full bg-accent">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-dark" dir="ltr">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* بخش شبکه‌های اجتماعی */}
            <div className="pt-6 border-t border-dark">
              <h4 className="text-xl font-bold text-dark">ما را دنبال کنید</h4>
              <div className="flex gap-4 mt-4">
                {socialMedia.map((social) => (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent p-4 text-primary rounded-full"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* بخش فرم تماس */}
          <div className="bg-lightGray text-dark p-8 rounded-lg shadow-lg w-full lg:w-2/3">
            <h2 className="mb-6 text-4xl font-extrabold text-center">
              پیامتو ارسال کن
            </h2>
            <form
              onSubmit={handleSubmit}
              method="post"
              className="text-center space-y-8"
              aria-labelledby="contact-form"
            >
              <div>
                <input
                  type="email"
                  id="email"
                  className="input"
                  placeholder="ایمیل شما"
                  required
                  aria-label="ایمیل شما"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="subject"
                  className="input"
                  placeholder="موضوع پیام شما"
                  required
                  aria-label="موضوع پیام شما"
                />
              </div>
              <div>
                <textarea
                  id="message"
                  rows="6"
                  className="input resize-none"
                  placeholder="پیام خود را وارد کنید..."
                  required
                  aria-label="پیام شما"
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary py-4 px-8 mx-auto"
                aria-label="ارسال پیام"
              >
                ارسال پیام
                <Image
                  src="/icons/send.png"
                  alt="لوگوی ارسال"
                  width={150}
                  height={150}
                  priority
                  className="w-6 h-6 rounded-lg"
                />
              </button>
            </form>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </section>
    </>
  )
}
