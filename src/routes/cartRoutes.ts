import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate';
import { createCartSchemas } from '../schemas/cartSchemas';
import {
  clearCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from '../controllers/cartController';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  const { addCartItemSchema, updateCartItemSchema } = createCartSchemas(
    req.headers['accept-language']?.split(',')[0] || 'en'
  );
  router.get('/products/', getCart);
  router.post('/products/', validate(addCartItemSchema), addCartItem);
  router.patch(
    '/products/:productId',
    validate(updateCartItemSchema),
    updateCartItem
  );
  router.delete('/products/:productId', deleteCartItem);
  router.delete('/products/', clearCart);
  next();
});

export default router;
