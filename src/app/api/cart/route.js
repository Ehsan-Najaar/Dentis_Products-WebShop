import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/db'
import User from '../../../../models/User'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

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
  } catch (error) {
    console.error('Error fetching cart:', error.message) // Log the full error
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

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

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    )

    if (cartItem) {
      cartItem.quantity = quantity
    } else {
      user.cart.push({ productId, quantity })
    }

    await user.save()

    // Ensure cart is populated after saving
    await user.populate('cart.productId')

    return NextResponse.json({
      message: 'Product updated in cart',
      cart: user.cart,
    })
  } catch (error) {
    console.error('Error updating cart:', error.message) // Log the full error
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

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

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    )

    await user.save()

    // Ensure cart is populated after deleting
    await user.populate('cart.productId')

    return NextResponse.json({
      message: 'Product removed from cart',
      cart: user.cart,
    })
  } catch (error) {
    console.error('Error removing product from cart:', error.message) // Log the full error
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}
