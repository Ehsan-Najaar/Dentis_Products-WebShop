'use client'

import { ProductCard1 } from '@/components/ProductCards'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import { useEffect, useRef, useState } from 'react'

export default function ProductsList({ products, error, loading }) {
  const [visibleProducts, setVisibleProducts] = useState([]) // لیست محصولات قابل نمایش
  const [loadedCount, setLoadedCount] = useState(12) // تعداد محصولات نمایش داده‌شده
  const [isFetching, setIsFetching] = useState(false) // آیا محصولات جدید در حال بارگذاری هستند؟
  const [isMobile, setIsMobile] = useState(false) // بررسی اندازه صفحه
  const observerRef = useRef(null) // برای تشخیص اسکرول به انتهای لیست

  // بررسی تغییر اندازه صفحه و تعیین حالت موبایل یا دسکتاپ
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640) // کمتر از md در Tailwind
    }

    checkScreenSize() // بررسی اولیه
    window.addEventListener('resize', checkScreenSize) // تغییرات هنگام تغییر اندازه صفحه

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (!products || products.length === 0) return
    setVisibleProducts(products.slice(0, 12))
  }, [products])

  useEffect(() => {
    if (loadedCount >= products.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true) // فعال کردن حالت لودینگ
          const loadAmount = isMobile ? 12 : 12 // موبایل ۴ تا، بقیه ۳ تا

          setTimeout(() => {
            setVisibleProducts((prev) => [
              ...prev,
              ...products.slice(loadedCount, loadedCount + loadAmount),
            ])
            setLoadedCount((prev) => prev + loadAmount)
            setIsFetching(false) // غیرفعال کردن لودر بعد از لود شدن
          }, 1500) // شبیه‌سازی تأخیر بارگذاری
        }
      },
      { threshold: 0.5 }
    )

    if (observerRef.current) observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [loadedCount, products, isFetching, isMobile])

  if (loading) {
    return (
      <div className="grid place-items-center grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {error ? (
        <p className="text-center text-red-500 col-span-3">{error}</p>
      ) : !products || products.length === 0 ? (
        <p className="text-center text-gray-500 col-span-3">محصولی یافت نشد.</p>
      ) : (
        <>
          {visibleProducts.map((product, index) => (
            <div
              key={product._id}
              ref={index === visibleProducts.length - 1 ? observerRef : null}
              className={`grid place-items-center ${
                index === 0 || index === 1 ? 'mt-0' : 'mt-24 lg:mt-0'
              } ${index === 2 ? 'sm:-mt-0 md:mt-24 lg:mt-0' : ''}`}
            >
              <ProductCard1 product={product} />
            </div>
          ))}

          {isFetching && (
            <div className="w-full col-span-2 lg:col-span-3 flex flex-col items-center mt-4">
              <p className="hidden md:block text-gray-500 text-sm animate-pulse">
                در حال بارگذاری...
              </p>
              <div className="w-full grid place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-48 sm:pr-24 md:pr-0 md:gap-2 mt-20 md:mt-2">
                {Array.from({ length: isMobile ? 12 : 12 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
