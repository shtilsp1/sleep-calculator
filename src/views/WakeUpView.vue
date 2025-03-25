<template>
  <div>
    <h1>Рассчитайте лучшее время для пробуждения с <strong class="strong-title">somnivance</strong></h1>
    <label class="fallAsleep">Сколько минут вам нужно, чтобы заснуть?</label>
    <input type="number" aria-label="time-to-fall-asleep" v-model.number="sleepStore.fallAsleepTime" min="0" max="60" step="1" placeholder="15" @change="savePrefs" />
    <label class="block-label">Во сколько ложитесь спать?</label>
    <input type="time" aria-label="time-to-sleep" v-model="sleepStore.sleepTime" @change="sleepStore.calculateWakeUp" />
    <ul>
      <li v-for="(time, index) in sleepStore.results" :key="index">
        {{ time }} (цикл {{ index + 1 }})
      </li>
    </ul>
    <canvas id="wakeUpChart" v-if="sleepStore.results.length"></canvas>
    <div class="sleep-tips" v-if="sleepStore.results.length">
      <h2>Советы для лучшего сна</h2>
      <div class="tip" v-for="(tip, index) in sleepStore.getSleepTips()" :key="index">
        <p class="tip-text">{{ tip.tip }}</p>
        <p class="tip-reason">{{ tip.reason }}</p>
      </div>
    </div>
    <p>Хотите просыпаться бодрым? Используйте наш калькулятор сна, чтобы определить лучшее время для пробуждения.</p>

    <h2>Как работает калькулятор сна?</h2>
    <p>Укажите, во сколько собираетесь лечь спать и сколько времени вам понадобится на засыпание, и somnivance рассчитает, когда вам лучше проснуться, учитывая циклы сна.</p>

    <h2>Почему важно просыпаться в правильное время?</h2>
    <p>Просыпание в лёгкой фазе сна (REM или N1) помогает чувствовать себя отдохнувшим. Узнайте больше о <router-link to="/phases" class="link">фазах сна</router-link>.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, nextTick } from 'vue';
import { useSleepStore } from '@/stores/sleep';
import { useHead } from "@vueuse/head";
import { useRoute } from 'vue-router';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: 'WakeUpView',
  setup() {
    const route = useRoute();
    const currentUrl = `https://somnivance.ru${route.fullPath}`;
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Homepage",
            "name": "Somnivance — Улучшите сон с научным подходом",
            "description": "Ваше доверенное приложение для лучшего сна.",
            "url": currentUrl,
            "publisher": {
              "@type": "Organization",
              "name": "Somnivance",
              "logo": {
                "@type": "ImageObject",
                "url": "https://somnivance.ru/logo.png"
              }
            }
          })
        }
      ],
      title: 'Somnivance — Улучшите сон с научным подходом',
      meta: [
          { property: 'og:title', content: 'Somnivance — Улучшите сон с научным подходом' },
          { property: 'og:description', content: '"Рассчитайте лучшее время для сна и пробуждения с Somnivance. Научные советы для здоровья.' },
          { property: 'og:image', content: 'https://somnivance.ru/dream.png' },
          { property: 'og:url', content: 'https://somnivance.ru' },
          { property: 'og:type', content: 'website' },

      ]
    });
    const sleepStore = useSleepStore();
    let chart: Chart | null = null;

    const renderChart = () => {
      const canvas = document.getElementById('wakeUpChart') as HTMLCanvasElement | null;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (chart) chart.destroy();
      const phases = sleepStore.getSleepPhases();
      if (!phases.length) return;

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: phases.map(p => p.time),
          datasets: [{
            label: 'Фазы сна',
            data: phases.map(p => p.phase),
            borderColor: '#7f9cf5',
            backgroundColor: 'rgba(127, 156, 245, 0.2)',
            fill: true,
            tension: 0.4,
          }]
        },
        options: {
          scales: {
            y: {
              min: 0,
              max: 3,
              ticks: {
                stepSize: 1,
                callback: (value) => ['Засыпание', 'Лёгкий', 'Глубокий', 'REM'][value]
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const phase = context.raw as number;
                  return ['Засыпание', 'Лёгкий сон', 'Глубокий сон', 'REM'][phase];
                }
              }
            }
          }
        }
      });
    };

    const savePrefs = () => {
      sleepStore.savePreferences();
    };

    onMounted(() => {
      sleepStore.clearResults();
    });

    watch(() => sleepStore.results, (newResults) => {
      if (newResults.length) {
        nextTick(() => {
          renderChart();
        });
      } else if (chart) {
        chart.destroy();
        chart = null;
      }
    }, { deep: true });

    watch(() => sleepStore.fallAsleepTime, (newValue) => {
      if (sleepStore.sleepTime) {
        sleepStore.calculateWakeUp();
      }
      sleepStore.savePreferences();
    });

    return { sleepStore, savePrefs };
  }
});
</script>

<style>
.strong-title {
  color: #7f9cf5;
}

.link {
  text-decoration: none;
  color: #7f9cf5;
}
</style>