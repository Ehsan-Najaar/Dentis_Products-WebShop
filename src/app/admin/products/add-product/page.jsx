'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiPlus, FiRefreshCcw, FiTrash2 } from 'react-icons/fi'

export default function AddProductPage() {
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
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [brands, setBrands] = useState([])
  const [origins, setOrigins] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`)
        if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها')

        const data = await res.json()
        setCategories(data) // ذخیره دسته‌بندی‌ها در state
      } catch (err) {
        console.error(err.message)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    // دریافت برندها و کشورها از localStorage
    const savedBrands = JSON.parse(localStorage.getItem('brands')) || []
    const savedOrigins = JSON.parse(localStorage.getItem('origins')) || []
    setBrands(savedBrands)
    setOrigins(savedOrigins)
  }, [])

  const formatNumber = (value) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleChange = (e) => {
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

  const handleImageSelection = (event, index = null) => {
    const file = event.target.files[0]
    if (file) {
      if (index !== null) {
        // تغییر تصویر موجود
        const updatedImages = [...imageFiles]
        updatedImages[index] = file
        setImageFiles(updatedImages)
      } else {
        // اضافه کردن تصویر جدید
        setImageFiles([...imageFiles, file])
      }
    }
  }

  const handleRemoveImage = (index) => {
    const updatedImages = imageFiles.filter((_, i) => i !== index)
    setImageFiles(updatedImages)
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

  const handleSaveBrand = (e) => {
    const newBrand = e.target.value
    setFormData({ ...formData, brand: newBrand })

    if (newBrand && !brands.includes(newBrand)) {
      const updatedBrands = [...brands, newBrand]
      setBrands(updatedBrands)
      localStorage.setItem('brands', JSON.stringify(updatedBrands))
    }
  }

  const handleSaveOrigin = (e) => {
    const newOrigin = e.target.value
    setFormData({ ...formData, origin: newOrigin })

    if (newOrigin && !origins.includes(newOrigin)) {
      const updatedOrigins = [...origins, newOrigin]
      setOrigins(updatedOrigins)
      localStorage.setItem('origins', JSON.stringify(updatedOrigins))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrls = []
      for (const file of imageFiles) {
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
        if (!response.ok) throw new Error('خطا در آپلود تصویر')
        imageUrls.push(data.secure_url)
      }

      // بررسی مقدار price قبل از ارسال
      console.log('قبل از تبدیل قیمت:', formData.price)

      // تبدیل قیمت به عدد و بررسی اینکه آیا عدد معتبری است یا نه
      const price = formData.price
        ? parseFloat(formData.price.replace(/,/g, '').trim()) // حذف کاماها و تبدیل به عدد
        : 0 // اگر خالی یا نال بود، مقدار پیش‌فرض 0

      // بررسی اینکه قیمت عدد معتبر است یا نه
      if (isNaN(price)) {
        throw new Error('قیمت وارد شده معتبر نیست')
      }

      const quantity = formData.quantity ? Number(formData.quantity) : 0

      const productData = {
        ...formData,
        price: price, // قیمت تبدیل‌شده به عدد
        quantity: quantity, // تعداد موجودی تبدیل‌شده به عدد
        images: imageUrls,
      }

      const res = await fetch(`/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!res.ok) throw new Error('خطا در افزودن محصول')
      window.location.href = '/admin/products'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex p-6 gap-12">
      <AdminPanelNavbar />
      <div className="w-4/5 p-6 bg-lightGray rounded-2xl shadow-lg space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = '/admin/products')}
            className="p-2 rounded-full bg-bg hover:bg-gray-300"
          >
            <FiArrowRight size={24} />
          </button>
          <h2 className="h3">افزودن محصول</h2>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex gap-8">
          <div className="max-w-max">
            <div className="flex flex-col items-center gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Selected Image"
                    width={128}
                    height={128}
                    className="rounded-lg"
                  />

                  {/* گزینه‌های حذف و جایگزین هنگام هاور */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition">
                    <label
                      htmlFor={`replace-${index}`}
                      className="cursor-pointer p-2 bg-light rounded-full"
                    >
                      <FiRefreshCcw size={20} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-light rounded-full"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>

                  {/* اینپوت مخفی برای جایگزینی تصویر */}
                  <input
                    type="file"
                    accept="image/*"
                    id={`replace-${index}`}
                    className="hidden"
                    onChange={(e) => handleImageSelection(e, index)}
                  />
                </div>
              ))}

              {imageFiles.length < 4 && (
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
                onChange={handleImageSelection}
              />
            </div>
          </div>

          <div className="w-full space-y-5">
            <div className="grid grid-cols-2 gap-6 place-items-center">
              <input
                type="text"
                name="name"
                placeholder="نام محصول"
                onChange={handleChange}
                className="input"
                required
              />
              <div className="input flex items-center justify-between">
                <input
                  type="text"
                  name="price"
                  placeholder="قیمت"
                  value={formData.price}
                  onChange={handleChange}
                  inputMode="numeric"
                  className="w-full bg-transparent focus:outline-none"
                  required
                />
                <span className="ml-2 text-gray-400">تومان</span>
              </div>
              <div className="grid grid-cols-2 gap-6 place-items-center">
                <input
                  type="text"
                  name="brand"
                  list="brand-list"
                  placeholder="برند"
                  value={formData.brand}
                  onChange={handleSaveBrand}
                  className="input"
                  required
                />
                <datalist id="brand-list">
                  {brands.map((brand, index) => (
                    <option key={index} value={brand} />
                  ))}
                </datalist>

                <input
                  type="text"
                  name="origin"
                  list="origin-list"
                  placeholder="کشور سازنده"
                  value={formData.origin}
                  onChange={handleSaveOrigin}
                  className="input"
                  required
                />
                <datalist id="origin-list">
                  {origins.map((origin, index) => (
                    <option key={index} value={origin} />
                  ))}
                </datalist>
              </div>
              <input
                type="text"
                name="quantity"
                placeholder="تعداد موجود"
                value={formData.quantity}
                onChange={handleChange}
                inputMode="numeric"
                className="input"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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

            <div
              className={`${
                formData.features.length < 3
                  ? 'flex items-center justify-between'
                  : ''
              }`}
            >
              <div className="grid grid-cols-3 gap-4">
                {formData.features.map((feature, index) => (
                  <input
                    key={index}
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
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

            <textarea
              name="description"
              placeholder="توضیحات (اختیاری)"
              onChange={handleChange}
              className="input min-h-44 resize-none"
            ></textarea>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'در حال افزودن...' : 'افزودن محصول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
