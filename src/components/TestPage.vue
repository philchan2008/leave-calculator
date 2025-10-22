<template>
  <div class="d-flex justify-center">
    test
    <v-date-input
      v-model="model"
      label="Select a date"
      max-width="368"
    ></v-date-input>
  </div>
</template>

<script setup>
  import { shallowRef } from 'vue'

  const model = shallowRef(null)
</script>
