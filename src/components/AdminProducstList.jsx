import ConfirmDialog from '@/components/ConfirmDialog'
import { Loader } from '@/components/Loader'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminProductsList({ products, onDelete }) {
  const [categories, setCategories] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // get categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories`)
        if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها')
        const data = await res.json()
        const categoryMap = Object.fromEntries(
          data.map((cat) => [cat._id, cat.name])
        )
        setCategories(categoryMap)
      } catch (error) {
        console.error('❌ خطا در دریافت دسته‌بندی‌ها:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleDelete = (id) => {
    setSelectedProduct(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/products/${selectedProduct}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('حذف محصول ناموفق بود')
      onDelete(selectedProduct) // فراخوانی تابع ارسال‌شده از والد
    } catch (error) {
      console.error('❌ خطا در حذف محصول:', error)
    } finally {
      setConfirmOpen(false)
      setSelectedProduct(null)
    }
  }

  return (
    <div className="lg:h-[calc(100%-28%)] lg:max-h-[calc(100%-28%)] p-2 space-y-4 overflow-auto">
      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className={`flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 bg-light rounded-lg space-y-4 shadow ${
                product.quantity === 0 ? 'opacity-50' : ''
              } border-b last:border-0`}
            >
              {/* تصویر محصول */}
              <section className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center gap-4">
                <figure className="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden ">
                  {product.images?.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      بدون تصویر
                    </div>
                  )}
                </figure>

                <div className="w-full space-y-4 lg:space-y-0">
                  <small className="w-full lg:hidden small-text">
                    {categories[product.category] || 'نامشخص'}
                  </small>
                  <p className="body-text lg:max-w-[70%]">{product.name}</p>
                  <p className="lg:hidden body-text w-32 font-bold">
                    {product.price.toLocaleString()} تومان
                  </p>
                </div>
              </section>

              <section className="w-full lg:w-1/2 flex lg:items-center justify-between gap-2 lg:gap-0">
                {/* اطلاعات محصول */}
                <small className="hidden lg:block w-32 small-text">
                  {categories[product.category] || 'نامشخص'}
                </small>
                {/* قیمت و وضعیت موجودی */}
                <p className="hidden lg:block body-text w-32 text-center">
                  {product.price.toLocaleString()} تومان
                </p>
                {/* وضعیت موجودی */}
                <span
                  className={`w-24 flex items-center justify-center gap-2 px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    product.quantity > 3
                      ? 'bg-green-100 text-green-800'
                      : product.quantity === 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      product.quantity > 3
                        ? 'bg-green-800'
                        : product.quantity === 0
                        ? 'bg-red-800'
                        : 'bg-yellow-800'
                    }`}
                  ></span>
                  {product.quantity > 3
                    ? 'موجود'
                    : product.quantity === 0
                    ? 'ناموجود'
                    : `تنها ${product.quantity} عدد `}
                </span>
                {/* دکمه‌ها */}
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/products/${product._id}/edit-product`}
                    className="text-gray-500"
                  >
                    <Edit size={24} />
                  </Link>

                  <button
                    className="text-gray-500"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </section>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">هیچ محصولی یافت نشد.</p>
      )}

      {/* کامپوننت تأیید حذف */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="حذف محصول"
        message="آیا از حذف این محصول مطمئن هستید؟"
      />
    </div>
  )
}
