'use client'
import CartSummary from '@/components/CartSummary'
import { ProductCard2 } from '@/components/ProductCards'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [shippingCost, setShippingCost] = useState(0)

  // بارگذاری اطلاعات سبد خرید از سرور و هزینه ارسال از API
  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        console.log('Fetched cart:', data.cart) // 🛑 بررسی مقدار دریافتی از سرور
        setCart(data.cart)
      }
    }

    const fetchShippingCost = async () => {
      const res = await fetch('/api/shipping') // درخواست هزینه ارسال از API
      if (res.ok) {
        const data = await res.json()
        setShippingCost(data.shippingCost) // ذخیره هزینه ارسال
      }
    }

    fetchCart()
    fetchShippingCost()
  }, [])

  // به‌روزرسانی تعداد محصول
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQuantity }),
    })

    if (res.ok) {
      const data = await res.json()
      console.log('Updated cart:', data.cart) // 🛑 بررسی مقدار بعد از آپدیت
      setCart(data.cart)
    }
  }

  const removeFromCart = async (productId) => {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })

    if (res.ok) {
      const data = await res.json()
      console.log('Cart after delete:', data.cart) // 🛑 بررسی مقدار بعد از حذف
      setCart(data.cart)
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  )

  return (
    <div className="max-w-7xl mx-auto flex gap-12">
      <section className="w-3/4">
        <div className="flex-1 space-y-4">
          {cart.length > 0 ? (
            cart.map((product) => (
              <ProductCard2
                key={product.productId._id}
                product={product}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          ) : (
            <p>سبد خرید شما خالی است.</p>
          )}
        </div>
      </section>

      <section className="w-1/4 h-fit sticky top-4">
        <CartSummary total={total} shippingCost={shippingCost} />
      </section>
    </div>
  )
}
