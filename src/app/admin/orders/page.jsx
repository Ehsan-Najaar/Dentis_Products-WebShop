import AdminPanelNavbar from '@/components/AdminPanelNavbar'

export default function Orders() {
  return (
    <div className="min-h-screen flex p-6 gap-12">
      {/* نوار کناری */}
      <AdminPanelNavbar />

      {/* مین کانتنت */}
      <div className="w-4/5 p-4 bg-lightGray rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">مدیریت سفارشات</h1>

        {/* جدول یا لیست سفارشات */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">لیست سفارشات</h2>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">شناسه سفارش</th>
                <th className="py-2 px-4 border-b">نام مشتری</th>
                <th className="py-2 px-4 border-b">تاریخ سفارش</th>
                <th className="py-2 px-4 border-b">وضعیت</th>
                <th className="py-2 px-4 border-b">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {/* نمایش چند سفارش برای نمایش */}
              <tr>
                <td className="py-2 px-4 border-b">ORD001</td>
                <td className="py-2 px-4 border-b">مشتری 1</td>
                <td className="py-2 px-4 border-b">2025-02-12</td>
                <td className="py-2 px-4 border-b">در حال پردازش</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-primary hover:text-accent">
                    مشاهده
                  </button>
                  <button className="ml-4 text-red-600 hover:text-red-500">
                    حذف
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">ORD002</td>
                <td className="py-2 px-4 border-b">مشتری 2</td>
                <td className="py-2 px-4 border-b">2025-02-11</td>
                <td className="py-2 px-4 border-b">تکمیل شده</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-primary hover:text-accent">
                    مشاهده
                  </button>
                  <button className="ml-4 text-red-600 hover:text-red-500">
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
