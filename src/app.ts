import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import languageMiddleware from './middlewares/languageMiddleware';
import path from 'path';
import { storageConfig } from './config/storageConfig';

import { Err } from './types/err';
import HTTP_STATUS from './utils/httpStatus';

import rateLimit from 'express-rate-limit';
import { authenticate } from './middlewares/authMiddleware';
import logger from './utils/logger';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const app = express();

app.use(limiter);
app.use(express.json());
app.use(languageMiddleware);

if (storageConfig.type === 'local') {
  app.use(
    '/' + storageConfig.local.localEntryURL,
    express.static(path.join(__dirname, '../', storageConfig.local.uploadDir))
  );
}
app.use('/files', fileRoutes);
app.use('/auth', authRoutes);

const authenticatedRoutes = [
  { path: '/categories', route: categoryRoutes },
  { path: '/products', route: productRoutes },
  { path: '/favorites', route: favoriteRoutes },
  { path: '/cart', route: cartRoutes },
  { path: '/orders', route: orderRoutes },
];

authenticatedRoutes.forEach(({ path, route }) => {
  app.use(path, authenticate, route);
});

app.use(
  (error: Err | any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(error);

    const translations = req.locals?.languageTranslations;
    res.status(error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message || translations.error.serverError,
    });
  }
);
export default app;
