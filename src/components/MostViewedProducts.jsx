'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function MostViewedProducts() {
  const [products, setProducts] = useState([])
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const [loading, setLoading] = useState(true) // وضعیت بارگذاری

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const sortedProducts = data.sort((a, b) => b.views - a.views)
        setProducts(sortedProducts.slice(0, 8)) // محدود کردن تعداد محصولات به ۸ محصول پربازدید
        setLoading(false) // پس از دریافت داده‌ها بارگذاری تمام می‌شود
      })
      .catch((err) => {
        console.error('خطا در دریافت محصولات:', err)
        setLoading(false) // حتی در صورت خطا، بارگذاری تمام می‌شود
      })
  }, [])

  const updateSwiperState = (swiper) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const goToPrevSlide = () => {
    swiperInstance?.slidePrev()
  }

  const goToNextSlide = () => {
    swiperInstance?.slideNext()
  }

  return (
    <section className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-0 lg:py-24 lg:pr-24 p-6 bg-lightGray">
      <div className="lg:w-1/3 flex lg:flex-col items-center lg:items-start justify-between">
        <h2 className="lg:h2 h4">محصولات پربازدید ما</h2>
        <p className="hidden lg:block body-text">
          محصولات پربازدید ما شامل محبوب‌ترین و پرفروش‌ترین تجهیزات و مواد مصرفی
          دندانپزشکی هستند.
        </p>

        <div className="w-max">
          <div className="flex gap-2 z-10">
            <button
              className={`p-2 md:p-4 shadow-md bg-accent rounded-full transition-all ${
                isBeginning ? 'opacity-20' : 'text-dark hover:opacity-80'
              }`}
              onClick={goToPrevSlide}
              disabled={isBeginning}
              aria-label="مشاهده اسلاید قبلی"
            >
              <FiChevronRight size={20} />
            </button>
            <button
              className={`p-2 md:p-4 shadow-md bg-accent rounded-full transition-all ${
                isEnd ? 'opacity-20' : 'text-dark hover:opacity-80'
              }`}
              onClick={goToNextSlide}
              disabled={isEnd}
              aria-label="مشاهده اسلاید بعدی"
            >
              <FiChevronLeft size={20} />
            </button>
          </div>
        </div>

        <Link
          href="/products"
          className="hidden lg:flex  items-center gap-2 w-max btn-primary rounded-full"
        >
          دیدن محصولات بیشتر
          <FiArrowLeft size={24} />
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper)
          updateSwiperState(swiper)
        }}
        onSlideChange={updateSwiperState}
        className="lg:w-2/3 w-full h-72 lg:h-auto"
        loop={false}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        dir="rtl"
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 20 },
          480: { slidesPerView: 2.2, spaceBetween: 24 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 2.1, spaceBetween: 40 },
          1440: { slidesPerView: 3, spaceBetween: 16 },
        }}
      >
        {/* اگر هنوز در حال بارگذاری هستیم، اسکلتون را نشان بدهیم */}
        {loading
          ? Array(8)
              .fill(null)
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <ProductCardSkeleton />
                </SwiperSlide>
              ))
          : products.map((product) => (
              <SwiperSlide
                key={product.id}
                aria-label={`محصول: ${product.name}`}
              >
                <ProductCard1 product={product} />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  )
}
