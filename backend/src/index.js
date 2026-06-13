import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { generateRouter } from './routes/generate.js';
import { artifactsRouter } from './routes/artifacts.js';
import { healthRouter } from './routes/health.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// Security & middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));

// ── CORS ──────────────────────────────────────────────────────
// Normalise a URL: lowercase, strip trailing slash
function normalise(url) {
  return url?.trim().toLowerCase().replace(/\/+$/, '') ?? '';
}

// Build allowed list from env — supports comma-separated values,
// strips trailing slashes, and always includes localhost for dev.
const rawFrontendUrl = process.env.FRONTEND_URL ?? '';
const envOrigins = rawFrontendUrl
  .split(',')
  .map(normalise)
  .filter(Boolean);

const allowedOrigins = new Set([
  ...envOrigins,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
]);

console.log('Allowed CORS origins:', [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser requests (curl, Render health checks, etc.)
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(normalise(origin))) return cb(null, true);
      console.warn(`CORS blocked: "${origin}" not in`, [...allowedOrigins]);
      cb(new Error(`CORS: origin "${origin}" not allowed`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// Explicitly handle pre-flight for all routes
app.options('*', cors());

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
});
