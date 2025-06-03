import { NextResponse } from "next/server"
import { EnhancedEmailService } from "@/components/enhanced-email-service"

export async function POST() {
  try {
    console.log("🧪 Starting email system test...")

    // Run comprehensive email tests
    const testResult = await EnhancedEmailService.testEmailSystem()

    return NextResponse.json({
      success: testResult.success,
      message: `Email system test completed: ${testResult.summary.successful}/${testResult.summary.total} successful (${testResult.summary.successRate.toFixed(1)}%)`,
      results: testResult.results,
      summary: testResult.summary,
    })
  } catch (error: any) {
    console.error("❌ Email system test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Email system test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Get previous test results
    const results = EnhancedEmailService.getTestResults()

    return NextResponse.json({
      success: true,
      message: `Retrieved ${results.length} test results`,
      results,
      summary: {
        total: results.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        successRate: results.length > 0 ? (results.filter((r) => r.success).length / results.length) * 100 : 0,
      },
    })
  } catch (error: any) {
    console.error("❌ Failed to get test results:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get test results",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
