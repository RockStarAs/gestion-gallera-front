<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <!-- v-bind="attrs" para pasar los atributos y v-on="on" para los eventos -->
            <v-btn v-bind="attrs" v-on="on" @click="emitClick">
                <v-icon :icon="icon"></v-icon>
            </v-btn>
        </template>
        <span>{{ mensaje }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: "BotonTooltip",
    props: {
        icon: {
            type: String,
            required: true // Asegurar que el icono sea obligatorio
        },
        mensaje: {
            type: String,
            required: true // Asegurar que el mensaje sea obligatorio
        }
    },
    emits: ["fClick"],
    methods: {
        emitClick() {
            this.$emit('fClick'); // Emitir el evento personalizado
        }
    }
}
</script>
