import { type NextRequest, NextResponse } from "next/server"
import { testEmailConnection, testAlternativeEmailConnection, sendEmailSafe } from "@/lib/nodemailer"
import { FormspreeService } from "@/lib/formspree"

export async function GET(request: NextRequest) {
  try {
    console.log("=== COMPREHENSIVE EMAIL TEST STARTED ===")

    // Environment check
    const envCheck = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : "missing",
      nodeEnv: process.env.NODE_ENV,
    }

    console.log("Environment check:", envCheck)

    // Test Nodemailer connections
    console.log("Testing Nodemailer connections...")
    const primaryConnectionTest = await testEmailConnection()
    console.log("Primary connection (TLS 587) test result:", primaryConnectionTest)

    const alternativeConnectionTest = await testAlternativeEmailConnection()
    console.log("Alternative connection (SSL 465) test result:", alternativeConnectionTest)

    // Test Nodemailer sending
    let nodemailerSendTest = { success: false, error: "Not attempted", method: "none" }

    if (primaryConnectionTest || alternativeConnectionTest) {
      console.log("Testing Nodemailer email sending...")
      nodemailerSendTest = await sendEmailSafe({
        to: "rs.sparshnaturals@gmail.com",
        subject: "Nodemailer Test - SPARSH System",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Nodemailer Test</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; }
              .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 Nodemailer Test</h1>
                <p>SPARSH Natural Hair Care</p>
              </div>
              <div class="content">
                <h2>Customer Email System Test</h2>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Primary Connection (TLS 587):</strong> ${primaryConnectionTest ? "✅ Working" : "❌ Failed"}</p>
                <p><strong>Alternative Connection (SSL 465):</strong> ${alternativeConnectionTest ? "✅ Working" : "❌ Failed"}</p>
                <p><strong>Method Used:</strong> ${nodemailerSendTest.method || "Auto-detect"}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
                <p>If you receive this email, Nodemailer is working correctly for customer emails!</p>
              </div>
              <div class="footer">
                <p>This is an automated test email from SPARSH Nodemailer system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
      console.log("Nodemailer send test result:", nodemailerSendTest)
    }

    // Test Formspree
    console.log("Testing Formspree admin notifications...")
    const formspreeTest = await FormspreeService.sendAdminNotification({
      type: "system_test",
      subject: "Formspree Test - SPARSH System",
      content: `
🧪 FORMSPREE ADMIN NOTIFICATION TEST

Test Details:
- Test Time: ${new Date().toISOString()}
- Environment: ${process.env.NODE_ENV}
- Nodemailer Status: ${nodemailerSendTest.success ? "✅ Working" : "❌ Failed"}
- Test Type: System Integration Test

This is a test of the Formspree admin notification system.
If you receive this notification, Formspree is working correctly for admin alerts!

System Status:
- Customer Emails (Nodemailer): ${nodemailerSendTest.success ? "Operational" : "Issues Detected"}
- Admin Notifications (Formspree): Testing in progress...

⚠️ This is an automated system test. No action required.
      `,
      metadata: {
        test_timestamp: new Date().toISOString(),
        nodemailer_status: nodemailerSendTest.success,
        environment: process.env.NODE_ENV,
      },
    })
    console.log("Formspree test result:", formspreeTest)

    // Compile results
    const results = {
      status: "completed",
      timestamp: new Date().toISOString(),
      tests: {
        environment: envCheck,
        nodemailer: {
          connections: {
            primary_tls_587: primaryConnectionTest,
            alternative_ssl_465: alternativeConnectionTest,
          },
          sending: nodemailerSendTest,
        },
        formspree: {
          admin_notifications: formspreeTest,
        },
      },
      summary: {
        nodemailer_working: nodemailerSendTest.success,
        formspree_working: formspreeTest.success,
        any_connection_working: primaryConnectionTest || alternativeConnectionTest,
        recommended_method: nodemailerSendTest.method,
        overall_status:
          nodemailerSendTest.success && formspreeTest.success
            ? "✅ All email systems operational"
            : nodemailerSendTest.success
              ? "⚠️ Customer emails working, admin notifications need attention"
              : formspreeTest.success
                ? "⚠️ Admin notifications working, customer emails need attention"
                : "❌ Both email systems have issues",
        integration_status: {
          customer_emails: nodemailerSendTest.success ? "Nodemailer ✅" : "Nodemailer ❌",
          admin_notifications: formspreeTest.success ? "Formspree ✅" : "Formspree ❌",
        },
      },
    }

    console.log("=== COMPREHENSIVE EMAIL TEST COMPLETED ===")
    console.log("Summary:", results.summary)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Email test critical error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, method = "auto", service = "nodemailer" } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields: to, subject, message" }, { status: 400 })
    }

    let result

    if (service === "formspree") {
      // Test Formspree admin notification
      result = await FormspreeService.sendAdminNotification({
        type: "custom_test",
        subject: `Custom Test: ${subject}`,
        content: message,
        metadata: {
          test_timestamp: new Date().toISOString(),
          test_method: method,
        },
      })
    } else {
      // Test Nodemailer customer email
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Custom Test Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Custom Test Email</h1>
              <p>SPARSH Natural Hair Care</p>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                ${message}
              </div>
              <p><em>Sent at: ${new Date().toISOString()}</em></p>
              <p><em>Method: ${method}</em></p>
              <p><em>Service: ${service}</em></p>
            </div>
            <div class="footer">
              <p>This is a custom test email from SPARSH email system.</p>
            </div>
          </div>
        </body>
        </html>
      `

      result = await sendEmailSafe({ to, subject: `Test Email: ${subject}`, html })
    }

    return NextResponse.json({
      success: result.success,
      error: result.error,
      method: result.method || method,
      service,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
