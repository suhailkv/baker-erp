// src/controllers/invoice.controller.js
const PDFDocument = require('pdfkit');
const db = require('../models');

exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await db.Sale.findByPk(id, {
      include: [db.Customer, db.Production],
    });

    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    if (sale.status !== 'PAID')
      return res.status(400).json({ error: 'Invoice available only for PAID sales' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=invoice-${sale.order_code}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // --------------------
    // Company Header
    // --------------------
    doc.fontSize(20).text("🏭 Your Company Pvt. Ltd.", { align: "left" });
    doc.fontSize(10).text("123 Business Street, Industrial Area");
    doc.text("City, State, ZIP");
    doc.text("Phone: +91-9876543210 | Email: support@yourcompany.com");
    doc.moveDown(2);

    // --------------------
    // Invoice Header
    // --------------------
    doc.fontSize(16).text("INVOICE", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(12)
      .text(`Invoice #: ${sale.order_code}`, { align: "left" })
      .text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`, { align: "left" })
      .moveDown(1);

    // --------------------
    // Customer Info
    // --------------------
    doc.fontSize(12).text("Bill To:", { underline: true });
    doc.text(`${sale.Customer?.name}`);
    doc.text(`${sale.Customer?.phone}`);
    doc.moveDown(1);

    // --------------------
    // Product/Items Table
    // --------------------
    const tableTop = 250;
    const itemCodeX = 50;
    const descX = 120;
    const qtyX = 300;
    const priceX = 370;
    const totalX = 450;

    doc.fontSize(12).text("Item", descX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);

    const y = tableTop + 25;
    doc.fontSize(10)
      .text(sale.Production?.productName || "Product", descX, y)
      .text(sale.quantity, qtyX, y)
      .text(sale.amount, priceX, y)
      .text(sale.total_amount, totalX, y);

    // --------------------
    // Totals
    // --------------------
    doc.moveDown(5);
    doc.fontSize(12).text(`Subtotal: ₹25600`, { align: "right" });
    doc.text(`GST (18%): ₹125`, { align: "right" });
    doc.text(`Grand Total: ₹125`, { align: "right", bold: true });

    // --------------------
    // Footer
    // --------------------
    doc.moveDown(3);
    doc.fontSize(10).text("Thank you for your business!", { align: "center" });
    doc.text("This is a system generated invoice.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
