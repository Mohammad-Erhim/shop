import i18next from 'i18next';
import { ErrorMapCtx, z, ZodIssueOptionalMessage } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import arLocale from 'zod-i18n-map/locales/ar/zod.json';
import enLocale from 'zod-i18n-map/locales/en/zod.json';

export const initializeI18n = (lang: string) => {
  i18next.init({
    lng: lang,
    fallbackLng: 'en',
    resources: {
      en: { zod: enLocale },
      ar: { zod: arLocale },
    },
  });

  const customErrorMap = (
    issue: ZodIssueOptionalMessage,
    _ctx: ErrorMapCtx
  ) => {
    return zodI18nMap(issue, _ctx);
  };

  z.setErrorMap(customErrorMap);
};
