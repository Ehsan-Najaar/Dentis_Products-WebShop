import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  FiArrowLeftCircle,
  FiCheck,
  FiChevronLeft,
  FiList,
  FiLoader,
  FiMinus,
  FiPlus,
  FiShoppingCart,
} from 'react-icons/fi'

export default function ProductDetails({
  product,
  addToCart,
  inCart,
  isLoading,
  isLoggedIn,
}) {
  const [selectedImage, setSelectedImage] = useState(product?.images[0] || '')
  const [productNumber, setProductNumber] = useState(1)
  const [categoryName, setCategoryName] = useState('')
  const [isInCart, setIsInCart] = useState(inCart)
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    setIsInCart(inCart)
  }, [inCart])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch('/api/categories')
        const categories = await res.json()
        const category = categories.find((cat) => cat._id === product.category)
        if (category) setCategoryName(category.name)
      } catch (error) {
        console.error('خطا در دریافت دسته‌بندی:', error)
      }
    }

    if (product.category) fetchCategory()
  }, [product.category])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setCartLoading(true)
        const res = await fetch('/api/cart')
        const data = await res.json()

        if (res.ok) {
          const isInCart = data.cart?.some(
            (item) => item.productId._id === product._id
          )
          setIsInCart(isInCart)
        }
      } catch (error) {
        console.error('خطا در دریافت سبد خرید:', error)
      } finally {
        setCartLoading(false)
      }
    }

    fetchCart()
  }, [product._id, inCart])

  // مرجع برای باکس توضیحات جهت اسکرول
  const descriptionRef = useRef(null)

  // تغییر تصویر انتخاب‌شده هنگام کلیک روی تصاویر کوچک
  const handleImageClick = (image) => setSelectedImage(image)

  // تغییر تعداد محصول بر اساس مقدار ورودی کاربر
  const handleQuantityChange = (e) => setProductNumber(Number(e.target.value))

  // افزودن محصول به سبد خرید
  const updateCart = (quantity) => {
    addToCart(quantity)
    isLoggedIn && setIsInCart(true)
  }

  // محاسبه قیمت نهایی محصول بر اساس تعداد انتخاب شده
  const calculateTotalPrice = () => product?.price * productNumber

  // اسکرول به بخش توضیحات محصول
  const scrollToDescription = () => {
    descriptionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-24">
      {/* سکشن اصلی شامل گالری محصول و اطلاعات آن */}
      <section className="w-full flex flex-col lg:flex-row lg:max-h-[600px] gap-4 lg:gap-0 overflow-hidden">
        {/* گالری تصاویر محصول */}
        <div className="flex flex-col lg:flex-row-reverse gap-4">
          {/* نمایش تصویر اصلی محصول */}
          <div className="relative bg-light rounded-r-lg">
            <Image
              src={selectedImage}
              alt={`تصویر ${product?.name}`}
              width={800}
              height={800}
              className="h-full object-contain"
            />
          </div>

          {/* تصاویر کوچک محصول */}
          <div className="flex lg:flex-col items-center justify-center lg:justify-start gap-4">
            {product?.images?.map((image, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-light cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-gray-400"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image}
                  alt={`تصویر کوچک ${index}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* اطلاعات محصول */}
        <div className="relative w-full flex flex-col justify-between bg-lightGray lg:py-6 lg:px-6 p-4 rounded-l-lg space-y-8">
          {/* مسیر صفحه (breadcrumb) برای سئو بهتر */}
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-dark">
                  خانه
                </Link>
              </li>
              <FiChevronLeft />
              <li>
                <Link href="/products" className="hover:text-dark">
                  محصولات
                </Link>
              </li>
              <FiChevronLeft />
              <li>
                <Link
                  href={`/store/${product?.category || 'default-category'}`}
                  className="hover:text-dark"
                >
                  {categoryName || 'دسته‌بندی'}
                </Link>
              </li>
              <FiChevronLeft />
              <li>{product.name}</li>
            </ol>
          </nav>

          {/* نمایش نام محصول */}
          <h1 className="h3 font-semibold">{product?.name || 'نام محصول'}</h1>

          {/* برند و کشور سازنده */}
          <div className="flex items-center gap-4 text-gray-500">
            <p className="w-full bg-bg rounded-lg p-2">
              برند : {product.brand}
            </p>
            <p className="w-full bg-bg rounded-lg p-2">
              تولید : {product.origin}
            </p>
          </div>

          {/* ویژگی‌های محصول */}
          <section className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiList size={24} />
                <p className="h3">ویژگی‌ها :</p>
              </div>
              <ul className="grid grid-cols-2 gap-4 pl-5 text-gray-500">
                {product?.features?.map((feature, index) => (
                  <li key={index} className="bg-bg rounded-lg p-2 truncate">
                    {feature}
                  </li>
                ))}
                <button
                  onClick={scrollToDescription}
                  className="flex items-center justify-between bg-accent rounded-lg p-2 text-dark"
                >
                  نمایش تمام ویژگی ها
                  <FiArrowLeftCircle size={20} />
                </button>
              </ul>
            </div>
          </section>

          {/* قیمت و افزودن به سبد خرید */}
          <section className="flex items-end justify-between mt-4">
            <div className="text-gray-800">
              <span className="text-lg">قیمت</span>
              <p className="h3 font-semibold">
                {calculateTotalPrice().toLocaleString('en-US')} تومان
              </p>
            </div>

            {/* انتخاب تعداد و افزودن به سبد خرید */}
            <div className="flex flex-col items-center gap-4">
              {!isInCart && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      productNumber > 1 && setProductNumber(productNumber - 1)
                    }
                    className="w-10 h-10 grid place-items-center rounded-full border text-3xl font-bold border-dark text-dark hover:border-primary"
                  >
                    <FiMinus />
                  </button>
                  <input
                    min="1"
                    value={productNumber}
                    onChange={handleQuantityChange}
                    className="w-24 p-2 text-center rounded-full bg-transparent border border-dark text-dark"
                  />
                  <button
                    onClick={() => setProductNumber(productNumber + 1)}
                    className="w-10 h-10 grid place-items-center rounded-full border text-3xl font-bold border-dark text-dark hover:border-primary"
                  >
                    <FiPlus />
                  </button>
                </div>
              )}

              <button
                className={`flex items-center gap-2 py-4 px-8 rounded-lg ${
                  isLoggedIn && isInCart
                    ? 'bg-gray-500 text-gray-100'
                    : 'btn-primary'
                }`}
                onClick={() => !isInCart && updateCart(productNumber)}
                disabled={isInCart || cartLoading}
              >
                {cartLoading
                  ? 'درحال افزودن...'
                  : isLoggedIn && isInCart
                  ? 'اضافه شد به سبد خرید'
                  : 'افزودن به سبد خرید'}
                {cartLoading ? (
                  <FiLoader className="animate-spin" size={18} />
                ) : isLoggedIn && isInCart ? (
                  <FiCheck size={18} />
                ) : (
                  <FiShoppingCart size={18} />
                )}
              </button>
            </div>
          </section>
        </div>
      </section>

      {/* توضیحات محصول */}
      <section
        ref={descriptionRef}
        className="min-h-96 bg-lightGray rounded-xl shadow-md px-4 pb-4 space-y-6"
      >
        <h2 className="w-max bg-accent text-dark text-lg rounded-b-lg p-2">
          توضیحات و ویژگی‌ها
        </h2>
        <p className="h-96 max-h-96 overflow-auto p-2 text-gray-700">
          {product.description}
        </p>
      </section>
    </div>
  )
}
