// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email';

export const runtime = 'nodejs';

const prisma = getPrismaClient();

// Generate order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryPincode,
      notes,
      items,
      subtotal,
      discount,
      deliveryCharge,
      totalAmount,
    } = data;

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let exists = await prisma.order.findUnique({ where: { orderNumber } });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await prisma.order.findUnique({ where: { orderNumber } });
    }

    // Get variant IDs from SKUs
    const variantSkus = items.map((item: any) => item.variantSku);
    const variants = await prisma.variant.findMany({
      where: { sku: { in: variantSkus } },
      include: { product: true },
    });

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        companyName: companyName || null,
        deliveryAddress: deliveryAddress || null,
        deliveryCity: deliveryCity || null,
        deliveryState: deliveryState || null,
        deliveryPincode: deliveryPincode || null,
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        notes: notes || null,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => {
            const variant = variants.find(v => v.sku === item.variantSku);
            if (!variant) throw new Error(`Variant not found: ${item.variantSku}`);

            const discountPercent = calculateBulkDiscount(item.quantity);
            const itemDiscount = item.unitPrice * item.quantity * discountPercent / 100;
            const totalPrice = (item.unitPrice * item.quantity) - itemDiscount;

            return {
              variantId: variant.id,
              productName: item.productName,
              variantSize: item.variantSize,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: itemDiscount,
              totalPrice,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    // Send email notifications (non-blocking)
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      companyName: order.companyName || undefined,
      deliveryAddress: order.deliveryAddress || undefined,
      deliveryCity: order.deliveryCity || undefined,
      deliveryState: order.deliveryState || undefined,
      deliveryPincode: order.deliveryPincode || undefined,
      items: order.items.map(item => ({
        productName: item.productName,
        variantSize: item.variantSize,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryCharge: order.deliveryCharge,
      totalAmount: order.totalAmount,
      notes: order.notes || undefined,
    };

    Promise.all([
      sendOrderConfirmation(emailData),
      sendAdminOrderNotification(emailData),
    ]).catch(error => {
      console.error('Error sending order email notifications:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Calculate bulk discount (same logic as cart)
function calculateBulkDiscount(quantity: number): number {
  const tier = Math.floor(quantity / 500);
  return tier * 2.5;
}

// GET all orders (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const where: any = {};
    if (status) where.status = status;
    if (email) where.customerEmail = email;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
