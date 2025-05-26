export class EmailService {
  private static async sendEmailRequest(emailData: any, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`EmailService: Attempt ${attempt} for ${emailData.type}:`, {
          to: emailData.to ? `${emailData.to.substring(0, 5)}...` : "missing",
          subject: emailData.subject,
          type: emailData.type,
        })

        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        })

        console.log(`EmailService: API response status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`EmailService: API error response:`, errorText)

          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { error: errorText }
          }

          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log(`EmailService: Success for ${emailData.type}:`, result)
        return { success: true, result }
      } catch (error: any) {
        console.error(`EmailService: Attempt ${attempt} failed for ${emailData.type}:`, error.message)

        if (attempt === retries) {
          console.error(`EmailService: All attempts failed for ${emailData.type}`)
          return { success: false, error: error.message }
        }

        // Wait before retry with exponential backoff
        const delay = 1000 * Math.pow(2, attempt - 1)
        console.log(`EmailService: Waiting ${delay}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return { success: false, error: "Failed after all retries" }
  }

  static async sendOrderConfirmation(orderDetails: any) {
    console.log("EmailService: Sending order confirmation...")

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
            
            <h3>📋 Items Ordered</h3>
            ${orderDetails.order_items
              .map(
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

    return this.sendEmailRequest({
      to: orderDetails.customer_email,
      subject: `Order Confirmation #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "order_confirmation",
    })
  }

  static async sendContactMessage(contactDetails: any) {
    console.log("EmailService: Sending contact message...")

    // Send to business email
    const businessEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .message-box { background: #f9f9f9; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #8b5cf6; }
          .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
          .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚠️ New Customer Inquiry - Please Respond Within 24 Hours</strong>
            </div>
            
            <h2>Customer Contact Details</h2>
            <div class="message-box">
              <p><strong>Name:</strong> ${contactDetails.name}</p>
              <p><strong>Email:</strong> ${contactDetails.email}</p>
              <p><strong>Message Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3>💬 Customer Message</h3>
            <div class="message-box">
              <p>${contactDetails.message}</p>
            </div>
            
            <p><strong>Action Required:</strong> Please respond to this inquiry promptly to maintain excellent customer service.</p>
          </div>
          <div class="footer">
            <p>SPARSH Natural Hair Care - Customer Service Team</p>
            <p><small>This is an automated notification from your website contact form.</small></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send confirmation to customer
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

    // Send both emails
    const businessResult = await this.sendEmailRequest({
      to: "rs.sparshnaturals@gmail.com",
      subject: `🚨 New Contact Message from ${contactDetails.name} - SPARSH`,
      html: businessEmailHtml,
      type: "contact_message_business",
    })

    const customerResult = await this.sendEmailRequest({
      to: contactDetails.email,
      subject: "Message Received - SPARSH Natural Hair Care",
      html: customerEmailHtml,
      type: "contact_message_customer",
    })

    console.log("EmailService: Contact message results:", {
      business: businessResult.success,
      customer: customerResult.success,
    })

    return {
      success: businessResult.success && customerResult.success,
      businessEmail: businessResult,
      customerEmail: customerResult,
    }
  }

  static async sendAdminOrderNotification(orderDetails: any) {
    console.log("EmailService: Sending admin order notification...")

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received - SPARSH</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .order-item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .total { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .payment-info { background: #10b981; color: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
        .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f9f9f9; }
        .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Order Received!</h1>
          <p>SPARSH Natural Hair Care - Admin Notification</p>
        </div>
        <div class="content">
          <div class="urgent">
            <strong>🚨 Action Required: New order needs processing</strong>
          </div>
          
          <h2>Order Details</h2>
          
          <h3>📦 Order Information</h3>
          <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
          <p><strong>Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.payment_method}</p>
          <p><strong>Payment ID:</strong> ${orderDetails.payment_id}</p>
          
          <div class="payment-info">
            <h3>💳 Payment Status: COMPLETED ✅</h3>
            <p>Payment has been verified and processed successfully</p>
          </div>
          
          <h3>👤 Customer Information</h3>
          <p><strong>Name:</strong> ${orderDetails.customer_name}</p>
          <p><strong>Email:</strong> ${orderDetails.customer_email}</p>
          <p><strong>Phone:</strong> ${orderDetails.customer_phone}</p>
          <p><strong>Address:</strong><br>${orderDetails.shipping_address}</p>
          
          <h3>📋 Items Ordered</h3>
          ${orderDetails.order_items
            .map(
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
          
          <h3>📋 Next Steps</h3>
          <ol>
            <li><strong>Process the order for shipment</strong></li>
            <li>Update inventory if needed</li>
            <li>Prepare shipping labels</li>
            <li>Send shipment notification to customer</li>
            <li>Update order status in admin panel</li>
          </ol>
        </div>
        <div class="footer">
          <p>SPARSH Natural Hair Care - Admin Panel</p>
          <p>Transform your hair naturally 🌿</p>
          <p><small>This is an automated notification from your e-commerce system.</small></p>
        </div>
      </div>
    </body>
    </html>
  `

    return this.sendEmailRequest({
      to: "rs.sparshnaturals@gmail.com",
      subject: `🚨 New Order #${orderDetails.order_id.slice(0, 8)} - ₹${orderDetails.total_amount.toLocaleString()} - SPARSH`,
      html,
      type: "admin_order_notification",
    })
  }
}
