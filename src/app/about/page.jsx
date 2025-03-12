import Image from 'next/image'

export default function About() {
  return (
    <div className="max-w-7xl mx-auto space-y-20">
      {/* بخش درباره بایو نام */}
      <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/logo.webp"
            width={400}
            height={300}
            alt="درباره بایو نام - لوگو"
            className="rounded-lg"
            loading="lazy" // بهینه‌سازی بارگذاری تصاویر
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="h2">درباره بایو نام (Bionam)</h2>
          <p className="text-justify">
            به دنیای بایو نام خوش آمدید! بایو نام، مرجع تخصصی فروش تجهیزات و
            مصرفی دندان‌پزشکی، با هدف ارائه بهترین محصولات و خدمات به
            دندان‌پزشکان، کلینیک‌ها و مراکز درمانی فعالیت می‌کند. ما در بایو نام
            با تکیه بر سال‌ها تجربه و تخصص در حوزه دندان‌پزشکی، تلاش می‌کنیم تا
            نیازهای شما را به طور کامل برطرف کنیم و تجربه‌ای لذت‌بخش از خرید
            آنلاین را برایتان فراهم آوریم.
          </p>
        </div>
      </section>

      {/* بخش چرا بایو نام؟ */}
      <section className="flex flex-col md:flex-row-reverse items-center gap-10 mb-16">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/question.webp"
            width={500}
            height={500}
            alt="چرا بایو نام؟"
            className="rounded-lg"
            loading="lazy" // بهینه‌سازی بارگذاری تصاویر
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="h2">چرا بایو نام؟</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-disc list-inside text-justify">
            <li>
              <strong>تنوع محصولات:</strong> از تجهیزات پیشرفته دندان‌پزشکی تا
              مصرفی‌های روزمره، همه چیز را در بایو نام پیدا خواهید کرد.
            </li>
            <li>
              <strong>کیفیت بی‌نظیر:</strong> تمامی محصولات ما از برندهای معتبر
              و با کیفیت جهانی انتخاب شده‌اند تا بهترین عملکرد را برای شما به
              ارمغان بیاورند.
            </li>
            <li>
              <strong>قیمت مناسب:</strong> با بهره‌گیری از ارتباطات قوی با
              تامین‌کنندگان، محصولات را با بهترین قیمت به شما ارائه می‌دهیم.
            </li>
            <li>
              <strong>ارسال سریع و مطمئن:</strong> سفارشات شما در کوتاه‌ترین
              زمان ممکن و با بسته‌بندی ایمن به دستتان می‌رسد.
            </li>
            <li className="md:col-span-2">
              <strong>پشتیبانی حرفه‌ای:</strong> تیم پشتیبانی بایو نام همواره
              آماده پاسخگویی به سوالات و راهنمایی شماست.
            </li>
          </ul>
        </div>
      </section>

      {/* بخش ماموریت ما */}
      <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/images/target.webp"
            width={500}
            height={500}
            alt="ماموریت ما"
            className="rounded-lg"
            loading="lazy" // بهینه‌سازی بارگذاری تصاویر
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="h2">ماموریت ما</h2>
          <p className="text-justify">
            ماموریت بایو نام، ارتقای سطح خدمات دندان‌پزشکی با ارائه محصولات با
            کیفیت، ابزارهای مدرن و تجهیزات پیشرفته است. ما اعتقاد داریم که هر
            دندان‌پزشک و هر کلینیک، سزاوار دسترسی به بهترین ابزارها برای ارائه
            خدمات مطلوب به بیماران هستند.
          </p>
        </div>
      </section>

      {/* بخش ارزش‌ها و تعهدات ما */}
      <section className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/Commitment.webp"
            width={500}
            height={300}
            alt="ارزش‌ها و تعهدات ما"
            className="rounded-lg"
            loading="lazy" // بهینه‌سازی بارگذاری تصاویر
          />
        </div>
        <div className="space-y-6">
          <h2 className="h2">ارزش‌ها و تعهدات ما</h2>
          <ul className="space-y-4 list-disc list-inside">
            <li>اعتماد مشتریان، بزرگترین سرمایه ماست.</li>
            <li>تعهد به کیفیت و بهبود خدمات.</li>
            <li>نوآوری و ارائه تجهیزات مدرن.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
