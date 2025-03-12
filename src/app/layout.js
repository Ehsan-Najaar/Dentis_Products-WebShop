import Layout from '@/components/Layout'
import '../../styles/globals.css'

export const metadata = {
  title: 'Bionam',
  description: 'Dentis Products Webshop',
  icons: {
    icon: '/images/headerLogo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-bg">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
