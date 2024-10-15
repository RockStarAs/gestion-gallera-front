import axios from "axios"
import { URL } from "./constans";

const ENDPOINT = URL + "api/camadas";

export const listarCamadasGalloAPI = async(idCamada)=>{
    const peticion = await axios.get(`${ENDPOINT}/listarcamadas/${idCamada}`);
    return peticion;
}

export const listarCamadasAPI = async()=>{
    const peticion = await axios.get(`${ENDPOINT}/listarallcamadas`);
    return peticion;
}

export const guardarCamadaAPI = async(camada)=>{
    const peticion = await axios.post(`${ENDPOINT}/guardar`,camada);
    return peticion;
}

export const buscarCamadaAPI = async(idCamada)=>{
    const peticion = await axios.get(`${ENDPOINT}/buscar/${idCamada}`);
    return peticion;
}

export const modificarCamadaAPI = async(camada,codCamada) =>{
    const peticion = await axios.patch(`${ENDPOINT}/modificar/${codCamada}`,camada);
    return peticion;
}


export const eliminarRegistroCamadaAPI = async(codCamada) =>{
    const peticion = await axios.delete(`${ENDPOINT}/eliminar/${codCamada}`);
    return peticion;
}
