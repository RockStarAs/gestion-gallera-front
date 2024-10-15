<template>
    <v-container>
        <h1>Camadas en general</h1>
        <v-row>
            <v-col cols="12" md="12">
                <v-btn @click="abrirModalCamadaGeneral" color="blue">Registrar nueva camada</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="12">
                <v-data-table :headers="headers" :items="camadas" :search="search" :custom-filter="customFilter">
                    <template v-slot:item.actions="{ item }">
                        <v-btn class="ma-1" density="compact" @click="() => { abriModalCamadaEditarGeneral(item) }"
                            v-tooltip:bottom="'Editar camada'" icon="mdi-pencil-circle" color="yellow" />
                        <v-btn class="ma-1" density="compact" @click="() => { verCamadaGeneral(item) }"
                            v-tooltip:bottom="'Ver camada'" icon="mdi-eye-outline" color="blue" />
                        <v-btn class="ma-1" density="compact" @click="() => { eliminarCamada(item) }"
                            v-tooltip:bottom="'Eliminar camada'" icon="mdi-trash-can" color="red" />
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <ModalCamada ref="modalCamada" @list-data="listarCamadas"></ModalCamada>
    </v-container>
    <div class="text-center pa-4">
        <v-dialog v-model="dialog" max-width="400" persistent>
            <v-card text="¿Estás seguro que deseas eliminar?" title="Eliminar registro">
                <template v-slot:actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="() => { dialog = false; idGalloxEliminar = null }" color="green">
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
import { eliminarRegistroCamadaAPI, listarCamadasAPI } from '@/api/camadasApi';
import { STATUS_OK } from '@/api/constans';
import ModalCamada from '@/components/ModalCamada.vue';

const headers = [
    { key: 'gallo_madre', title: 'Gallina' },
    { key: 'gallo_padre', title: 'Gallo' },
    { key: 'fecha_nacimiento', title: 'Fecha nacimiento' },
    { key: 'cantidad_pollos_machos', title: 'N° pollos machos' },
    { key: 'cantidad_pollos_hembras', title: 'N° pollos hembra' },
    { key: 'actions', title: 'Acciones' },
];

export default {
    components: {
        ModalCamada
    },
    data() {
        return {
            camadas: [],
            headers: headers,
            dialog: false,
            idCamadaxEliminar: null,
            search: '',
        }
    },
    async mounted() {
        await this.listarCamadas();
    },
    methods: {
        async listarCamadas() {
            const resp = await listarCamadasAPI();
            if (resp.status == STATUS_OK) {
                this.camadas = resp.data;
            }
        },
        abrirModalCamadaGeneral() {
            this.$refs.modalCamada.abrirModalAgregarGeneral();
        },
        abriModalCamadaEditarGeneral(camada) {
            this.$refs.modalCamada.abrirModalEditarGeneral(camada.id_camada);
        },
        verCamadaGeneral(camada) {
            this.$refs.modalCamada.abrirModalVerGeneral(camada.id_camada);
        },
        eliminarCamada(camada) {
            this.dialog = true;
            this.idCamadaxEliminar = camada.id_camada;
        },
        async eliminarRegistroCamada() {
            const resp = await eliminarRegistroCamadaAPI(this.idCamadaxEliminar);
            if (resp.status == STATUS_OK) {
                await this.listarCamadas();
            }
            this.dialog = false;
        },
        customFilter(value, search, item) {
            if (!search) return true;
            const searchLower = search.toLowerCase();
            return (
                item.columns.gallo_madre.toLowerCase().includes(searchLower) ||
                item.columns.gallo_padre.toLowerCase().includes(searchLower)
            );
        }
    }
}
</script>