'use client'

import { useRouter } from 'next/navigation'

export default function CartSummary({ total, shippingCost }) {
  const router = useRouter()

  // تابع برای فرمت‌دهی قیمت
  const formatCurrency = (value) => {
    if (!value) return ''
    return value.toLocaleString() // فرمت‌دهی به صورت کاما جداکننده برای هزارگان
  }

  const handleCheckout = () => {
    // هدایت کاربر به مسیر مرحله اول خرید (مسیر delivery)
    router.push('/checkout/delivery')
  }

  return (
    <div className="bg-light rounded-xl shadow-md p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="h3 text-center">مجموع سبد خرید شما</h3>
        <p className="h3 text-center font-semibold">
          {formatCurrency(total)} تومان
        </p>
      </div>
      <div className="flex justify-between text-sm pt-6 border-t">
        <span>هزینه ارسال</span>
        <span>{formatCurrency(shippingCost)} تومان</span>
      </div>
      <button
        className="bg-primary text-light w-full mt-3 py-2 rounded-lg"
        onClick={handleCheckout}
      >
        ثبت سفارش
      </button>
    </div>
  )
}
