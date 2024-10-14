<template>
    <v-container>
        <h1>Camadas de gallo: {{ gallo.placaNro }} - {{ gallo.nombre }}</h1>

        <v-row>
            <v-col cols="12" md="12">
                <v-btn @click="abriModalCamada" color="blue">Registrar nueva camada</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <v-data-table
                    :headers="headers"
                    :items="camadas"
                >
                <template v-slot:item.actions="{ item }">
                        <v-btn
                            class="ma-1" density="compact" 
                            @click="()=>{editarCamada(item)}"
                            v-tooltip:bottom="'Editar camada'"
                            icon="mdi-pencil-circle"
                            color="yellow" 
                        />
                        <v-btn
                            class="ma-1" density="compact" 
                            @click="()=>{verCamada(item)}"
                            v-tooltip:bottom="'Ver camada'"
                            icon="mdi-eye-outline"
                            color="blue" 
                        />
                        <v-btn
                            class="ma-1" density="compact" 
                            @click="()=>{eliminarCamada(item)}"
                            v-tooltip:bottom="'Eliminar camada'"
                            icon="mdi-trash-can"
                            color="red" 
                        />
                    <!-- <v-btn @click="()=>{editarCamada(item)}">✏️</v-btn>
                    <v-btn @click="()=>{verCamada(item)}">🔎</v-btn>
                    <v-btn @click="()=>{eliminarCamada(item)}">🗑️</v-btn> -->
                </template>
                </v-data-table>
            </v-col>
        </v-row>
        <ModalCamada ref="modalCamada" @list-data="listarData"></ModalCamada>
    </v-container>
    <div class="text-center pa-4">
        <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
        <v-card
            text="¿Estás seguro que deseas eliminar?"
            title="Eliminar registro"
        >
            <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="()=>{dialog = false; idGalloxEliminar = null}" color="green">
                    Mantener
                </v-btn>

                <v-btn @click="eliminarRegistroCamada" color="red">
                    Eliminar
                </v-btn>
            </template>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { listarCamadasGalloAPI,eliminarRegistroCamadaAPI } from '@/api/camadasApi';
import { STATUS_OK, URL_SIN_FOTO } from '@/api/constans';
import { buscarGalloAPI } from '@/api/gallosApi';
import ModalCamada from '@/components/ModalCamada.vue';


const datosIniciales = Object.freeze({
    fechaNacimiento : null,
    nombre : "",
    placaNro : "",
    color : "",
    tipoCresta : "",
    sexo : null,
    tipoAve : null,
    codGalloPadre : null,
    codGalloMadre : null,
    observacion : "",
    rutaFoto: URL_SIN_FOTO,
    rutaFotoPre : URL_SIN_FOTO,
    imagen_obj : null,
    id_gallo : null,
});

const headers = [
  { key: 'gallo_padre', title: 'Gallo' },
  { key: 'gallo_madre', title: 'Gallina' },
  { key: 'fecha_nacimiento', title: 'Fecha nacimiento' },
  { key: 'cantidad_pollos_machos', title: 'N° pollos machos' },
  { key: 'cantidad_pollos_hembras', title: 'N° pollos hembra' },
  { key: 'actions', title: 'Acciones' },
];


export default {
    name : 'CamadasVista',
    components : {
        ModalCamada
    },
    async mounted(){
        this.limpiarFormulario();
        if(this.galloId){
            await this.buscarRegistroGallo(this.galloId);
            await this.listarData();
        }
    },
    computed : {
        galloId(){
            return this.$route.params.id_gallo || null;
        },
    },
    data(){
        return {
            gallo : { ...datosIniciales },
            camadas : [],
            headers,
            dialog : false,
            idCamadaxEliminar : null
        }
    },
    methods:{
        abriModalCamada(){
            this.$refs.modalCamada.abrirModalAgregar(this.gallo);
        },
        async buscarRegistroGallo(idGallo){
            const peticion = await buscarGalloAPI(idGallo);

            if(peticion.status == STATUS_OK){
                this.asignarDatos(peticion.data);
            }
        },
        editarCamada(camada){
            this.$refs.modalCamada.abrirModalEditar(this.gallo,camada.id_camada);
        },
        limpiarFormulario(){
            this.gallo.fechaNacimiento = null;
            this.gallo.nombre = "";
            this.gallo.placaNro = "";
            this.gallo.color = "";
            this.gallo.tipoCresta = "";
            this.gallo.sexo = null;
            this.gallo.tipoAve = null;
            this.gallo.codGalloPadre = null;
            this.gallo.codGalloMadre = null;
            this.gallo.observacion = "";
            this.gallo.rutaFoto = URL_SIN_FOTO;
            this.gallo.rutaFotoPre = URL_SIN_FOTO;
            this.gallo.imagen_obj = null;
            this.id_gallo = null;
        },
        asignarDatos(gallo){
            this.gallo.fechaNacimiento = gallo.fecha_nacimiento;
            this.gallo.nombre = gallo.nombre;
            this.gallo.placaNro = gallo.nro_placa;
            this.gallo.color = gallo.color;
            this.gallo.tipoCresta = gallo.tipo_cresta;
            this.gallo.sexo = String(gallo.sexo);
            this.gallo.tipoAve = String(gallo.tipo_ave);
            this.gallo.codGalloPadre = Number(gallo.id_gallo_padre);
            this.gallo.codGalloMadre = Number(gallo.id_gallo_madre);
            this.gallo.observacion = gallo.observacion;
            this.gallo.rutaFoto = gallo.ruta_foto;
            this.gallo.rutaFotoPre = gallo.ruta_foto;
            this.gallo.imagen_obj = null;
            this.gallo.id_gallo = gallo.id_gallo;
        },
        verCamada(camada){
            this.$refs.modalCamada.abrirModalVer(this.gallo,camada.id_camada);
        },
        eliminarCamada(camada){
            this.dialog = true;
            this.idCamadaxEliminar = camada.id_camada;
        },
        async eliminarRegistroCamada(){
            const resp = await eliminarRegistroCamadaAPI(this.idCamadaxEliminar);
            if(resp.status == STATUS_OK){
                await this.listarData();
            }
            this.dialog = false;
        },
        async listarData(){
            const resp = await listarCamadasGalloAPI(this.gallo.id_gallo);
            if(resp.status == STATUS_OK){
                this.camadas = resp.data;
                console.log(this.camadas);
            }else{
                this.camadas = [];
            }
        }
    }
}
</script>