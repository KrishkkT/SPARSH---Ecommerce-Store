import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/components/email-service"

export async function POST(request: NextRequest) {
  try {
    const returnData = await request.json()

    // Validate required fields
    if (
      !returnData.orderId ||
      !returnData.reason ||
      !returnData.items ||
      !returnData.customerName ||
      !returnData.customerEmail ||
      !returnData.customerPhone
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Send emails (customer confirmation + admin notification)
    const emailResult = await EmailService.sendReturnRequest({
      orderId: returnData.orderId,
      reason: returnData.reason,
      items: returnData.items,
      customerName: returnData.customerName,
      customerEmail: returnData.customerEmail,
      customerPhone: returnData.customerPhone,
      customerAddress: returnData.customerAddress || "",
    })

    // Note: Skipping Shiprocket return creation due to permissions issue
    // This would typically require special return permissions in Shiprocket account
    // For now, we'll handle returns manually through admin notifications

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully",
      emailResult,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process return request",
      },
      { status: 500 },
    )
  }
}
