import {  validationResult } from 'express-validator';
import {  type Request, type Response } from "express";
import slug from 'slug';
import {formidable} from 'formidable';
import {v4 as uuid} from 'uuid';
import cloudinary from '../config/cloudinary';

import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJTW } from '../utils/jwt';
import { request } from 'axios';

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

    const token=generateJTW({id:user._id});

    res.send(token);
    return;
    
}	

export const getUser = async ( req:Request, res:Response): Promise<void> => {
        
        res.json(req.user);
}


export const updateProfile = async(req:Request, res:Response):Promise<void> =>{
    try {
        const {description, links } = req.body
        const handle=slug(req.body.handle,'');
        const handleExist=await User.findOne({handle});
    
        if(handleExist &&  handleExist.email !==req.user.email){
            const error=new Error("Nombre de Usuario No Disponible");
            res.status(409).json({error:error.message})
            return;
        }
        //Actualizar el Usuario
        req.user.description=description
        req.user.handle=handle
        req.user.links=links

        await req.user.save();
        res.send('Perfil Actualizado Corectamente');

    } catch (e) {
        const error= new Error('Hubo un error');
         res.status(500).json({error:error.message});
         return
    }
}

export const updateImage = async(req:Request, res:Response):Promise<void> =>{

    const form = formidable({multiples:false})
   
    try {
        form.parse(req, (error, fields, files)=>{
           
            cloudinary.uploader.upload(files.file[0].filepath,{
                public_id:uuid()
            },async function(error, result) {
              if(error){
                const error= new Error('Hubo un error al subir la imagen');
                res.status(500).json({error:error.message});
                return
              }
              if(result){
                    req.user.image= result.secure_url;
                    await req.user.save();
                    
                    return res.json({image:result.secure_url});
              }
               
                    
            })
        })
        
    } catch (e) {
        const error= new Error('Hubo un error');
        res.status(500).json({error:error.message});
        return
    }
    
}