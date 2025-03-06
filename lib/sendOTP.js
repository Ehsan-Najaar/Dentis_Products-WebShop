import cryptoRandomString from 'crypto-random-string'
import { Resend } from 'resend'
import OTP from '../models/OTP'

const resend = new Resend(process.env.RESEND_API_KEY) // استفاده از کلید API از متغیر محیطی

export async function POST(req) {
  const { email } = await req.json() // دریافت ایمیل از درخواست کاربر

  // تولید کد OTP تصادفی با استفاده از crypto-random-string
  const otpCode = cryptoRandomString({ length: 6, type: 'numeric' }) // تولید کد 6 رقمی

  // ذخیره کد OTP در MongoDB
  try {
    const otp = new OTP({
      email,
      code: otpCode,
      createdAt: new Date(), // اضافه کردن زمان ساخت کد
    })
    await otp.save()

    // ارسال ایمیل با استفاده از Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'کد تأیید ورود',
      html: `<p>کد تأیید شما: <strong>${otpCode}</strong></p>`,
    })

    return new Response('کد تأیید ارسال شد', { status: 200 })
  } catch (error) {
    return new Response('خطا در ارسال کد تأیید', { status: 500 })
  }
}
