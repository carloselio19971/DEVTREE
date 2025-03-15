import { Request, Response, NextFunction } from 'express';
import {validationResult} from 'express-validator';

export const handelInputError= (req:Request, res:Response, next:NextFunction) =>{
    
    let error= validationResult(req);
    console.log("Desde Validation.ts")
    if(!error.isEmpty()){
        res.status(400).json({errors:error.array()})
        return;
    }    
    next();
}