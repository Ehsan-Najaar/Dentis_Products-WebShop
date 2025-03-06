import { useState } from 'react'
import { FiUser } from 'react-icons/fi'

const EmailForm = ({ setEmail, setStep, setIsSignUp }) => {
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    if (!emailInput.trim()) {
      setError('لطفاً ایمیل خود را وارد کنید')
      return
    }

    if (!validateEmail(emailInput)) {
      setError('لطفاً یک ایمیل معتبر وارد کنید')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      })

      if (!response.ok) throw new Error('مشکلی در ارتباط با سرور پیش آمده است')

      const data = await response.json()
      console.log('API Response:', data)
      setEmail(emailInput)
      setIsSignUp(!data.exists)

      if (data.exists) {
        setStep('password')
      } else {
        setStep('otp')
      }
    } catch (error) {
      setError(error.message || 'مشکلی رخ داده است')
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="h3 text-center">ورود / ثبت‌نام</h2>
      <div className="bg-bg rounded-lg pr-4 flex items-center gap-4">
        <span className="text-gray-400">
          <FiUser size={24} />
        </span>
        <input
          type="email"
          placeholder="ایمیل"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="input"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'در حال بررسی...' : 'ادامه'}
      </button>
    </div>
  )
}

export default EmailForm
