// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'packlite.aryan@gmail.com';
const COMPANY_NAME = 'Packlite - Ariv Packlite Pvt Ltd';

interface QuoteData {
  id: number;
  fullName: string;
  companyName: string;
  phone: string;
  email: string | null;
  items: Array<{
    productType: string;
    dimensions: string | null;
    quantity: string;
    notes: string | null;
  }>;
  additionalComments: string | null;
}

interface QuoteResponseData {
  quoteTo: string;
  customerName: string;
  quoteId: number;
  message: string;
  pricing?: string;
  deliveryInfo?: string;
}

// Send quote confirmation to customer
export async function sendQuoteConfirmation(quoteData: QuoteData) {
  if (!quoteData.email) {
    console.log('No email provided, skipping confirmation email');
    return { success: false, reason: 'no_email' };
  }

  try {
    const itemsList = quoteData.items
      .map((item, index) => `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
          <h4 style="margin: 0 0 10px 0; color: #1f2937;">Item ${index + 1}</h4>
          <p style="margin: 5px 0;"><strong>Product:</strong> ${item.productType}</p>
          ${item.dimensions ? `<p style="margin: 5px 0;"><strong>Dimensions:</strong> ${item.dimensions}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Quantity:</strong> ${item.quantity} units</p>
          ${item.notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${item.notes}</p>` : ''}
        </div>
      `)
      .join('');

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [quoteData.email],
      subject: `Quote Request Received - ${COMPANY_NAME} (Ref: #${quoteData.id})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Packlite</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ariv Packlite Pvt Ltd</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #667eea; margin-top: 0;">Quote Request Received!</h2>
            
            <p>Dear ${quoteData.fullName},</p>
            
            <p>Thank you for your interest in our packaging solutions. We have received your quote request and our team will review it shortly.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Your Reference Number</h3>
              <p style="font-size: 24px; font-weight: bold; color: #667eea; margin: 0;">#${quoteData.id}</p>
            </div>
            
            <h3 style="color: #374151; margin-top: 25px;">Quote Details</h3>
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong>Company:</strong> ${quoteData.companyName}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${quoteData.phone}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${quoteData.email}</p>
            </div>
            
            <h3 style="color: #374151;">Requested Items (${quoteData.items.length})</h3>
            ${itemsList}
            
            ${quoteData.additionalComments ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">Additional Comments</h4>
                <p style="margin: 0; color: #78350f;">${quoteData.additionalComments}</p>
              </div>
            ` : ''}
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li>Our team will review your requirements within 24 hours</li>
                <li>We'll contact you with competitive pricing and delivery options</li>
                <li>For bulk orders, we offer special discounts and free delivery in NCR</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <h3 style="color: #374151; margin-bottom: 15px;">Contact Us</h3>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +91 75035 42703</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> aryanenterprises721@gmail.com</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> C-5, Ram Vihar, Dhanwapur, Sector 104, Gurgaon - 122001</p>
              <p style="margin: 15px 0 5px 0;"><strong>GST No:</strong> 06DVHPK8768L1ZQ</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>&copy; 2025 Ariv Packlite Pvt Ltd. All Rights Reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending customer confirmation:', error);
      return { success: false, error };
    }

    console.log('Customer confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending customer confirmation:', error);
    return { success: false, error };
  }
}

