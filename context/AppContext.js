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
  }) // مقداردهی اولیه به cart

  useEffect(() => {
    console.log('Session:', session)
    console.log('Status:', status)
    if (status === 'authenticated') {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [session, status])

  const login = async (email, password) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // جلوگیری از ریدایرکت پیش‌فرض
    })

    if (!result.error) {
      setIsLoggedIn(true)
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    setIsLoggedIn(false)
  }

  return (
    <AppContext.Provider value={{ session, isLoggedIn, login, logout, cart }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
