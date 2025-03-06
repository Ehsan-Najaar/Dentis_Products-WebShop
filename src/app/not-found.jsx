import Image from 'next/image'
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* تصویر 404 */}
        <div className="">
          <Image
            src="/images/404.png"
            alt="صفحه یافت نشد"
            width={492}
            height={492}
            priority
          />
        </div>

        {/* متن و دکمه */}
        <div className="space-y-24">
          <div className="space-y-2">
            <h3 className="h3">
              متأسفیم! صفحه‌ای که به دنبال آن هستید، وجود ندارد.
            </h3>
            <p className="body-text">
              ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه حذف شده باشد.
            </p>
          </div>
          <Link href="/" className="inline-block btn-primary py-4 px-8">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  )
}
