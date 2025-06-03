import jsPDF from "jspdf";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
  payment_status: string;
  payment_method: string | null;
  payment_id?: string;
  razorpay_payment_id?: string;
  tracking_number?: string;
  order_items: OrderItem[];
}

export async function generateInvoicePDF(order: Order): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const invoiceNo = order.id.slice(0, 8).toUpperCase();
  const invoiceDate = format(new Date(order.created_at), "dd/MM/yyyy");

  let y = 10;
  doc.setFontSize(14);
  doc.text("INVOICE", 10, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${invoiceNo}`, 10, y);
  doc.text(`Date: ${invoiceDate}`, 150, y);
  y += 10;

  doc.text(`Customer: ${order.customer_name}`, 10, y);
  doc.text(`Email: ${order.customer_email}`, 10, y + 5);
  doc.text(`Phone: ${order.customer_phone}`, 10, y + 10);
  y += 20;

  const addressLines = order.shipping_address.split(",");
  doc.text("Shipping Address:", 10, y);
  addressLines.forEach((line) => {
    doc.text(line.trim(), 10, y += 5);
  });
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Product", 10, y);
  doc.text("Qty", 100, y);
  doc.text("Price", 120, y);
  doc.text("Total", 160, y);
  y += 5;
  doc.setFont("helvetica", "normal");

  order.order_items.forEach((item) => {
    const itemTotal = item.product_price * item.quantity;
    doc.text(item.product_name, 10, y);
    doc.text(item.quantity.toString(), 100, y);
    doc.text(`Rs. ${item.product_price}`, 120, y);
    doc.text(`Rs. ${itemTotal}`, 160, y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: Rs. ${order.total_amount}`, 10, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.text(`Payment Method: ${order.payment_method || "Online Payment"}`, 10, y);
  doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, 10, y + 5);
  const paymentId = order.payment_id || order.razorpay_payment_id;
  if (paymentId) doc.text(`Transaction ID: ${paymentId}`, 10, y + 10);

  y += 20;
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for your purchase!", 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order.id}`, 10, y + 5);

  const pdfArrayBuffer = doc.output("arraybuffer");
  return Buffer.from(pdfArrayBuffer);
}
