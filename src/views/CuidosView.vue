<template>
    <v-container>
        <h1>Cuidos del gallo Placa N° {{ gallo.placaNro }} - {{ gallo.nombre }}</h1>
        <v-row>
            <v-col cols="12" md="12">
                <v-btn @click="abriModalCuido" color="blue">Registrar nueva cuido</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <v-data-table
                    :headers="headers"
                    :items="cuidos"
                >
                <template v-slot:item.actions="{ item }">
                    <v-btn
                        class="ma-1" density="compact" 
                        @click="()=>{abrirModalCuidoModificar(item)}"
                        v-tooltip:bottom="'Editar cuido'"
                        icon="mdi-pencil-circle"
                        color="yellow" 
                    />
                    <v-btn
                        class="ma-1" density="compact" 
                        @click="()=>{abrirModalObservarCuido(item)}"
                        v-tooltip:bottom="'Ver cuido'"
                        icon="mdi-eye-outline"
                        color="blue" 
                    />
                    <v-btn
                        class="ma-1" density="compact" 
                        @click="()=>{idCuidoxEliminar = item.id_cuidado; dialog = true;}"
                        v-tooltip:bottom="'Eliminar cuido'"
                        icon="mdi-trash-can"
                        color="red" 
                    />
                    <!-- <v-btn @click="()=>{abrirModalCuidoModificar(item)}">✏️</v-btn>
                    <v-btn @click="()=>{abrirModalObservarCuido(item)}">🔎</v-btn>
                    <v-btn @click="()=>{ idCuidoxEliminar = item.id_cuidado; dialog = true;}">🗑️</v-btn> -->
                </template>
                </v-data-table>
            </v-col>
        </v-row>
        <ModalCuidado ref="modalCuidado" @listar-data="listarDatos"></ModalCuidado>
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

                <v-btn @click="()=>{dialog = false; idCuidoxEliminar = null}" color="green">
                    Mantener
                </v-btn>

                <v-btn @click="eliminarRegistroCuido" color="red">
                    Eliminar
                </v-btn>
            </template>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { STATUS_OK, URL_SIN_FOTO } from '@/api/constans';
import { eliminarCuidoAPI, listarCuidosGalloAPI } from '@/api/cuidoApi';
import { buscarGalloAPI } from '@/api/gallosApi';
import ModalCuidado from '@/components/ModalCuidado.vue';
// listarCuidosGalloAPI

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
    // {key : 'id_cuidado' , title : 'id_cuidado'},
    // {key : 'id_gallo' , title : 'id_gallo'},
    {key : 'fecha_inicio' , title : 'Fecha inicio'},
    {key : 'peso' , title : 'Peso'},
    {key : 'fecha_pelea' , title : 'Fecha pelea'},
    {key : 'fecha_tope_uno' , title : 'Fecha tope 1'},
    {key : 'fecha_tope_dos' , title : 'Fecha tope 2'},
    {key : 'fecha_tope_tres' , title : 'Fecha tope 3'},
    {key : 'fecha_tope_cuatro' , title : 'Fecha tope 4'},
    {key : 'medicamento' , title : 'Medicamento'},
    {key : 'calificacion' , title : 'Calificación'},
    {key : 'actions', title : 'Acciones'}
    // {key : 'observacion' , title : 'observacion'},
    // {key : 'marca_baja' , title : 'marca_baja'}
];


export default{
    components : {
        ModalCuidado
    },
    data(){
        return{
            gallo : {...datosIniciales},
            cuidos : [],
            headers : headers,
            dialog: false,
            idCuidoxEliminar : null
        }
    },
    computed : {
        galloId(){
            return this.$route.params.id_gallo || null;
        },
    },
    async mounted(){
        await this.buscarRegistroGallo(this.galloId);
        await this.listarDatos();
    },
    methods : {
        async buscarRegistroGallo(idGallo){
            const peticion = await buscarGalloAPI(idGallo);

            if(peticion.status == STATUS_OK){
                this.asignarDatos(peticion.data);
            }
        },
        async listarDatos(){
            const peticion = await listarCuidosGalloAPI(this.gallo.id_gallo);
            
            if(peticion.status == STATUS_OK){
                // this.asignarDatos(peticion.data)
                console.log(peticion.data);
                this.cuidos = peticion.data;
            }
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
        abriModalCuido(){
            // modalCuidado
            this.$refs.modalCuidado.abrirModalAgregar(this.gallo);
        },
        abrirModalCuidoModificar(cuido){
            this.$refs.modalCuidado.abrirModalModificar(this.gallo,{...cuido});
        },
        abrirModalObservarCuido(cuido){
            this.$refs.modalCuidado.abrirModalObservar(this.gallo,{...cuido});
        },
        async eliminarRegistroCuido(){
            const resp = await eliminarCuidoAPI(this.idCuidoxEliminar);
            if(resp.status == STATUS_OK){
                await this.listarDatos();
                this.dialog = false;
            }
        }
    }
}
</script>