import { validationResult } from 'express-validator';
import  type { Request, Response } from "express";
import slug from 'slug';
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const createAccount = async (req:Request,res:Response) : Promise<void> =>{

    //Manejar Errores
    let errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()})
        return;
    }

    const {email , password } = req.body;
    
    const userExists = await User.findOne({email})

    if(userExists){
        const error=new Error("El Usuario ya esta registrado");
        res.status(409).json({error:error.message})
        return;
    }

    const handle=slug(req.body.handle,'');
    const handleExist=await User.findOne({handle});

    if(handleExist){
        const error=new Error("Nombre de Usuario No Disponible");
        res.status(409).json({error:error.message})
        return;
    }



    const user=new User(req.body);
    user.password= await hashPassword(password);
    user.handle=handle;
    await user.save();

    res.status(201).json({msg:"Registro Creado Correctamente"});
    
}

export const login = async (req:Request, res:Response): Promise<void> =>{


    
    const {email,password}=req.body;
    const user= await User.findOne({email})
    //Validar que el Usuario este registrado
    if(!user){
        const error=new Error("El Usuario no Existe");
        res.status(404).json({error:error.message})
        return;
    }
    //Comprobar el password
    const isPasswordCorrect=  await checkPassword(password, user.password)
    if(!isPasswordCorrect){
        const error=new Error("Password Incorrecta");
        res.status(401).json({error:error.message});
        return;
    }

    res.status(200).json({ message: "Login exitoso" });
    return;
    
}	
