import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate';
import { createCategorySchemas } from '../schemas/categorySchemas';
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController';

const router = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  const { addCategorySchema, updateCategorySchema } = createCategorySchemas(
    req.headers['accept-language']?.split(',')[0] || 'en'
  );
  router.get('/', getCategories);
  router.get('/:id', getCategory);
  router.post('/', validate(addCategorySchema), addCategory);
  router.patch('/:id', validate(updateCategorySchema), updateCategory);
  router.delete('/:id', deleteCategory);

  next();
});

export default router;
