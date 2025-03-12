import AdminPanelNavbar from '@/components/AdminPanelNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen h-[710px] flex p-6 gap-12">
        <AdminPanelNavbar />
      </div>
    </ProtectedRoute>
  )
}
