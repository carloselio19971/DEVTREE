import { authenticate } from './middleware/auth';
import { Router } from "express";
import { createAccount, getUser, login, updateProfile } from "./handlers";
import { body } from "express-validator";
import { handelInputError } from "./middleware/validation";



const router = Router();

/* Autenticacion y Registro*/
router.post('/auth/register',
        body('handle')
                .notEmpty()
                .withMessage("El handle no puede ir vacio"),
        body('name')
                .notEmpty()
                .withMessage("El Nombre no puede ir vacio"),
        body('email')
                .isEmail()
                .withMessage("E-mail no valido"),
        body('password')
                .isLength({ min: 8 })
                .withMessage("El password es muy corto minimo 8 caracteres"),
        handelInputError,
        createAccount);

router.post('/auth/login',
        body('email')
                .isEmail()
                .withMessage("E-mail no valido"),
        body('password')
                .notEmpty()
                .withMessage("El password es Obligatorio"),
        handelInputError,
        login);

router.get('/user', authenticate, getUser)
router.patch('/user',
        body('handle')
                .notEmpty()
                .withMessage("El handle no puede ir vacio"),
        body('description')
                .notEmpty()
                .withMessage("La Descripcion no puede ir vacio"),
        handelInputError,
        authenticate,
        updateProfile)
export default router;