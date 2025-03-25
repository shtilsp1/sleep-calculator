<template>
  <div class="background">
    <div
        v-for="n in starCount"
        :key="n"
        class="star"
        :class="{ 'falling-star': n % fallingStarInterval === 0 }"
        :style="{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        '--size': `${Math.random() * 3 + 1}px`, // Единый размер для ширины и высоты
        animationDelay: `${Math.random() * 5}s`
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

export default defineComponent({
  name: 'RelaxingBackground',
  setup() {
    const starCount = ref(100);
    const fallingStarInterval = ref(10);

    onMounted(() => {
      const regularStars = document.querySelectorAll('.star:not(.falling-star)');
      gsap.to(regularStars, {
        opacity: 0.2,
        scale: 1.5,
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 10 - 5,
        duration: () => Math.random() * 3 + 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.05
      });
    });

    return { starCount, fallingStarInterval };
  }
});
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
  z-index: -1;
  overflow: hidden;
}

.star {
  position: absolute;
  width: var(--size); /* Единый размер из --size */
  height: var(--size);
  background: #ffffff;
  border-radius: 50%; /* Делает звёзды круглыми */
  opacity: 0.7;
}

.falling-star {
  width: 3px; /* Фиксированный размер звезды */
  height: 3px;
  opacity: 1;
  animation: fall 5s infinite linear;
}

.falling-star::after {
  content: '';
  position: absolute;
  top: -20px; /* Начало следа выше звезды */
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px; /* Длина следа */
  background: linear-gradient(180deg, #ffffff, transparent);
  opacity: 0.8;
  animation: fadeTrail 5s infinite linear;
}

@keyframes fall {
  0% {
    transform: translateY(-100vh);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes fadeTrail {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
</style>