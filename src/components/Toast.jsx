import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

const Toast = () => {
  const { toast } = useAppContext()

  if (!toast.isVisible) return null

  return (
    <div
      className={`fixed bg-light/70 backdrop-blur-sm top-24 left-1/2 -translate-x-1/2 lg:bottom-4 lg:right-6 transform px-4 py-2 rounded-md shadow-lg text-dark w-80 h-max lg:w-auto lg:left-auto lg:translate-x-0 lg:top-auto`}
      style={{ zIndex: 9999 }}
    >
      {/* نمایش آیکون مربوطه */}
      <div className="flex items-center gap-3">
        {toast.type === 'success' ? (
          <CheckCircleIcon className="h-6 w-6 text-primary" />
        ) : (
          <XCircleIcon className="h-6 w-6 text-red-500" />
        )}

        {/* نمایش پیام */}
        <p className="flex-1">{toast.message}</p>
      </div>

      {/* نوار زمان */}
      <div
        className="w-full h-1 mt-2 bg-gray-200 rounded-full"
        style={{
          width: `${(toast.timeLeft / toast.duration) * 100}%`, // زمان باقی‌مانده
          backgroundColor: toast.type === 'success' ? '#5B52A3' : 'red',
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  )
}

export default Toast
