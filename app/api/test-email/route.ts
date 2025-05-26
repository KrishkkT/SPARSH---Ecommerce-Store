import { type NextRequest, NextResponse } from "next/server"
import { testEmailConnection, testAlternativeEmailConnection, sendEmailSafe } from "@/lib/nodemailer"

export async function GET(request: NextRequest) {
  try {
    console.log("=== EMAIL TEST STARTED ===")

    // Environment check
    const envCheck = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : "missing",
      nodeEnv: process.env.NODE_ENV,
    }

    console.log("Environment check:", envCheck)

    // Test both connection methods
    console.log("Testing primary email connection...")
    const primaryConnectionTest = await testEmailConnection()
    console.log("Primary connection test result:", primaryConnectionTest)

    console.log("Testing alternative email connection...")
    const alternativeConnectionTest = await testAlternativeEmailConnection()
    console.log("Alternative connection test result:", alternativeConnectionTest)

    // Test sending emails
    let sendTest = { success: false, error: "Not attempted", method: "none" }

    if (primaryConnectionTest || alternativeConnectionTest) {
      console.log("Testing email sending...")
      sendTest = await sendEmailSafe({
        to: "rs.sparshnaturals@gmail.com",
        subject: "Email Test - SPARSH System",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Email Test</title>
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
                <h1>🧪 Email System Test</h1>
                <p>SPARSH Natural Hair Care</p>
              </div>
              <div class="content">
                <h2>Test Results</h2>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Primary Connection:</strong> ${primaryConnectionTest ? "✅ Working" : "❌ Failed"}</p>
                <p><strong>Alternative Connection:</strong> ${alternativeConnectionTest ? "✅ Working" : "❌ Failed"}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
                <p>If you receive this email, the email system is working correctly!</p>
              </div>
              <div class="footer">
                <p>This is an automated test email from SPARSH email system.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
      console.log("Send test result:", sendTest)
    }

    const results = {
      status: "completed",
      tests: {
        environment: envCheck,
        connections: {
          primary: primaryConnectionTest,
          alternative: alternativeConnectionTest,
        },
        sending: sendTest,
      },
      summary: {
        anyConnectionWorking: primaryConnectionTest || alternativeConnectionTest,
        emailSendingWorking: sendTest.success,
        recommendedMethod: sendTest.method,
        overallStatus: sendTest.success ? "✅ All systems working" : "❌ Email system has issues",
      },
      timestamp: new Date().toISOString(),
    }

    console.log("=== EMAIL TEST COMPLETED ===", results.summary)

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
    const { to, subject, message, method = "auto" } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields: to, subject, message" }, { status: 400 })
    }

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
          </div>
          <div class="footer">
            <p>This is a custom test email from SPARSH email system.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await sendEmailSafe({ to, subject: `Test Email: ${subject}`, html })

    return NextResponse.json({
      success: result.success,
      error: result.error,
      method: result.method || method,
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
