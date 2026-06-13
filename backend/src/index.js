import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { generateRouter } from './routes/generate.js';
import { artifactsRouter } from './routes/artifacts.js';
import { healthRouter } from './routes/health.js';

const app = express();
app.set('trust proxy', 1); // Required for Render reverse proxy
const PORT = process.env.PORT || 3001;

// Security & middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));

// CORS — allow frontend origin
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/health', healthRouter);
app.use('/api/generate', generateRouter);
app.use('/api/artifacts', artifactsRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SN Toolkit API running on port ${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV}`);
  console.log(`   CORS: ${allowedOrigins.join(', ')}`);
});
