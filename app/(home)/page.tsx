import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { LatestProducts } from '@/components/home/latest-products'
import { AboutSection } from '@/components/home/about-section'
import { BackToTop } from '@/components/ui/back-to-top'
import '@/styles/animations.css'

async function getLatestProducts() {
  return await prisma.product.findMany({
    where: {
      name: {
        in: [
          'Shadows of the Past: Unpacking US History',
          'The Obscured Path Shaping the United States from 1900–1950'
        ]
      }
    },
    include: {
      reviews: true,
    },
  })
}

export default async function HomePage() {
  const latestProducts = await getLatestProducts()

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

      <LatestProducts products={latestProducts} />
      
      <BackToTop />
    </div>
  )
}
