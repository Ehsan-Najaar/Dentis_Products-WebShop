'use client'

import Image from 'next/image'

export function CheckoutSummary({ items = [], total, shippingCost }) {
  const formatCurrency = (value) => {
    if (!value) return '۰'
    return value.toLocaleString() // فرمت‌دهی به صورت کاما جداکننده برای هزارگان
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-center">خلاصه خرید</h3>
      <p className="text-center text-sm text-gray-600">
        {items.length} محصول در کیف خرید شما
      </p>

      {items.length > 0 && (
        <div className="flex items-center border p-3 rounded-lg shadow-sm">
          <Image
            src={items[0].image}
            alt={items[0].name}
            width={50}
            height={50}
            className="rounded-md"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold">{items[0].name}</p>
            <p className="text-xs text-gray-500">
              {formatCurrency(items[0].price)} تومان
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between text-sm pt-6 border-t">
        <span>جمع کل کیف خرید</span>
        <span>{formatCurrency(total)} تومان</span>
      </div>

      <div className="flex justify-between text-sm border-t pt-2">
        <span>هزینه ارسال</span>
        <span>{formatCurrency(shippingCost)} تومان</span>
      </div>

      <div className="flex justify-between font-bold text-md border-t pt-2">
        <span>مجموع پرداختی</span>
        <span>{formatCurrency(total + shippingCost)} تومان</span>
      </div>
    </div>
  )
}
