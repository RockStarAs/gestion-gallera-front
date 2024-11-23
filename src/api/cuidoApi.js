import axios from "axios"
import { URL } from "./constans";

const ENDPOINT = URL + "api/cuido";

export const guardarCuidoAPI = async(cuido)=>{
    const peticion = await axios.post(`${ENDPOINT}/guardar`,cuido);
    return peticion;
}

export const listarCuidosGalloAPI = async(idGallo)=>{
    const peticion = await axios.get(`${ENDPOINT}/listarcuidos/${idGallo}`);
    return peticion;
}

export const modificarCuidoAPI = async(cuido,codCuido) =>{
    const peticion = await axios.patch(`${ENDPOINT}/modificar/${codCuido}`,cuido);
    return peticion;
}

export const eliminarCuidoAPI = async(codCuido) =>{
    const peticion = await axios.delete(`${ENDPOINT}/eliminar/${codCuido}`);
    return peticion;
}

export const listarAllCuidos = async()=>{
    const peticion = await axios.get(`${ENDPOINT}/listarallcuidos`);
    return peticion;
}