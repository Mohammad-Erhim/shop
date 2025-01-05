import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate';
import { createProductSchemas } from '../schemas/productSchemas';
import {
  addProduct,
  updateProduct,
  getProduct,
  getProducts,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  const { addProductSchema, updateProductSchema } = createProductSchemas(
    req.headers['accept-language']?.split(',')[0] || 'en'
  );
  router.get('/', getProducts);
  router.get('/:id', getProduct);
  router.post('/', validate(addProductSchema), addProduct);
  router.patch('/:id', validate(updateProductSchema), updateProduct);
  router.delete('/:id', validate(updateProductSchema), deleteProduct);

  next();
});

export default router;
