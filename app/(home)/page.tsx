import Image from 'next/image'
import { db } from '@/lib/db'
import { LatestProducts } from '@/components/home/latest-products'
import { AboutSection } from '@/components/home/about-section'
import { BackToTop } from '@/components/ui/back-to-top'
import '@/styles/animations.css'
import type { Product } from '@/types'

async function getLatestProducts() {
  try {
    console.log('Fetching latest products...')
    const products = await db.product.findMany({
      take: 8, // Limit to 8 latest products
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true,
      },
    })
    console.log('Successfully fetched products:', products.length)
    return products
  } catch (error) {
    console.error('Error fetching latest products:', error)
    return []
  }
}

export default async function HomePage() {
  console.log('Rendering HomePage component')
  const latestProducts = await getLatestProducts()
  console.log('Latest products count:', latestProducts.length)

  return (
    <div className='space-y-8 mt-6'>
      <section className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='relative animate-fade-up'>
          <div className='relative aspect-[21/9] w-full overflow-hidden rounded-lg'>
            <Image
              src='/images/banner.png'
              alt='AI Amazona Banner'
              fill
              className='object-cover'
              priority
            />
            <div className='absolute inset-0 bg-black/20' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 max-w-4xl animate-fade-up animation-delay-200'>
                The U.S. Story — Explained for International Minds
              </h1>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      {latestProducts.length > 0 && <LatestProducts products={latestProducts} />}
      
      <BackToTop />
    </div>
  )
}
