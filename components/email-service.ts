import { sendEmailSafe } from "@/lib/nodemailer"
import { FormspreeService } from "@/lib/formspree"

export class EmailService {
  // Send customer emails using Nodemailer
  static async sendCustomerEmail(emailData: {
    to: string
    subject: string
    html: string
    type: string
  }): Promise<{ success: boolean; error?: string; method?: string }> {
    try {
      const result = await sendEmailSafe({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      })

      if (result.success) {
        return { success: true, method: result.method }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Send admin notifications using Formspree
  static async sendAdminNotification(data: {
    type: string
    subject: string
    content: string
    metadata?: Record<string, any>
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await FormspreeService.sendAdminNotification(data)

      if (result.success) {
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Order confirmation to customer (Nodemailer)
  static async sendOrderConfirmation(orderDetails: any) {
    // Add invoice link to email if available
    const invoiceSection = orderDetails.invoice_url
      ? `
        <div style="margin: 20px 0; text-align: center;">
          <a href="${orderDetails.invoice_url}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Download Invoice
          </a>
        </div>
      `
      : ""

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .order-item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          .total { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌿 SPARSH</div>
            <h1>Order Confirmation</h1>
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name}!</h2>
            <p>We're excited to confirm that we've received your order. Here are the details:</p>
            
            <h3>📦 Order Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.payment_method}</p>
            <p><strong>Payment ID:</strong> ${orderDetails.payment_id}</p>
            
            <h3>📋 Items Ordered</h3>
            ${orderDetails.order_items
              ?.map(
                (item: any) => `
              <div class="order-item">
                <strong>${item.product_name}</strong><br>
                Quantity: ${item.quantity} × ₹${item.product_price.toLocaleString()}<br>
                <strong>Subtotal: ₹${item.subtotal.toLocaleString()}</strong>
              </div>
            `,
              )
              .join("")}
            
            <div class="total">
              <h3>💰 Total Amount: ₹${orderDetails.total_amount.toLocaleString()}</h3>
            </div>
            
            ${invoiceSection}
            
            <h3>🚚 Shipping Information</h3>
            <p><strong>Delivery Address:</strong><br>${orderDetails.shipping_address}</p>
            <p><strong>Phone:</strong> ${orderDetails.customer_phone}</p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your order, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
            <p><small>This email was sent automatically. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendCustomerEmail({
      to: orderDetails.customer_email,
      subject: `Order Confirmation #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "order_confirmation",
    })
  }

  // Order notification to admin (Formspree)
  static async sendAdminOrderNotification(orderDetails: any) {
    return FormspreeService.sendOrderNotification(orderDetails)
  }

  // Contact message handling
  static async sendContactMessage(contactDetails: {
    name: string
    email: string
    message: string
  }) {
    // Send confirmation to customer (Nodemailer)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Message Received</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>Hello ${contactDetails.name}!</h2>
            <p>Thank you for contacting SPARSH Natural Hair Care. We have received your message and will respond within 24 hours.</p>
            
            <h3>Your Message:</h3>
            <div class="message-box">
              ${contactDetails.message}
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your message</li>
              <li>We'll respond within 24 hours</li>
              <li>For urgent matters, call us at +91 9409073136</li>
            </ul>
            
            <p>Thank you for your interest in our natural hair care products!</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
            <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send customer confirmation
    const customerResult = await this.sendCustomerEmail({
      to: contactDetails.email,
      subject: "Message Received - SPARSH Natural Hair Care",
      html: customerEmailHtml,
      type: "contact_confirmation",
    })

    // Send admin notification via Formspree
    const adminResult = await FormspreeService.sendContactNotification(contactDetails)

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminNotification: adminResult,
    }
  }

  // Enhanced return request handling with photo support
  static async sendReturnRequest(returnDetails: {
    orderId: string
    reason: string
    items: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    refundAmount?: number
    refundPercentage?: number
    photoUrls?: string[]
  }) {
    // Send confirmation to customer (Nodemailer)
    const photoSection =
      returnDetails.photoUrls && returnDetails.photoUrls.length > 0
        ? `
        <h3>📸 Uploaded Photos</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">
          ${returnDetails.photoUrls
            .map(
              (url, index) => `
            <img src="${url}" alt="Return photo ${index + 1}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid #10b981;">
          `,
            )
            .join("")}
        </div>
      `
        : ""

    const refundSection = returnDetails.refundAmount
      ? `
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
          <h3 style="color: #065f46; margin: 0 0 10px 0;">💰 Expected Refund</h3>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #059669;">
            ₹${returnDetails.refundAmount.toLocaleString()} (${returnDetails.refundPercentage}% of order value)
          </p>
        </div>
      `
      : ""

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Return Request Received - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Return Request Received</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>Hello ${returnDetails.customerName}!</h2>
            <p>We have received your return request and will process it within 24-48 hours.</p>
            
            <h3>Return Request Details:</h3>
            <div class="info-box">
              <p><strong>Order ID:</strong> ${returnDetails.orderId}</p>
              <p><strong>Items:</strong> ${returnDetails.items}</p>
              <p><strong>Reason:</strong> ${returnDetails.reason}</p>
              <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${refundSection}
            ${photoSection}
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your return request</li>
              <li>We'll send you return instructions within 48 hours</li>
              <li>Once approved, you'll receive a return shipping label</li>
              <li>Refund will be processed after we receive the returned items</li>
            </ul>
            
            <p>For any questions, please contact us at +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
            <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send customer confirmation via Nodemailer
    const customerResult = await this.sendCustomerEmail({
      to: returnDetails.customerEmail,
      subject: "Return Request Received - SPARSH Natural Hair Care",
      html: customerEmailHtml,
      type: "return_confirmation",
    })

    // Send admin notification via Formspree
    const photoInfo =
      returnDetails.photoUrls && returnDetails.photoUrls.length > 0
        ? `\n📸 Photos uploaded: ${returnDetails.photoUrls.length} images\nPhoto URLs: ${returnDetails.photoUrls.join(", ")}`
        : ""

    const adminResult = await FormspreeService.sendAdminNotification({
      type: "return_request",
      subject: `🔄 Return Request from ${returnDetails.customerName} - Order #${returnDetails.orderId}`,
      content: `
🔄 NEW RETURN REQUEST

Customer Details:
- Name: ${returnDetails.customerName}
- Email: ${returnDetails.customerEmail}
- Phone: ${returnDetails.customerPhone}
- Address: ${returnDetails.customerAddress}

Return Details:
- Order ID: ${returnDetails.orderId}
- Items: ${returnDetails.items}
- Reason: ${returnDetails.reason}
- Expected Refund: ₹${returnDetails.refundAmount?.toLocaleString() || "TBD"} (${returnDetails.refundPercentage || 60}%)
- Request Date: ${new Date().toLocaleString()}${photoInfo}

⚠️ ACTION REQUIRED: Please review and process this return request.
      `,
      metadata: {
        order_id: returnDetails.orderId,
        customer_email: returnDetails.customerEmail,
        customer_name: returnDetails.customerName,
        refund_amount: returnDetails.refundAmount,
        photo_count: returnDetails.photoUrls?.length || 0,
      },
    })

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminNotification: adminResult,
    }
  }

  // Signup confirmation to customer (Nodemailer)
  static async sendSignupConfirmation(userDetails: {
    email: string
    fullName?: string
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SPARSH - Account Created</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .welcome-box { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
          .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Welcome to SPARSH!</h1>
            <p>Natural Hair Care Excellence</p>
          </div>
          <div class="content">
            <h2>Hello ${userDetails.fullName || "Valued Customer"}!</h2>
            
            <div class="welcome-box">
              <h3>🎉 Account Created Successfully!</h3>
              <p>Welcome to the SPARSH family! Your account has been created and you can now enjoy:</p>
              <ul>
                <li>✅ Exclusive access to premium natural hair care products</li>
                <li>✅ Order tracking and history</li>
                <li>✅ Personalized product recommendations</li>
                <li>✅ Special offers and early access to new products</li>
              </ul>
            </div>
            
            <h3>🛍️ Start Your Natural Hair Journey</h3>
            <p>Explore our range of handcrafted, natural hair care products designed to transform your hair naturally.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app"}" class="cta-button">
                Start Shopping Now
              </a>
            </div>
            
            <h3>📞 Need Help?</h3>
            <p>Our customer support team is here to help:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
            <p><small>This email was sent to ${userDetails.email}</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send customer welcome email
    const customerResult = await this.sendCustomerEmail({
      to: userDetails.email,
      subject: "Welcome to SPARSH Natural Hair Care - Account Created!",
      html,
      type: "signup_confirmation",
    })

    // Send admin notification via Formspree
    const adminResult = await FormspreeService.sendSignupNotification(userDetails)

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminNotification: adminResult,
    }
  }

  // Status update notification to customer (Nodemailer)
  static async sendStatusUpdateNotification(statusDetails: {
    orderId: string
    customerName: string
    customerEmail: string
    oldStatus: string
    newStatus: string
    orderItems?: Array<{
      product_name: string
      quantity: number
      product_price: number
    }>
    totalAmount: number
  }) {
    const statusMessages = {
      shipped: {
        title: "📦 Your Order Has Been Shipped!",
        message: "Great news! Your order is on its way to you.",
        color: "#8b5cf6",
        icon: "🚚",
      },
      delivered: {
        title: "✅ Your Order Has Been Delivered!",
        message: "Your order has been successfully delivered. We hope you love your SPARSH products!",
        color: "#10b981",
        icon: "📦",
      },
      cancelled: {
        title: "❌ Your Order Has Been Cancelled",
        message: "Your order has been cancelled. If you have any questions, please contact our support team.",
        color: "#ef4444",
        icon: "🚫",
      },
    }

    const statusInfo = statusMessages[statusDetails.newStatus as keyof typeof statusMessages] || {
      title: "📋 Order Status Updated",
      message: `Your order status has been updated to: ${statusDetails.newStatus}`,
      color: "#6b7280",
      icon: "📋",
    }

    const itemsSection =
      statusDetails.orderItems && statusDetails.orderItems.length > 0
        ? `
        <h3>📋 Order Items</h3>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          ${statusDetails.orderItems
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e5;">
              <span><strong>${item.product_name}</strong> × ${item.quantity}</span>
              <span style="color: #10b981; font-weight: bold;">₹${(item.product_price * item.quantity).toLocaleString()}</span>
            </div>
          `,
            )
            .join("")}
          <div style="border-top: 2px solid #10b981; padding-top: 10px; margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
              <span>Total Amount:</span>
              <span style="color: #10b981;">₹${statusDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `
        : ""

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: ${statusInfo.color}; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .status-box { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusInfo.color}; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.icon} ${statusInfo.title}</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>Hello ${statusDetails.customerName}!</h2>
            
            <div class="status-box">
              <h3 style="color: ${statusInfo.color}; margin: 0 0 10px 0;">${statusInfo.title}</h3>
              <p style="margin: 0; font-size: 16px;">${statusInfo.message}</p>
            </div>
            
            <h3>📦 Order Information</h3>
            <p><strong>Order ID:</strong> ${statusDetails.orderId}</p>
            <p><strong>Previous Status:</strong> ${statusDetails.oldStatus}</p>
            <p><strong>New Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${statusDetails.newStatus}</span></p>
            <p><strong>Update Time:</strong> ${new Date().toLocaleString()}</p>
            
            ${itemsSection}
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your order, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
            <p><small>This email was sent automatically. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send customer notification
    const customerResult = await this.sendCustomerEmail({
      to: statusDetails.customerEmail,
      subject: `${statusInfo.icon} Order Status Update - ${statusDetails.orderId.slice(0, 8)} - SPARSH`,
      html,
      type: "status_update",
    })

    // Send admin notification via Formspree
    const adminResult = await FormspreeService.sendAdminNotification({
      type: "status_update",
      subject: `📋 Order Status Updated: ${statusDetails.orderId.slice(0, 8)} → ${statusDetails.newStatus}`,
      content: `
📋 ORDER STATUS UPDATED

Order Details:
- Order ID: ${statusDetails.orderId}
- Customer: ${statusDetails.customerName}
- Email: ${statusDetails.customerEmail}
- Previous Status: ${statusDetails.oldStatus}
- New Status: ${statusDetails.newStatus}
- Total Amount: ₹${statusDetails.totalAmount.toLocaleString()}
- Update Time: ${new Date().toLocaleString()}

Status change processed successfully. Customer notification email sent.
    `,
      metadata: {
        order_id: statusDetails.orderId,
        customer_email: statusDetails.customerEmail,
        old_status: statusDetails.oldStatus,
        new_status: statusDetails.newStatus,
        total_amount: statusDetails.totalAmount,
      },
    })

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminNotification: adminResult,
    }
  }
}
