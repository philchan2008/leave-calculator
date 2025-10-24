<template>
  <div>
    <!-- Visible form inputs -->
    <v-text-field v-model="form.name" label="Name" />
    <v-number-input v-model="form.daysTaken" label="Days Taken" />

    <!-- Hidden table for PDF -->
    <div ref="pdfContent" style="display: none">
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Name</td><td>{{ form.name }}</td></tr>
        <tr><td>Days Taken</td><td>{{ form.daysTaken }}</td></tr>
        <!-- Add more rows as needed -->
      </table>
    </div>

    <v-btn @click="generatePDF">Print as PDF</v-btn>
  </div>
</template>

<script setup></script>
