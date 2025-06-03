import type { Transporter } from "nodemailer"

// Only import nodemailer on server side
let nodemailer: any = null

// Lazy load nodemailer only on server side
const getNodemailer = async () => {
  if (typeof window !== "undefined") {
    throw new Error("Nodemailer can only be used on the server side")
  }

  if (!nodemailer) {
    try {
      nodemailer = await import("nodemailer")
    } catch (error) {
      console.error("Failed to import nodemailer:", error)
      throw new Error("Nodemailer is not available")
    }
  }
  return nodemailer
}

// Validate environment variables when needed
const validateEmailConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("Email configuration can only be validated on the server side")
  }

  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  console.log("Email configuration check:", {
    hasEmailUser: !!emailUser,
    hasEmailPass: !!emailPass,
    emailUser: emailUser ? `${emailUser.substring(0, 5)}...` : "missing",
  })

  if (!emailUser || !emailPass) {
    console.error("Email environment variables missing:", {
      EMAIL_USER: !!emailUser,
      EMAIL_PASS: !!emailPass,
    })
    throw new Error("EMAIL_USER and EMAIL_PASS environment variables must be defined")
  }

  return { emailUser, emailPass }
}

// Create transporter with TLS (Port 587)
const createTransporter = async (): Promise<Transporter> => {
  try {
    console.log("Creating nodemailer transporter (TLS)...")

    const { emailUser, emailPass } = validateEmailConfig()
    const nodemailerModule = await getNodemailer()

    const transporter = nodemailerModule.default.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      logger: process.env.NODE_ENV === "development",
      debug: process.env.NODE_ENV === "development",
    })

    console.log("Nodemailer transporter (TLS) created successfully")
    return transporter
  } catch (error) {
    console.error("Failed to create email transporter (TLS):", error)
    throw new Error(`Email configuration failed: ${error}`)
  }
}

// Send email with automatic fallback
export const sendEmailSafe = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string; method?: string }> => {
  if (typeof window !== "undefined") {
    return {
      success: false,
      error: "Email sending can only be performed on server side",
    }
  }

  try {
    // Validate config first
    validateEmailConfig()

    console.log("Attempting to send email safely (TLS)...")

    const transporter = await createTransporter()
    const { emailUser } = validateEmailConfig()

    const mailOptions = {
      from: `"SPARSH Natural Hair Care" <${emailUser}>`,
      to,
      subject,
      html,
      replyTo: emailUser,
    }

    const result = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully via TLS method")
    transporter.close()

    return { success: true, method: "TLS" }
  } catch (error: any) {
    console.error("Email sending failed:", error.message)

    // In development, log email content to console
    if (process.env.NODE_ENV === "development") {
      console.log("=== EMAIL CONTENT (Development Mode) ===")
      console.log("To:", to)
      console.log("Subject:", subject)
      console.log("HTML:", html.substring(0, 200) + "...")
      console.log("=== END EMAIL CONTENT ===")
    }

    return {
      success: false,
      error: error.message,
    }
  }
}

// Export other functions for backward compatibility
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const result = await sendEmailSafe({
      to: "test@example.com",
      subject: "Test Connection",
      html: "<p>Test email</p>",
    })
    return result.success
  } catch {
    return false
  }
}
