import { Link } from "react-router-dom"
import {useForm} from 'react-hook-form'
import type { RegisterFrom } from "../types"
import axios , {isAxiosError} from 'axios'
import { ErrorMessage } from "../components/ErrorMessage"


const initialValues  = {
    name:'',
    email:'',
    password:'',
    handle:'',
    password_confirmation:''
}



export const RegisterView = () => {
    const {register, watch, handleSubmit, reset, formState:{errors}}=useForm<RegisterFrom>({defaultValues:initialValues})

    const password= watch('password');

    const handleRegister =  async (formData:RegisterFrom) =>{
          try {
                const {data}  = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`,formData)
                console.log(data)
                reset();
          } catch (error) {
                if(isAxiosError(error) && error.response){
                  console.log(error.response?.data.error)
                }
          }
    }

  return (
    <>
       <h1 className="text-4xl text-white font-bold">Crear Cuenta</h1>
        <form  
              onSubmit={handleSubmit(handleRegister)}
              className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
            >
            <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
              <input
                  id="name"
                  type="text"
                  placeholder="Tu Nombre"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('name',{
                    required: 'El nombre es Obligatorio'
                  })}
              />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>
            <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
              <input
                  id="email"
                  type="email"
                  placeholder="Email de Registro"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('email',{
                    required: 'El Email  es Obligatorio',
                    pattern:{
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: 'El Email no es valido'
                    }
                    
                  })}
              />
                 {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>
            <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
              <input
                  id="handle"
                  type="text"
                  placeholder="Nombre de usuario: sin espacios"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('handle',{
                    required: 'El Handle es Obligatorio'
                  })}
              />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>
            <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
              <input
                  id="password"
                  type="password"
                  placeholder="Password de Registro"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('password',{
                    required: 'La contraseña es Obligatoria',
                    minLength:{
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres'
                    }
                  })}
              />
               {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 space-y-3">
              <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
              <input
                  id="password_confirmation"
                  type="password"
                  placeholder="Repetir Password"
                  className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                  {...register('password_confirmation',{
                    required: 'Repetir Passwor es Obligatorio',
                    validate: (value) => value === password || 'Los password no son iguales'
                  
                  })}
                  
              />
                  {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                  
            </div>

          <input
              type="submit"
              className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
              value='Crear Cuenta'
          />  
        </form>
       <nav className="mt-10">
          <Link 
              className="text-center text-white text-lg block" 
              to="/auth/login">
                ¿Ya tienes  una cuenta ? Inicia Sesion
          </Link>
        </nav>
    </>
    
    
  )
}
