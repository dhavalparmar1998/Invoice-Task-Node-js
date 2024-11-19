// models/Invoice.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: String,
    rate: Number,
    quantity: Number,
    amount: Number,
});

const InvoiceSchema = new Schema({
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    products: [ProductSchema],
    totalAmount: Number,
    amountInWords: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', InvoiceSchema);
