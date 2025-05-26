export class EmailService {
  private static async sendEmailRequest(emailData: any) {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send email")
      }

      return { success: true }
    } catch (error: any) {
      console.error("Email service error:", error)
      return { success: false, error: error.message }
    }
  }

  static async sendOrderConfirmation(orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          .total { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Order Confirmation</h1>
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name}!</h2>
            <p>We're excited to confirm that we've received your order. Here are the details:</p>
            
            <h3>📦 Order Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
            
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

  static async sendOrderCancellation(orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Cancelled - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
          .total { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Order Cancelled</h1>
            <p>Your order has been successfully cancelled</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name},</h2>
            <p>We've successfully cancelled your order as requested. Here are the details:</p>
            
            <h3>📦 Cancelled Order Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Original Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
            <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>📋 Cancelled Items</h3>
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
              <h3>💰 Cancelled Amount: ₹${orderDetails.total_amount.toLocaleString()}</h3>
            </div>
            
            <h3>💳 Refund Information</h3>
            <p>If you made a payment, your refund will be processed within 5-7 business days to your original payment method.</p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>We hope to serve you again soon!</p>
            <p>SPARSH Natural Hair Care 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: orderDetails.customer_email,
      subject: `Order Cancelled #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "order_cancellation",
    })
  }

  static async sendOrderModification(orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Modified - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
          .total { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Order Modified</h1>
            <p>Your order has been successfully updated</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name}!</h2>
            <p>We've successfully updated your order as requested. Here are the new details:</p>
            
            <h3>📦 Updated Order Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Original Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
            <p><strong>Modification Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>📋 Updated Items</h3>
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
              <h3>💰 New Total Amount: ₹${orderDetails.total_amount.toLocaleString()}</h3>
            </div>
            
            <h3>🚚 Shipping Information</h3>
            <p><strong>Delivery Address:</strong><br>${orderDetails.shipping_address}</p>
            <p><strong>Phone:</strong> ${orderDetails.customer_phone}</p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your updated order, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: orderDetails.customer_email,
      subject: `Order Modified #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "order_modification",
    })
  }

  static async sendPasswordResetNotification(userDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset Request</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>Password Reset Requested</h2>
            <p>We received a request to reset the password for your SPARSH account:</p>
            
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="warning">
              <h3>⚠️ Security Notice</h3>
              <p>If you didn't request this password reset, please ignore this email or contact us immediately.</p>
            </div>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or concerns, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>SPARSH Natural Hair Care - Transform your hair naturally 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: userDetails.email,
      subject: "Password Reset Request - SPARSH Natural Hair Care",
      html,
      type: "password_reset",
    })
  }

  static async sendAccountUpdateNotification(userDetails: any, updateType: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Updated - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✏️ Account Updated</h1>
            <p>Your account information has been updated</p>
          </div>
          <div class="content">
            <h2>Hello ${userDetails.full_name || "Valued Customer"}!</h2>
            <p>Your SPARSH account information has been successfully updated.</p>
            
            <h3>📋 Update Details</h3>
            <div class="info-box">
              <p><strong>Update Type:</strong> ${updateType}</p>
              <p><strong>Update Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3>👤 Current Account Information</h3>
            <div class="info-box">
              <p><strong>Name:</strong> ${userDetails.full_name || "Not provided"}</p>
              <p><strong>Email:</strong> ${userDetails.email}</p>
              <p><strong>Phone:</strong> ${userDetails.phone || "Not provided"}</p>
              <p><strong>Address:</strong> ${userDetails.address || "Not provided"}</p>
            </div>
            
            <div class="warning">
              <h3>⚠️ Security Notice</h3>
              <p>If you didn't make these changes, please contact us immediately at rs.sparshnaturals@gmail.com</p>
            </div>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: userDetails.email,
      subject: "Account Updated - SPARSH Natural Hair Care",
      html,
      type: "account_update",
    })
  }

  static async sendContactMessage(contactDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #8b5cf6; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>New Customer Inquiry</h2>
            <p>You have received a new message from a customer:</p>
            
            <h3>👤 Contact Details</h3>
            <div class="message-box">
              <p><strong>Name:</strong> ${contactDetails.name}</p>
              <p><strong>Email:</strong> ${contactDetails.email}</p>
              <p><strong>Message Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3>💬 Message</h3>
            <div class="message-box">
              <p>${contactDetails.message}</p>
            </div>
            
            <p><strong>Please respond to this inquiry promptly to maintain excellent customer service.</strong></p>
          </div>
          <div class="footer">
            <p>SPARSH Natural Hair Care - Customer Service Team</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send to business email
    return this.sendEmailRequest({
      to: "rs.sparshnaturals@gmail.com",
      subject: `New Contact Message from ${contactDetails.name} - SPARSH`,
      html,
      type: "contact_message",
    })
  }

  static async sendShipmentUpdate(orderDetails: any, trackingInfo: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking-box { background: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #8b5cf6; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Your Order is on the Way!</h1>
            <p>SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name}!</h2>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="tracking-box">
              <h3>📦 Tracking Information</h3>
              <p><strong>Tracking Number:</strong> ${trackingInfo.tracking_number}</p>
              <p><strong>Carrier:</strong> ${trackingInfo.carrier}</p>
              <p><strong>Estimated Delivery:</strong> ${trackingInfo.estimated_delivery}</p>
            </div>
            
            <h3>📦 Order Details</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Ship Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>📋 Shipped Items</h3>
            ${orderDetails.order_items
              .map(
                (item: any) => `
              <div class="order-item">
                <strong>${item.product_name}</strong><br>
                Quantity: ${item.quantity}
              </div>
            `,
              )
              .join("")}
            
            <h3>🏠 Shipping Address</h3>
            <p>${orderDetails.shipping_address}</p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your shipment, please contact us:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: orderDetails.customer_email,
      subject: `Order Shipped #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "shipment_update",
    })
  }

  static async sendDeliveryConfirmation(orderDetails: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered - SPARSH</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-box { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
          .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #059669; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Delivered!</h1>
            <p>Your SPARSH products have arrived</p>
          </div>
          <div class="content">
            <h2>Hello ${orderDetails.customer_name}!</h2>
            <p>Wonderful! Your order has been successfully delivered. We hope you love your new hair care products!</p>
            
            <div class="success-box">
              <h3>🎉 Delivery Confirmed</h3>
              <p><strong>Delivered on:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            </div>
            
            <h3>📋 Delivered Items</h3>
            ${orderDetails.order_items
              .map(
                (item: any) => `
              <div class="order-item">
                <strong>${item.product_name}</strong><br>
                Quantity: ${item.quantity}
              </div>
            `,
              )
              .join("")}
            
            <h3>💡 Hair Care Tips</h3>
            <p>To get the best results from your SPARSH products:</p>
            <ul>
              <li>Follow the usage instructions on each product</li>
              <li>Be consistent with your hair care routine</li>
              <li>Give products 2-4 weeks to show visible results</li>
              <li>Store products in a cool, dry place</li>
            </ul>
            
            <h3>⭐ Share Your Experience</h3>
            <p>We'd love to hear about your experience! Please consider leaving a review or sharing your hair transformation journey with us.</p>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your products or need hair care advice:</p>
            <p>📧 Email: rs.sparshnaturals@gmail.com</p>
            <p>📞 Phone: +91 9409073136</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing SPARSH Natural Hair Care!</p>
            <p>Transform your hair naturally 🌿</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmailRequest({
      to: orderDetails.customer_email,
      subject: `Order Delivered #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
      html,
      type: "delivery_confirmation",
    })
  }

  static async sendAdminOrderNotification(orderDetails: any) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received - SPARSH</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
        .total { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .payment-info { background: #10b981; color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Order Received!</h1>
          <p>SPARSH Natural Hair Care - Admin Notification</p>
        </div>
        <div class="content">
          <h2>Order Details</h2>
          
          <h3>📦 Order Information</h3>
          <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
          <p><strong>Order Date:</strong> ${new Date(orderDetails.order_date).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${orderDetails.payment_method}</p>
          <p><strong>Payment ID:</strong> ${orderDetails.payment_id}</p>
          
          <div class="payment-info">
            <h3>💳 Payment Status: COMPLETED ✅</h3>
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
          <ul>
            <li>Process the order for shipment</li>
            <li>Update inventory if needed</li>
            <li>Prepare shipping labels</li>
            <li>Send shipment notification to customer</li>
          </ul>
        </div>
        <div class="footer">
          <p>SPARSH Natural Hair Care - Admin Panel</p>
          <p>Transform your hair naturally 🌿</p>
        </div>
      </div>
    </body>
    </html>
  `

    return this.sendEmailRequest({
      to: "rs.sparshnaturals@gmail.com",
      subject: `New Order #${orderDetails.order_id.slice(0, 8)} - ₹${orderDetails.total_amount.toLocaleString()} - SPARSH`,
      html,
      type: "admin_order_notification",
    })
  }
}
