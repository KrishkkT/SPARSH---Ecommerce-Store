export class FormspreeService {
  private static readonly FORMSPREE_ENDPOINT = "https://formspree.io/f/xeogbjvv"

  // Send admin notification via Formspree
  static async sendAdminNotification(data: {
    type: string
    subject: string
    content: string
    metadata?: Record<string, any>
  }): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`FormspreeService: Sending admin notification (${data.type})`)

      const response = await fetch(this.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: data.subject,
          message: data.content,
          type: data.type,
          timestamp: new Date().toISOString(),
          ...data.metadata,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("FormspreeService: Error response:", errorText)
        throw new Error(`Formspree error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("FormspreeService: Admin notification sent successfully")
      return { success: true }
    } catch (error: any) {
      console.error("FormspreeService: Error sending admin notification:", error)
      return { success: false, error: error.message }
    }
  }

  // Send order notification to admin
  static async sendOrderNotification(orderDetails: any): Promise<{ success: boolean; error?: string }> {
    const content = `
🎉 NEW ORDER RECEIVED!

Order Details:
- Order ID: ${orderDetails.order_id}
- Customer: ${orderDetails.customer_name}
- Email: ${orderDetails.customer_email}
- Phone: ${orderDetails.customer_phone}
- Total Amount: ₹${orderDetails.total_amount?.toLocaleString()}
- Payment Method: ${orderDetails.payment_method}
- Payment ID: ${orderDetails.payment_id}

Items Ordered:
${orderDetails.order_items
  ?.map((item: any) => `- ${item.product_name} (Qty: ${item.quantity}) - ₹${item.subtotal?.toLocaleString()}`)
  .join("\n")}

Shipping Address:
${orderDetails.shipping_address}

Order Date: ${new Date(orderDetails.order_date).toLocaleString()}

⚠️ ACTION REQUIRED: Please process this order for shipment.
    `

    return this.sendAdminNotification({
      type: "new_order",
      subject: `🚨 New Order #${orderDetails.order_id?.slice(0, 8)} - ₹${orderDetails.total_amount?.toLocaleString()} - SPARSH`,
      content,
      metadata: {
        order_id: orderDetails.order_id,
        customer_email: orderDetails.customer_email,
        total_amount: orderDetails.total_amount,
        payment_id: orderDetails.payment_id,
      },
    })
  }

  // Send contact notification to admin
  static async sendContactNotification(contactDetails: {
    name: string
    email: string
    message: string
  }): Promise<{ success: boolean; error?: string }> {
    const content = `
📧 NEW CONTACT MESSAGE

Customer Details:
- Name: ${contactDetails.name}
- Email: ${contactDetails.email}
- Message Time: ${new Date().toLocaleString()}

Message:
${contactDetails.message}

⚠️ Please respond to this customer inquiry within 24 hours.
    `

    return this.sendAdminNotification({
      type: "contact_message",
      subject: `📧 New Contact Message from ${contactDetails.name} - SPARSH`,
      content,
      metadata: {
        customer_name: contactDetails.name,
        customer_email: contactDetails.email,
      },
    })
  }

  // Send signup notification to admin
  static async sendSignupNotification(userDetails: {
    email: string
    fullName?: string
  }): Promise<{ success: boolean; error?: string }> {
    const content = `
👤 NEW USER SIGNUP

User Details:
- Name: ${userDetails.fullName || "Not provided"}
- Email: ${userDetails.email}
- Signup Time: ${new Date().toLocaleString()}

A new customer has joined SPARSH Natural Hair Care!
    `

    return this.sendAdminNotification({
      type: "user_signup",
      subject: `👤 New User Signup: ${userDetails.fullName || userDetails.email} - SPARSH`,
      content,
      metadata: {
        user_email: userDetails.email,
        user_name: userDetails.fullName,
      },
    })
  }
}
