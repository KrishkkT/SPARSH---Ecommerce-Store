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
  order_items: OrderItem[]
}

export async function generateInvoicePDF(order: Order): Promise<Buffer> {
  // Create a new PDF document (A4 size)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Define colors
  const primaryGreen = [16, 150, 129] // emerald-600
  const darkGreen = [6, 95, 70] // emerald-800
  const lightGreen = [240, 253, 244] // emerald-50
  const borderColor = [229, 231, 235] // gray-200

  // Set background color for header
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 210, 297, "F") // White background for entire page

  // Add green header design
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.rect(0, 0, 210, 40, "F")

  // Add diagonal design element
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2])
  doc.triangle(0, 0, 210, 0, 0, 40, "F")

  // Add light green accent
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2])
  doc.triangle(210, 0, 210, 20, 180, 0, "F")

  // Add SPARSH logo text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("SPARSH", 20, 20)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("BY R NATURALS", 20, 28)

  // Add invoice title
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("INVOICE", 140, 25)

  // Reset text color for body content
  doc.setTextColor(60, 60, 60)

  // Add invoice details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const invoiceNo = order.id.slice(0, 8).toUpperCase()
  const invoiceDate = format(new Date(order.created_at), "dd/MM/yyyy")

  doc.text(`Invoice no: ${invoiceNo}`, 140, 45)
  doc.text(`Date: ${invoiceDate}`, 140, 52)

  // Add total due box
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.roundedRect(140, 58, 50, 20, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Total due:", 145, 67)
  doc.setFontSize(14)
  doc.text(`₹ ${order.total_amount.toLocaleString()}`, 145, 73)

  // Customer details section
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("Invoice to:", 20, 55)

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.text(order.customer_name.toUpperCase(), 20, 63)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  // Split address into lines
  const addressLines = order.shipping_address.split(",")
  let yPos = 70
  addressLines.forEach((line) => {
    doc.text(line.trim(), 20, yPos)
    yPos += 5
  })

  // Add customer contact info
  doc.text(`Email: ${order.customer_email}`, 20, yPos + 5)
  doc.text(`Phone: ${order.customer_phone}`, 20, yPos + 10)

  // Add horizontal separator
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(20, 95, 190, 95)

  // Items table header
  const tableStartY = 105
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.rect(20, tableStartY, 170, 10, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("PRODUCT / SERVICE", 25, tableStartY + 7)
  doc.text("QTY", 120, tableStartY + 7)
  doc.text("PRICE", 140, tableStartY + 7)
  doc.text("TOTAL", 170, tableStartY + 7)

  // Items table content
  doc.setTextColor(60, 60, 60)
  doc.setFont("helvetica", "normal")
  let currentY = tableStartY + 20

  // Add zebra striping for better readability
  order.order_items.forEach((item, index) => {
    // Add light background for even rows
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252) // slate-50
      doc.rect(20, currentY - 10, 170, 12, "F")
    }

    const itemTotal = item.product_price * item.quantity

    doc.setFont("helvetica", "normal")
    doc.text(item.product_name, 25, currentY)
    doc.text(item.quantity.toString(), 125, currentY)
    doc.text(`₹${item.product_price.toLocaleString()}`, 140, currentY)

    doc.setFont("helvetica", "bold")
    doc.text(`₹${itemTotal.toLocaleString()}`, 170, currentY)

    currentY += 15
  })

  // Add summary section with clean design
  const summaryY = Math.max(currentY + 20, 220) // Ensure enough space

  // Add separator line
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(20, summaryY - 10, 190, summaryY - 10)

  // Sub total
  doc.setFont("helvetica", "normal")
  doc.text("Sub Total:", 140, summaryY)
  doc.setFont("helvetica", "bold")
  doc.text(`₹${order.total_amount.toLocaleString()}`, 170, summaryY)

  // Total (highlighted)
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.roundedRect(120, summaryY + 5, 70, 15, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL:", 140, summaryY + 15)
  doc.setFontSize(14)
  doc.text(`₹${order.total_amount.toLocaleString()}`, 170, summaryY + 15)

  // Payment information section
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  const paymentY = summaryY + 35
  doc.text("Payment Information", 20, paymentY)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Method: ${order.payment_method || "Online Payment"}`, 20, paymentY + 7)
  doc.text(`Status: ${order.payment_status}`, 20, paymentY + 14)
  doc.text(`Order ID: ${order.id}`, 20, paymentY + 21)

  // Add company information in a nice box
  const companyInfoY = paymentY + 35
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2])
  doc.roundedRect(20, companyInfoY, 170, 30, 3, 3, "F")

  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("SPARSH BY R NATURALS", 25, companyInfoY + 10)

  doc.setTextColor(80, 80, 80)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Telephone: +91 9409073136", 25, companyInfoY + 18)
  doc.text("E-mail: rs.sparshnaturals@gmail.com", 25, companyInfoY + 25)

  // Footer
  const footerY = 270
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.setLineWidth(0.5)
  doc.line(20, footerY - 5, 190, footerY - 5)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Thank you for your purchase!", 20, footerY + 5)

  // SPARSH signature
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.text("SPARSH", 150, footerY + 5)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.setFont("helvetica", "normal")
  doc.text("Administrator", 150, footerY + 12)

  // Convert to buffer
  const pdfArrayBuffer = doc.output("arraybuffer")
  return Buffer.from(pdfArrayBuffer)
}
