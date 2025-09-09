import { Router } from 'express';
const router = Router();

/**
 * controllers
 */
import register from "@/controllers/auth/registration";
/*
 * middlerwares
 */
import { userValidationRules } from '@/middleware/validator/userValidator';
import { validate } from '@/middleware/validator/validate';

/**
 * routes
 * 
 */
router.post('/register' , userValidationRules.createUser , validate ,register)
export default router;
