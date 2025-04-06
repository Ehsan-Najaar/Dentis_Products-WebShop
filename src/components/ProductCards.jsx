import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FiCheckCircle,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTrash2,
} from 'react-icons/fi'
import { useAppContext } from '../../context/AppContext'
import { generateSlug } from '../../utils/slugify'

const ProductCard1 = ({ product }) => {
  const { showToast } = useAppContext()
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
            (item) => item.productId && item.productId._id === product._id
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
      showToast('محصول به سبد خرید اضافه شد', 'success')
    } else {
      showToast('خطا در افزودن محصول', 'error')
      alert(data.message || 'خطا در افزودن محصول')
    }
  }

  return (
    <div className="flex flex-col items-center justify-between bg-light md:rounded-2xl rounded-t-2xl w-40 h-40 md:w-72 md:h-80">
      <Link
        href={`/products/${generateSlug(product.name)}-${generateSlug(
          product.brand
        )}`}
        className="w-full"
      >
        <figure className="w-full md:h-48 h-32 flex items-center justify-center rounded-2xl overflow-hidden mt-6">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={192}
            height={192}
            className="object-contain object-center"
            priority
          />
        </figure>
      </Link>

      <div className="w-full flex flex-col md:flex-row justify-between gap-2 md:items-center bg-accent p-2 rounded-xl">
        <section className="space-y-2">
          <h3 className="md:body-text text-[14px] w-36 md:max-w-[184px] truncate">
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
            className="hidden md:flex  items-center justify-center w-max p-2 bg-light rounded-full"
            disabled={loading || inCart}
          >
            {/* اگر بارگذاری سبد خرید یا بارگذاری در حال انجام است، آیکون سبد خرید را نمایش می‌دهیم */}
            {cartLoading || loading ? (
              <FiShoppingCart size={24} className="stroke-[1.5]" />
            ) : inCart ? (
              <FiCheckCircle size={24} className="text-primary" /> // آیکون تیک
            ) : (
              <FiShoppingCart size={24} className="stroke-[1.5]" />
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
      <div className="w-full md:w-[90%] lg:w-[95%] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral rounded-lg shadow-md p-4">
        {/* بخش تصویر و جزئیات محصول */}
        <div className="flex items-center gap-4 sm:gap-6 w-full">
          <Link
            href={`/products/${generateSlug(
              product.productId.name
            )}-${generateSlug(product.productId.brand)}`}
            className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-32 md:h-32"
          >
            <figure className="relative w-20 h-20 lg:w-32 lg:h-32 flex items-center justify-center rounded-2xl overflow-hidden">
              <Image
                src={product?.productId?.images?.[0] || '/default-image.jpg'}
                alt={product?.productId?.name || 'بدون نام'}
                fill
                priority
                sizes="(max-width: 768px) 90px, 190px"
                className="object-center object-contain"
              />
            </figure>
          </Link>

          <div className="flex flex-col lg:gap-4 justify-between w-full">
            <Link
              href={`/products/${generateSlug(
                product.productId.name
              )}-${generateSlug(product.productId.brand)}`}
              className="block lg:w-64 text-sm sm:text-base font-semibold"
            >
              {product.productId.name}
            </Link>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-2">
              {/* قیمت محصول */}
              <span className="text-dark text-xs sm:text-sm">
                {product.productId.price.toLocaleString('en-US')} تومان
              </span>

              {/* دکمه‌های تغییر تعداد */}
              <div className="w-max flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    onUpdateQuantity(
                      product.productId._id,
                      product.quantity - 1
                    )
                  }
                  className="px-2 py-2 text-gray-600"
                >
                  <FiMinus />
                </button>
                <span className="w-10 text-center text-gray-700">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(
                      product.productId._id,
                      product.quantity + 1
                    )
                  }
                  className="px-2 py-2 text-gray-600"
                >
                  <FiPlus />
                </button>
              </div>

              {/* نمایش قیمت کل */}
              <span className="text-primary text-xs sm:text-base font-semibold sm:ml-4">
                {(product.productId.price * product.quantity).toLocaleString(
                  'en-US'
                )}{' '}
                تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه حذف محصول */}
      <button
        onClick={() => onRemove(product.productId._id)}
        className="md:w-[5%] w-[15%] grid place-items-center text-neutral bg-lightGray hover:bg-red-600 hover:text-light transition-all duration-300"
      >
        <FiTrash2 size={24} />
      </button>
    </div>
  )
}

export { ProductCard1, ProductCard2 }
