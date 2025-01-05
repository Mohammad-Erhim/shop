import { NextFunction, Request, Response, Router } from 'express';
import { validate } from '../utils/validate';
import { createAuthSchemas } from '../schemas/authSchemas';
import { register, login, refreshToken } from '../controllers/authController';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const { registerSchema, loginSchema, refreshTokenSchema } = createAuthSchemas(
    req.headers['accept-language']?.split(',')[0] || 'en'
  );

  router.post('/register', validate(registerSchema), register);
  router.post('/login', validate(loginSchema), login);
  router.post('/refresh', validate(refreshTokenSchema), refreshToken);
  next();
});

export default router;
