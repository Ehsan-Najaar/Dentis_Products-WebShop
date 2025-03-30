import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from '../../../../../lib/db'
import User from '../../../../../models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('کاربری با این ایمیل یافت نشد.')

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) throw new Error('ایمیل یا رمز عبور اشتباه است.')

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user // مقدار `user` از `token` دریافت میشه
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // مقدار نقش را ست کن
        }
      }
      return token
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
