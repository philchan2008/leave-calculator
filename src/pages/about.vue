<template>
  <v-toolbar>
    <v-toolbar-title>Leave Calculator</v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="goBack">
      <v-icon>mdi-keyboard-tab-reverse</v-icon>
    </v-btn>
  </v-toolbar>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text-h5">About Leave Calculator</v-card-title>
          <v-card-text>
            <p>
              This leave calculator helps you estimate your remaining leave days based on your employment terms,
              earning rate, and last balance. Built with Vue 3.5, Vite, and Vuetify for a fast and responsive experience.
            </p>
            <p>Features include:</p>
            <ul>
              <li>Dynamic form inputs</li>
              <li>PDF export of leave summary (To be implemented.)</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back(); // or router.go(-1)
}
</script>

<style scoped>
ul {
  padding-left: 1.2em;
}
</style>
