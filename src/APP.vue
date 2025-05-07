<template>
  <div class="container">
    <h1>番茄钟</h1>
    <TimerComponent />
    <TaskList />
  </div>
</template>

<script lang="js" setup>
import TaskList from "./components/TaskList.vue";
import TimerComponent from "./components/TimerComponent.vue";
</script>

<style>
.container {
  text-align: center;
  padding: 20px;
}
</style>
