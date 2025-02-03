import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import {connectDB} from './config/database.js';
import faqRoutes from './routes/faq.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src/public'));

// Routes
app.use('/api/faqs', faqRoutes);

// Admin route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname,'public','admin','index.html'));
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});