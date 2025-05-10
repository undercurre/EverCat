<template>
  <div class="container">
    <div class="loading">
      <span
        v-for="(letter, index) in letters"
        :key="index"
        :style="{ animationDelay: `${index / 60}s` }"
      >
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const letters = ref("Misson".split(""));
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Baloo+Bhaijaan&display=swap");

@function float-text-3d($shadow-color: #bbb, $depth: 10, $floating: false) {
  $shadows: ();

  @for $i from 1 to $depth {
    @if ($floating == false and $i > $depth / 2) {
      $shadow-color: transparent;
    }

    $shadows: append($shadows, 0 ($i * 1px) $shadow-color, comma);
  }

  @if ($floating == false) {
    $shadows: append($shadows, 0 10px 10px rgba(0, 0, 0, 0.4), comma);
  } @else {
    $shadows: append($shadows, 0 50px 25px rgba(0, 0, 0, 0.2), comma);
  }

  @return $shadows;
}

.container {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #2980b9;
}

.loading {
  display: flex;
  color: white;
  font-size: 5em;
  font-family: "Baloo Bhaijaan", cursive;
  text-transform: uppercase;

  span {
    text-shadow: float-text-3d($floating: false);
    transform: translateY(20px);
    animation: bounce 0.3s ease infinite alternate;
  }
}

@keyframes bounce {
  to {
    text-shadow: float-text-3d($floating: true);
    transform: translateY(-20px);
  }
}
</style>
