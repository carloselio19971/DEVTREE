import { Router } from "express";
import { createAccount, login } from "./handlers";
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
            .isLength({min:8})
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

export default router;