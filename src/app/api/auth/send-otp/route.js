import cryptoRandomString from 'crypto-random-string'
import { Resend } from 'resend'
import OTP from '../../../../../models/OTP'

const resend = new Resend('re_AUCUiqt3_JNTTXVaNoMrV1av5qYjz5JDL') // کلید API

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

    // ارسال ایمیل
    await resend.emails.send({
      from: 'info@bionam.ir', // اینجا آدرس ایمیل خود را وارد کنید
      to: email,
      subject: 'کد تأیید ورود',
      html: `<p>کد تأیید شما: <strong>${otpCode}</strong></p>`,
    })

    console.log('OTP sent to email:', email)

    return new Response('کد تأیید ارسال شد', { status: 200 })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return new Response('خطا در ارسال کد تأیید', { status: 500 })
  }
}
