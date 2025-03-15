import colors from 'colors';
import server from './server';

const port = process.env.PORT || "4000";

//Crear el Servidor
server.listen(port, ()=>{
    console.log(colors.blue.bold.italic(`Servidor Funcionando en el ${port}`));
})

