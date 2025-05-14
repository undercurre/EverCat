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
  {
    path: "/setting",
    name: "Settings",
    component: () => import("../components/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
