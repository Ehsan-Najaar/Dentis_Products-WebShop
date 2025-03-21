'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import { Edit, Plus, Signpost, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiMail, FiMapPin, FiX } from 'react-icons/fi'
import { useAppContext } from '../../context/AppContext'

const UserAddresses = ({ userId }) => {
  const { showToast } = useAppContext()
  const pathname = usePathname()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/addresses?userId=${userId}`)
        const data = await res.json()
        if (Array.isArray(data)) setAddresses(data)
      } catch (error) {
        console.error('Error fetching addresses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [userId])

  const openModalForAdd = () => {
    setNewAddress({ street: '', city: '', postalCode: '' })
    setEditingAddressId(null) // برای افزودن آدرس جدید
    setIsModalOpen(true)
  }

  const openModalForEdit = (address) => {
    setNewAddress({
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
    })
    setEditingAddressId(address._id)
    setIsModalOpen(true)
  }

  const handleSaveAddress = async () => {
    if (Object.values(newAddress).some((val) => !val)) {
      alert('لطفاً تمام فیلدها را پر کنید')
      return
    }

    if (editingAddressId) {
      // ویرایش آدرس
      const res = await fetch('/api/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          addressId: editingAddressId,
          updatedAddress: newAddress,
        }),
      })
      const data = await res.json()
      setAddresses(data)
      showToast('آدرس مورد نظر ویرایش شد', 'success')
    } else {
      // افزودن آدرس جدید
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, address: newAddress }),
      })
      const data = await res.json()
      setAddresses(data)
      showToast('آدرس مورد نظر اضافه شد', 'success')
    }

    setIsModalOpen(false) // بستن مودال پس از ذخیره
  }

  const confirmDeleteAddress = (addressId) => {
    setSelectedAddressId(addressId)
    setDialogOpen(true)
  }

  const handleDeleteAddress = async () => {
    if (!selectedAddressId) return

    const res = await fetch(
      `/api/addresses?userId=${userId}&addressId=${selectedAddressId}`,
      { method: 'DELETE' }
    )

    const text = await res.text()

    try {
      const data = JSON.parse(text)
      setAddresses(data)
      showToast('آدرس مورد نظر حذف شد', 'success')
    } catch (error) {
      console.error('Error parsing JSON:', error)
    }

    setDialogOpen(false)
    setSelectedAddressId(null)
  }

  if (loading) {
    return (
      // نمایش حالت لودینگ روی کل بخش
      <div className="h-full w-4/5 bg-lightGray grid place-items-center">
        <span className="loader"></span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* نمایش عنوان و دکمه افزودن آدرس */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="hidden lg:inline-block h3">
          {pathname.startsWith('/dashboard/addresses') ? (
            <span>آدرس های من</span>
          ) : (
            <span>انتخاب آدرس تحویل</span>
          )}
        </h2>

        <button
          onClick={openModalForAdd}
          disabled={addresses.length >= 3}
          className={`btn-outline w-full lg:w-max flex items-center justify-center gap-2 ${
            addresses.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus size={16} /> افزودن آدرس جدید
        </button>
      </div>

      {/* نمایش لیست آدرس‌ها */}
      {addresses === null ? (
        <p className="loader"></p>
      ) : addresses.length > 0 ? (
        <ul
          className={`${
            pathname.startsWith('/dashboard/addresses')
              ? 'h-[278px] max-h-[278px]'
              : 'h-[410px] max-h-[410px]'
          } overflow-auto p-2 space-y-2`}
        >
          {addresses.map((address) => (
            <li
              key={address._id}
              onClick={() => {
                if (!pathname.startsWith('/dashboard/addresses')) {
                  setSelectedAddress(address)
                }
              }}
              className={`p-4 rounded flex flex-col lg:flex-row justify-between items-center border-2 ${
                !pathname.startsWith('/dashboard/addresses')
                  ? 'cursor-pointer'
                  : ''
              } ${
                selectedAddress?._id === address._id
                  ? 'bg-accent border-primary text-primary'
                  : 'bg-light border-light'
              }`}
            >
              <div className="w-4/5 space-y-4">
                <div className="flex items-center gap-4">
                  <Signpost size={20} className="shrink-0 h-5" />
                  <p className="leading-relaxed">{address.street}</p>
                </div>

                <p className="flex items-center gap-4 body-text">
                  <FiMapPin size={20} />
                  <span className="font-semibold">{address.city}</span>
                </p>
                <div className="flex items-center gap-4">
                  <FiMail size={20} />
                  <p>{address.postalCode}</p>
                </div>
              </div>
              <div className="w-full lg:w-max flex justify-end gap-2 lg:flex-col lg:gap-8 mt-6 text-gray-500">
                <button
                  onClick={() => openModalForEdit(address)}
                  className="p-2 bg-bg rounded"
                >
                  <Edit size={24} />
                </button>
                <button
                  onClick={() => confirmDeleteAddress(address._id)}
                  className="p-2 bg-bg rounded"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>هیچ آدرسی وجود ندارد.</p>
      )}

      {/* مودال افزودن/ویرایش آدرس */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          style={{ margin: 0 }}
        >
          <div className="bg-light p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
            {/* دکمه بستن */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-light rounded-full p-2"
            >
              <FiX size={24} />
            </button>
            <div className="space-y-4">
              <h3 className="h3 text-center">
                {editingAddressId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
              </h3>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                placeholder="خیابان ، کوچه ، پلاک ، واحد"
                className="input w-full"
              />
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                placeholder="شهر"
                className="input w-full"
              />
              <input
                type="text"
                value={newAddress.postalCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
                placeholder="کد پستی"
                className="input w-full"
              />
              <button
                onClick={handleSaveAddress}
                className="btn-primary w-full"
              >
                {editingAddressId ? 'ذخیره تغییرات' : 'افزودن آدرس'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteAddress}
        title="حذف آدرس"
        message="آیا از حذف این آدرس مطمئن هستید؟"
      />
    </div>
  )
}

export default UserAddresses
