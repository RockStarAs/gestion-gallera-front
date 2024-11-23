<template>
    <div class="text-center pa-4">
        <v-dialog
            v-model="visible"
            persistent
            fullscreen
        >
            <v-card
                :title="titulo"
            >
                <v-container>
                    <v-row>
                        <!-- <v-col cols="12" md="8">
                            <v-text-field
                                :model-value="nombreGallo"
                                label="Gallo"
                                readonly
                            ></v-text-field>
                        </v-col> -->
                        <v-col cols="12" md="4">
                            <v-select
                                v-model="galloId"
                                label="Gallo"
                                :items="gallos"
                                :item-title="gallo => `${gallo.nro_placa} - ${gallo.nombre}`"
                                item-value="id_gallo"
                                :readonly="(!agregar && !modificar) || galloId != null"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaInicio"
                                label="Fecha de inicio"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="number"
                                v-model="cuido.peso"
                                label="Peso"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaPelea"
                                label="Fecha de pelea"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaTope1"
                                label="Fecha de Tope 1"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaTope2"
                                label="Fecha de Tope 2"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaTope3"
                                label="Fecha de Tope 3"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="cuido.fechaTope4"
                                label="Fecha de Tope 4"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-textarea
                                v-model="cuido.medicamento"
                                label="Medicamento"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-textarea>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="number"
                                v-model="cuido.calificacion"
                                label="Calificación"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-textarea
                                v-model="cuido.observacion"
                                label="Observación"
                                required
                                :readonly="(!agregar && !modificar)"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
                <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="visible = false" color="red" variant="tonal">
                    Cancelar
                </v-btn>

                <v-btn v-if="agregar" @click="registrarCuido" color="green" variant="tonal">Registrar</v-btn>
                <v-btn v-if="modificar" @click="modificarCuido" color="green" variant="tonal">Modificar</v-btn>
                </template>
            </v-card>
        <v-snackbar :text="mensaje.mensaje" v-model="mensaje.ver" :color="mensaje.color" :timeout="mensaje.timeout"></v-snackbar>
        </v-dialog>
  </div>
</template>

<script>
import { STATUS_CREATED, STATUS_OK, TIPO_HEMBRA, TIPO_MACHO, URL_SIN_FOTO } from '@/api/constans';
import { guardarCuidoAPI, modificarCuidoAPI } from '@/api/cuidoApi';
import { listarGallosAPI } from '@/api/gallosApi';

const cuidoInit = Object.freeze({
    nroPlaca : null,
    fechaInicio : null,
    peso : 0,
    fechaPelea : null,
    fechaTope1 : null,
    fechaTope2 : null,
    fechaTope3 : null,
    fechaTope4 : null,
    medicamento : "",
    calificacion : 0,
    observacion : ""
})

export default{
    name: 'ModalCuido',
    emits : ['listarData'],
    data(){
        return {
            visible : false,
            titulo : "",
            cuido : {...cuidoInit},
            mensaje : {
                ver : false,
                mensaje : "",
                timeout : 4000,
                color : 'blue'
            },
            nombreGallo : "",
            galloId : 0,
            agregar : false,
            modificar : false,
            idCuidado: null,
            gallos : []
        }
    },
    async mounted(){
        await this.buscarGallosxTipo();
    },
    methods:{
        async buscarGallosxTipo(){
            const peticionGallos = await listarGallosAPI();
            
            this.gallos = [];

            if(peticionGallos.status == STATUS_OK){
                this.gallos = peticionGallos.data;
            }
        },
        abrirModalAgregar(gallo){
            this.visible = true;
            this.agregar = true;
            this.modificar = false;
            this.titulo = "Registrando cuido";
            this.nombreGallo = `${gallo.placaNro} - ${gallo.nombre}`;
            this.galloId = gallo.id_gallo;
        },
        abrirModalModificar(gallo,cuido){
            this.visible = true;
            this.agregar = false;
            this.modificar = true;
            this.titulo = "Modificando cuido";
            this.nombreGallo = `${gallo.placaNro} - ${gallo.nombre}`;
            this.galloId = gallo.id_gallo;
            this.asignarValoresCuido(cuido);
        },
        abrirModalObservar(gallo,cuido){
            this.visible = true;
            this.agregar = false;
            this.modificar = false;
            this.titulo = "Observando cuido";
            this.nombreGallo = `${gallo.placaNro} - ${gallo.nombre}`;
            this.galloId = gallo.id_gallo;
            this.asignarValoresCuido(cuido);
        },
        asignarValoresCuido(cuido){
            this.idCuidado = cuido.id_cuidado;
            this.galloId = cuido.id_gallo;
            this.cuido.fechaInicio = cuido.fecha_inicio;
            this.cuido.peso = cuido.peso;
            this.cuido.fechaPelea = cuido.fecha_pelea;
            this.cuido.fechaTope1 = cuido.fecha_tope_uno;
            this.cuido.fechaTope2 = cuido.fecha_tope_dos;
            this.cuido.fechaTope3 = cuido.fecha_tope_tres;
            this.cuido.fechaTope4 = cuido.fecha_tope_cuatro;
            this.cuido.medicamento = cuido.medicamento;
            this.cuido.calificacion = cuido.calificacion;
            this.cuido.observacion = cuido.observacion;
            // this.cuido.me = cuido.marca_baja;
        },
        async registrarCuido(){
            // this.agregar =
            let hayError = this.validaciones();
            if(hayError){ return;}

            const resp = await guardarCuidoAPI({...this.cuido,id_gallo : this.galloId});
            if(resp.status == STATUS_CREATED){
                this.visible = false;
                this.$emit("listarData");
            }
        },
        async modificarCuido(){
            let hayError = this.validaciones();
            if(hayError){ return;}

            const resp = await modificarCuidoAPI({...this.cuido},this.galloId);
            if(resp.status == STATUS_OK){
                this.visible = false;
                this.$emit("listarData");
            }
        },
        validaciones(){
            let hayError = false;
            let mensajeError = "";
            // nroPlaca
            if(this.cuido.fechaInicio == null){
                hayError = true;
                mensajeError = "La fecha de inicio no debe de ser nula";
            }
            if(this.cuido.peso < 0){
                hayError = true;
                mensajeError = "El peso no debe ser 0"
            }
            if(this.cuido.fechaPelea == null){
                hayError = true; 
                mensajeError = "La fecha de pelea no debe de ser nula";
            }
            if(hayError){
                this.verMensajeInfo(mensajeError,"red");
            }
            return hayError;
        },
        reiniciarMensaje(){
            this.mensaje.mensaje = "";
            this.mensaje.ver = false;
        },
        verMensajeInfo(mensaje,color ){
            this.mensaje.mensaje = mensaje;
            this.mensaje.ver = true;
            this.mensaje.color = color;
        },
    }
}
</script>