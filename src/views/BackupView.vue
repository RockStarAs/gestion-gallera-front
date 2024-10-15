<template>
    <v-container>
        <h2>Generar backup</h2>
        <v-row>
            <v-col cols="12" md="12">
                <v-btn @click="descargarBackup" color="success">Generar nuevo backup</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <v-file-input v-model="file" label="File input"></v-file-input>
                <v-btn v-if="!!file" @click="restaurarBackup" color="success">Restaurar un backup</v-btn>
            </v-col>
        </v-row>
        <v-snackbar :text="mensaje.mensaje" v-model="mensaje.ver" :color="mensaje.color" :timeout="mensaje.timeout"></v-snackbar>
    </v-container>
</template>
<script>
import { generarBackupAPI, restaurarBackupAPI } from '@/api/backupApi';
import { STATUS_OK } from '@/api/constans';

export default{
    data(){
        return {
            file : null,
            mensaje : {
                ver : false,
                mensaje : "",
                timeout : 4000,
                color : 'blue'
            },
        }
    },
    methods: {
        async descargarBackup(){
            // listarCamadasGalloAPI
            const peticion = await generarBackupAPI();
            if(peticion.status == STATUS_OK){
                const url = window.URL.createObjectURL(new Blob([peticion.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'backup.sql'); // El nombre del archivo que se descargará
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Eliminar el enlace temporal
            }
        },
        async restaurarBackup(){
            console.log(this.file);
            const pet = await restaurarBackupAPI(this.file);
            console.log(pet);
            if(pet.status == STATUS_OK){
                this.mensaje.color = "green";
                this.mensaje.mensaje = pet.data.message;
                this.mensaje.ver = true;
            }else{
                this.mensaje.color = "red";
                this.mensaje.mensaje = pet.data.message; 
                this.mensaje.ver = false;
            }
            this.file = null;
        }
    }
}
</script>