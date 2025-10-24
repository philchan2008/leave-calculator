
<template>
  <v-container class="text-center py-10">
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="48"
    />
    <div v-if="loading" class="mt-4 text-subtitle-1">
      Loading, please wait...
    </div>
  </v-container>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

onMounted(() => {
  loading.value = true;

  setTimeout(() => {
    router.push('/calc');
  }, 1500); // simulate delay
});

</script>
