import Image from 'next/image'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 -mt-44">
        {/* تصویر 404 */}
        <div className="w-64 h-64 md:w-[492px] md:h-[492px]">
          <Image
            src="/images/404.webp"
            alt="صفحه یافت نشد"
            width={492}
            height={492}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* متن و دکمه */}
        <div className="space-y-12 md:space-y-24 text-center md:text-right">
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">
              متأسفیم! صفحه‌ای که به دنبال آن هستید، وجود ندارد.
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه حذف شده باشد.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block btn-primary py-3 px-6 md:py-4 md:px-8 text-sm md:text-base"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
