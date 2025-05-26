import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

// Environment variables validation
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

// Create transporter with better configuration
const createTransporter = (): Transporter => {
  try {
    console.log("Creating nodemailer transporter...")

    // Use the correct nodemailer syntax
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false, // For development/testing
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      logger: process.env.NODE_ENV === "development", // Enable logging in development
      debug: process.env.NODE_ENV === "development", // Enable debug in development
    })

    console.log("Nodemailer transporter created successfully")
    return transporter
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    throw new Error(`Email configuration failed: ${error}`)
  }
}

// Create alternative transporter (SSL)
const createAlternativeTransporter = (): Transporter => {
  try {
    console.log("Creating alternative nodemailer transporter...")

    const transporter = nodemailer.createTransport({
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

    console.log("Alternative nodemailer transporter created successfully")
    return transporter
  } catch (error) {
    console.error("Failed to create alternative email transporter:", error)
    throw new Error(`Alternative email configuration failed: ${error}`)
  }
}

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing email connection...")
    const transporter = createTransporter()

    console.log("Verifying SMTP connection...")
    await transporter.verify()

    console.log("Email connection verified successfully")
    transporter.close()
    return true
  } catch (error: any) {
    console.error("Email connection test failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    })
    return false
  }
}

// Test alternative email connection
export const testAlternativeEmailConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing alternative email connection...")
    const transporter = createAlternativeTransporter()

    console.log("Verifying alternative SMTP connection...")
    await transporter.verify()

    console.log("Alternative email connection verified successfully")
    transporter.close()
    return true
  } catch (error: any) {
    console.error("Alternative email connection test failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    })
    return false
  }
}

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
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt}:`, {
        to: to.substring(0, 5) + "...",
        subject,
        from: emailUser,
      })

      const transporter = createTransporter()

      // Verify connection before sending
      console.log("Verifying connection before sending...")
      await transporter.verify()

      const mailOptions = {
        from: `"SPARSH Natural Hair Care" <${emailUser}>`,
        to,
        subject,
        html,
        replyTo: emailUser,
      }

      console.log("Sending email with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      })

      const result = await transporter.sendMail(mailOptions)

      console.log("Email sent successfully:", {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      })

      // Close the transporter
      transporter.close()

      return // Success, exit the retry loop
    } catch (error: any) {
      console.error(`Email sending attempt ${attempt} failed:`, {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      })

      if (attempt === retries) {
        // Last attempt failed
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`)
      }

      // Wait before retry (exponential backoff)
      const delay = 1000 * Math.pow(2, attempt - 1) // 1s, 2s, 4s
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Send email with alternative method
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
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending email (alternative) attempt ${attempt}:`, {
        to: to.substring(0, 5) + "...",
        subject,
        from: emailUser,
      })

      const transporter = createAlternativeTransporter()

      // Verify connection before sending
      console.log("Verifying alternative connection before sending...")
      await transporter.verify()

      const mailOptions = {
        from: `"SPARSH Natural Hair Care" <${emailUser}>`,
        to,
        subject,
        html,
        replyTo: emailUser,
      }

      console.log("Sending email (alternative) with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      })

      const result = await transporter.sendMail(mailOptions)

      console.log("Email sent successfully (alternative):", {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      })

      // Close the transporter
      transporter.close()

      return // Success, exit the retry loop
    } catch (error: any) {
      console.error(`Email sending (alternative) attempt ${attempt} failed:`, {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      })

      if (attempt === retries) {
        // Last attempt failed
        throw new Error(`Failed to send email (alternative) after ${retries} attempts: ${error.message}`)
      }

      // Wait before retry (exponential backoff)
      const delay = 1000 * Math.pow(2, attempt - 1) // 1s, 2s, 4s
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Send email with fallback to console logging in development
export const sendEmailSafe = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string; method?: string }> => {
  try {
    console.log("Attempting to send email safely...")
    await sendEmail({ to, subject, html })
    console.log("Email sent successfully via sendEmailSafe (primary)")
    return { success: true, method: "primary" }
  } catch (error: any) {
    console.error("Primary email method failed, trying alternative:", error.message)

    try {
      await sendEmailAlternative({ to, subject, html })
      console.log("Email sent successfully via sendEmailSafe (alternative)")
      return { success: true, method: "alternative" }
    } catch (altError: any) {
      console.error("Alternative email method also failed:", altError.message)

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
        error: `Primary: ${error.message}, Alternative: ${altError.message}`,
      }
    }
  }
}
