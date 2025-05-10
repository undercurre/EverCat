<template>
  <div class="container">
    <JumpingText />
    <TimerComponent />
    <TaskList />
  </div>
</template>

<script lang="js" setup>
import TaskList from "./components/TaskList.vue";
import TimerComponent from "./components/TimerComponent.vue";
import JumpingText from "./components/JumpingText.vue";
</script>

<style lang="scss">
@import "./styles/reset.scss";
.container {
  text-align: center;
  padding: 20px;
  background-color: #2980b9;
}
</style>
