import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const ResetPasswordForm = ({ email, setStep, onClose }) => {
  const { showToast } = useAppContext()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      showToast('رمزها یکسان نیستند!', 'error')
      return
    }

    // ارسال داده‌ها به API
    setLoading(true)
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password }),
    })

    const data = await response.json()
    setLoading(false)

    if (data.success) {
      showToast('رمز عبور با موفقیت تغییر کرد!', 'success')
      setStep('login') // برگشت به صفحه ورود
      onClose() // بستن مودال بعد از تغییر رمز
    } else {
      showToast(data.message, 'error')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="h3 text-center">تغییر رمز عبور</h2>
      <input
        type="password"
        placeholder="رمز جدید"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="تکرار رمز جدید"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleResetPassword}
        disabled={loading}
        className="w-full btn-primary"
      >
        {loading ? 'در حال تغییر رمز...' : 'تغییر رمز عبور'}
      </button>
    </div>
  )
}

export default ResetPasswordForm
