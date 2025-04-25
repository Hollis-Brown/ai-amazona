import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Header } from "@/components/layout/header"
import { ServerProtectedRoute } from "@/components/auth/server-protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ServerProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <DashboardNav />
          </aside>
          <main className="flex w-full flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </ServerProtectedRoute>
  )
}
