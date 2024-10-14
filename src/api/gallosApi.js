import axios from "axios"
import { URL } from "./constans";

const ENDPOINT = URL + "api/gallos";

export const listarGallosAPI = async()=>{
    const peticion = await axios.get(`${ENDPOINT}/listar`);
    return peticion;
}

export const buscarGalloAPI = async(idGallo)=>{
    const peticion = await axios.get(`${ENDPOINT}/buscar/${idGallo}`);
    return peticion;
}

export const buscarGalloxTipoAPI = async(idGallo)=>{
    const peticion = await axios.get(`${ENDPOINT}/buscarxtipo/${idGallo}`);
    return peticion;
}

export const guardarGalloAPI = async(gallo)=>{
    const formData = new FormData();

    // Recorrer todas las propiedades del objeto gallo y añadirlas a FormData
    for (const key in gallo) {
        if (gallo.hasOwnProperty(key)) {
            formData.append(key, gallo[key]);  // otros datos (texto, etc.)
        }
    }

    const peticion = await axios.post(`${ENDPOINT}/guardar`,gallo,{headers: { 'Content-Type': 'multipart/form-data',}});
    return peticion;
}

export const modificarGalloAPI = async(gallo,idGallo)=>{
    // Crear una instancia de FormData
    const formData = new FormData();

    // Recorrer todas las propiedades del objeto gallo y añadirlas a FormData
    for (const key in gallo) {
        if (gallo.hasOwnProperty(key)) {
            formData.append(key, gallo[key]);  // otros datos (texto, etc.)
        }
    }
    formData.append('id',idGallo);
    const peticion = await axios.post(`${ENDPOINT}/actualizar`,formData,{headers: { 'Content-Type': 'multipart/form-data',}});
    return peticion;
}

export const eliminarGalloAPI = async(idGallo)=>{
    const peticion = await axios.delete(`${ENDPOINT}/borrar/${idGallo}`);
    return peticion;
}


export const buscarGallosPadreAPI = async(idGallo)=>{
    const peticion = await axios.get(`${ENDPOINT}/buscarpadres/${idGallo}`);
    return peticion; 
}
