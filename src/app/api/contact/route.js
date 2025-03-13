import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import { getServerSession } from 'next-auth'
import nodemailer from 'nodemailer'
import path from 'path'

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

    // خواندن قالب HTML ایمیل
    const htmlFilePath = path.join(
      process.cwd(),
      'emails',
      'contactTemplate.html'
    )
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8')

    // جایگزینی اطلاعات در قالب HTML
    htmlContent = htmlContent
      .replace('${senderEmail}', session.user.email)
      .replace('${subject}', subject)
      .replace('${message}', message)

    // تنظیمات SMTP برای Zoho
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // Zoho فقط از SSL پشتیبانی می‌کند
      auth: {
        user: process.env.EMAIL_USERNAME, // ایمیل Zoho
        pass: process.env.EMAIL_PASSWORD, // پسورد یا App Password
      },
    })

    // ارسال ایمیل
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: 'info@bionam.ir',
      replyTo: session.user.email, // امکان پاسخ مستقیم به ایمیل کاربر
      subject: subject,
      html: htmlContent, // استفاده از قالب HTML خوانده شده
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
