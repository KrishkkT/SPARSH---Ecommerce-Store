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

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAAEdCAYAAABtzDIaAAB9O0lEQVR4nO2dd5xcV3n3f6fcMnWrpJ";

export async function generateInvoicePDF(order: Order): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const pageHeight = doc.internal.pageSize.height
  let currentY = 0

  const primaryGreen = [16, 150, 129]
  const darkGreen = [6, 95, 70]
  const lightGreen = [240, 253, 244]
  const borderColor = [229, 231, 235]

  const addPageHeader = () => {
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
    doc.rect(0, 0, 210, 45, "F")
    doc.addImage(logoBase64, "PNG", 20, 10, 40, 25)
    doc.setFontSize(36)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.text("INVOICE", 150, 25)
    currentY = 50
  }

  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, 210, 297, "F")
  addPageHeader()

  const invoiceNo = order.id.slice(0, 8).toUpperCase()
  const invoiceDate = format(new Date(order.created_at), "dd/MM/yyyy")
  const dueDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "dd/MM/yyyy")

  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.setFont("helvetica", "normal")
  doc.text(`Invoice no: INV-${invoiceNo}`, 135, currentY)
  doc.text(`Date: ${invoiceDate}`, 135, currentY + 7)
  doc.text(`Due Date: ${dueDate}`, 135, currentY + 14)
  if (order.tracking_number) {
    doc.text(`Tracking: ${order.tracking_number}`, 135, currentY + 21)
  }

  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.roundedRect(135, currentY + 28, 55, 25, 4, 4, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Total due:", 140, currentY + 38)
  doc.setFontSize(16)
  doc.text(`Rs. ${order.total_amount.toLocaleString()}`, 140, currentY + 46)

  currentY += 60

  // Customer Details
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Invoice to:", 20, currentY)

  doc.setFontSize(16)
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.text(order.customer_name.toUpperCase(), 20, currentY + 10)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  currentY += 20

  const addressLines = order.shipping_address.split(",")
  addressLines.forEach((line) => {
    if (line.trim()) {
      doc.text(line.trim(), 20, currentY)
      currentY += 5
    }
  })
  doc.text(`Email: ${order.customer_email}`, 20, currentY + 5)
  doc.text(`Phone: ${order.customer_phone}`, 20, currentY + 12)

  currentY += 20
  doc.setLineWidth(0.5)
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
  doc.line(20, currentY, 190, currentY)
  currentY += 10

  // Table Header
  const drawTableHeader = () => {
    doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.roundedRect(20, currentY, 170, 10, 2, 2, "F")
    doc.text("PRODUCT / SERVICE", 25, currentY + 7)
    doc.text("QTY", 115, currentY + 7)
    doc.text("PRICE", 135, currentY + 7)
    doc.text("TOTAL", 165, currentY + 7)
    currentY += 14
  }

  drawTableHeader()
  doc.setFont("helvetica", "normal")
  doc.setTextColor(60, 60, 60)

  const addPageBreak = () => {
    doc.addPage()
    currentY = 20
    addPageHeader()
    drawTableHeader()
  }

  order.order_items.forEach((item, index) => {
    if (currentY > 270) addPageBreak()

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(20, currentY - 6, 170, 10, 1, 1, "F")
    }

    const itemTotal = item.product_price * item.quantity
    doc.text(item.product_name, 25, currentY)
    doc.text(item.quantity.toString(), 115, currentY)
    doc.text(`Rs. ${item.product_price.toLocaleString()}`, 135, currentY)
    doc.setFont("helvetica", "bold")
    doc.text(`Rs. ${itemTotal.toLocaleString()}`, 165, currentY)
    doc.setFont("helvetica", "normal")
    currentY += 12
  })

  // Summary and Footer
  if (currentY > 240) addPageBreak()

  const footerY = currentY + 10
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text("Sub Total:", 130, footerY)
  doc.setFont("helvetica", "bold")
  doc.text(`Rs. ${order.total_amount.toLocaleString()}`, 165, footerY)
  doc.setFont("helvetica", "normal")
  doc.text("Shipping:", 130, footerY + 7)
  doc.text("Free", 165, footerY + 7)
  doc.text("Tax (Inclusive):", 130, footerY + 14)
  doc.text("Included", 165, footerY + 14)

  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.roundedRect(115, footerY + 20, 75, 18, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TOTAL:", 130, footerY + 30)
  doc.setFontSize(16)
  doc.text(`Rs. ${order.total_amount.toLocaleString()}`, 165, footerY + 30)

  const paymentY = footerY + 48
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(12)
  doc.text("Payment Information", 20, paymentY)
  doc.setFontSize(10)
  doc.text(`Method: ${order.payment_method || "Online Payment"}`, 20, paymentY + 8)
  doc.text(`Status: ${order.payment_status?.toUpperCase() || "COMPLETED"}`, 20, paymentY + 15)

  const paymentId = order.payment_id || order.razorpay_payment_id
  if (paymentId) doc.text(`Transaction ID: ${paymentId}`, 20, paymentY + 22)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Thank you for your purchase!", 20, paymentY + 36)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Order ID: ${order.id}`, 20, paymentY + 44)
  doc.setTextColor(120, 120, 120)
  doc.text("Return within 2 days if damaged or wrong item. Contact support for assistance.", 20, paymentY + 50)

  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2])
  doc.text("SPARSH", 140, paymentY + 46)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.text("Administrator", 140, paymentY + 53)

  const pdfArrayBuffer = doc.output("arraybuffer")
  return Buffer.from(pdfArrayBuffer)
}
