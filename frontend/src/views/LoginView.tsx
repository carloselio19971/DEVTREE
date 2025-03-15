import {Link} from 'react-router-dom'
export const LoginView = () => {
  return (
            <>
             <h1 className="text-4xl text-white font-bold">Iniciar Sesion</h1>
             <nav className='mt-10'>
                <Link 
                    className="text-center text-white text-lg block" 
                    to="/auth/register"
                    >¿No tiene cuenta? Crea una aqui</Link>
             </nav>
              
            </>

  )
}
