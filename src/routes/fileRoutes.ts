import { Router } from 'express';
import uploadMiddleware from '../middlewares/fileUploadMiddleware';
import {
  uploadFile,
  deleteFile,
  getFileUrl,
} from '../controllers/fileController';

const router = Router();

router.post('/upload', uploadMiddleware, uploadFile);
router.delete('/delete/:filename', deleteFile);
router.get('/get-url/:filename', getFileUrl);

export default router;
