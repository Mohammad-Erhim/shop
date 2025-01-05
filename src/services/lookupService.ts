import { Lookup } from '../models/associations';
import LookupType from '../models/lookupType';
import { LanguageTranslations } from '../types/languageTranslations';
import { LookupTypeEnum } from '../types/lookup';
import HTTP_STATUS from '../utils/httpStatus';
import { formatMessage } from '../utils/stringUtils';

export const isAdjustmentType = async (
  id: number,
  translations: LanguageTranslations
) => {
  const adjustmentType = await Lookup.findOne({
    where: { id },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.ADJUSTMENT_TYPE },
    },
  });

  if (!adjustmentType) {
    throw {
      status: HTTP_STATUS.BAD_REQUEST,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.adjustmentType,
      }),
    };
  }

  return adjustmentType;
};
