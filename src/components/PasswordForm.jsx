import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FiLock } from 'react-icons/fi'

const PasswordForm = ({ email, isSignUp, setStep, onClose }) => {
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // ثبت‌نام کاربر جدید
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'خطا در ثبت‌نام')
        }
      }

      // ورود به حساب
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) throw new Error('ایمیل یا رمز عبور اشتباه است')

      onClose()
    } catch (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="h3 text-center">ورود</h2>
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'در حال برسی...' : isSignUp ? 'ثبت نام' : 'ورود'}
      </button>
    </div>
  )
}

export default PasswordForm
