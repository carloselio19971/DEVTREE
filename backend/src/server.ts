import  express from 'express'; 
import  'dotenv/config';
import router from './router';
import { connectDB } from './config/db';

//An instance of Express
const app=express();
connectDB();
//Leer datos del formulario
app.use(express.json());
//Routing
app.use('/',router)
app.use('/ecommerce',router)


export default app