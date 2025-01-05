import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Lookup from '../models/lookup';
import LookupType from '../models/lookupType';
import HTTP_STATUS from '../utils/httpStatus';
import { UserRole, LookupTypeEnum } from '../types/lookup';
import { formatMessage } from '../utils/stringUtils';
import { LanguageTranslations } from '../types/languageTranslations';
import { LoginPayload, RegisterPayload } from '../types/auth';

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY!;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET_KEY, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET_KEY, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

export const registerUser = async (
  { name, password, email }: RegisterPayload,
  translations: LanguageTranslations
) => {
  const hashedPassword = await hashPassword(password);

  const customerRole = await Lookup.findOne({
    where: { value: UserRole.CUSTOMER },
    include: {
      model: LookupType,
      where: { name: LookupTypeEnum.USER_ROLE },
    },
  });

  if (!customerRole) {
    throw {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: translations.error.serverError,
    };
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw {
      status: HTTP_STATUS.CONFLICT,
      message: translations.auth.userExists,
    };
  }

  const user = await User.create({
    name,
    password: hashedPassword,
    email,
    userTypeId: customerRole.id,
  });

  const userJSON = user.toJSON();
  const { password: _, ...userWithoutPassword } = userJSON;

  return userWithoutPassword;
};

export const loginUser = async (
  { email, password }: LoginPayload,
  translations: LanguageTranslations
) => {
  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password'] },
  });

  if (!user) {
    throw {
      status: HTTP_STATUS.NOT_FOUND,
      message: formatMessage(translations.status.notFound, {
        entity: translations.entities.user,
      }),
    };
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: translations.auth.invalidCredentials,
    };
  }

  return generateTokens(user.id);
};

export const refreshUserToken = (
  refreshToken: string,
  translations: LanguageTranslations
) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as {
      userId: number;
    };
    return generateTokens(decoded.userId);
  } catch {
    throw {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: translations.auth.invalidOrExpiredToken,
    };
  }
};
