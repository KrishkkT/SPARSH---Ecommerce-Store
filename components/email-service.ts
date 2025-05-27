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
      console.log(`EmailService: Sending customer email (${emailData.type}):`, {
        to: emailData.to ? `${emailData.to.substring(0, 5)}...` : "missing",
        subject: emailData.subject,
        type: emailData.type,
      })

      const result = await sendEmailSafe({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      })

      if (result.success) {
        console.log(`EmailService: Customer email sent successfully via ${result.method}`)
        return { success: true, method: result.method }
      } else {
        console.error(`EmailService: Customer email failed:`, result.error)
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      console.error(`EmailService: Customer email error:`, error)
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
      console.log(`EmailService: Sending admin notification (${data.type}):`, {
        subject: data.subject,
        type: data.type,
      })

      const result = await FormspreeService.sendAdminNotification(data)

      if (result.success) {
        console.log(`EmailService: Admin notification sent successfully via Formspree`)
        return { success: true }
      } else {
        console.error(`EmailService: Admin notification failed:`, result.error)
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      console.error(`EmailService: Admin notification error:`, error)
      return { success: false, error: error.message }
    }
  }

  // Order confirmation to customer (Nodemailer)
  static async sendOrderConfirmation(orderDetails: any) {
    console.log("EmailService: Sending order confirmation to customer...")

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
    console.log("EmailService: Sending admin order notification via Formspree...")

    return FormspreeService.sendOrderNotification(orderDetails)
  }

  // Contact message handling
  static async sendContactMessage(contactDetails: {
    name: string
    email: string
    message: string
  }) {
    console.log("EmailService: Processing contact message...")

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

    console.log("EmailService: Contact message results:", {
      customer: customerResult.success,
      admin: adminResult.success,
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
    console.log("EmailService: Sending signup confirmation to customer...")

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
}
