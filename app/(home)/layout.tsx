import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 py-6'>{children}</main>
      <Footer />
    </div>
  )
}
