// middlewares/validators/userValidators.ts
import { body } from 'express-validator';

export const userValidationRules = {
    createUser: [
        body('firstName')
            .notEmpty()
            .withMessage('First name is required')
            .isLength({ max: 20 })
            .withMessage('First name must be less than 20 characters'),

        body('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .isLength({ max: 20 })
            .withMessage('Last name must be less than 20 characters'),

        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email must be valid')
            .isLength({ max: 50 })
            .withMessage('Email must be less than 50 characters'),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),

        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),

        body('contactNumber')
            .optional()
            .isMobilePhone('any')
            .withMessage('Invalid contact number'),

        body('accountType')
            .optional()
            .isIn(['Admin', 'Instructor', 'student'])
            .withMessage('Invalid account type'),

       
    ],
};
