'use client'

import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import { useAppContext } from '../../../../context/AppContext'

export default function Category() {
  const { showToast } = useAppContext()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('خطا در بارگذاری دسته‌بندی‌ها')
      }
    }
    fetchCategories()
  }, [])

  const addCategory = async (e) => {
    e.preventDefault()
    if (newCategory.name) {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })
      const data = await response.json()
      if (response.ok) {
        setCategories([...categories, data])
        setNewCategory({ name: '' })
        showToast('دسته بندی با موفقیت اضافه شد', 'success')
      } else {
        showToast('خطا در افزودن دسته بندی', 'error')
      }
    }
  }

  const deleteSelectedCategories = async () => {
    for (const id of selectedCategories) {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        showToast('دسته‌بندی‌های انتخاب شده با موفقیت حذف شدند', 'success')
      } else {
        showToast('خطا در حذف دسته‌بندی‌ها', 'error')
      }
    }
    setCategories(categories.filter((c) => !selectedCategories.includes(c._id)))
    setSelectedCategories([])
  }

  const editCategory = async (e) => {
    e.preventDefault()
    if (editingCategory?.name) {
      const response = await fetch(`/api/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory._id,
          name: editingCategory.name,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setCategories(categories.map((c) => (c._id === data._id ? data : c)))
        setEditingCategory(null)
        showToast('دسته بندی با موفقیت ویرایش شد', 'success')
      } else {
        showToast('خطا در ویرایش دسته بندی', 'error')
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex p-6 gap-12">
        <AdminPanelNavbar />

        <div className="w-full lg:w-4/5 lg:h-[750px] px-2 lg:p-4 lg:flex bg-lightGray rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 px-4 pt-2 lg:hidden">
            <button
              onClick={() => (window.location.href = '/admin')}
              className="p-2 rounded-full bg-bg hover:bg-gray-300"
            >
              <FiArrowRight size={24} />
            </button>
            <h2 className="h3">دسته بندی ها</h2>
          </div>

          <section className="lg:w-1/2 p-4 lg:pl-6 space-y-4">
            <h3 className="hidden lg:block h3 text-center">
              لیست دسته بندی های
            </h3>
            <div className="flex items-center justify-between px-4 py-2 bg-light shadow-sm rounded-full">
              <input
                type="text"
                placeholder="جستجو نام دسته بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
              <FiSearch size={24} className="text-gray-500" />
            </div>
            <div className="flex flex-col gap-2 p-2 h-[calc(100%-24%)] max-h-[calc(100%-24%)] overflow-auto">
              {categories.length === 0 ? (
                <span className="loader"></span>
              ) : (
                categories
                  .filter((category) => category.name.includes(searchTerm))
                  .map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between bg-light p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(category._id)
                                ? prev.filter((id) => id !== category._id)
                                : [...prev, category._id]
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-gray-500"
                        >
                          <Edit size={24} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {selectedCategories.length > 0 && (
              <button
                onClick={deleteSelectedCategories}
                className="flex items-center gap-2 mx-auto py-2 px-4 rounded-full border border-red-800 text-red-800 hover:bg-red-800 hover:text-light transition-all duration-300 whitespace-nowrap"
              >
                حذف موارد انتخاب شده
                <Trash2 size={24} />
              </button>
            )}
          </section>

          <section className="lg:w-1/2 lg:pr-6 lg:border-r border-t lg:border-t-0 border-gray-400">
            <div className="h-1/2 p-4 pb-6 border-b border-gray-400 space-y-4">
              <h3 className="h3">افزودن دسته‌بندی</h3>
              <form
                onSubmit={addCategory}
                className="flex flex-col lg:flex-row gap-2"
              >
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ name: e.target.value })}
                  placeholder="نام دسته‌بندی"
                  className="w-full p-4 rounded-lg bg-bg focus:outline-none  focus:border-dark focus:ring-1 focus:ring-dark"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  افزودن
                </button>
              </form>
            </div>
            {editingCategory && (
              <div className="h-1/2 p-4 pt-6 space-y-4">
                <h3 className="h3">ویرایش دسته‌بندی</h3>
                <form
                  onSubmit={editCategory}
                  className="flex flex-col lg:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-lg bg-bg focus:outline-none  focus:border-dark focus:ring-1 focus:ring-dark"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-lg"
                  >
                    ذخیره
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    لغو
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  )
}
