import cryptoRandomString from 'crypto-random-string'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import OTP from '../../../../../models/OTP'

// دسترسی به کلید API از متغیر محیطی
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const { email } = await req.json() // دریافت ایمیل از درخواست کاربر

  // تولید کد OTP تصادفی
  const otpCode = cryptoRandomString({ length: 6, type: 'numeric' })

  try {
    console.log(`Received OTP request for email: ${email}`)
    const otp = new OTP({
      email,
      code: otpCode,
      createdAt: new Date(),
    })
    await otp.save()

    console.log('OTP saved to database:', otp)

    // خواندن فایل HTML
    const htmlFilePath = path.join(process.cwd(), 'emails', 'otpTemplate.html')
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8')

    // جایگزینی کد OTP در قالب HTML
    htmlContent = htmlContent.replace('${otpCode}', otpCode)

    // ارسال ایمیل
    await resend.emails.send({
      from: 'info@bionam.ir', // اینجا آدرس ایمیل خود را وارد کنید
      to: email,
      subject: 'کد تأیید ورود',
      html: htmlContent, // استفاده از قالب HTML خوانده شده
    })

    console.log('OTP sent to email:', email)

    return new Response('کد تأیید ارسال شد', { status: 200 })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response('خطا در ارسال کد تأیید', { status: 500 })
  }
}
