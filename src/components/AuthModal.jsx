'use client'

import EmailForm from '@/components/EmailForm'
import OTPForm from '@/components/OTPForm'
import PasswordForm from '@/components/PasswordForm'
import ResetPasswordForm from '@/components/ResetPasswordForm'
import SignupForm from '@/components/SignupForm'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email') // email | password | otp | reset-password | signup
  const [email, setEmail] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isReset, setIsReset] = useState(false)

  // بستن مودال و ریست کردن مراحل
  const handleClose = () => {
    setStep('email')
    setEmail('')
    setIsSignUp(false)
    setIsReset(false)
    onClose()
  }

  const handleForgotPassword = () => {
    setIsReset(true)
    setStep('otp') // ارسال کد تأیید برای ریست رمز
  }

  // تعیین مرحله قبلی برای دکمه "مرحله قبل"
  const handlePreviousStep = () => {
    if (step === 'password') setStep('email')
    else if (step === 'otp') setStep('email')
    else if (step === 'signup') setStep('otp')
    else if (step === 'reset-password') setStep('otp')
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      style={{ margin: 0 }}
    >
      <div
        className="relative bg-light p-6 rounded-lg shadow-lg lg:w-1/4"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن هنگام کلیک روی مودال
      >
        {/* دکمه بستن */}
        <button
          onClick={handleClose}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-light rounded-full p-2"
        >
          <FiX size={24} />
        </button>

        {/* مراحل فرم */}
        {step === 'email' && (
          <EmailForm
            setEmail={setEmail}
            setStep={setStep}
            setIsSignUp={setIsSignUp}
          />
        )}
        {step === 'password' && (
          <PasswordForm
            email={email}
            isSignUp={isSignUp}
            setStep={setStep}
            onClose={handleClose}
          />
        )}
        {step === 'otp' && (
          <OTPForm
            email={email}
            setStep={setStep}
            flowType={isReset ? 'forgotPassword' : 'signup'}
          />
        )}
        {step === 'reset-password' && (
          <ResetPasswordForm
            email={email}
            setStep={setStep}
            onClose={handleClose}
          />
        )}
        {step === 'signup' && (
          <SignupForm email={email} setStep={setStep} onClose={handleClose} />
        )}

        {/* دکمه مرحله قبل */}
        {step !== 'email' && (
          <div className="mt-8 space-y-2">
            {/* خط جداکننده */}
            <div className="h-[1.5px] w-full bg-gray-200 rounded-full mb-8"></div>

            {/* دکمه مرحله قبل */}
            <button
              onClick={handlePreviousStep}
              className="bg-gray-100 text-dark py-2 px-4 rounded w-full hover:bg-gray-300 transition-all duration-300"
            >
              مرحله قبل
            </button>

            {/* دکمه فراموشی رمز عبور فقط در مرحله پسورد نمایش داده شود */}
            {step === 'password' && (
              <button
                onClick={handleForgotPassword}
                className="bg-gray-100 text-dark py-2 px-4 rounded w-full hover:bg-gray-300 transition-all duration-300"
              >
                رمز عبور رو فراموش کردی؟
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal
