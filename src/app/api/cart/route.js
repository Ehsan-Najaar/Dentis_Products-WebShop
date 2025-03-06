import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import User from '../../../../models/User'

export async function GET() {
  await connectDB()
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await User.findOne({ email: session.user.email }).populate(
    'cart.productId'
  )

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ cart: user.cart })
}

export async function POST(req) {
  await connectDB()
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { productId, quantity = 1 } = await req.json()

  if (!productId || quantity === undefined) {
    return NextResponse.json(
      { message: 'Product ID and quantity are required' },
      { status: 400 }
    )
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  console.log('Before update:', user.cart) // 🛑 بررسی مقدار قبل از تغییر

  const cartItem = user.cart.find(
    (item) => item.productId.toString() === productId
  )

  if (cartItem) {
    cartItem.quantity = quantity
  } else {
    user.cart.push({ productId, quantity })
  }

  await user.save()

  console.log('After update:', user.cart) // 🛑 بررسی مقدار بعد از تغییر

  await user.populate('cart.productId')

  return NextResponse.json({
    message: 'Product updated in cart',
    cart: user.cart,
  })
}

export async function DELETE(req) {
  await connectDB()
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await req.json()

  if (!productId) {
    return NextResponse.json(
      { message: 'Product ID is required' },
      { status: 400 }
    )
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  console.log('Before delete:', user.cart) // 🛑 بررسی مقدار قبل از حذف

  user.cart = user.cart.filter(
    (item) => item.productId.toString() !== productId
  )

  await user.save()

  console.log('After delete:', user.cart) // 🛑 بررسی مقدار بعد از حذف

  await user.populate('cart.productId')

  return NextResponse.json({
    message: 'Product removed from cart',
    cart: user.cart,
  })
}
