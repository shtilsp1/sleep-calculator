<template>
  <div>
    <relaxing-background />
    <nav class="navbar">
      <div class="burger" ref="burger" @click="toggleMenu">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="nav-links" ref="navLinks" :class="{ 'active': isMenuOpen }">
        <router-link to="/" @click="closeMenu">Когда проснуться</router-link>
        <router-link to="/sleep" @click="closeMenu">Когда лечь</router-link>
        <router-link to="/nap" @click="closeMenu">Короткий сон</router-link>
        <router-link to="/phases" @click="closeMenu">Фазы сна</router-link>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section footer-about">
          <h3 class="strong-title">Somnivance</h3>
          <p>Мы помогаем вам лучше спать и просыпаться, используя науку о фазах сна.</p>
        </div>
        <div class="footer-section footer-contact">
          <h3>Свяжитесь с нами</h3>
          <p>📧 <a href="mailto:somnivance@gmail.com">somnivance@gmail.com</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Somnivance. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import RelaxingBackground from './components/RelaxingBackground.vue';

export default defineComponent({
  name: 'App',
  components: {
    RelaxingBackground
  },
  setup() {
    const isMenuOpen = ref(false);
    const burger = ref<HTMLElement | null>(null); // Типизация для бургера
    const navLinks = ref<HTMLElement | null>(null); // Типизация для контейнера ссылок

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
      animateMenu();
    };

    const closeMenu = () => {
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
        animateMenu();
      }
    };

    const animateMenu = () => {
      if (!burger.value || !navLinks.value) return; // Проверка на null

      const lines = burger.value.children; // Получаем линии бургера

      if (isMenuOpen.value) {
        // Анимация бургера в крестик
        gsap.to(lines[0], { rotation: 45, y: 8, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { opacity: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[2], { rotation: -45, y: -8, duration: 0.3, ease: 'power2.out' });

        // Анимация появления меню
        gsap.fromTo(
            navLinks.value,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );

        // Последовательная анимация ссылок
        gsap.from(navLinks.value.children, {
          x: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: 'power2.out'
        });
      } else {
        // Обратная анимация бургера
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[1], { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' });

        // Анимация скрытия меню
        gsap.to(navLinks.value, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    };

    onMounted(() => {
      gsap.from('.navbar', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    });

    return { isMenuOpen, burger, navLinks, toggleMenu, closeMenu };
  }
});
</script>

<style>
.app {
  min-height: 100vh;
  position: relative;
}

.strong-title {
  color: #7f9cf5!important;
}

.burger {
  display: none;
  cursor: pointer;
}

.line {
  width: 25px;
  height: 3px;
  background: white;
  margin: 5px 0;
  transform-origin: center;
}

.navbar {
  padding: 1rem;
}

@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .navbar {
    display: flex;
    justify-content: flex-start;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #1e2a44;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
  }

  .nav-links.active {
    display: flex;
    padding-left: 60px;
  }

  nav a::after {
    bottom: -2px!important;

  }

  nav a:hover::after,
  nav a.router-link-active::after {
    width: 30% !important;
  }

  .nav-links a {
    padding: 0.5rem 0;
    color: white;
    text-decoration: none;
  }

  .nav-links a:hover {
    color: #7f9cf5;
  }
}

@media (max-width: 600px) {
  nav a:hover::after,
  nav a.router-link-active::after {
    width: 40% !important;
  }
}

/*footer*/

.footer {
  background: rgba(26, 32, 44, 0.95);
  color: #d6deff;
  padding: 40px 20px;
  position: relative;
  bottom: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-section {
  min-width: 200px;
}

.footer-about h3,
.footer-links h3,
.footer-contact h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #ffffff;
}

.footer-about p {
  font-size: 14px;
  line-height: 1.5;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a,
.footer-contact a {
  color: #d6deff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover,
.footer-contact a:hover {
  color: #a5b4fc;
}

.footer-contact p {
  font-size: 14px;
  margin: 0;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  margin: 0;
  font-size: 14px;
  color: #a5b4fc;
}

.footer-legal {
  margin-top: 10px;
}

.footer-legal a {
  color: #d6deff;
  text-decoration: none;
  margin: 0 5px;
}

.footer-legal a:hover {
  color: #a5b4fc;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-section {
    margin-bottom: 20px;
  }
}

</style>