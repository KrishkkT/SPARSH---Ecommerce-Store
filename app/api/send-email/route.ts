import { type NextRequest, NextResponse } from "next/server"
import { sendEmailSafe, testEmailConnection, testAlternativeEmailConnection } from "@/lib/nodemailer"

export async function POST(request: NextRequest) {
  try {
    console.log("=== EMAIL API CALLED ===")

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { to, subject, html, type } = body

    console.log("Email request details:", {
      to: to ? `${to.substring(0, 5)}...` : "missing",
      subject: subject ? subject.substring(0, 30) + "..." : "missing",
      type,
      hasHtml: !!html,
      htmlLength: html ? html.length : 0,
    })

    // Validation
    if (!to || !subject || !html) {
      console.error("Missing required fields:", { hasTo: !!to, hasSubject: !!subject, hasHtml: !!html })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "to, subject, and html are required",
          received: { hasTo: !!to, hasSubject: !!subject, hasHtml: !!html },
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      console.error("Invalid email address:", to)
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Test both email connection methods
    console.log("Testing email connections...")
    const primaryConnectionTest = await testEmailConnection()
    const alternativeConnectionTest = await testAlternativeEmailConnection()

    console.log("Connection test results:", {
      primary: primaryConnectionTest,
      alternative: alternativeConnectionTest,
    })

    if (!primaryConnectionTest && !alternativeConnectionTest) {
      console.error("Both email connection methods failed")
      return NextResponse.json(
        {
          error: "Email service unavailable",
          details: "Unable to connect to email server with any method",
          primaryConnection: primaryConnectionTest,
          alternativeConnection: alternativeConnectionTest,
        },
        { status: 503 },
      )
    }

    // Send email using the safe method (tries both primary and alternative)
    console.log("Sending email using safe method...")
    const result = await sendEmailSafe({ to, subject, html })

    if (result.success) {
      console.log(`Email sent successfully using ${result.method} method`)
      return NextResponse.json(
        {
          message: "Email sent successfully",
          type,
          method: result.method,
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      )
    } else {
      console.error("All email methods failed:", result.error)
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: result.error,
          type,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Email API critical error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    console.log("Email health check requested")

    const primaryConnectionTest = await testEmailConnection()
    const alternativeConnectionTest = await testAlternativeEmailConnection()

    // Test environment variables
    const envCheck = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : "missing",
      nodeEnv: process.env.NODE_ENV,
    }

    console.log("Health check results:", {
      primary: primaryConnectionTest,
      alternative: alternativeConnectionTest,
      envCheck,
    })

    const isHealthy = primaryConnectionTest || alternativeConnectionTest

    return NextResponse.json({
      status: isHealthy ? "healthy" : "unhealthy",
      emailService: {
        primary: primaryConnectionTest ? "connected" : "disconnected",
        alternative: alternativeConnectionTest ? "connected" : "disconnected",
        anyWorking: isHealthy,
      },
      environment: envCheck,
      timestamp: new Date().toISOString(),
      version: "3.0",
    })
  } catch (error: any) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