// Send notification to admin about new quote
export async function sendAdminQuoteNotification(quoteData: QuoteData) {
  try {
    const itemsList = quoteData.items
      .map((item, index) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.productType}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.dimensions || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
        </tr>
      `)
      .join('');

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      subject: `🔔 New Quote Request #${quoteData.id} - ${quoteData.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🔔 New Quote Request!</h1>
            <p style="margin: 10px 0 0 0;">Quote #${quoteData.id}</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #374151; margin-top: 0;">Customer Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px; background: #f9fafb;">${quoteData.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Company:</td>
                <td style="padding: 10px;">${quoteData.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; background: #f9fafb;">
                  <a href="tel:${quoteData.phone}" style="color: #667eea; text-decoration: none;">${quoteData.phone}</a>
                </td>
              </tr>
              ${quoteData.email ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Email:</td>
                  <td style="padding: 10px;">
                    <a href="mailto:${quoteData.email}" style="color: #667eea; text-decoration: none;">${quoteData.email}</a>
                  </td>
                </tr>
              ` : ''}
            </table>
            
            <h3 style="color: #374151;">Requested Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">#</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Product</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Dimensions</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            ${quoteData.additionalComments ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">Additional Comments</h4>
                <p style="margin: 0; color: #78350f;">${quoteData.additionalComments}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/quotes/${quoteData.id}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Quote in Admin Panel
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 6px;">
              <h4 style="margin: 0 0 10px 0; color: #374151;">Quick Actions</h4>
              <p style="margin: 5px 0;">
                <a href="tel:${quoteData.phone}" style="color: #667eea;">📞 Call Customer</a>
              </p>
              ${quoteData.email ? `
                <p style="margin: 5px 0;">
                  <a href="mailto:${quoteData.email}" style="color: #667eea;">✉️ Email Customer</a>
                </p>
              ` : ''}
              <p style="margin: 5px 0;">
                <a href="https://wa.me/${quoteData.phone.replace(/[^0-9]/g, '')}" style="color: #667eea;">💬 WhatsApp</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error };
    }

    console.log('Admin notification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending admin notification:', error);
    return { success: false, error };
  }
}

// Send quote response from admin to customer
export async function sendQuoteResponse(responseData: QuoteResponseData) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [responseData.quoteTo],
      subject: `Quote Response - ${COMPANY_NAME} (Ref: #${responseData.quoteId})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Packlite</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Ariv Packlite Pvt Ltd</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #667eea; margin-top: 0;">Quote Response - Ref #${responseData.quoteId}</h2>
            
            <p>Dear ${responseData.customerName},</p>
            
            <p>Thank you for your patience. We have reviewed your requirements and are pleased to provide our quote.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-line;">
              ${responseData.message}
            </div>
            
            ${responseData.pricing ? `
              <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">Pricing Details</h3>
                <div style="white-space: pre-line; color: #1e40af;">
                  ${responseData.pricing}
                </div>
              </div>
            ` : ''}
            
            ${responseData.deliveryInfo ? `
              <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin: 0 0 10px 0; color: #065f46;">Delivery Information</h3>
                <div style="white-space: pre-line; color: #065f46;">
                  ${responseData.deliveryInfo}
                </div>
              </div>
            ` : ''}
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">Next Steps</h3>
              <p style="margin: 0; color: #78350f;">If you're satisfied with our quote, please reply to this email or contact us directly to confirm your order.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <h3 style="color: #374151; margin-bottom: 15px;">Contact Us</h3>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +91 75035 42703</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> aryanenterprises721@gmail.com</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> C-5, Ram Vihar, Dhanwapur, Sector 104, Gurgaon - 122001</p>
              <p style="margin: 15px 0 5px 0;"><strong>GST No:</strong> 06DVHPK8768L1ZQ</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              We look forward to serving you!
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>&copy; 2025 Ariv Packlite Pvt Ltd. All Rights Reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending quote response:', error);
      return { success: false, error };
    }

    console.log('Quote response email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending quote response:', error);
    return { success: false, error };
  }
}

// Order confirmation email types
interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPincode?: string;
  items: Array<{
    productName: string;
    variantSize: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  notes?: string;
}

// Send order confirmation to customer
export async function sendOrderConfirmation(orderData: OrderData) {
  try {
    const itemsList = orderData.items
      .map((item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName} (${item.variantSize})</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${item.totalPrice.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const deliveryAddress = orderData.deliveryAddress 
      ? `${orderData.deliveryAddress}, ${orderData.deliveryCity}, ${orderData.deliveryState} - ${orderData.deliveryPincode}` 
      : 'To be confirmed';

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [orderData.customerEmail],
      subject: `Order Confirmation #${orderData.orderNumber} - ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✓ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Packlite - Ariv Packlite Pvt Ltd</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Dear ${orderData.customerName},</p>
            
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Your Order Number</h3>
              <p style="font-size: 32px; font-weight: bold; color: #10b981; margin: 0;">${orderData.orderNumber}</p>
            </div>
            
            <h3 style="color: #374151; margin-top: 25px;">Order Details</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">Subtotal:</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">₹${orderData.subtotal.toFixed(2)}</td>
                </tr>
                ${orderData.discount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; color: #059669;">Discount:</td>
                  <td style="padding: 12px; text-align: right; color: #059669;">-₹${orderData.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">Delivery Charge:</td>
                  <td style="padding: 12px; text-align: right;">${orderData.deliveryCharge > 0 ? `₹${orderData.deliveryCharge.toFixed(2)}` : 'FREE'}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb;">Total Amount:</td>
                  <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #10b981; border-top: 2px solid #e5e7eb;">₹${orderData.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <h3 style="color: #374151; margin-top: 25px;">Delivery Information</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${orderData.customerName}</p>
              ${orderData.companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${orderData.companyName}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>
              <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${deliveryAddress}</p>
            </div>
            
            ${orderData.notes ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #f59e0b;">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">Order Notes</h4>
              <p style="margin: 0; color: #78350f;">${orderData.notes}</p>
            </div>
            ` : ''}
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af;">What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li>Our team will confirm your order within 24 hours</li>
                <li>We'll contact you for payment and delivery coordination</li>
                <li>Your order will be prepared and shipped</li>
                <li>You'll receive tracking information once shipped</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <h3 style="color: #374151; margin-bottom: 15px;">Need Help?</h3>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +91 75035 42703</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> packlite.aryan@gmail.com</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> C-5, Ram Vihar, Dhanwapur, Sector 104, Gurgaon - 122001</p>
              <p style="margin: 15px 0 5px 0;"><strong>GST No:</strong> 06DVHPK8768L1ZQ</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              This is an automated order confirmation. Please save this email for your records.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>&copy; 2025 Ariv Packlite Pvt Ltd. All Rights Reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation:', error);
      return { success: false, error };
    }

    console.log('Order confirmation email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending order confirmation:', error);
    return { success: false, error };
  }
}

// Send new order notification to admin
export async function sendAdminOrderNotification(orderData: OrderData) {
  try {
    const itemsList = orderData.items
      .map((item, index) => `
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.variantSize}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold;">₹${item.totalPrice.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const deliveryAddress = orderData.deliveryAddress 
      ? `${orderData.deliveryAddress}, ${orderData.deliveryCity}, ${orderData.deliveryState} - ${orderData.deliveryPincode}` 
      : 'Not provided';

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      subject: `🛒 New Order #${orderData.orderNumber} - ₹${orderData.totalAmount.toFixed(2)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🛒 New Order Received!</h1>
            <p style="margin: 10px 0 0 0;">Order #${orderData.orderNumber}</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <h2 style="margin: 0; color: #10b981; font-size: 32px;">₹${orderData.totalAmount.toFixed(2)}</h2>
              <p style="margin: 5px 0 0 0; color: #6b7280;">Total Order Value</p>
            </div>
            
            <h2 style="color: #374151; margin-top: 0;">Customer Information</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px; background: #f9fafb;">${orderData.customerName}</td>
              </tr>
              ${orderData.companyName ? `
              <tr>
                <td style="padding: 10px; font-weight: bold;">Company:</td>
                <td style="padding: 10px;">${orderData.companyName}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; background: #f9fafb;">
                  <a href="tel:${orderData.customerPhone}" style="color: #10b981; text-decoration: none;">${orderData.customerPhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Email:</td>
                <td style="padding: 10px;">
                  <a href="mailto:${orderData.customerEmail}" style="color: #10b981; text-decoration: none;">${orderData.customerEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Delivery:</td>
                <td style="padding: 10px; background: #f9fafb;">${deliveryAddress}</td>
              </tr>
            </table>
            
            <h3 style="color: #374151;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">#</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Product</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Size</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Qty</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Unit Price</th>
                  <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot style="background: #f9fafb; font-weight: bold;">
                <tr>
                  <td colspan="5" style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Subtotal:</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">₹${orderData.subtotal.toFixed(2)}</td>
                </tr>
                ${orderData.discount > 0 ? `
                <tr>
                  <td colspan="5" style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; color: #059669;">Discount:</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; color: #059669;">-₹${orderData.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="5" style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Delivery:</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">${orderData.deliveryCharge > 0 ? `₹${orderData.deliveryCharge.toFixed(2)}` : 'FREE'}</td>
                </tr>
                <tr>
                  <td colspan="5" style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-size: 16px;">Total:</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-size: 16px; color: #10b981;">₹${orderData.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            ${orderData.notes ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">Customer Notes</h4>
              <p style="margin: 0; color: #78350f;">${orderData.notes}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders/${orderData.orderNumber}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Order in Admin Panel
              </a>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 6px;">
              <h4 style="margin: 0 0 10px 0; color: #374151;">Quick Actions</h4>
              <p style="margin: 5px 0;">
                <a href="tel:${orderData.customerPhone}" style="color: #10b981;">📞 Call Customer</a>
              </p>
              <p style="margin: 5px 0;">
                <a href="mailto:${orderData.customerEmail}" style="color: #10b981;">✉️ Email Customer</a>
              </p>
              <p style="margin: 5px 0;">
                <a href="https://wa.me/${orderData.customerPhone.replace(/[^0-9]/g, '')}" style="color: #10b981;">💬 WhatsApp</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending admin order notification:', error);
      return { success: false, error };
    }

    console.log('Admin order notification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending admin order notification:', error);
    return { success: false, error };
  }
}
