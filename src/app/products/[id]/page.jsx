'use client'

import ProductDetails from '@/components/ProductDetails'
import RelatedProducts from '@/components/RelatedProducts'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { toSlug } from '../../../../utils/slugify'

export default function SingleProductPage() {
  const pathname = usePathname()
  const slug = decodeURIComponent(pathname.split('/').pop())

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('🔹 در حال دریافت محصولات...')
        const res = await fetch('/api/products')

        if (!res.ok) {
          throw new Error('مشکلی در دریافت لیست محصولات پیش آمده است')
        }

        const allProducts = await res.json()

        const generateProductSlug = (product) =>
          toSlug(`${product.name} ${product.brand}`)

        const matchedProduct = allProducts.find(
          (product) => generateProductSlug(product) === slug
        )

        if (!matchedProduct) {
          throw new Error('محصول یافت نشد')
        }

        setProduct(matchedProduct)

        const filteredRelatedProducts = allProducts.filter(
          (p) =>
            p.category === matchedProduct.category &&
            generateProductSlug(p) !== slug
        )
        setRelatedProducts(filteredRelatedProducts)
      } catch (error) {
        console.error('❌ خطا در دریافت محصول:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const addToCart = async (quantity) => {
    setLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id, quantity }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setInCart(true)
    } else {
      alert(data.message || 'خطا در افزودن محصول')
    }
  }

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">
        <FiLoader size={48} />
      </div>
    )
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="max-w-7xl mx-auto space-y-24">
      <ProductDetails
        product={product}
        addToCart={addToCart}
        inCart={inCart}
        isLoading={loading}
      />

      <RelatedProducts relatedProducts={relatedProducts} />
    </div>
  )
}
