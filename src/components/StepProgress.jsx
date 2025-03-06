'use client'

import { ListCheck } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FaBox, FaCheck, FaCreditCard } from 'react-icons/fa'

const StepProgress = () => {
  const pathname = usePathname() // دریافت مسیر فعلی
  const currentStep = pathname.split('/').pop() // استخراج بخش آخر مسیر

  // تعیین وضعیت هر مرحله بر اساس بخش آخر مسیر
  const steps = [
    {
      name: 'سبد خرید',
      icon: <FaCheck size={20} />,
      completed:
        currentStep === 'cart' ||
        currentStep === 'delivery' ||
        currentStep === 'payment' ||
        currentStep === 'confirmation',
      current: currentStep === 'cart', // بررسی اینکه آیا این مرحله فعلی است
    },
    {
      name: 'تحویل',
      icon:
        currentStep === 'delivery' ? (
          <FaBox size={20} />
        ) : (
          <FaCheck size={20} />
        ),
      completed: currentStep === 'payment' || currentStep === 'confirmation',
      current: currentStep === 'delivery',
    },
    {
      name: 'پرداخت',
      icon:
        currentStep === 'payment' || currentStep === 'delivery' ? (
          <FaCreditCard size={20} />
        ) : (
          <FaCheck size={20} />
        ),
      completed: currentStep === 'confirmation',
      current: currentStep === 'payment',
    },
    {
      name: 'تأیید نهایی',
      icon:
        currentStep !== 'confirmation' ? (
          <ListCheck size={20} />
        ) : (
          <FaCheck size={20} />
        ),
      completed: currentStep === 'confirmation',
      current: currentStep === 'confirmation',
    },
  ]

  return (
    <div className="flex items-center justify-between w-full max-w-5xl mx-auto overflow-hidden">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-center relative ${
            index === steps.length - 1 ? 'w-max' : 'w-full'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div>
              {/* دایره‌ی استپ */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.completed
                    ? 'bg-dark text-light'
                    : step.current
                    ? 'bg-primary text-light'
                    : 'bg-lightGray text-dark'
                }`}
              >
                {step.icon}
              </div>
            </div>
            {/* متن زیر استپ */}
            <span
              className={`mt-2 text-sm text-nowrap ${
                step.completed
                  ? 'text-dark'
                  : step.current
                  ? 'text-primary'
                  : 'text-dark'
              }`}
            >
              {step.name}
            </span>
          </div>

          {/* خط بین استپ‌ها */}
          {index < steps.length - 1 && (
            <div className="flex-grow h-1 mx-2">
              <div
                className={`h-full ${
                  steps[index].completed ? 'bg-dark' : 'bg-lightGray'
                }`}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StepProgress
