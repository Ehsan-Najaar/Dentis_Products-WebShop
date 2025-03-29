import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import { getServerSession } from 'next-auth'
import nodemailer from 'nodemailer'
import path from 'path'

// حافظه موقت برای محدود کردن ارسال ایمیل
const emailLimitCache = new Map()

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return new Response(
        JSON.stringify({ error: 'برای ارسال پیام ابتدا وارد شوید' }),
        { status: 401 }
      )
    }

    const { subject, message } = await req.json()

    if (!subject || !message) {
      return new Response(
        JSON.stringify({ error: 'لطفاً همه فیلدها را پر کنید' }),
        { status: 400 }
      )
    }

    const userEmail = session.user.email
    const currentTime = Date.now()

    // بررسی تعداد ایمیل‌های ارسالی در ۲۴ ساعت اخیر
    const userRequests = emailLimitCache.get(userEmail) || []

    // حذف درخواست‌های قدیمی‌تر از ۲۴ ساعت
    const filteredRequests = userRequests.filter(
      (timestamp) => currentTime - timestamp < 24 * 60 * 60 * 1000
    )

    if (filteredRequests.length >= 5) {
      return new Response(
        JSON.stringify({
          error:
            'حداکثر ۵ ایمیل در هر ۲۴ ساعت مجاز است. لطفاً فردا امتحان کنید.',
        }),
        { status: 429 }
      )
    }

    // اضافه کردن درخواست جدید به لیست
    filteredRequests.push(currentTime)
    emailLimitCache.set(userEmail, filteredRequests)

    // خواندن قالب HTML ایمیل
    const htmlFilePath = path.join(
      process.cwd(),
      'emails',
      'contactTemplate.html'
    )
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8')

    // جایگزینی اطلاعات در قالب HTML
    htmlContent = htmlContent
      .replace('${senderEmail}', userEmail)
      .replace('${subject}', subject)
      .replace('${message}', message)

    // تنظیمات SMTP برای Zoho
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // ارسال ایمیل
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: 'info@bionam.ir',
      replyTo: userEmail,
      subject: subject,
      html: htmlContent,
    })

    return new Response(
      JSON.stringify({ success: true, message: 'ایمیل با موفقیت ارسال شد' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: 'خطایی رخ داد، دوباره امتحان کنید' }),
      { status: 500 }
    )
  }
}
