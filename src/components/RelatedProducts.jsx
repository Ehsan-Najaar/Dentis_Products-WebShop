'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const RelatedProducts = ({ relatedProducts }) => {
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        محصول مرتبطی یافت نشد.
      </div>
    )
  }

  const goToNextSlide = () => swiperInstance?.slideNext()
  const goToPrevSlide = () => swiperInstance?.slidePrev()

  const updateSwiperState = (swiper) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  return (
    <div className="relative flex flex-col gap-12">
      <div className="flex items-center justify-between lg:mb-8 px-4 md:px-0">
        <h3 className="h4 lg:h3">محصولات مرتبط</h3>

        {/* دکمه‌های کنترلی اسلایدر */}
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
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper)
          updateSwiperState(swiper)
        }}
        onSlideChange={updateSwiperState}
        className="w-full h-72 lg:h-80"
        loop={false}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },
          480: { slidesPerView: 2.4, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 3.5, spaceBetween: 24 },
          1440: { slidesPerView: 4, spaceBetween: 16 },
        }}
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product._id} className="px-2 md:px-4">
            <ProductCard1 product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default RelatedProducts
