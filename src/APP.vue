<template>
  <div class="container">
    <JumpingText />
    <SplitTextMenu class="pt-20px" />
    <TaskList />
  </div>
</template>

<script lang="js" setup>
import TaskList from "./components/TaskList.vue";
import SplitTextMenu from "./components/SplitTextMenu.vue";
import TimerComponent from "./components/TimerComponent.vue";
import JumpingText from "./components/JumpingText.vue";
</script>

<style lang="scss">
@import "./styles/reset.scss";

.container {
  width: 100vw;
  min-height: 100vh;
  text-align: center;
  background-color: #222831;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
