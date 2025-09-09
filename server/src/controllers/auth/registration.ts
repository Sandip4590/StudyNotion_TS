import type { Request, Response } from 'express';
import config from '@/config';
import { logger } from '@/lib/winston';
import User from '@/models/User';
import { IUser } from '@/models/User';
import { generateAccessToken } from '@/lib/jwt';
import { generateRefreshToken } from '@/lib/jwt';
import Token from '@/models/Token';

type UserData = Pick<
  IUser,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'accountType'
  | 'password'
  | 'confirmPassword'
>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, accountType, confirmPassword } =
    req.body as UserData;

  if (
    accountType === 'Admin' &&
    !config.WHITELIST_ADMINS_MAIL.includes(email)
  ) {
    res.status(403).json({
      code: 'AuthrizationError',
      message: 'You cannot Register as an Admin',
    });

    logger.warn(
      `User with ${email} tried to rigster as an admin but is not in the whitelist`,
    );
    return;
  }
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      accountType,
      confirmPassword,
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info({
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(201).json({
      user: newUser,
      accessToken,
    });
    logger.info('User Registered SuccessFully', newUser);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      Message: 'Internal Server Error',
      error: err,
    });

    logger.warn('Error during user registrations', err);
  }
};

export default register;
