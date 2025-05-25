export class EmailService {
  static async sendOrderConfirmation(orderDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `New Hair Care Order from ${orderDetails.customer_name}`,
          message: `
🌿 NEW HAIR CARE ORDER RECEIVED! 🌿

Customer Details:
👤 Name: ${orderDetails.customer_name}
📧 Email: ${orderDetails.customer_email}
📞 Phone: ${orderDetails.customer_phone}
🏠 Address: ${orderDetails.shipping_address}

Order Details:
${orderDetails.order_items.map((item: any) => `• ${item.product_name} x ${item.quantity} = ₹${item.subtotal.toLocaleString()}`).join("\n")}

💰 Total Amount: ₹${orderDetails.total_amount.toLocaleString()}
📅 Order Date: ${new Date(orderDetails.order_date).toLocaleString()}
🆔 Order ID: ${orderDetails.order_id}
          `,
          order_details: JSON.stringify(orderDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send order confirmation email")
      }

      return { success: true }
    } catch (error) {
      console.error("Email service error:", error)
      return { success: false, error }
    }
  }

  static async sendOrderCancellation(orderDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Order Cancelled - ${orderDetails.customer_name}`,
          message: `
❌ ORDER CANCELLED ❌

Customer Details:
👤 Name: ${orderDetails.customer_name}
📧 Email: ${orderDetails.customer_email}
📞 Phone: ${orderDetails.customer_phone}

Cancelled Order Details:
${orderDetails.order_items.map((item: any) => `• ${item.product_name} x ${item.quantity} = ₹${item.subtotal.toLocaleString()}`).join("\n")}

💰 Cancelled Amount: ₹${orderDetails.total_amount.toLocaleString()}
📅 Original Order Date: ${new Date(orderDetails.order_date).toLocaleString()}
🆔 Order ID: ${orderDetails.order_id}
          `,
          order_details: JSON.stringify(orderDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send order cancellation email")
      }

      return { success: true }
    } catch (error) {
      console.error("Email service error:", error)
      return { success: false, error }
    }
  }

  static async sendOrderModification(orderDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Order Modified - ${orderDetails.customer_name}`,
          message: `
🔄 ORDER MODIFIED 🔄

Customer Details:
👤 Name: ${orderDetails.customer_name}
📧 Email: ${orderDetails.customer_email}
📞 Phone: ${orderDetails.customer_phone}

Updated Order Details:
${orderDetails.order_items.map((item: any) => `• ${item.product_name} x ${item.quantity} = ₹${item.subtotal.toLocaleString()}`).join("\n")}

💰 New Total Amount: ₹${orderDetails.total_amount.toLocaleString()}
📅 Original Order Date: ${new Date(orderDetails.order_date).toLocaleString()}
🆔 Order ID: ${orderDetails.order_id}
          `,
          order_details: JSON.stringify(orderDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send order modification email")
      }

      return { success: true }
    } catch (error) {
      console.error("Email service error:", error)
      return { success: false, error }
    }
  }

  static async sendLoginNotification(userDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Successful Login - ${userDetails.email}`,
          message: `
🔐 SUCCESSFUL LOGIN NOTIFICATION 🔐

User Details:
👤 Name: ${userDetails.full_name || "Not provided"}
📧 Email: ${userDetails.email}
🕐 Login Time: ${new Date().toLocaleString()}
🌐 IP Address: ${userDetails.ip_address || "Not available"}
📱 Device: ${userDetails.user_agent || "Not available"}

This is an automated notification confirming a successful login to your SPARSH account.

If this wasn't you, please contact us immediately at rs.sparshnaturals@gmail.com
          `,
          user_details: JSON.stringify(userDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send login notification")
      }

      return { success: true }
    } catch (error) {
      console.error("Login notification error:", error)
      return { success: false, error }
    }
  }

  static async sendPasswordResetNotification(userDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Password Reset Request - ${userDetails.email}`,
          message: `
🔑 PASSWORD RESET REQUEST 🔑

User Details:
📧 Email: ${userDetails.email}
🕐 Request Time: ${new Date().toLocaleString()}
🌐 IP Address: ${userDetails.ip_address || "Not available"}

A password reset has been requested for this email address.

If you didn't request this reset, please ignore this email or contact us at rs.sparshnaturals@gmail.com

The reset link has been sent to the user's email address.
          `,
          user_details: JSON.stringify(userDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send password reset notification")
      }

      return { success: true }
    } catch (error) {
      console.error("Password reset notification error:", error)
      return { success: false, error }
    }
  }

  static async sendAccountUpdateNotification(userDetails: any, updateType: string) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Account Updated - ${userDetails.email}`,
          message: `
✏️ ACCOUNT UPDATE NOTIFICATION ✏️

User Details:
👤 Name: ${userDetails.full_name || "Not provided"}
📧 Email: ${userDetails.email}
📞 Phone: ${userDetails.phone || "Not provided"}
🏠 Address: ${userDetails.address || "Not provided"}
🕐 Update Time: ${new Date().toLocaleString()}
📝 Update Type: ${updateType}

Your SPARSH account information has been successfully updated.

If you didn't make these changes, please contact us immediately at rs.sparshnaturals@gmail.com
          `,
          user_details: JSON.stringify(userDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send account update notification")
      }

      return { success: true }
    } catch (error) {
      console.error("Account update notification error:", error)
      return { success: false, error }
    }
  }

  static async sendContactMessage(contactDetails: any) {
    try {
      const response = await fetch("https://formspree.io/f/xeogbjvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `New Contact Message from ${contactDetails.name}`,
          message: `
📧 NEW CONTACT MESSAGE 📧

Contact Details:
👤 Name: ${contactDetails.name}
📧 Email: ${contactDetails.email}
🕐 Message Time: ${new Date().toLocaleString()}

Message:
${contactDetails.message}

Please respond to this inquiry promptly.
          `,
          contact_details: JSON.stringify(contactDetails, null, 2),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send contact message")
      }

      return { success: true }
    } catch (error) {
      console.error("Contact message error:", error)
      return { success: false, error }
    }
  }
}
