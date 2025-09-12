import { Router } from 'express';
const router = Router();

/**
 * controllers
 */
import register from '@/controllers/auth/registration';
import login from '@/controllers/auth/login';
/*
 * middlerwares
 */
import { userValidationRules } from '@/middleware/validator/userValidator';
import { validate } from '@/middleware/validator/validate';
import { body } from 'express-validator';

import { authValidationRules } from '@/middleware/validator/authValidation';

/**
 * routes
 *
 */
router.post('/register', userValidationRules.createUser, validate, register);
router.post(
    '/login',
   authValidationRules.loginUser,
    validate,
    login,
);
export default router;
