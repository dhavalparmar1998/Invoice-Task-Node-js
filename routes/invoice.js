import express from 'express';
import Invoice from '../models/invoice.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import numberToWords from 'number-to-words';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now you can use __dirname as needed
console.log(__dirname);


const router = express.Router();

// Create an invoice and generate PDF
router.post('/create', async (req, res) => {
    const { customerName, mobileNumber, products } = req.body;

    // Calculate total amount
    const totalAmount = products.reduce((sum, product) => sum + product.amount, 0);
    const amountInWords = numberToWords.toWords(totalAmount);

    // Save invoice to the database
    const newInvoice = new Invoice({
        customerName,
        mobileNumber,
        products,
        totalAmount,
        amountInWords
    });

    try {
        console.log("Invoice data being saved:", newInvoice);

        // Save the invoice to the database
        const savedInvoice = await newInvoice.save();

        // Ensure the invoices directory exists
        const invoicesDir = path.join(__dirname, '../invoices'); // Absolute path
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir);
        }

        // Generate PDF
        const pdfPath = path.join(invoicesDir, `invoice_${savedInvoice._id}.pdf`); // Use absolute path
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));

        // Add Invoice Details to PDF
        doc.fontSize(20).text('Invoice', { align: 'center' });
        doc.fontSize(12).text(`Invoice ID: ${savedInvoice._id}`);
        doc.text(`Customer Name: ${customerName}`);
        doc.text(`Mobile Number: ${mobileNumber}`);

        doc.text('Products:', { underline: true });
        products.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.name} - ${product.quantity} x ${product.rate} = ${product.amount}`);
        });

        doc.text(`Total Amount: ${totalAmount}`, { bold: true });
        doc.text(`Amount in Words: ${amountInWords}`);

        // Finalize PDF file
        doc.end();

        // Respond with success and provide download link
        res.send({ message: 'Invoice created successfully', downloadUrl: `/download/${savedInvoice._id}` });

    } catch (err) {
        // Log and handle error in invoice creation
        console.error("Error creating invoice:", err);
        res.status(500).json({ message: 'Error creating invoice', error: err.message });
    }
});

export default router;
