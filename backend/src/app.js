import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error_middleware.js';

const app = express();

// ✅ Security
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Session (required for Google OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// ✅ Passport (Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/api', routes);

// ✅ Global Error Handler (must be last)
app.use(errorHandler);

export default app;