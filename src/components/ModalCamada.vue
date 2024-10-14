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
                        <v-col cols="12" md="4">
                            <v-select
                                v-model="camada.codMadre"
                                label="Gallina madre"
                                :items="gallinasMadre"
                                :item-title="gallo => `${gallo.nro_placa} - ${gallo.nombre}`"
                                item-value="id_gallo"
                                :disabled="bloqueoCodMadre"
                                :readonly="(!agregando && !editando)"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select
                                v-model="camada.codPadre"
                                label="Gallo padre"
                                :items="gallosPadre"
                                :item-title="gallo => `${gallo.nro_placa} - ${gallo.nombre}`"
                                item-value="id_gallo"
                                :disabled="bloqueoCodPadre"
                                :readonly="(!agregando && !editando)"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="date"
                                v-model="camada.fechaNacimiento"
                                label="Fecha de nacimiento de la camada"
                                required
                                :readonly="(!agregando && !editando)"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="number"
                                v-model="camada.cantPollosMacho"
                                label="N° pollos machos"
                                required
                                :readonly="(!agregando && !editando)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field
                                type="number"
                                v-model="camada.cantPollosHembra"
                                label="N° pollos hembras"
                                required
                                :readonly="(!agregando && !editando)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-textarea
                                v-model="camada.observacion" 
                                label="Observaciones"
                                :readonly="(!agregando && !editando)"
                            ></v-textarea>
                        </v-col>
                        <!-- observacion -->
                    </v-row>
                </v-container>
                <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="visible = false" color="red" variant="tonal">
                    Cancelar
                </v-btn>

                <v-btn v-if="agregando" @click="agregarCamada" color="green" variant="tonal">Registrar</v-btn>
                <v-btn v-if="editando" @click="modificarCamada" color="green" variant="tonal">Modificar</v-btn>
                </template>
            </v-card>
        <v-snackbar :text="mensaje.mensaje" v-model="mensaje.ver" :color="mensaje.color" :timeout="mensaje.timeout"></v-snackbar>
        </v-dialog>
  </div>
</template>

<script>
import { buscarCamadaAPI, guardarCamadaAPI, modificarCamadaAPI } from '@/api/camadasApi';
import { STATUS_CREATED, STATUS_OK, TIPO_HEMBRA, TIPO_MACHO, URL_SIN_FOTO } from '@/api/constans';
import { buscarGalloxTipoAPI } from '@/api/gallosApi';


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
    id_gallo: null,
    id_gallo_select : null,
});

