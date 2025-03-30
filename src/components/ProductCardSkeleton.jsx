const ProductCardSkeleton = () => {
  return (
    <div className="bg-light w-[160px] h-[240px] sm:w-[160px] sm:h-[240px] md:w-[240px] md:h-[280px] lg:w-[288px] lg:h-[320px] rounded-lg p-4 animate-pulse">
      <div className="w-full h-28 sm:h-32 md:h-40 lg:h-52 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-md"></div>
      <div className="mt-4 space-y-3">
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded w-3/4"></div>
        <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded w-1/2"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded w-full"></div>
      </div>
    </div>
  )
}

const AdminProductCardSkeleton = () => {
  return (
    <div className="w-[1018px] h-[112px] bg-light p-4 flex items-center justify-between gap-4 animate-pulse rounded-lg">
      {/* تصویر محصول */}
      <div className="w-[80px] h-[80px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-md"></div>

      {/* اطلاعات محصول (اسم، دسته‌بندی و قیمت) */}
      <div className="flex items-center gap-4 ml-4 w-[calc(100%-80px)]">
        <div className="w-3/5 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded"></div>
        <div className="w-1/5 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded"></div>
        <div className="w-1/5 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded"></div>
      </div>

      {/* موجودیت محصول */}
      <div className="w-[96px] h-[24px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-full"></div>

      {/* دکمه‌های ادیت و حذف */}
      <div className="flex gap-4">
        <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-full"></div>
        <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[loading_1.5s_infinite_linear] rounded-full"></div>
      </div>
    </div>
  )
}

export { AdminProductCardSkeleton, ProductCardSkeleton }
