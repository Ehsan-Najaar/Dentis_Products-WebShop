import { signIn, signOut, useSession } from 'next-auth/react'
import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const { data: session, status } = useSession()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    shippingCost: 0,
  })
  const [toast, setToast] = useState({
    message: '',
    type: '',
    isVisible: false,
    duration: 5000, // مدت زمان نمایش Toast
    timeLeft: 5000, // زمان باقی‌مانده
  })

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [session, status])

  useEffect(() => {
    // شبیه‌سازی بارگذاری سبد خرید
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setCart(data.cart)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }
    fetchCart()
  }, [isLoggedIn]) // هر بار که وضعیت کاربر تغییر کند، سبد خرید بارگذاری می‌شود

  const updateCart = (updatedCart) => {
    setCart(updatedCart)
  }

  const login = async (email, password) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (!result.error) {
      setIsLoggedIn(true)
      showToast('Welcome back!', 'success')
    } else {
      showToast('Login failed. Please try again.', 'error')
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    setIsLoggedIn(false)
    showToast('Logged out successfully.', 'success')
  }

  const showToast = (message, type) => {
    const duration = 5000 // مدت زمان دلخواه برای نمایش Toast

    setToast((prev) => ({
      message,
      type,
      isVisible: true,
      duration,
      timeLeft: duration,
    }))

    // تایمر کاهش زمان
    const timer = setInterval(() => {
      setToast((prev) => {
        if (prev.timeLeft <= 0) {
          clearInterval(timer)
          return { ...prev, isVisible: false }
        }
        return { ...prev, timeLeft: prev.timeLeft - 100 }
      })
    }, 100)

    // پاک کردن تایمر در صورت unmount شدن
    return () => clearInterval(timer)
  }

  return (
    <AppContext.Provider
      value={{
        session,
        isLoggedIn,
        login,
        logout,
        cart,
        updateCart, // اضافه کردن متد updateCart برای آپدیت سبد خرید
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
