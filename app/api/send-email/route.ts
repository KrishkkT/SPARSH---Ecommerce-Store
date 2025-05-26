import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, type } = body

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 })
    }

    await sendEmail({ to, subject, html })

    return NextResponse.json({ message: "Email sent successfully", type }, { status: 200 })
  } catch (error: any) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email", details: error.message }, { status: 500 })
  }
}
