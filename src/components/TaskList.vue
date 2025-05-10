<template>
  <div id="todolist">
    <template v-if="todo.length">
      <transition-group name="todolist" tag="ul">
        <li
          v-for="item in todoByStatus"
          :key="item.id"
          :class="{ done: item.done }"
        >
          <span class="label">{{ item.label }}</span>
          <div class="actions">
            <button
              class="btn-picto"
              type="button"
              @click="markAsDoneOrUndone(item)"
              :aria-label="item.done ? 'Undone' : 'Done'"
              :title="item.done ? 'Undone' : 'Done'"
            >
              <i class="material-icons">
                <svg
                  v-if="item.done"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64m-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58"
                  />
                </svg>
                <svg
                  v-if="!item.done"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="32"
                    d="M352 176L217.6 336L160 272"
                  />
                  <rect
                    width="384"
                    height="384"
                    x="64"
                    y="64"
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="32"
                    rx="48"
                    ry="48"
                  />
                </svg>
              </i>
            </button>
            <button
              class="btn-picto"
              type="button"
              @click="deleteItemFromList(item)"
              aria-label="Delete"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                />
              </svg>
            </button>
          </div>
        </li>
      </transition-group>
      <ToggleButton
        label="Move done items at the end?"
        name="todosort"
        v-model="sortByStatus"
      />
    </template>
    <p v-else class="emptylist">Your todo list is empty.</p>

    <form @submit.prevent="addItem">
      <label for="newitem">Add to the todo list</label>
      <input type="text" id="newitem" v-model="newitem" />
      <button type="submit">Add item</button>
    </form>
  </div>
</template>

<script>
import ToggleButton from "./ToggleButton.vue";

export default {
  name: "TodoList",
  components: {
    ToggleButton,
  },
  data() {
    return {
      newitem: "",
      sortByStatus: false,
      todo: [
        { id: 1, label: "Learn VueJs", done: true },
        { id: 2, label: "Code a todo list", done: false },
        { id: 3, label: "Learn something else", done: false },
      ],
    };
  },
  methods: {
    addItem() {
      this.todo.push({
        id: Math.floor(Math.random() * 9999) + 10,
        label: this.newitem,
        done: false,
      });
      this.newitem = "";
    },
    markAsDoneOrUndone(item) {
      item.done = !item.done;
    },
    deleteItemFromList(item) {
      const index = this.todo.indexOf(item);
      this.todo.splice(index, 1);
    },
  },
  computed: {
    todoByStatus() {
      if (!this.sortByStatus) return this.todo;
      return [
        ...this.todo.filter((item) => !item.done),
        ...this.todo.filter((item) => item.done),
      ];
    },
  },
};
</script>

<style scoped>
#todolist {
  padding: 0 2rem;
  max-width: 500px;
  background: transparent;
  color: #fff;
}

h1 {
  font-weight: normal;
  font-size: 2.6rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

h1 span {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  margin-left: 3px;
  margin-top: 0.2rem;
}

.emptylist {
  margin-top: 2.6rem;
  text-align: center;
  letter-spacing: 0.05em;
  font-style: italic;
  opacity: 0.8;
}

ul {
  margin-top: 2.6rem;
  list-style: none;
}

li {
  display: flex;
  margin: 0 -3rem 4px;
  padding: 1.1rem 3rem;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

.actions {
  flex-shrink: 0;
  padding-left: 0.7em;
}

.label {
  position: relative;
  transition: opacity 0.2s linear;
}

.done .label {
  opacity: 0.6;
}

.done .label::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -0.5rem;
  display: block;
  width: 0%;
  height: 1px;
  background: #fff;
  animation: strikeitem 0.3s ease-out 0s forwards;
}

@keyframes strikeitem {
  to {
    width: calc(100% + 1rem);
  }
}

.btn-picto {
  border: none;
  background: none;
  -webkit-appearance: none;
  cursor: pointer;
  color: #fff;
}

form {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
}

form label {
  min-width: 100%;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

form input {
  flex-grow: 1;
  border: none;
  background: #f7f1f1;
  padding: 0 1.5em;
  font-size: initial;
}

form button {
  padding: 0 1.3rem;
  border: none;
  background: #00adb5;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-left: 5px;
  cursor: pointer;
  transition: background 0.2s ease-out;
}

form button:hover {
  background: #00adb5;
}

form input,
form button {
  font-family: "Quicksand", sans-serif;
  height: 3rem;
}
</style>
