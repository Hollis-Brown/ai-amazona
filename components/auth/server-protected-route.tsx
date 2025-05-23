import { redirect } from "next/navigation"
import { auth } from "@/app/auth"

export async function ServerProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return <>{children}</>
} 
