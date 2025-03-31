import cryptoRandomString from 'crypto-random-string'
import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import OTP from '../../../../../models/OTP'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const { email } = await req.json()

  try {
    console.log(`Received OTP request for email: ${email}`)

    // محاسبه زمان ۲۴ ساعت گذشته
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)

    // شمارش تعداد درخواست‌های OTP در ۲۴ ساعت گذشته
    const otpRequests = await OTP.countDocuments({
      email,
      createdAt: { $gte: last24Hours },
    })

    if (otpRequests >= 3) {
      console.log(`OTP request limit reached for email: ${email}`)
      return new Response(
        'شما بیش از حد مجاز کد درخواست کرده‌اید. لطفاً بعداً تلاش کنید.',
        { status: 429 }
      )
    }

    // تولید کد OTP تصادفی
    const otpCode = cryptoRandomString({ length: 6, type: 'numeric' })

    // ذخیره OTP در پایگاه داده
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
      from: 'info@bionam.ir',
      to: email,
      subject: 'کد تأیید ورود',
      html: htmlContent,
    })

    console.log('OTP sent to email:', email)

    return new Response('کد تأیید ارسال شد', { status: 200 })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response('خطا در ارسال کد تأیید', { status: 500 })
  }
}
