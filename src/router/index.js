import { createRouter, createWebHashHistory } from "vue-router";
import TaskList from "../components/TaskList.vue";
import TimerComponent from "../components/TimerComponent.vue";

const routes = [
  {
    path: "/",
    redirect: "/todo",
  },
  {
    path: "/todo",
    name: "Todo",
    component: TaskList,
  },
  {
    path: "/clock",
    name: "Clock",
    component: TimerComponent,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
