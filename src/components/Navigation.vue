<template>
  <nav class="navigation">
    <div class="nav-container">
      <!-- Логотип или заголовок (опционально) -->
      <router-link to="/" class="nav-logo">SleepWell</router-link>

      <!-- Кнопка гамбургера для мобильных -->
      <button class="nav-toggle" @click="toggleMenu" :aria-expanded="isOpen" aria-label="Toggle navigation">
        <span class="hamburger" :class="{ 'open': isOpen }"></span>
      </button>

      <!-- Список навигации -->
      <ul class="nav-menu" :class="{ 'open': isOpen }" ref="navMenu">
        <li><router-link to="/phases" @click="closeMenu">Фазы сна</router-link></li>
        <li><router-link to="/sleep" @click="closeMenu">Сон</router-link></li>
        <li><router-link to="/wakeup" @click="closeMenu">Пробуждение</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { gsap } from 'gsap';

export default defineComponent({
  name: 'Navigation',
  setup() {
    const isOpen = ref(false);
    const navMenu = ref<HTMLElement | null>(null);

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        gsap.fromTo(navMenu.value,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else {
        gsap.to(navMenu.value,
            { height: 0, opacity: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    };

    const closeMenu = () => {
      if (isOpen.value) {
        isOpen.value = false;
        gsap.to(navMenu.value, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.out' });
      }
    };

    onMounted(() => {
      // Анимация появления навигации
      gsap.from('.navigation', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    });

    return { isOpen, navMenu, toggleMenu, closeMenu };
  }
});
</script>

<style scoped>
.navigation {
  background: rgba(26, 32, 44, 0.9); /* Тёмный фон с прозрачностью */
  padding: 10px 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  backdrop-filter: blur(5px); /* Эффект размытия фона */
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  color: #e0e7ff;
  text-decoration: none;
  font-size: 24px;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  margin-left: 20px;
}

.nav-menu a {
  font-family: 'Manrope', sans-serif;
  font-weight: 400;
  color: #d6deff;
  text-decoration: none;
  padding: 10px;
  transition: color 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #7f9cf5;
}

.nav-toggle {
  display: none; /* Скрыт на десктопе */
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.hamburger {
  display: block;
  width: 25px;
  height: 3px;
  background: #e0e7ff;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background: #e0e7ff;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.open::after {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Мобильные стили */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
  }

  .nav-menu {
    display: none; /* Скрыто по умолчанию */
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(26, 32, 44, 0.95);
    flex-direction: column;
    padding: 10px 0;
    overflow: hidden;
  }

  .nav-menu.open {
    display: flex; /* Показывается при открытии */
  }

  .nav-menu li {
    margin: 10px 0;
    text-align: center;
  }

  .nav-menu a {
    display: block;
    padding: 15px;
    font-size: 18px;
  }
}
</style>