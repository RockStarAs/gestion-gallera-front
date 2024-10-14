<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const drawer = ref(null)
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item prepend-icon="mdi-food-drumstick" to="/listar-gallos">Listar Gallos</v-list-item>
        <v-list-item prepend-icon="mdi-plus" to="/registro-gallo"> Registrar gallo
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon icon="mdi-menu"/>
      </v-app-bar-nav-icon>

      <v-app-bar-title>Team Unión</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
//  import { mdiMenu } from '@mdi/js'
  export default {
    data: () => ({ drawer: null }),
  }
</script>

<style scoped>
</style>
