import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
const app = express();
app.use(async (req, res, next) => {
    try {
        const fs = await import('fs/promises');
        const log = `${new Date().toISOString()} - ${req.method} ${req.url} - Base: ${req.baseUrl} - Path: ${req.path}\n`;
        await fs.appendFile('request.log', log);
    }
    catch (e) { }
    next();
});
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    /^https?:\/\/([a-z0-9-]+\.)*learnwithandi\.com$/
];
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        for (const allowed of allowedOrigins) {
            if (typeof allowed === 'string' && origin === allowed) {
                return callback(null, true);
            }
            else if (allowed instanceof RegExp && allowed.test(origin)) {
                return callback(null, true);
            }
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static('public/uploads'));
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/jobs', jobRoutes);
// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 Catch-All
app.use('*', (req, res) => {
    console.log(`404_DEBUG: ${req.method} ${req.url} - Base: ${req.baseUrl} - Path: ${req.path}`);
    res.status(404).json({
        error: {
            message: 'Looks like this endpoint ghosted you! 👻 (404 Not Found)',
            status: 404
        }
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: {
            message,
            status,
            details: process.env.NODE_ENV === 'development' ? err.details : undefined
        }
    });
});
export default app;
//# sourceMappingURL=app.js.map