const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ✅ MIDDLEWARES (order matters!)
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// ✅ TEST ROUTES
app.get('/api/test', (req, res) => {
    res.json({ message: "congrats! your backend server is working fine" });
});

// ✅ Body test route - yeh check karne ke liye ke Postman body bhej raha hai ya nahi
app.post('/api/test-body', (req, res) => {
    console.log('📦 Test body received:', req.body);
    res.json({ 
        message: 'Body received successfully!',
        data: req.body 
    });
});

// ✅ AUTH ROUTES
const authRoutes = require('./routes/authroutes');
app.use('/api/auth', authRoutes);

// ✅ DATABASE CONNECTION
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
});