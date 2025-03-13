import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const OTPForm = ({ email, setStep, flowType }) => {
  const { showToast } = useAppContext()
  const [otp, setOtp] = useState('')
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  const handleSendOtp = async () => {
    if (countdown > 0) return

    setError('')
    setCountdown(60) // شروع شمارش معکوس از 60 ثانیه

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error('مشکلی در ارسال کد تأیید پیش آمده است')

      showToast('کد تأیید به ایمیل شما ارسال شد!', 'success')
    } catch (error) {
      setError(error.message || 'مشکلی پیش آمده است')
      showToast(error.message || 'مشکلی پیش آمده است', 'error')
      setCountdown(0) // در صورت بروز خطا شمارش را متوقف کن
    }
  }

  const handleVerify = async () => {
    setLoadingVerify(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      if (!response.ok) throw new Error('کد اشتباه است')

      if (flowType === 'forgotPassword') {
        setStep('reset-password')
        showToast(
          'کد تأیید درست بود. به مرحله تغییر رمز هدایت شدید.',
          'success'
        )
      } else {
        setStep('signup')
        showToast('کد تأیید درست بود. به مرحله ثبت‌نام هدایت شدید.', 'success')
      }
    } catch (error) {
      setError(error.message || 'مشکلی در تایید کد پیش آمده است')
      showToast(error.message || 'مشکلی در تایید کد پیش آمده است', 'error')
    }

    setLoadingVerify(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="h3 text-center">ورود با کد تأیید ایمیل</h2>
      <div className="flex items-center justify-between bg-bg rounded-lg">
        <input
          type="text"
          placeholder="کد تأیید"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input"
        />
        <button
          onClick={handleSendOtp}
          disabled={countdown > 0}
          className="bg-dark rounded-lg text-light text-sm whitespace-nowrap p-5"
        >
          {countdown > 0 ? `ارسال مجدد (${countdown}s)` : 'ارسال کد تایید'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleVerify}
        disabled={loadingVerify}
        className="w-full btn-primary"
      >
        {loadingVerify ? 'در حال بررسی...' : 'تایید کد'}
      </button>
    </div>
  )
}

export default OTPForm
