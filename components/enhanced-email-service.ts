import { sendEmailSafe } from "@/lib/nodemailer"
import { FormspreeService } from "@/lib/formspree"

interface EmailTestResult {
  success: boolean
  method?: string
  error?: string
  timestamp: string
  recipient: string
  subject: string
}

interface EmailValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class EnhancedEmailService {
  private static testResults: EmailTestResult[] = []

  // Validate email data before sending
  static validateEmailData(emailData: {
    to: string
    subject: string
    html: string
    type: string
  }): EmailValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailData.to)) {
      errors.push("Invalid email address format")
    }

    // Validate subject
    if (!emailData.subject || emailData.subject.trim().length === 0) {
      errors.push("Email subject is required")
    } else if (emailData.subject.length > 200) {
      warnings.push("Email subject is very long (>200 characters)")
    }

    // Validate HTML content
    if (!emailData.html || emailData.html.trim().length === 0) {
      errors.push("Email content is required")
    } else if (emailData.html.length > 100000) {
      warnings.push("Email content is very large (>100KB)")
    }

    // Check for required elements in HTML
    if (!emailData.html.includes("SPARSH")) {
      warnings.push("Email content doesn't include brand name")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Enhanced email sending with validation and logging
  static async sendCustomerEmail(emailData: {
    to: string
    subject: string
    html: string
    type: string
  }): Promise<{ success: boolean; error?: string; method?: string; validationResult?: EmailValidationResult }> {
    const timestamp = new Date().toISOString()

    try {
      // Validate email data
      const validationResult = this.validateEmailData(emailData)

      if (!validationResult.isValid) {
        const error = `Email validation failed: ${validationResult.errors.join(", ")}`
        this.logTestResult({
          success: false,
          error,
          timestamp,
          recipient: emailData.to,
          subject: emailData.subject,
        })
        return { success: false, error, validationResult }
      }

      // Log warnings if any
      if (validationResult.warnings.length > 0) {
        console.warn("Email warnings:", validationResult.warnings)
      }

      // Send email
      const result = await sendEmailSafe({
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      })

      // Log result
      this.logTestResult({
        success: result.success,
        method: result.method,
        error: result.error,
        timestamp,
        recipient: emailData.to,
        subject: emailData.subject,
      })

      return {
        success: result.success,
        method: result.method,
        error: result.error,
        validationResult,
      }
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error occurred"
      this.logTestResult({
        success: false,
        error: errorMessage,
        timestamp,
        recipient: emailData.to,
        subject: emailData.subject,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Enhanced order confirmation with invoice attachment
  static async sendOrderConfirmation(orderDetails: any) {
    const invoiceSection = orderDetails.invoice_url
      ? `
        <div style="margin: 30px 0; text-align: center; background: linear-gradient(135deg, #10b981, #059669); border-radius: 15px; padding: 20px;">
          <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">📄 Your Invoice is Ready!</h3>
          <a href="${orderDetails.invoice_url}" 
             style="background-color: white; color: #10b981; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Download Invoice PDF
          </a>
          <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 10px 0 0 0;">
            You can also access your invoice anytime from your order history.
          </p>
        </div>
      `
      : `
        <div style="margin: 20px 0; text-align: center; background: #f3f4f6; border-radius: 10px; padding: 15px;">
          <p style="color: #6b7280; margin: 0;">📄 Your invoice will be available in your order history once processed.</p>
        </div>
      `

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SPARSH Natural Hair Care</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #fff; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          .content { padding: 40px 30px; }
          .order-item { 
            background: linear-gradient(135deg, #f9fafb, #f3f4f6); 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 12px; 
            border-left: 4px solid #10b981;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .total { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: white; 
            padding: 25px; 
            text-align: center; 
            border-radius: 15px; 
            margin: 25px 0;
            box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #6b7280; 
            padding: 30px; 
            background: linear-gradient(135deg, #f9fafb, #f3f4f6);
            border-radius: 15px;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }
          .highlight {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌿 SPARSH</div>
            <h1 style="margin: 0; font-size: 24px;">Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing SPARSH Natural Hair Care!</p>
          </div>
          <div class="content">
            <h2 style="color: #10b981;">Hello ${orderDetails.customer_name}! 👋</h2>
            <p style="font-size: 16px; color: #4b5563;">
              We're excited to confirm that we've received your order. Your natural hair transformation journey begins now!
            </p>
            
            <div class="highlight">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">📦 Order Information</h3>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.order_id}</p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(
                orderDetails.order_date,
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderDetails.payment_method}</p>
              <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${orderDetails.payment_id}</p>
            </div>
            
            <h3 style="color: #10b981;">📋 Items Ordered</h3>
            ${orderDetails.order_items
              ?.map(
                (item: any) => `
              <div class="order-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <strong style="color: #1f2937; font-size: 16px;">${item.product_name}</strong><br>
                    <span style="color: #6b7280;">Quantity: ${item.quantity} × ₹${item.product_price.toLocaleString()}</span>
                  </div>
                  <div style="text-align: right;">
                    <strong style="color: #10b981; font-size: 18px;">₹${item.subtotal.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
            
            <div class="total">
              <h3 style="margin: 0 0 10px 0; font-size: 20px;">💰 Total Amount</h3>
              <div style="font-size: 32px; font-weight: bold;">₹${orderDetails.total_amount.toLocaleString()}</div>
            </div>
            
            ${invoiceSection}
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0;">🚚 Shipping Information</h3>
              <p style="margin: 5px 0;"><strong>Delivery Address:</strong></p>
              <p style="margin: 5px 0; color: #4b5563;">${orderDetails.shipping_address}</p>
              <p style="margin: 10px 0 5px 0;"><strong>Phone:</strong> ${orderDetails.customer_phone}</p>
              <p style="margin: 5px 0; color: #059669; font-weight: bold;">📦 Expected delivery: 3-5 business days</p>
            </div>
            
            <div style="background: #fef7ff; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #a855f7;">
              <h3 style="color: #7c3aed; margin: 0 0 15px 0;">📞 Need Help?</h3>
              <p style="margin: 5px 0;">Our customer support team is here to help you:</p>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> rs.sparshnaturals@gmail.com</p>
              <p style="margin: 5px 0;"><strong>📞 Phone:</strong> +91 9409073136</p>
              <p style="margin: 5px 0;"><strong>⏰ Hours:</strong> Monday - Saturday, 9 AM - 6 PM</p>
            </div>
          </div>
          <div class="footer">
            <h3 style="color: #10b981; margin: 0 0 15px 0;">Thank you for choosing SPARSH Natural Hair Care! 🌿</h3>
            <p style="margin: 5px 0; font-size: 16px; color: #059669; font-weight: bold;">Transform your hair naturally</p>
            <p style="margin: 15px 0 5px 0; font-size: 12px;">This email was sent automatically. Please do not reply to this email.</p>
            <p style="margin: 5px 0; font-size: 12px;">© 2025 SPARSH Natural Hair Care. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    let result
    try {
      result = await this.sendCustomerEmail({
        to: orderDetails.customer_email,
        subject: `🎉 Order Confirmation #${orderDetails.order_id.slice(0, 8)} - SPARSH Natural Hair Care`,
        html,
        type: "order_confirmation",
      })
    } catch (error: any) {
      console.error("Error sending customer email:", error)
      return {
        success: false,
        customerEmail: { success: false, error: error.message },
        adminNotification: { success: false },
      }
    }

    // Also send admin notification
    let adminResult
    try {
      adminResult = await FormspreeService.sendOrderNotification(orderDetails)
    } catch (error: any) {
      console.error("Error sending admin notification:", error)
      return {
        success: false,
        customerEmail: result,
        adminNotification: { success: false, error: error.message },
      }
    }

    return {
      success: result.success && adminResult.success,
      customerEmail: result,
      adminNotification: adminResult,
    }
  }

  // Test email functionality
  static async testEmailSystem(): Promise<{
    success: boolean
    results: EmailTestResult[]
    summary: {
      total: number
      successful: number
      failed: number
      successRate: number
    }
  }> {
    console.log("🧪 Starting comprehensive email system test...")

    const testEmails = [
      {
        to: "test@example.com",
        subject: "Test Email - Order Confirmation",
        html: "<h1>Test Order Confirmation</h1><p>This is a test email.</p>",
        type: "test_order_confirmation",
      },
      {
        to: "admin@example.com",
        subject: "Test Email - Contact Form",
        html: "<h1>Test Contact Form</h1><p>This is a test contact form submission.</p>",
        type: "test_contact",
      },
    ]

    const results: EmailTestResult[] = []

    for (const emailData of testEmails) {
      const result = await this.sendCustomerEmail(emailData)
      results.push({
        success: result.success,
        method: result.method,
        error: result.error,
        timestamp: new Date().toISOString(),
        recipient: emailData.to,
        subject: emailData.subject,
      })
    }

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length
    const successRate = (successful / results.length) * 100

    console.log(`✅ Email test completed: ${successful}/${results.length} successful (${successRate.toFixed(1)}%)`)

    return {
      success: successRate > 50, // Consider successful if more than 50% pass
      results,
      summary: {
        total: results.length,
        successful,
        failed,
        successRate,
      },
    }
  }

  // Get test results
  static getTestResults(): EmailTestResult[] {
    return this.testResults
  }

  // Clear test results
  static clearTestResults(): void {
    this.testResults = []
  }

  // Log test result
  private static logTestResult(result: EmailTestResult): void {
    this.testResults.push(result)
    console.log(`📧 Email ${result.success ? "✅ sent" : "❌ failed"}: ${result.subject} to ${result.recipient}`)
    if (result.error) {
      console.error(`   Error: ${result.error}`)
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
      // Check if FormspreeService is available
      if (typeof FormspreeService !== "undefined") {
        const result = await FormspreeService.sendAdminNotification(data)
        return result
      } else {
        console.warn("FormspreeService not available, skipping admin notification")
        return { success: true } // Don't fail the whole process
      }
    } catch (error: any) {
      console.warn("Admin notification failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Contact message handling with enhanced validation
  static async sendContactMessage(contactDetails: { name: string; email: string; message: string }) {
    // Validate contact details
    const validation = this.validateEmailData({
      to: contactDetails.email,
      subject: "Contact Form Confirmation",
      html: contactDetails.message,
      type: "contact_confirmation",
    })

    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(", ")}`,
        customerEmail: { success: false },
        adminNotification: { success: false },
      }
    }

    // Enhanced customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received - SPARSH Natural Hair Care</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #fff; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #10b981, #059669); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .content { padding: 40px 30px; }
          .message-box { 
            background: linear-gradient(135deg, #f9fafb, #f3f4f6); 
            padding: 20px; 
            border-radius: 12px; 
            border-left: 4px solid #10b981; 
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #6b7280; 
            padding: 30px; 
            background: linear-gradient(135deg, #f9fafb, #f3f4f6);
            border-radius: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">✅ Message Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">SPARSH Natural Hair Care</p>
          </div>
          <div class="content">
            <h2 style="color: #10b981;">Hello ${contactDetails.name}! 👋</h2>
            <p style="font-size: 16px; color: #4b5563;">
              Thank you for contacting SPARSH Natural Hair Care. We have received your message and will respond within 24 hours.
            </p>
            
            <h3 style="color: #10b981;">Your Message:</h3>
            <div class="message-box">
              <p style="margin: 0; font-style: italic; color: #4b5563;">"${contactDetails.message}"</p>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">What happens next?</p>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li>Our team will review your message carefully</li>
                <li>We'll respond within 24 hours during business days</li>
                <li>For urgent matters, call us at +91 9409073136</li>
                <li>You can also check our FAQ section on our website</li>
              </ul>
            </div>
            
            <p style="color: #059669; font-weight: bold;">Thank you for your interest in our natural hair care products! 🌿</p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #10b981;">SPARSH Natural Hair Care</p>
            <p style="margin: 5px 0;">Transform your hair naturally 🌿</p>
            <p style="margin: 15px 0 5px 0; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    let customerResult
    try {
      // Send customer confirmation
      customerResult = await this.sendCustomerEmail({
        to: contactDetails.email,
        subject: "✅ Message Received - SPARSH Natural Hair Care",
        html: customerEmailHtml,
        type: "contact_confirmation",
      })
    } catch (error: any) {
      console.error("Error sending customer email:", error)
      return {
        success: false,
        error: error.message,
        customerEmail: { success: false },
        adminNotification: { success: false },
      }
    }

    let adminResult
    try {
      // Send admin notification via Formspree
      adminResult = await FormspreeService.sendContactNotification(contactDetails)
    } catch (error: any) {
      console.error("Error sending admin notification:", error)
      return {
        success: false,
        error: error.message,
        customerEmail: customerResult,
        adminNotification: { success: false },
      }
    }

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminNotification: adminResult,
    }
  }
}
