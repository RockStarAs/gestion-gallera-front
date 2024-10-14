import axios from "axios"
import { URL } from "./constans";

const ENDPOINT = URL + "api/parametros";

export const listarParametros = async(flag = 0, numero = 0, dato = 0)=>{
    const params = {
        flag,
        numero
    };
    if(dato != 0 || dato !== null){ params.dato = dato}

    const peticion = await axios.get(`${ENDPOINT}/buscar`,{ params });
    return peticion;
}