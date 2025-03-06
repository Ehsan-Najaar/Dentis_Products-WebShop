'use client'

import { CheckoutSummary } from '@/components/CheckoutSummary'
import StepProgress from '@/components/StepProgress'
import UserAddresses from '@/components/UserAddresses'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../../../context/AppContext'

export default function DeliveryPage() {
  const { session, cart } = useAppContext()
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id)
    }
  }, [session]) // به محض تغییر session

  if (!userId) {
    return <div>در حال بارگذاری...</div> // منتظر هستیم تا userId دریافت شود
  }

  const total = cart?.total || 0
  const shippingCost = cart?.shippingCost || 0

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-24">
      <StepProgress />

      <div className="flex gap-12">
        <section className="w-2/3 space-y-4">
          <div className="h-[500px] bg-lightGray p-4 rounded-2xl shadow space-y-6">
            <UserAddresses userId={userId} />
          </div>
        </section>
        <section className="w-1/3 bg-lightGray p-4 rounded-2xl shadow space-y-6">
          <CheckoutSummary total={total} shippingCost={shippingCost} />
        </section>
      </div>
    </div>
  )
}
