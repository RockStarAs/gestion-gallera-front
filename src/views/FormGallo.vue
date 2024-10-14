<template>
    <!-- <input type="date" :value="gallo.fechaNacimiento" @change="val => gallo.fechaNacimiento = val.target.value">
    <input type="text" :value="gallo.nombre" @input="val => gallo.nombre = val.target.value"> -->
    <v-container>
        <h1>{{ galloId ? "Editando información del gallo" : galloIdViendo ? 'Viendo datos' : 'Registrar un nuevo gallo' }}
        </h1>
        <v-row>
            <v-col cols="8">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field :readonly="estaObservando" v-model="gallo.nombre" label="Nombre del gallo o gallina" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field :readonly="estaObservando" type="date" v-model="gallo.fechaNacimiento" label="Fecha de nacimiento del gallo"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field :readonly="estaObservando" v-model="gallo.placaNro" label="N° Placa" required></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field :readonly="estaObservando" v-model="gallo.color" label="Color" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field :readonly="estaObservando" v-model="gallo.tipoCresta" label="Tipo cresta" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select :readonly="estaObservando"v-model="gallo.sexo" label="Sexo" :items="sexos"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-select :readonly="estaObservando" v-model="gallo.tipoAve" label="Tipo de ave" :items="tiposAve"></v-select>
                    </v-col>
                    <v-col v-show="!(galloIdViendo == 1 || galloIdViendo == 2)" cols="12" md="4">
                        <v-select :readonly="estaObservando" v-model="gallo.codGalloMadre" label="Gallina madre" :items="gallinasMadre"
                            :item-title="gallo => `${gallo.nro_placa} - ${gallo.nombre}`"
                            item-value="id_gallo"></v-select>
                    </v-col>
                    <v-col v-show="!(galloIdViendo == 1 || galloIdViendo == 2)" cols="12" md="4">
                        <v-select :readonly="estaObservando" v-model="gallo.codGalloPadre" label="Gallo padre" :items="gallosPadre"
                            :item-title="gallo => `${gallo.nro_placa} - ${gallo.nombre}`"
                            item-value="id_gallo"></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-textarea :readonly="estaObservando" v-model="gallo.observacion" label="Observaciones"></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-row>
                            <v-col cols="12" md="12" class="image-container" @mousemove="moveImage" @mouseleave="resetImage">
                                <v-img :src="gallo.rutaFoto" class="zoomable-img" ref="zoomImage"></v-img>
                            </v-col>
                            <v-col v-if="!estaObservando" cols="12" md="12">
                                <v-file-input accept="image/png, image/jpeg, image/bmp" label="Cargar nueva foto"
                                    placeholder="Cargar una nueva foto"
                                    v-on:update:model-value="actualizarArchivo"></v-file-input>
                            </v-col>
                            <v-col v-if="!estaObservando" cols="12" md="6">
                                <v-btn class="me-2 text-none" variant="flat" @click="sinFoto" color="red"><span
                                        style="font-size: 12px;">Quitar foto actual</span></v-btn>
                            </v-col>
                            <v-col v-if="!estaObservando" cols="12" md="6">
                                <v-btn class="me-2 text-none" variant="flat" @click="sinFotov2" color="blue"><span
                                        style="font-size: 12px;">Dejar como "sin foto"</span></v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <template v-if="!galloIdViendo">
                    <v-btn v-if="!galloId" color="blue" variant="elevated" @click="registrarGallo">Registrar</v-btn>
                    <v-btn v-else color="blue" variant="elevated" @click="actualizarRegistroGallo">Actualizar
                        registro</v-btn>
                </template>
            </v-col>
        </v-row>
    </v-container>
    <v-snackbar :text="error.mensajeError" v-model="error.hayError" color="red" :timeout="error.timeout"></v-snackbar>
    <v-snackbar :text="mensaje.mensaje" v-model="mensaje.ver" color="blue" :timeout="mensaje.timeout"></v-snackbar>
</template>

<script>
import { FLAG_SEXOS, FLAG_TIPOS_AVE, STATUS_CREATED, STATUS_OK, TIPO_HEMBRA, TIPO_MACHO, URL_SIN_FOTO } from '@/api/constans';
import { buscarGalloAPI, buscarGalloxTipoAPI, guardarGalloAPI, modificarGalloAPI } from '@/api/gallosApi';
import { listarParametros } from '@/api/parametrosApi';

