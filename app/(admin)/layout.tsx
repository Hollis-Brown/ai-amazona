import { AdminHeader } from "@/components/admin/admin-header"
import { ServerProtectedRoute } from "@/components/auth/server-protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ServerProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <main className="flex w-full flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </ServerProtectedRoute>
  )
}
