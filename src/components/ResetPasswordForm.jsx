import { useState } from 'react'

const ResetPasswordForm = ({ email, setStep, onClose }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert('رمزها یکسان نیستند!')
      return
    }

    // ارسال داده‌ها به API
    setLoading(true)
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password }), // استفاده از password به جای newPassword
    })

    const data = await response.json()
    setLoading(false)

    if (data.success) {
      alert('رمز عبور با موفقیت تغییر کرد!')
      setStep('login') // برگشت به صفحه ورود
      onClose() // بستن مودال بعد از تغییر رمز
    } else {
      alert(data.message)
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
