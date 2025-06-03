import jsPDF from "jspdf"
import { format } from "date-fns"

interface OrderItem {
  id: string
  product_name: string
  product_price: number
  quantity: number
}

interface Order {
  id: string
  total_amount: number
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  created_at: string
  payment_status: string
  payment_method: string | null
  payment_id?: string
  razorpay_payment_id?: string
  tracking_number?: string
  order_items: OrderItem[]
}

export async function generateInvoicePDF(order: Order): Promise<{ buffer: Buffer; base64: string }> {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

    // Color palette
    const primary = [16, 150, 129] // Emerald
    const secondary = [6, 95, 70] // Dark emerald
    const accent = [240, 253, 244] // Light emerald
    const text = [31, 41, 55] // Gray-800
    const lightText = [107, 114, 128] // Gray-500

    let currentY = 20

    // Header with gradient effect
    doc.setFillColor(primary[0], primary[1], primary[2])
    doc.rect(0, 0, 210, 60, "F")

    // Company branding
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(32)
    doc.setFont("helvetica", "bold")
    doc.text("SPARSH", 20, 35)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Natural Hair Care", 20, 45)

    // Invoice title
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text("INVOICE", 150, 35)

    currentY = 80

    // Invoice details card
    doc.setFillColor(accent[0], accent[1], accent[2])
    doc.roundedRect(20, currentY, 170, 35, 5, 5, "F")

    doc.setTextColor(text[0], text[1], text[2])
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")

    const invoiceNo = order.id.slice(0, 8).toUpperCase()
    const invoiceDate = format(new Date(order.created_at), "dd MMM yyyy")

    // Left column
    doc.text("Invoice Number:", 25, currentY + 10)
    doc.text("Invoice Date:", 25, currentY + 18)
    doc.text("Payment Status:", 25, currentY + 26)

    doc.setFont("helvetica", "normal")
    doc.text(`INV-${invoiceNo}`, 65, currentY + 10)
    doc.text(invoiceDate, 65, currentY + 18)
    doc.text(order.payment_status.toUpperCase(), 65, currentY + 26)

    // Right column
    doc.setFont("helvetica", "bold")
    doc.text("Order ID:", 120, currentY + 10)
    doc.text("Payment Method:", 120, currentY + 18)
    if (order.tracking_number) {
      doc.text("Tracking:", 120, currentY + 26)
    }

    doc.setFont("helvetica", "normal")
    doc.text(order.id.slice(0, 12), 150, currentY + 10)
    doc.text(order.payment_method || "Online", 150, currentY + 18)
    if (order.tracking_number) {
      doc.text(order.tracking_number, 150, currentY + 26)
    }

    currentY += 50

    // Customer information
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(20, currentY, 170, 40, 5, 5, "F")
    doc.setDrawColor(primary[0], primary[1], primary[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(20, currentY, 170, 40, 5, 5, "S")

    doc.setTextColor(primary[0], primary[1], primary[2])
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("BILL TO", 25, currentY + 12)

    doc.setTextColor(text[0], text[1], text[2])
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(order.customer_name.toUpperCase(), 25, currentY + 22)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(lightText[0], lightText[1], lightText[2])

    const addressLines = order.shipping_address.split(",")
    let addressY = currentY + 28
    addressLines.slice(0, 2).forEach((line) => {
      if (line.trim() && addressY < currentY + 38) {
        doc.text(line.trim(), 25, addressY)
        addressY += 4
      }
    })

    currentY += 55

    // Items table header
    doc.setFillColor(primary[0], primary[1], primary[2])
    doc.rect(20, currentY, 170, 12, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("ITEM", 25, currentY + 8)
    doc.text("QTY", 120, currentY + 8)
    doc.text("PRICE", 140, currentY + 8)
    doc.text("TOTAL", 165, currentY + 8)

    currentY += 12

    // Items
    doc.setTextColor(text[0], text[1], text[2])
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252)
          doc.rect(20, currentY, 170, 10, "F")
        }

        const itemTotal = item.product_price * item.quantity

        // Truncate long product names
        const productName =
          item.product_name.length > 35 ? item.product_name.substring(0, 32) + "..." : item.product_name

        doc.text(productName, 25, currentY + 6)
        doc.text(item.quantity.toString(), 125, currentY + 6)
        doc.text(`₹${item.product_price.toLocaleString()}`, 142, currentY + 6)
        doc.setFont("helvetica", "bold")
        doc.text(`₹${itemTotal.toLocaleString()}`, 167, currentY + 6)
        doc.setFont("helvetica", "normal")

        currentY += 10
      })
    }

    // Total section
    currentY += 10
    doc.setFillColor(primary[0], primary[1], primary[2])
    doc.roundedRect(120, currentY, 70, 25, 5, 5, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("TOTAL AMOUNT", 125, currentY + 10)
    doc.setFontSize(18)
    doc.text(`₹${order.total_amount.toLocaleString()}`, 125, currentY + 20)

    // Footer
    currentY += 40
    doc.setTextColor(lightText[0], lightText[1], lightText[2])
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")

    doc.text("Thank you for choosing SPARSH Natural Hair Care!", 20, currentY)
    doc.text("For support: rs.sparshnaturals@gmail.com | +91 9409073136", 20, currentY + 8)
    doc.text("Return policy: 2 days for damaged or wrong items", 20, currentY + 16)

    // Payment info
    if (order.payment_id || order.razorpay_payment_id) {
      doc.text(`Transaction ID: ${order.payment_id || order.razorpay_payment_id}`, 20, currentY + 24)
    }

    // Generate output
    const pdfArrayBuffer = doc.output("arraybuffer")
    const buffer = Buffer.from(pdfArrayBuffer)
    const base64 = buffer.toString("base64")

    console.log("✅ PDF generated successfully, size:", buffer.length, "bytes")

    return { buffer, base64 }
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}
