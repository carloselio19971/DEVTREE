import type { Request, Response , NextFunction } from "express"
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/User";

//Forma de Comunicar un middleware
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export const authenticate = async (req:Request, res:Response , next:NextFunction) => {
             const bearer=req.headers.authorization;
             //Valida que le envien un header de autorizacion
             if(!bearer){
                 const error=new Error("No AUtorizado")
                 res.status(401).json({error:error.message});
                 return;
             }
             const [ , token]=bearer.split(' ');
             //Valida que el token no este vacio
            if(!token){
                 const error=new Error("No Autorizado");
                 res.status(401).json({error:error.message});
            }
            //Valida que el token sea valido
            try {
                 const result=jwt.verify(token,process.env.JWT_SECRET)
                    if(typeof result === 'object' && result.id){
                         const user = (await User.findById(result.id).select('-password'));
                         if(!user){
                             const error=new Error("El Usuario no Existe");
                             res.status(404).json({error:error.message});
                         }
                         req.user=user;
                        next();
                    }
                
            } catch (error) {
                 res.status(500).json({error:'Token no Valido'})
            }    
}