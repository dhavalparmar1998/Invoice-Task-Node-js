import mongoose from "mongoose";

async function dbconnect(){
    await mongoose.connect('mongodb+srv://admin:admin@cluster1.3xukv.mongodb.net/invoicedb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB connected');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });
}


export default dbconnect;