import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate';
import { createFavoriteSchemas } from '../schemas/favoriteSchemas';
import {
  addFavorite,
  deleteFavorite,
  getFavorite,
  getFavorites,
} from '../controllers/favoriteController';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  const { addFavoriteSchema } = createFavoriteSchemas(
    req.headers['accept-language']?.split(',')[0] || 'en'
  );
  router.get('/', getFavorites);
  router.get('/:productId', getFavorite);
  router.post('/', validate(addFavoriteSchema), addFavorite);
  router.delete('/:productId', deleteFavorite);

  next();
});

export default router;
