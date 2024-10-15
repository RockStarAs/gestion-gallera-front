<template>
    <v-card
        :title="cargando ? 'Cargando' : 'Viendo registros'"
        flat
    >
        <template v-slot:text>
            <v-text-field
                v-model="search"
                label="Buscar"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            ></v-text-field>
        </template>

        <v-data-table
            :headers="headers"
            :items="gallos"
            :search="search"
        >
            <template v-slot:item.sexo="{ item }">
                <div class="text-start">
                    <v-chip
                        color="green"
                        :text="sexos.find(e=>e.value == item.sexo).title"
                        class="text-uppercase"
                        size="small"
                        label
                    ></v-chip>
                </div>
            </template>
            <template v-slot:item.tipo_ave="{ item }">
                <div class="text-start">
                    <v-chip
                        color="green"
                        :text="tiposAve.find(e=>e.value == item.tipo_ave).title"
                        class="text-uppercase"
                        size="small"
                        label
                    ></v-chip>
                </div>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-row>
                        <!-- <BotonTooltip icon="mdi-tag-edit" mensaje="Editar registro" @fClick="()=>{}" /> -->
                        <v-btn
                            v-if="item.id_gallo != 1 && item.id_gallo != 2" 
                            class="ma-1"
                            density="compact"
                            @click="()=>{editarRegistroGallo(item)}" 
                            color="yellow" 
                            v-tooltip:bottom="'Modificar registro'"
                            icon="mdi-tag-edit"
                        >
                        </v-btn>
                        <v-btn
                            class="ma-1"
                            density="compact" 
                            @click="()=>{verRegistroGallo(item)}"
                            v-tooltip:bottom="'Ver registro'"
                            icon="mdi-tag-search"
                            color="blue" 
                        >
                        </v-btn>
                        <v-btn
                            class="ma-1"
                            density="compact" 
                            @click="()=>{verCamadas(item)}"
                            v-tooltip:bottom="'Ver camadas'"
                            icon="mdi-egg"
                            color="green" 
                        >
                        </v-btn>
                        <v-btn
                            class="ma-1"
                            density="compact" 
                            @click="()=>{verCuidos(item)}"
                            v-tooltip:bottom="'Ver cuidos'"
                            icon="mdi-medal"
                            color="yellow" 
                        >
                        </v-btn>
                        <v-btn
                            class="ma-1"
                            density="compact" 
                            @click="()=>{verArbol(item)}"
                            v-tooltip:bottom="'Ver árbol genealógico'"
                            icon="mdi-family-tree"
                            color="green"
                        >
                        </v-btn>
                        <v-btn
                            class="ma-1"
                            v-if="item.id_gallo != 1 && item.id_gallo != 2" 
                            density="compact" 
                            @click="()=>{dialog = true; idGalloxEliminar = item.id_gallo}"
                            v-tooltip:bottom="'Eliminar registro'"
                            icon="mdi-trash-can"
                            color="red"
                        >
                        </v-btn>
                </v-row>
            </template>
            <template v-slot:item.ruta_foto_v2="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img
                        :src="item.ruta_foto_v2"
                        height="64"
                        cover
                    ></v-img>
                </v-card>
            </template>
        </v-data-table>
    </v-card>

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

                <v-btn @click="eliminarRegistroGallo" color="red">
                    Eliminar
                </v-btn>
            </template>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { FLAG_SEXOS, FLAG_TIPOS_AVE, STATUS_OK } from '@/api/constans';
import { eliminarGalloAPI, listarGallosAPI } from '@/api/gallosApi';
import { listarParametros } from '@/api/parametrosApi';

const headers = [
  { key: 'nro_placa',title: 'N° Placa' },
  { key: 'nombre', title: 'Nombre' },
  { key: 'fecha_nacimiento', title: 'Fecha Nacimiento' },
  { key: 'sexo', title: 'Sexo' },
  { key: 'ruta_foto_v2', title: 'Imagen' },
  { key: 'tipo_ave', title: 'Tipo ave' },
  { key: 'actions', title: 'Acciones'}
];

export default{
    name: 'ListarGallos',
    components : {
    },
    data(){
        return {
            gallos : [],
            cargando : false,
            headers : headers,
            sexos : [],
            search: '',
            tiposAve : [],
            dialog : false,
            idGalloxEliminar : null
        }
    },
    async mounted(){
        this.cargando = true;
        const peticion2 = await listarParametros(FLAG_SEXOS,1);
        const peticion3 = await listarParametros(FLAG_TIPOS_AVE,1);
        this.cargando = false;
        if(peticion2.status == STATUS_OK){
            this.sexos = peticion2.data;
        }else{
            this.sexos = [];
        }

        if(peticion3.status == STATUS_OK){
            this.tiposAve = peticion3.data;
        }else{
            this.tiposAve = [];
        }
        this.cargando = true;
        await this.cargarRegistros();
        this.cargando = false;
    },
    methods:{
        editarRegistroGallo(item){
            this.$router.push({ name: 'editargallo', params: { id_gallo: item.id_gallo } });
        },
        verRegistroGallo(item){
            this.$router.push({ name: 'verGallo', params: { ver_id_gallo : item.id_gallo} });
        },
        async eliminarRegistroGallo(){
            this.dialog = false;
            const resp = await eliminarGalloAPI(this.idGalloxEliminar);
            if(resp.status == STATUS_OK){
                await this.cargarRegistros();
            }
        },
        async cargarRegistros(){
            const peticion = await listarGallosAPI();
            if(peticion.status == STATUS_OK){
                let gallos = peticion.data;
                this.gallos = gallos.map(e=>({...e,actions : null}));
            }else{
                this.gallos = [];
            }
        },
        async verCamadas(item){
            this.$router.push({ name: 'camadas', params: { id_gallo : item.id_gallo} });
        }, 
        async verCuidos(item){
            this.$router.push({ name: 'cuidos', params: { id_gallo : item.id_gallo} });
        },
        async verArbol(item){
            this.$router.push({ name: 'arbol', params: { id_gallo : item.id_gallo} });
        }
    }
}
</script>