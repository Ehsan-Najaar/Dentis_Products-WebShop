'use client'

import { Edit, Plus, Signpost, Trash2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiMail, FiMapPin, FiX } from 'react-icons/fi'

const UserAddresses = ({ userId }) => {
  const pathname = usePathname()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`/api/addresses?userId=${userId}`)
        const data = await res.json()
        if (Array.isArray(data)) setAddresses(data)
      } catch (error) {
        console.error('Error fetching addresses:', error)
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
    setEditingAddressId(address._id) // ذخیره آیدی آدرسی که قرار است ویرایش شود
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
    } else {
      // افزودن آدرس جدید
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, address: newAddress }),
      })
      const data = await res.json()
      setAddresses(data)
    }

    setIsModalOpen(false) // بستن مودال پس از ذخیره
  }

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) return

    const res = await fetch(
      `/api/addresses?userId=${userId}&addressId=${addressId}`,
      { method: 'DELETE' }
    )

    const text = await res.text()
    console.log('Response:', text) // اینجا بررسی می‌کنیم که آیا پاسخ معتبر است؟

    try {
      const data = JSON.parse(text)
      setAddresses(data)
    } catch (error) {
      console.error('Error parsing JSON:', error)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="h3">
          {pathname.startsWith('/dashboard/addresses') ? (
            <span>آدرس های من</span>
          ) : (
            <span>انتخاب آدرس تحویل</span>
          )}
        </h2>
        <button
          onClick={openModalForAdd}
          disabled={addresses.length >= 3}
          className={`btn-outline flex items-center gap-2 ${
            addresses.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus size={16} /> افزودن آدرس جدید
        </button>
      </div>

      <ul
        className={`${
          pathname.startsWith('/dashboard/addresses')
            ? 'h-[278px] max-h-[278px]'
            : 'h-[410px] max-h-[410px]'
        } overflow-auto p-2 space-y-2`}
      >
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <li
              key={address._id}
              onClick={() => {
                if (!pathname.startsWith('/dashboard/addresses')) {
                  setSelectedAddress(address)
                }
              }}
              className={`p-4 rounded flex justify-between items-center border-2  ${
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
              <div className="flex flex-col gap-8 text-gray-500">
                <button onClick={() => openModalForEdit(address)}>
                  <Edit size={24} />
                </button>
                <button onClick={() => handleDeleteAddress(address._id)}>
                  <Trash2 size={24} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>هیچ آدرسی وجود ندارد.</p>
        )}
      </ul>

      {/* مودال افزودن/ویرایش آدرس */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          style={{ margin: 0 }}
        >
          <div className="bg-light p-6 rounded-lg shadow-lg w-96 relative">
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
    </div>
  )
}

export default UserAddresses
