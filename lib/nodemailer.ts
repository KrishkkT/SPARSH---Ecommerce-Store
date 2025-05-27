import type { Transporter } from "nodemailer"

// Only import nodemailer on server side
let nodemailer: any = null

// Lazy load nodemailer only on server side
const getNodemailer = async () => {
  if (typeof window !== "undefined") {
    throw new Error("Nodemailer can only be used on the server side")
  }

  if (!nodemailer) {
    nodemailer = await import("nodemailer")
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

    const transporter = nodemailerModule.default.createTransport({
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

// Create alternative transporter with SSL (Port 465)
const createAlternativeTransporter = async (): Promise<Transporter> => {
  try {
    console.log("Creating alternative nodemailer transporter (SSL)...")

    const { emailUser, emailPass } = validateEmailConfig()
    const nodemailerModule = await getNodemailer()

    const transporter = nodemailerModule.default.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
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

    console.log("Alternative nodemailer transporter (SSL) created successfully")
    return transporter
  } catch (error) {
    console.error("Failed to create alternative email transporter (SSL):", error)
    throw new Error(`Alternative email configuration failed: ${error}`)
  }
}

// Test email connection (TLS)
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    if (typeof window !== "undefined") {
      console.error("testEmailConnection can only be called on server side")
      return false
    }

    console.log("Testing email connection (TLS)...")

    // Validate config first
    validateEmailConfig()

    const transporter = await createTransporter()

    console.log("Verifying SMTP connection (TLS)...")
    await transporter.verify()

    console.log("Email connection (TLS) verified successfully")
    transporter.close()
    return true
  } catch (error: any) {
    console.error("Email connection test (TLS) failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    })
    return false
  }
}

// Test alternative email connection (SSL)
export const testAlternativeEmailConnection = async (): Promise<boolean> => {
  try {
    if (typeof window !== "undefined") {
      console.error("testAlternativeEmailConnection can only be called on server side")
      return false
    }

    console.log("Testing alternative email connection (SSL)...")

    // Validate config first
    validateEmailConfig()

    const transporter = await createAlternativeTransporter()

    console.log("Verifying alternative SMTP connection (SSL)...")
    await transporter.verify()

    console.log("Alternative email connection (SSL) verified successfully")
    transporter.close()
    return true
  } catch (error: any) {
    console.error("Alternative email connection test (SSL) failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    })
    return false
  }
}

// Send email using TLS method
export const sendEmail = async ({
  to,
  subject,
  html,
  retries = 3,
}: {
  to: string
  subject: string
  html: string
  retries?: number
}): Promise<void> => {
  if (typeof window !== "undefined") {
    throw new Error("sendEmail can only be called on server side")
  }

  const { emailUser } = validateEmailConfig()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending email (TLS) attempt ${attempt}:`, {
        to: to.substring(0, 5) + "...",
        subject,
        from: emailUser,
      })

      const transporter = await createTransporter()

      // Verify connection before sending
      console.log("Verifying connection before sending (TLS)...")
      await transporter.verify()

      const mailOptions = {
        from: `"SPARSH Natural Hair Care" <${emailUser}>`,
        to,
        subject,
        html,
        replyTo: emailUser,
      }

      console.log("Sending email with TLS...")
      const result = await transporter.sendMail(mailOptions)

      console.log("Email sent successfully (TLS):", {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      })

      transporter.close()
      return // Success
    } catch (error: any) {
      console.error(`Email sending (TLS) attempt ${attempt} failed:`, {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      })

      if (attempt === retries) {
        throw new Error(`Failed to send email (TLS) after ${retries} attempts: ${error.message}`)
      }

      // Wait before retry
      const delay = 1000 * Math.pow(2, attempt - 1)
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Send email using SSL method
export const sendEmailAlternative = async ({
  to,
  subject,
  html,
  retries = 3,
}: {
  to: string
  subject: string
  html: string
  retries?: number
}): Promise<void> => {
  if (typeof window !== "undefined") {
    throw new Error("sendEmailAlternative can only be called on server side")
  }

  const { emailUser } = validateEmailConfig()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending email (SSL) attempt ${attempt}:`, {
        to: to.substring(0, 5) + "...",
        subject,
        from: emailUser,
      })

      const transporter = await createAlternativeTransporter()

      // Verify connection before sending
      console.log("Verifying connection before sending (SSL)...")
      await transporter.verify()

      const mailOptions = {
        from: `"SPARSH Natural Hair Care" <${emailUser}>`,
        to,
        subject,
        html,
        replyTo: emailUser,
      }

      console.log("Sending email with SSL...")
      const result = await transporter.sendMail(mailOptions)

      console.log("Email sent successfully (SSL):", {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      })

      transporter.close()
      return // Success
    } catch (error: any) {
      console.error(`Email sending (SSL) attempt ${attempt} failed:`, {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      })

      if (attempt === retries) {
        throw new Error(`Failed to send email (SSL) after ${retries} attempts: ${error.message}`)
      }

      // Wait before retry
      const delay = 1000 * Math.pow(2, attempt - 1)
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
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

    console.log("Attempting to send email safely (TLS first)...")
    await sendEmail({ to, subject, html })
    console.log("Email sent successfully via TLS method")
    return { success: true, method: "TLS" }
  } catch (error: any) {
    console.error("TLS email method failed, trying SSL:", error.message)

    try {
      await sendEmailAlternative({ to, subject, html })
      console.log("Email sent successfully via SSL method")
      return { success: true, method: "SSL" }
    } catch (altError: any) {
      console.error("SSL email method also failed:", altError.message)

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
        error: `TLS: ${error.message}, SSL: ${altError.message}`,
      }
    }
  }
}
