import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FiLock, FiSmartphone, FiUser } from 'react-icons/fi'

const SignupForm = ({ email, setStep, onClose }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      // ثبت‌نام کاربر جدید
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, mobile }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در ثبت‌نام')
      }

      // ورود به حساب کاربری پس از ثبت‌نام موفق
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) throw new Error('ایمیل یا رمز عبور اشتباه است')

      // بسته شدن مودال بعد از ورود موفق
      alert('ثبت‌نام و ورود موفقیت‌آمیز بود!')
      onClose() // بستن مودال
      setStep('email') // بازگشت به مرحله اول (ایمیل)
    } catch (error) {
      setError(error.message || 'مشکلی پیش آمده است')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="h3 text-center">ثبت نام</h2>

      <div className="bg-bg rounded-lg pr-4 flex items-center gap-4">
        <span className="text-gray-400">
          <FiUser size={24} />
        </span>
        <input
          type="text"
          placeholder="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>
      <div className="bg-bg rounded-lg pr-4 flex items-center gap-4">
        <span className="text-gray-400">
          <FiLock size={24} />
        </span>
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>
      <div className="bg-bg rounded-lg pr-4 flex items-center gap-4">
        <span className="text-gray-400">
          <FiSmartphone size={24} />
        </span>
        <input
          type="text"
          placeholder="شماره موبایل (اختیاری)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="input"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'در حال ثبت‌ نام...' : 'ثبت‌ نام و ورود'}
      </button>
    </div>
  )
}

export default SignupForm
