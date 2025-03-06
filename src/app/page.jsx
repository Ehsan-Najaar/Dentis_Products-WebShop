'use client'

import FAQAccordion from '@/components/Accordion'
import Banner from '@/components/Banner'
import CategoriesAndProducts from '@/components/CategoriesAndProducts '
import MostViewedProducts from '@/components/MostViewedProducts'
import Services from '@/components/Services'

export default function Home() {
  return (
    <main className="space-y-24">
      {/* بنر صفحه */}
      <section aria-label="بنر اصلی">
        <Banner />
      </section>

      {/* خدمات */}
      <section aria-label="خدمات وب‌سایت">
        <Services />
      </section>

      {/* محصولات پرفروش */}
      <section aria-label="پربازدیدترین محصولات">
        <MostViewedProducts />
      </section>

      {/* دسته‌بندی‌ها و محصولات */}
      <section aria-label="دسته‌بندی‌ها و محصولات">
        <CategoriesAndProducts />
      </section>

      {/* سوالات متداول */}
      <section aria-label="سوالات متداول">
        <FAQAccordion />
      </section>
    </main>
  )
}
