<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <Dialogs />
  </v-app>
</template>

<script setup>
import Dialogs from './components/Dialogs.vue';
</script>
