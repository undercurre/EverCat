<template>
  <div class="container">
    <h1>Electron + Vue 3</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
const increment = () => count.value++;
</script>

<style>
.container {
  text-align: center;
  padding: 20px;
}
</style>
