export function toSlug(text) {
  if (typeof text !== 'string') return ''

  return text
    .trim() // حذف فاصله‌های اضافی اول و آخر
    .replace(/\s+/g, '-') // تبدیل همه فاصله‌ها به خط فاصله
    .replace(/-+/g, '-') // حذف خط فاصله‌های پشت سرهم
    .toLowerCase() // بهتره همه حروف رو کوچک کنی برای یکنواختی
}

export function generateSlug(productName) {
  return toSlug(productName)
}
