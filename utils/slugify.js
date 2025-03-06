// utlis / slugify.js

export function toSlug(text) {
  return text
    .trim() // حذف فاصله‌های اضافی اول و آخر
    .replace(/\s+/g, '-') // تبدیل همه فاصله‌ها به خط فاصله
    .replace(/-+/g, '-') // حذف خط فاصله‌های پشت سرهم
}

export function generateSlug(productName) {
  return toSlug(productName)
}
