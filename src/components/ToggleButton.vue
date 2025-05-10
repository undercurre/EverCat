<template>
  <div
    class="togglebutton-wrapper"
    :class="modelValue ? 'togglebutton-checked' : ''"
  >
    <label :for="name">
      <span class="togglebutton-label">{{ label }}</span>
      <span class="tooglebutton-box"></span>
    </label>
    <input
      :id="name"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style scoped>
.togglebutton-wrapper {
  margin-top: 1em;
}
.togglebutton-wrapper label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.togglebutton-wrapper input {
  position: absolute;
  left: -9999px;
}
.togglebutton-label {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}
.tooglebutton-box {
  position: relative;
  display: block;
  margin-left: 0.6em;
  width: 38px;
  height: 22px;
  background: white;
  border-radius: 999px;
  cursor: pointer;
}
.tooglebutton-box::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00adb5;
  opacity: 0.7;
  transition: all 0.2s ease-in-out;
}
.togglebutton-checked .tooglebutton-box::before {
  left: calc(100% - 4px - 16px);
  opacity: 1;
}
</style>
