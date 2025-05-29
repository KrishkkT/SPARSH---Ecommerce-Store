const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdkogqko"

export class FormspreeService {
  static async sendAdminNotification(data: {
    type: string
    subject: string
    content: string
    metadata?: Record<string, any>
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: data.subject,
          message: data.content,
          type: data.type,
          metadata: JSON.stringify(data.metadata || {}),
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || "Failed to send notification" }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  static async sendOrderNotification(orderDetails: any): Promise<{ success: boolean; error?: string }> {
    return this.sendAdminNotification({
      type: "new_order",
      subject: `🛒 New Order from ${orderDetails.customer_name} - Order #${orderDetails.order_id}`,
      content: `
🛒 NEW ORDER RECEIVED

Customer Details:
- Name: ${orderDetails.customer_name}
- Email: ${orderDetails.customer_email}
- Phone: ${orderDetails.customer_phone}
- Address: ${orderDetails.shipping_address}

Order Details:
- Order ID: ${orderDetails.order_id}
- Total Amount: ₹${orderDetails.total_amount.toLocaleString()}
- Payment Method: ${orderDetails.payment_method}
- Payment ID: ${orderDetails.payment_id}
- Order Date: ${new Date(orderDetails.order_date).toLocaleString()}

Items:
${orderDetails.order_items?.map((item: any) => `- ${item.product_name} × ${item.quantity} = ₹${(item.product_price * item.quantity).toLocaleString()}`).join("\n")}

⚠️ ACTION REQUIRED: Please process this order for shipment.
      `,
      metadata: {
        order_id: orderDetails.order_id,
        customer_email: orderDetails.customer_email,
        total_amount: orderDetails.total_amount,
      },
    })
  }

  static async sendContactNotification(contactDetails: {
    name: string
    email: string
    message: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendAdminNotification({
      type: "contact_message",
      subject: `💬 New Contact Message from ${contactDetails.name}`,
      content: `
💬 NEW CONTACT MESSAGE

Customer Details:
- Name: ${contactDetails.name}
- Email: ${contactDetails.email}

Message:
${contactDetails.message}

⚠️ ACTION REQUIRED: Please respond to this customer inquiry.
      `,
      metadata: {
        customer_name: contactDetails.name,
        customer_email: contactDetails.email,
      },
    })
  }

  static async sendSignupNotification(userDetails: {
    email: string
    fullName?: string
  }): Promise<{ success: boolean; error?: string }> {
    return this.sendAdminNotification({
      type: "new_signup",
      subject: `👤 New User Signup - ${userDetails.fullName || userDetails.email}`,
      content: `
👤 NEW USER SIGNUP

User Details:
- Name: ${userDetails.fullName || "Not provided"}
- Email: ${userDetails.email}
- Signup Date: ${new Date().toLocaleString()}

A new user has joined SPARSH Natural Hair Care!
      `,
      metadata: {
        user_email: userDetails.email,
        user_name: userDetails.fullName,
      },
    })
  }
}
