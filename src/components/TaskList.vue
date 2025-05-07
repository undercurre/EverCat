<template>
  <div class="task-list">
    <h3>任务清单</h3>
    <div class="add-task">
      <input v-model="newTask" @keyup.enter="addTask" />
      <button @click="addTask">添加</button>
    </div>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <input type="checkbox" v-model="task.completed" />
        <span :class="{ completed: task.completed }">{{ task.text }}</span>
        <button @click="removeTask(index)">×</button>
      </li>
    </ul>
  </div>
</template>

<script lang="js" setup>
import { ref } from "vue";

const tasks = ref(JSON.parse(localStorage.getItem("tasks")) || []);
const newTask = ref("");

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false,
    });
    saveTasks();
    newTask.value = "";
  }
};

const removeTask = (index) => {
  tasks.value.splice(index, 1);
  saveTasks();
};

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};
</script>
