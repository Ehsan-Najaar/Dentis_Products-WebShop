import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiCheckCircle, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { generateSlug } from '../../utils/slugify'

const ProductCard1 = ({ product }) => {
  const [loading, setLoading] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [cartLoading, setCartLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setCartLoading(true) // شروع بارگذاری سبد خرید
        const res = await fetch('/api/cart')
        const data = await res.json()

        if (res.ok) {
          const isInCart = data.cart?.some(
            (item) => item.productId._id === product._id
          )
          setInCart(isInCart)
        }
      } catch (error) {
        console.error('خطا در دریافت سبد خرید:', error)
      } finally {
        setCartLoading(false) // بارگذاری سبد خرید تمام شده
      }
    }

    fetchCart()
  }, [product._id, inCart])

  const addToCart = async () => {
    setLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setInCart(true)
      alert('محصول به سبد خرید اضافه شد')
    } else {
      alert(data.message || 'خطا در افزودن محصول')
    }
  }

  return (
    <div className="flex flex-col items-center justify-between bg-light lg:rounded-2xl rounded-t-2xl w-40 h-40 lg:w-72 lg:h-80">
      <Link
        href={`/products/${generateSlug(product.name)}-${generateSlug(
          product.brand
        )}`}
        className=""
      >
        <figure className="w-44 lg:h-48 h-32 flex items-center justify-center rounded-2xl overflow-hidden mt-6">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={192}
            height={192}
            className="w-full h-full object-contain object-center"
            priority
          />
        </figure>
      </Link>

      <div className="w-full flex flex-col lg:flex-row justify-between gap-2 lg:items-center bg-accent p-2 rounded-xl">
        <section className="space-y-2">
          <h3 className="lg:body-text text-[14px] w-40 lg:max-w-[184px] truncate">
            <Link
              href={`/products/${generateSlug(product.name)}-${generateSlug(
                product.brand
              )}`}
              className="hover:underline"
            >
              {product.name}
            </Link>
          </h3>

          <div className="flex flex-col">
            <small className="small-text">برند : {product.brand}</small>
            <small className="small-text">تولید : {product.origin}</small>
          </div>
        </section>

        <section className="flex flex-col items-end gap-2">
          <button
            aria-label={`افزودن ${product.name} به سبد خرید`}
            onClick={addToCart}
            className="hidden lg:flex  items-center justify-center w-max p-2 bg-light rounded-full"
            disabled={loading || inCart}
          >
            {/* اگر بارگذاری سبد خرید یا بارگذاری در حال انجام است، آیکون سبد خرید را نمایش می‌دهیم */}
            {cartLoading || loading ? (
              <Image
                src="/icons/Bag.png"
                alt="افزودن به سبد خرید"
                width={24}
                height={24}
                unoptimized
              />
            ) : inCart ? (
              <FiCheckCircle size={24} className="text-primary" /> // آیکون تیک
            ) : (
              <Image
                src="/icons/Bag.png"
                alt="افزودن به سبد خرید"
                width={24}
                height={24}
                unoptimized
              />
            )}
          </button>

          <p className="small-text text-dark">
            {product.price.toLocaleString('en-US')} تومان
          </p>
        </section>
      </div>
    </div>
  )
}

const ProductCard2 = ({ product, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex rounded-lg overflow-hidden bg-light">
      <div className="w-[90%] lg:w-[95%] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral rounded-lg shadow-md p-4">
        {/* بخش تصویر و جزئیات محصول */}
        <div className="flex items-center gap-6">
          <Link
            href={`/product/${product.productId._id}`}
            className="relative w-32 h-32"
          >
            <figure className="flex items-center justify-center rounded-2xl overflow-hidden mt-6">
              <Image
                src={product?.productId?.images?.[0] || '/default-image.jpg'}
                alt={product?.productId?.name || 'بدون نام'}
                layout="fill"
                className="w-full h-full object-center object-contain"
              />
            </figure>
          </Link>
          <div className="space-y-6">
            {/* نمایش نام و دسته‌بندی محصول */}
            <section>
              <Link
                href={`/category/${product.productId.category?._id}`}
                className="w-52 body-text block"
              >
                {product.productId.name}
              </Link>
            </section>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* قیمت محصول */}
          <span className="hidden lg:block text-dark">
            {product.productId.price.toLocaleString('en-US')} تومان
          </span>

          {/* دکمه‌های تغییر تعداد */}
          <div className="flex items-center">
            <button
              onClick={() =>
                onUpdateQuantity(product.productId._id, product.quantity - 1)
              }
              className="px-2 py-2 text-gray-600 border-2 border-gray-300 rounded-lg"
            >
              <FiMinus />
            </button>
            <span className="w-[50px] text-center text-gray-700">
              {product.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(product.productId._id, product.quantity + 1)
              }
              className="px-2 py-2 text-gray-600 border-2 border-gray-300 rounded-lg"
            >
              <FiPlus />
            </button>
          </div>

          {/* نمایش قیمت کل */}
          <span className="w-[120px] text-nowrap text-primary">
            {(product.productId.price * product.quantity).toLocaleString(
              'en-US'
            )}{' '}
            تومان
          </span>
        </div>
      </div>

      {/* دکمه حذف محصول */}
      <button
        onClick={() => onRemove(product.productId._id)}
        className="w-[10%] lg:w-[5%] grid place-items-center text-neutral bg-lightGray hover:bg-[#FF0000] hover:text-light transition-all duration-300"
      >
        <FiTrash2 size={24} />
      </button>
    </div>
  )
}

export { ProductCard1, ProductCard2 }
