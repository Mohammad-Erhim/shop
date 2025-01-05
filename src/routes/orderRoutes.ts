import { NextFunction, Request, Response, Router } from 'express';
import { cancelOrder, getOrders, order } from '../controllers/orderController';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  router.post('/', order);
  router.get('/', getOrders);
  router.patch('/:id/cancel', cancelOrder);
  next();
});

export default router;
