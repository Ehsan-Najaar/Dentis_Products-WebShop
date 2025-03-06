// app / api / auth / verify-otp / route.js
import OTP from '../../../../../models/OTP'

export async function POST(req) {
  const { email, otp } = await req.json()

  if (!email || !otp) {
    return new Response(
      JSON.stringify({ message: 'ایمیل و کد تأیید الزامی است' }),
      {
        status: 400,
      }
    )
  }

  try {
    // جستجو برای کد OTP در پایگاه داده
    const storedOtp = await OTP.findOne({ email, code: otp })

    if (!storedOtp) {
      return new Response(JSON.stringify({ message: 'کد تأیید اشتباه است' }), {
        status: 400,
      })
    }

    // بررسی اینکه کد OTP منقضی نشده باشد
    const now = new Date()
    if (now - new Date(storedOtp.createdAt) > 5 * 60 * 1000) {
      return new Response(
        JSON.stringify({ message: 'کد تأیید منقضی شده است' }),
        {
          status: 400,
        }
      )
    }

    // حذف کد OTP پس از تأیید
    await OTP.deleteOne({ _id: storedOtp._id })

    return new Response(
      JSON.stringify({ message: 'کد تأیید موفقیت‌آمیز بود' }),
      {
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ message: 'خطا در تأیید کد تأیید' }), {
      status: 500,
    })
  }
}