export default {
    emits : ["listData"],
    data(){
        return {
            visible : false,
            gallo : {...datosIniciales},
            gallosPadre : [],
            gallinasMadre : [],
            titulo : "",
            camada : {
                codPadre : null,
                codMadre : null,
                fechaNacimiento : null,
                cantPollosMacho : 0,
                cantPollosHembra : 0,
                observacion : "",
            },
            bloqueoCodPadre : null,
            bloqueoCodMadre : null,
            mensaje : {
                ver : false,
                mensaje : "",
                timeout : 4000,
                color : 'blue'
            },
            editando : false,
            agregando : false,
            codCamada : null,
        }
    },
    async mounted(){
        await this.buscarGallosxTipo();
    },
    methods : {
        limpiarForm(){
            this.mensaje.ver = false;

            this.camada.codPadre = null;
            this.camada.codMadre = null;
            this.camada.fechaNacimiento = null;
            this.camada.cantPollosMacho = 0;
            this.camada.cantPollosHembra = 0;
            this.camada.observacion = "";
        },
        abrirModalAgregar(gallo){
            this.limpiarForm();
            this.agregando = true;
            this.editando = false;
            this.codCamada = null;
            this.visible = true;
            this.gallo = gallo;
            this.gallo.id_gallo_select = this.gallo.id_gallo;
            if(this.gallo.sexo == TIPO_HEMBRA){
                this.camada.codPadre = null;
                this.camada.codMadre = this.gallo.id_gallo; 
                this.bloqueoCodMadre = true;
                this.bloqueoCodPadre = false;
            }else{
                this.camada.codPadre = this.gallo.id_gallo;
                this.camada.codMadre = null;
                this.bloqueoCodPadre = true; 
                this.bloqueoCodMadre = false;
            }
            this.titulo = `Registrando nueva camada de ${this.gallo.placaNro} - ${this.gallo.nombre}`
        },
        async abrirModalVer(gallo,idCamada){
            this.limpiarForm();
            this.agregando = false;
            this.editando = false;
            this.visible = true;
            this.codCamada = idCamada;
            this.gallo = gallo;
            this.titulo = `Observando camada de ${this.gallo.placaNro} - ${this.gallo.nombre}`;
            
            const resp = await buscarCamadaAPI(idCamada);
            if(resp.status == STATUS_OK){
                this.seteaCamada(resp.data);
                this.visible = true;
            }else{
                this.verMensajeInfo("No se encontraron datos","red");
                this.visible = false;
            }
        },
        async abrirModalEditar(gallo,idCamada){
            this.limpiarForm();
            this.agregando = false;
            this.editando = true;
            this.visible = true;
            this.codCamada = idCamada;
            this.gallo = gallo;
            if(this.gallo.sexo == TIPO_HEMBRA){
                this.camada.codPadre = null;
                this.camada.codMadre = this.gallo.id_gallo; 
                this.bloqueoCodMadre = true;
                this.bloqueoCodPadre = false;
            }else{
                this.camada.codPadre = this.gallo.id_gallo;
                this.camada.codMadre = null;
                this.bloqueoCodPadre = true; 
                this.bloqueoCodMadre = false;
            }
            this.titulo = `Modificando camada de ${this.gallo.placaNro} - ${this.gallo.nombre}`;

            const resp = await buscarCamadaAPI(idCamada);
            if(resp.status == STATUS_OK){
                this.seteaCamada(resp.data);
                this.visible = true;
            }else{
                this.verMensajeInfo("No se encontraron datos","red");
                this.visible = false;
            }
        },
        seteaCamada(camada){
            this.camada.codPadre = camada.id_gallo_padre;
            this.camada.codMadre = camada.id_gallo_madre;
            this.camada.fechaNacimiento = camada.fecha_nacimiento;
            this.camada.cantPollosMacho = camada.cantidad_pollos_machos;
            this.camada.cantPollosHembra = camada.cantidad_pollos_hembras;
            this.camada.observacion = camada.observacion;
        },
        async buscarGallosxTipo(){
            const peticionMachos = await buscarGalloxTipoAPI(TIPO_MACHO);
            const peticionHembras = await buscarGalloxTipoAPI(TIPO_HEMBRA);
            
            this.gallosPadre = [];
            this.gallinasMadre = [];

            if(peticionMachos.status == STATUS_OK){
                this.gallosPadre = peticionMachos.data;
            }
            if(peticionHembras.status == STATUS_OK){ 
                this.gallinasMadre = peticionHembras.data;
            }
        },
        async agregarCamada(){
            let hayError = this.validaciones();
            if(hayError){return;}

            const resp = await guardarCamadaAPI(this.camada);

            if(resp.status == STATUS_CREATED){
                this.$emit("listData");
                this.visible = false;
            }
        },
        async modificarCamada(){
            let hayError = this.validaciones();
            if(hayError){return;}

            const resp = await modificarCamadaAPI(this.camada,this.codCamada);

            if(resp.status == STATUS_OK){
                this.$emit("listData");
                this.visible = false;
            }
        },
        validaciones(){
            let hayError = false;
            let mensaje = "";
            if(this.camada.codMadre == null){
                hayError = true;
                mensaje = "Elija a la madre de la camada.";
            }

            if(this.camada.codPadre == null){
                hayError = true;
                mensaje = "Elija al padre de la camada.";
            }

            if(this.camada.cantPollosHembra < 0){
                hayError = true;
                mensaje = "La cantidad de pollos hembra no puede ser menor que cero.";
            }

            if(this.camada.cantPollosHembra < 0){
                hayError = true;
                mensaje = "La cantidad de pollos machos no puede ser menor que cero.";
            }

            if(this.camada.observacion == null){
                this.camada.observacion = "";
            }

            if(this.camada.fechaNacimiento == null){
                hayError = true;
                mensaje = "La fecha de nacimiento no puede ir vacia";
            }

            if(hayError){
                this.reiniciarMensaje();
                this.verMensajeInfo(mensaje,"red");
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