'use client'

import CartSummary from '@/components/CartSummary'
import EmptyCart from '@/components/EmptyCart'
import { Loader } from '@/components/Loader'
import { ProductCard2 } from '@/components/ProductCards'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/AppContext'

export default function CartPage() {
  const { showToast } = useAppContext()
  const [cart, setCart] = useState([])
  const [shippingCost, setShippingCost] = useState(0)
  const [loading, setLoading] = useState(true) // 🟢 حالت لودینگ

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setCart(data.cart)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }

    const fetchShippingCost = async () => {
      try {
        const res = await fetch('/api/shipping')
        if (res.ok) {
          const data = await res.json()
          setShippingCost(data.shippingCost)
        }
      } catch (error) {
        console.error('Error fetching shipping cost:', error)
      }
    }

    Promise.all([fetchCart(), fetchShippingCost()]).finally(() =>
      setLoading(false)
    ) // ⏳ پس از دریافت داده‌ها، لودینگ را غیرفعال می‌کنیم
  }, [])

  // ✅ نمایش لودینگ هنگام دریافت داده‌ها
  if (loading) {
    return <Loader />
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: newQuantity }),
    })

    if (res.ok) {
      const data = await res.json()
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
      setCart(data.cart)
      showToast('محصول از سبد خرید حذف شد', 'success')
    }
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.productId ? item.productId.price * item.quantity : 0),
    0
  )

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 px-6 lg:px-0">
        {/* ✅ اگر سبد خرید خالی بود، فقط عکس نمایش داده شود */}
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <section className="lg:w-3/4">
              <div className="space-y-4">
                {cart.map((product) => (
                  <ProductCard2
                    key={product.productId._id}
                    product={product}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </section>

            <section className="lg:w-1/4 h-fit sticky top-4">
              <CartSummary total={total} shippingCost={shippingCost} />
            </section>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
