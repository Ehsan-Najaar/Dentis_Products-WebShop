'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus, FiRefreshCcw, FiTrash2 } from 'react-icons/fi'
import { useAppContext } from '../../../../../../context/AppContext'

export default function EditProductPage() {
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    origin: '',
    quantity: '',
    category: '',
    features: [''],
    description: '',
    images: [],
  })
  const { showToast } = useAppContext()
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [loadingIndexes, setLoadingIndexes] = useState([])

  const productId = pathname.split('/')[3] // Get the product ID from the URL

  // Fetch the categories, product details, and other necessary data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`)
        if (!res.ok) {
          showToast('خطا در دریافت دسته بندی ها', 'error')
        }

        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', productId) // بررسی مقدار productId
        const res = await fetch(`/api/products/${productId}`)

        const text = await res.text() // دریافت به صورت متن

        console.log('Raw response:', text) // بررسی محتوای پاسخ خام

        if (!res.ok) throw new Error(`Error fetching product: ${res.status}`)

        // حالا تلاش برای تبدیل به JSON
        const data = JSON.parse(text)
        console.log('Fetched product data:', data)

        setFormData({
          name: data.name || '',
          price: data.price || '',
          brand: data.brand || '',
          origin: data.origin || '',
          quantity: data.quantity || '',
          category: data.category || '',
          features: data.features || [''],
          description: data.description || '',
          images: data.images || [],
        })
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Error loading product details')
      }
    }

    fetchCategories()
    fetchProduct()
  }, [productId, showToast])

  const formatNumber = (value) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleChangeValue = (e) => {
    const { name, value } = e.target

    if (name === 'price' || name === 'quantity') {
      const numericValue = value.replace(/\D/g, '') // حذف کاراکترهای غیرعددی
      setFormData({
        ...formData,
        [name]: numericValue ? formatNumber(numericValue) : '', // مقدار خالی در صورت حذف همه کاراکترها
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const handleAddFeature = () => {
    if (formData.features.length < 3) {
      setFormData({ ...formData, features: [...formData.features, ''] })
    }
  }

  const handleNewImageUpload = async (event) => {
    if (formData.images.length >= 4) return

    const file = event.target.files[0]
    if (!file) return

    setLoading(true)

    try {
      const formDataImage = new FormData()
      formDataImage.append('file', file)
      formDataImage.append('upload_preset', 'product_images')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dh6tfsjzz/image/upload',
        {
          method: 'POST',
          body: formDataImage,
        }
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(`Error uploading image: ${data.error?.message}`)

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.secure_url],
      }))
    } catch (err) {
      console.error('Error uploading new image:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageReplace = async (index, event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoadingIndexes((prev) => [...prev, index])

    try {
      // 1️⃣ استخراج public_id از URL قبلی
      const prevImageUrl = formData.images[index]
      const publicIdMatch = prevImageUrl.match(/\/v\d+\/(.+)\.\w+$/)
      const publicId = publicIdMatch ? publicIdMatch[1] : null

      // 2️⃣ حذف تصویر قبلی از Cloudinary
      if (publicId) {
        const cloudinaryResponse = await fetch('/api/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_id: publicId }),
        })
        const cloudinaryData = await cloudinaryResponse.json()
        if (!cloudinaryResponse.ok) {
          throw new Error(
            `Error deleting image from Cloudinary: ${
              cloudinaryData.error?.message || 'Unknown error'
            }`
          )
        }
        console.log('Old image deleted from Cloudinary!')
      }

      // 3️⃣ آپلود تصویر جدید به Cloudinary
      const formDataImage = new FormData()
      formDataImage.append('file', file)
      formDataImage.append('upload_preset', 'product_images')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dh6tfsjzz/image/upload',
        {
          method: 'POST',
          body: formDataImage,
        }
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(`Error uploading image: ${data.error?.message}`)

      // 4️⃣ جایگزینی تصویر در دیتابیس (حافظه لوکال فرم) و به‌روزرسانی UI
      setFormData((prev) => {
        const updatedImages = [...prev.images]
        updatedImages[index] = data.secure_url
        return { ...prev, images: updatedImages }
      })

      // 5️⃣ اختیاری: اگر می‌خواهید دیتابیس هم به‌روزرسانی بشه
      const dbResponse = await fetch('/api/products/update-image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: data.secure_url,
          index: index, // یا ID محصول
        }),
      })
      const dbData = await dbResponse.json()
      if (!dbResponse.ok) {
        throw new Error(`Error updating image in database: ${dbData.message}`)
      }

      console.log('Image URL updated in database!')
    } catch (err) {
      console.error('Error replacing image:', err)
    } finally {
      setLoadingIndexes((prev) => prev.filter((i) => i !== index))
    }
  }

  const handleImageDelete = async (index) => {
    try {
      const imageUrl = formData.images[index]

      // 1️⃣ استخراج public_id از URL تصویر
      const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/)
      const publicId = publicIdMatch ? publicIdMatch[1] : null
      if (!publicId) throw new Error('Invalid image URL!')

      // 2️⃣ حذف تصویر از Cloudinary از طریق API خودمان
      const cloudinaryResponse = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      })

      const cloudinaryData = await cloudinaryResponse.json()
      if (!cloudinaryResponse.ok) {
        throw new Error(
          `Error deleting image from Cloudinary: ${cloudinaryData.error?.message}`
        )
      }
      console.log('Image deleted from Cloudinary!')

      // 3️⃣ حذف تصویر از استیت (به‌روزرسانی UI)
      setFormData((prev) => {
        const updatedImages = prev.images.filter((_, i) => i !== index)
        return { ...prev, images: updatedImages }
      })
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('Submitting updated product data:', formData)

    try {
      // بارگذاری تصاویر
      let imageUrls = []
      for (const file of imageFiles) {
        const formDataImage = new FormData()
        formDataImage.append('file', file)
        formDataImage.append('upload_preset', 'product_images')

        console.log('Uploading image:', file.name)

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dh6tfsjzz/image/upload',
          { method: 'POST', body: formDataImage }
        )

        const data = await response.json()
        if (!response.ok)
          throw new Error(`Error uploading image: ${data.error?.message}`)
        imageUrls.push(data.secure_url)
      }

      console.log('قبل از تبدیل قیمت:', formData.price)

      // تبدیل `formData.price` به رشته و حذف کاماها و تبدیل به عدد
      const priceString = String(formData.price).replace(/,/g, '').trim()
      const price = priceString ? parseFloat(priceString) : 0

      // بررسی اینکه قیمت عدد معتبر است یا نه
      if (isNaN(price)) {
        throw new Error('قیمت وارد شده معتبر نیست')
      }

      const quantity = formData.quantity ? Number(formData.quantity) : 0

      const productData = {
        ...formData,
        price, // استفاده از مقدار قیمت نهایی
        images: [...formData.images, ...imageUrls],
      }

      console.log('Final product data before PUT request:', productData)

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(`Error updating product: ${errorData.message}`)
      }
      setTimeout(() => {
        window.location.href = '/admin/products'
      }, 3000)

      showToast('محصول با موفقیت ویرایش شد', 'success')
    } catch (err) {
      setError(err.message)
      showToast('خطا در ویرایش محصول', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex p-6 gap-12">
        <AdminPanelNavbar />
        <div className="lg:w-4/5 p-6 bg-lightGray rounded-2xl shadow-lg space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = '/admin/products')}
              className="p-2 rounded-full bg-bg hover:bg-gray-300"
            >
              <FiArrowRight size={24} />
            </button>
            <h2 className="h3">ویرایش محصول</h2>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* بخش آپلود تصویر */}
            <div className="max-w-max">
              <div className="lg:flex lg:flex-col grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-32 rounded-lg flex items-center justify-center group overflow-hidden"
                  >
                    {loadingIndexes.includes(index) ? (
                      <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
                    ) : (
                      <Image
                        src={image}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
                      <label
                        htmlFor={`replace-${index}`}
                        className="cursor-pointer p-2 bg-white rounded-full"
                      >
                        <FiRefreshCcw size={20} />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="p-2 bg-white rounded-full"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                    <input
                      type="file"
                      id={`replace-${index}`}
                      className="hidden"
                      onChange={(e) => handleImageReplace(index, e)}
                    />
                  </div>
                ))}

                {formData.images.length < 4 && (
                  <label
                    htmlFor="imageUpload"
                    className="w-32 h-32 bg-bg rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer"
                  >
                    <FiPlus size={40} />
                    <span className="text-sm">افزودن</span>
                  </label>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleNewImageUpload}
                />
              </div>
            </div>

            {/* بخش ورودی‌ها */}
            <div className="w-full space-y-5">
              <div className="grid lg:grid-cols-2 gap-6 place-items-center">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChangeValue}
                  className="input"
                  placeholder="نام محصول"
                  required
                />
                <div className="input flex items-center justify-between">
                  <input
                    type="text"
                    name="price"
                    placeholder="قیمت"
                    value={formData.price}
                    onChange={handleChangeValue}
                    inputMode="numeric"
                    className="w-full bg-transparent focus:outline-none"
                    required
                  />
                  <span className="ml-2 text-gray-400">تومان</span>
                </div>
                <div className="w-full grid lg:grid-cols-2 gap-6 place-items-center">
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChangeValue}
                    className="input"
                    placeholder="برند"
                    required
                  />
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChangeValue}
                    className="input"
                    placeholder="کشور سازنده"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChangeValue}
                  className="input"
                  placeholder="تعداد موجود"
                  required
                />
                {/* دسته‌بندی */}
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChangeValue}
                  className="input"
                  required
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ویژگی‌های محصول */}
              <div
                className={`${
                  formData.features.length < 3
                    ? 'flex items-center justify-between'
                    : ''
                }`}
              >
                <div className="grid lg:grid-cols-3 gap-4">
                  {formData.features?.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      className="input w-full"
                      placeholder={`ویژگی ${index + 1}`}
                    />
                  ))}
                </div>
                {formData.features.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="w-max flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap"
                  >
                    افزودن ویژگی جدید
                    <FiPlus />
                  </button>
                )}
              </div>

              {/* توضیحات محصول */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChangeValue}
                className="input min-h-44 resize-none"
                placeholder="توضیحات (اختیاری)"
              />

              {/* دکمه ثبت */}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'در حال ویرایش...' : 'ویرایش محصول'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
