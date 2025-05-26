import nodemailer from "nodemailer"

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER and EMAIL_PASS environment variables must be defined")
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  secure: true,
})

export const sendEmail = async ({
  to,
  subject,
  html,
}: { to: string; subject: string; html: string }): Promise<void> => {
  try {
    await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      html,
    })
    console.log("Email sent successfully!")
  } catch (error: any) {
    console.error("Failed to send email:", error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
