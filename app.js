import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import invoiceRoutes from './routes/invoice.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files like PDFs
app.use(express.static(path.join(__dirname, 'invoices')));

// MongoDB Atlas connection string
const mongoURI = "mongodb+srv://admin:admin@cluster1.3xukv.mongodb.net/invoicedb";
mongoose.connect(mongoURI, {
   
})
.then(() => console.log('MongoDB connected to Atlas successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/invoices', invoiceRoutes);

// Serve the HTML form with EJS
app.get('/', (req, res) => {
    res.render('index');
});

// Route for file download
app.get('/download/:id', (req, res) => {
    const fileId = req.params.id;
    const filePath = path.join(__dirname, 'invoices', `${fileId}.pdf`);

    // Log the file path for debugging
    console.log(`Attempting to download file from: ${filePath}`);

    res.download(filePath, (err) => {
        if (err) {
            console.error('File download error:', err.message);
            res.status(500).send('File download failed.');
        }
    });
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
