import express from 'express';
import { CrearServidorWebSocket } from './src/Server.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const Puerto = process.env.PUERTO;
app.use(express.json());
const ServidorHTTP = await CrearServidorWebSocket(app);

ServidorHTTP.listen(Puerto,()=>{
    console.log(`Servidor escuchando en el puerto: ${Puerto}`);
});