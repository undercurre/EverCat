<template>
  <ul class="split-menu">
    <li v-for="(item, index) in menuItems" :key="index">
      <router-link :to="item.path">
        <span class="primary" :data-text="splitText(item.title).primary">{{
          splitText(item.title).primary
        }}</span>
        <span class="secondary" :data-text="splitText(item.title).secondary">{{
          splitText(item.title).secondary
        }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const menuItems = ref([
  { title: "Mission List", path: "/todo" },
  { title: "Tomato Clock", path: "/clock" },
]);

const splitText = (text) => {
  const words = text.split(" ");
  return {
    primary: words[0],
    secondary: words.slice(1).join(" "),
  };
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Lato");

.split-menu {
  --primary-color: #00adb5;
  --secondary-color: #eeeeee;
  --border-color: #d2d5e4;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.split-menu li:not(:last-child) {
  border-right: 2px dotted var(--border-color);
}

.split-menu li a {
  display: flex;
  padding: 6px 2em 3px;
  color: white;
  font-family: Lato, sans-serif;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
}

.split-menu li a .primary {
  position: relative;
  padding-right: 4px;
  color: var(--primary-color);
  transition: 0.3s;
}

.split-menu li a .primary::before {
  position: absolute;
  content: attr(data-text);
  color: var(--secondary-color);
  transform: translateY(130%);
  transition: 0.3s;
}

.split-menu li a .secondary {
  position: relative;
  color: var(--secondary-color);
  transition: 0.3s;
}

.split-menu li a .secondary::before {
  position: absolute;
  content: attr(data-text);
  color: var(--primary-color);
  transform: translateY(-130%);
  transition: 0.3s;
}

.split-menu li a:hover .primary {
  transform: translateY(-130%);
}

.split-menu li a:hover .secondary {
  transform: translateY(130%);
}
</style>
