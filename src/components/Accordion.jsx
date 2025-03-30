import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const FAQAccordion = () => {
  // مدیریت وضعیت نمایش سوالات متداول
  const [activeIndex, setActiveIndex] = useState(null)

  // لیست سوالات متداول مرتبط با تجهیزات دندانپزشکی
  const faqs = [
    {
      question: 'آیا تجهیزات دارای ضمانت هستند؟',
      answer:
        'بله، تمامی تجهیزات دندانپزشکی ما دارای ضمانت اصالت کالا و سلامت فیزیکی هستند.',
    },
    {
      question: 'مدت زمان ارسال محصولات چقدر است؟',
      answer:
        'ارسال سفارش‌ها معمولاً بین ۲ تا ۵ روز کاری زمان می‌برد و در صورت سفارش عمده، زمان تحویل متغیر خواهد بود.',
    },
    {
      question: 'چگونه می‌توانم سفارشم را پیگیری کنم؟',
      answer:
        'پس از ثبت سفارش، کد رهگیری برای شما ارسال خواهد شد که از طریق آن می‌توانید وضعیت سفارش خود را مشاهده کنید.',
    },
  ]

  // تابع تغییر وضعیت نمایش هر سوال
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index) // اگر روی همان سوال کلیک شود، بسته شده و در غیر این صورت باز می‌شود
  }

  return (
    <section
      className="max-w-7xl mx-auto space-y-6 px-6 xl:px-0"
      aria-labelledby="faq-section"
    >
      {/* عنوان بخش */}
      <h2 className="lg:h2 h4" id="faq-section">
        سوالات متداول
      </h2>

      {/* لیست سوالات متداول */}
      <div id="faq-accordion" className="space-y-4 rtl">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-light rounded-lg shadow-md overflow-hidden"
            aria-labelledby={`question-${index}`}
          >
            {/* سوال */}
            <h3 id={`question-${index}`}>
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="flex items-center justify-between w-full p-6 text-dark"
                aria-expanded={activeIndex === index} // بهینه‌سازی برای سئو
                aria-controls={`answer-${index}`} // اتصال سوال به پاسخ
              >
                <span className="body-text">{faq.question}</span>
                {/* آیکون باز و بسته شدن */}
                <FiChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>

            {/* پاسخ */}
            <div
              id={`answer-${index}`}
              className={`flex lg:items-center gap-3 p-6 body-text text-gray-500 pr-8 transition-all duration-300 ${
                activeIndex === index ? 'flex' : 'hidden'
              }`}
              aria-labelledby={`question-${index}`} // برای ارتباط پاسخ با سوال
            >
              {/* دایره توپر قبل از متن پاسخ */}
              <div className="w-4 h-4 rounded-full bg-accent mt-2 lg:mt-0 shrink-0"></div>

              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQAccordion
