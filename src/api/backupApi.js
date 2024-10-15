import axios from "axios"
import { URL } from "./constans";

const ENDPOINT = URL + "api/backups";

export const generarBackupAPI = async()=>{
    const peticion = await axios.get(`${ENDPOINT}/generar-backup`);
    return peticion;
}

export const restaurarBackupAPI = async(backupFile)=>{
    let formData = new FormData();
    formData.append('backup_file', backupFile);
    const peticion = await axios.post(`${ENDPOINT}/restaurar-backup`,formData,
        {headers: {
            'Content-Type': 'multipart/form-data',
        }},
    );
    return peticion;
}
