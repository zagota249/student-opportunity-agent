const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const cluster = require('cluster');
const os = require('os');

dotenv.config();

// Cluster mode for multi-core support (production)
const numCPUs = os.cpus().length;
const isProduction = process.env.NODE_ENV === 'production';

// In production, use cluster mode for scalability
if (isProduction && cluster.isPrimary) {
    console.log(`[CLUSTER] Primary ${process.pid} is running`);
    console.log(`[CLUSTER] Forking ${numCPUs} workers for ${numCPUs} CPUs`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[CLUSTER] Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Worker process or development mode
    const app = express();

    const { generalLimiter, rateLimitInfo } = require('./middleware/rateLimiter');

    // MIDDLEWARES for scalability
    app.use(compression()); // Gzip compression for faster responses
    app.use(express.json({ limit: '10mb' }));
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimitInfo);
    app.use('/api', generalLimiter);

    // TEST ROUTES
    app.get('/api/test', (req, res) => {
        res.json({ message: "congrats! your backend server is working fine" });
    });

    // Health check endpoint for load balancers
    app.get('/api/health', async (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
            }
        });
    });

    const internshipRoutes = require("./routes/internshiproute");
    app.use('/api/internships', internshipRoutes);

    const agentRoutes = require('./routes/agentroute');
    app.use('/api/agent', agentRoutes);

    // Job Search Routes (Live job fetching)
    const jobRoutes = require('./routes/jobRoutes');
    app.use('/api/jobs', jobRoutes);

    // Body test route
    app.post('/api/test-body', (req, res) => {
        console.log('Test body received:', req.body);
        res.json({
            message: 'Body received successfully!',
            data: req.body
        });
    });

    // AUTH ROUTES
    const authRoutes = require('./routes/authroutes');
    app.use('/api/auth', authRoutes);

    // DATABASE CONNECTION
    const connectDB = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    };
    connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
        console.log(`${signal} received, shutting down...`);

        server.close(async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB closed. Exiting.');
                process.exit(0);
            } catch (error) {
                console.error('Shutdown error:', error);
                process.exit(1);
            }
        });

        setTimeout(() => {
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
