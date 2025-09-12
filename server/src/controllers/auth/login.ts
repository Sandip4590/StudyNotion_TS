import type { Request, Response } from 'express';
import type { IUser } from '@/models/User';
import User from '@/models/User';
import config from '@/config';
import { logger } from '@/lib/winston';
import Token from '@/models/Token';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import bcrypt from 'bcrypt';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserData;

    const user = await User.findOne({ email })
      .select('email password')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User Not found',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        code: 'Unauthorized',
        message: 'Invalid  Password',
      });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info({
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(201).json({
      user: user,
      accessToken,
    });
    logger.info('User Logged In SuccessFully', user);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      Message: 'Internal Server Error',
      error: err,
    });

    logger.warn('Error during user Login Process ', err);
  }
};

export default login;
