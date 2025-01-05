import { NextFunction, Request, Response } from 'express';
import uploadFileService from '../services/uploadFileService';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;
  const file = req.file as Express.Multer.File;
  try {
    const fileName = await uploadFileService.uploadFile({ file }, translations);
    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.upload,
        entity: translations.entities.file,
      }),
      fileName,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const translations = req.locals.languageTranslations;

  try {
    const { filename } = req.params;
    await uploadFileService.deleteFile(filename);
    res.status(HTTP_STATUS.OK).json({
      message: formatMessage(translations.status.success, {
        action: translations.actions.delete,
        entity: translations.entities.file,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getFileUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    const fileUrl = await uploadFileService.getFileUrl(filename);
    res.status(HTTP_STATUS.OK).json({ fileUrl });
  } catch (error) {
    next(error);
  }
};
