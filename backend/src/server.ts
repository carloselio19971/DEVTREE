import  express from 'express'; 
import cors from 'cors';
import  'dotenv/config';
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
connectDB();
//An instance of Express
const app=express();

app.use(cors(corsConfig))

//Leer datos del formulario
app.use(express.json());
//Routing
app.use('/',router)
app.use('/ecommerce',router)


export default app