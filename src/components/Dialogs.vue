<template>
  <v-dialog v-model="showModal" max-width="400">
    <template #default>
      <v-card>
        <v-card-title class="text-h6">{{ dialog.msg.title }}</v-card-title>
        <v-card-text>
          {{ dialog.msg.text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog.showModal = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-dialog v-model="dialog.showHolidayList" max-width="800px">
    <HolidayList />
  </v-dialog>
</template>

<script setup>
import { useDialogStore } from '/stores/useDialogStore';
import HolidayList from '/src/components/HolidayList.vue'

const dialog = useDialogStore()
</script>