const datosIniciales = Object.freeze({
    fechaNacimiento: null,
    nombre: "",
    placaNro: "",
    color: "",
    tipoCresta: "",
    sexo: null,
    tipoAve: null,
    codGalloPadre: null,
    codGalloMadre: null,
    observacion: "",
    rutaFoto: URL_SIN_FOTO,
    rutaFotoPre: URL_SIN_FOTO,
    imagen_obj: null
});

export default {
    name: "CrearGallo",
    data() {
        return {
            sexos: [],
            tiposAve: [],
            gallo: { ...datosIniciales },
            error: {
                hayError: false,
                mensajeError: "",
                timeout: 4000
            },
            mensaje: {
                ver: false,
                mensaje: "",
                timeout: 4000
            },
            gallosPadre: [],
            gallinasMadre: []
        }
    },
    async mounted() {
        this.limpiarFormulario();
        const peticion = await listarParametros(FLAG_SEXOS, 1);
        const peticion2 = await listarParametros(FLAG_TIPOS_AVE, 1);
        await this.buscarGallosxTipo();

        if (peticion.status == STATUS_OK) {
            this.sexos = peticion.data;
        }

        if (peticion2.status == STATUS_OK) {
            this.tiposAve = peticion2.data;
        }

        if (this.galloId) {
            await this.buscarRegistroGallo(this.galloId);
        }

        if (this.galloIdViendo) {
            await this.buscarRegistroGallo(this.galloIdViendo);
        }
    },
    computed: {
        galloId() {
            return this.$route.params.id_gallo || null;
        },
        galloIdViendo() {
            return this.$route.params.ver_id_gallo || null;
        },
        estaObservando(){
            return !!this.galloIdViendo
        }
    },
    methods: {
        limpiarFormulario() {
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
        },
        reiniciarError() {
            this.error.hayError = false;
            this.error.mensajeError = "";
        },
        reiniciarMensaje() {
            this.mensaje.mensaje = "";
            this.mensaje.ver = false;
        },
        verMensajeInfo(mensaje, color) {
            this.mensaje.mensaje = mensaje;
            this.mensaje.ver = true;
            this.mensaje.color = color;
        },
        async buscarRegistroGallo(idGallo) {
            const peticion = await buscarGalloAPI(idGallo);

            if (peticion.status == STATUS_OK) {
                this.asignarDatos(peticion.data);
            }
        },
        asignarDatos(gallo) {
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
        },
        async actualizarRegistroGallo() {
            this.reiniciarError();
            const hayError = this.validarDatos();
            if (hayError) return false;

            const peticion = await modificarGalloAPI(this.gallo, this.galloId);
            if (peticion.status == STATUS_OK) {
                this.reiniciarMensaje();
                this.asignarDatos(peticion.data);
                this.verMensajeInfo("Se modificó con éxito", "blue");
            } else {
                this.reiniciarMensaje();
                this.verMensajeInfo("Ocurrió un error", "red");
            }
        },
        async registrarGallo() {
            this.reiniciarError();
            const hayError = this.validarDatos();
            if (hayError) return false;

            const peticion = await guardarGalloAPI(this.gallo);

            if (peticion.status == STATUS_CREATED) {
                await this.buscarGallosxTipo();
                this.reiniciarMensaje();
                this.verMensajeInfo("Se registró con éxito", "blue");
                this.$router.push({ name: 'listargallo'});
            } else {
                this.reiniciarMensaje();
                this.verMensajeInfo("Ocurrió un error", "red");
            }
        },
        async buscarGallosxTipo() {
            const peticionMachos = await buscarGalloxTipoAPI(TIPO_MACHO);
            const peticionHembras = await buscarGalloxTipoAPI(TIPO_HEMBRA);

            this.gallosPadre = [];
            this.gallinasMadre = [];

            if (peticionMachos.status == STATUS_OK) {
                this.gallosPadre = peticionMachos.data;
            }
            if (peticionHembras.status == STATUS_OK) {
                this.gallinasMadre = peticionHembras.data;
            }
        },
        actualizarArchivo(file) {
            if (file === undefined) {
                this.sinFoto();
                return;
            }
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];
            if (!allowedTypes.includes(file.type)) {
                // this.error = 'El archivo debe ser de tipo PNG, JPG, JPEG o BMP.';
                this.gallo.rutaFoto = this.gallo.rutaFotoPre;
                this.gallo.imagen_obj = null;
                return;
            }
            this.gallo.imagen_obj = file;
            this.gallo.rutaFoto = URL.createObjectURL(file);
        },
        sinFoto() {
            // if(this.gallo.imagen_obj == null){
            //     this.gallo.rutaFoto = this.gallo.rutaFotoPre;
            // }
            this.gallo.rutaFoto = this.gallo.rutaFotoPre;
            this.gallo.imagen_obj = null;
        },
        sinFotov2() {
            this.gallo.rutaFoto = URL_SIN_FOTO;
            this.gallo.imagen_obj = null;
        },
        validarDatos() {
            let hayError = false;

            if (this.gallo.fechaNacimiento == null) {
                this.error.mensajeError = "La fecha de nacimiento no puede ser nula";
                hayError = true;
            }

            if (this.gallo.nombre == null || this.gallo.nombre == "") {
                this.error.mensajeError = "Nombre no puede ir vacío.";
                hayError = true;
            }

            if (this.gallo.placaNro == null || this.gallo.placaNro == "") {
                this.error.mensajeError = "Placa del animal no puede ir vacío.";
                hayError = true;
            }

            if (this.gallo.tipoCresta == null || this.gallo.tipoCresta == "") {
                this.error.mensajeError = "Tipo de cresta del animal no puede ir vacío.";
                hayError = true;
            }

            if (this.gallo.sexo == null) {
                this.error.mensajeError = "Sexo del animal no puede ir vacío.";
                hayError = true;
            }

            if (this.gallo.tipoAve == null) {
                this.error.mensajeError = "Tipo de ave no puede ir vacío.";
                hayError = true;
            }

            if (this.gallo.codGalloMadre == null) {
                this.error.mensajeError = "La gallina madre no puede ir vacío";
                hayError = true;
            }

            if (this.gallo.codGalloPadre == null) {
                this.error.mensajeError = "El campo de gallo padre no puede ir vacío";
                hayError = true;
            }


            if (this.gallo.observacion == null) { this.gallo.observacion = ""; }

            if (this.galloId == this.gallo.codGalloMadre) {
                this.error.mensajeError = "El mismo gallo no puede ser gallina madre.";
                hayError = true;
            }

            if (this.galloId == this.gallo.codGalloPadre) {
                this.error.mensajeError = "El mismo gallo no puede ser gallo padre";
                hayError = true;
            }

            // if(this.error.mensajeError)
            this.error.hayError = hayError;
            return hayError;

            // fechaNacimiento : null,
            // nombre : "",
            // placaNro : "",
            // color : "",
            // tipoCresta : "",
            // sexo : null,
            // tipoAve : null,
            // codGalloPadre : null,
            // codGalloMadre : null,
            // observacion : ""
        },
        moveImage(event) {
            const container = event.currentTarget;
            const img = this.$refs.zoomImage.$el;

            // Obtener el tamaño del contenedor y el tamaño del mouse dentro del contenedor
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left; // Posición X del mouse dentro del contenedor
            const y = event.clientY - rect.top;  // Posición Y del mouse dentro del contenedor

            // Calcular el porcentaje de movimiento dentro del contenedor
            const moveX = ((x / rect.width) * 100) - 50; // Porcentaje para centrar
            const moveY = ((y / rect.height) * 100) - 50;

            // Mover la imagen usando translate para permitir el "scroll" dentro de la imagen ampliada
            img.style.transform = `scale(1.5) translate(${moveX * -1}%, ${moveY * -1}%)`;
        },
        resetImage() {
            const img = this.$refs.zoomImage.$el;
            // Restablecer la imagen al centro con el zoom original cuando el mouse se salga del contenedor
            img.style.transform = "scale(1) translate(0%, 0%)";
        }
    }
}
</script>

<style scoped>
.image-container {
    position: relative;
    width: 291px;
    /* Ancho fijo del contenedor */
    height: 291px;
    /* Altura fija del contenedor */
    overflow: hidden;
    /* Oculta la parte ampliada de la imagen fuera del contenedor */
}

.zoomable-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    /* Transición suave */
    transform-origin: center center;
    /* La imagen se amplía desde el centro */
}

/* Efecto de zoom al hacer hover */
.image-container:hover .zoomable-img {
    transform: scale(2.5);
    /* Zoom: agranda un 50% la imagen */
}

/* Moverse dentro de la imagen ampliada */
.image-container:hover {
    cursor: move;
    /* Mostrar el cursor de mover */
}

/* Permitir el desplazamiento dentro de la imagen */
.image-container:hover .zoomable-img {
    transition: transform 0.1s ease;
    /* Actualiza rápidamente la transformación durante el movimiento */
    position: absolute;
}
</style>