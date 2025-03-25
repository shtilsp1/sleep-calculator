<template>
  <div>
    <h1>рассчитайте оптимальное время сна с <strong class="strong-title">somnivance</strong></h1>
    <label class="fallAsleep">Сколько минут вам нужно, чтобы заснуть?</label>
    <input type="number" aria-label="time-to-fall-asleep" v-model.number="sleepStore.fallAsleepTime" min="0" max="60" step="1" placeholder="15" @change="savePrefs" />
    <label class="block-label">Во сколько хотите проснуться?</label>
    <input type="time" aria-label="wake-up-time" v-model="sleepStore.wakeTime" @change="sleepStore.calculateSleep" />
    <ul>
      <li v-for="(time, index) in sleepStore.results" :key="index">
        {{ time }} (цикл {{ index + 1 }})
      </li>
    </ul>
    <canvas id="sleepChart" v-if="sleepStore.results.length"></canvas>
    <div class="sleep-tips" v-if="sleepStore.results.length">
      <h2>Советы для лучшего сна</h2>
      <div class="tip" v-for="(tip, index) in sleepStore.getSleepTips()" :key="index">
        <p class="tip-text">{{ tip.tip }}</p>
        <p class="tip-reason">{{ tip.reason }}</p>
      </div>
    </div>
    <p>Хотите легко засыпать и обеспечить себе качественный отдых? Воспользуйтесь нашим калькулятором сна, чтобы определить, когда лучше лечь спать.</p>

    <h2>Как работает калькулятор сна?</h2>
    <p>Введите желаемое время пробуждения, и somnivance подскажет, во сколько следует лечь спать, учитывая оптимальные циклы сна для максимальной эффективности отдыха.</p>

    <h2>Почему важно ложиться спать вовремя?</h2>
    <p>Оптимальное время отхода ко сну помогает правильно распределить фазы сна, включая критическую фазу быстрого сна, что способствует восстановлению организма и бодрому пробуждению. Узнайте больше о <router-link to="/phases" class="link">фазах сна</router-link> и настройте свой режим отдыха с помощью нашего калькулятора.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, nextTick } from 'vue';
import { useSleepStore } from '@/stores/sleep';
import Chart from 'chart.js/auto';
import {useHead} from "@vueuse/head";

export default defineComponent({
  name: 'SleepView',
  setup() {
    useHead({
      title: 'Somnivance — Когда ложиться спать: оптимальное время сна',
      meta: [
        {
          name: 'description',
          content: 'Узнайте, когда ложиться спать, чтобы выспаться, используя калькулятор сна. Рассчитайте по фазам сна оптимальное время с Somnivance!'
        }
      ]
    });
    const sleepStore = useSleepStore();
    let chart: Chart | null = null;

    const renderChart = () => {
      const canvas = document.getElementById('sleepChart') as HTMLCanvasElement | null;
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
                callback: (value) => ['Засыпание', 'Лёгкий', 'Глубокий', 'Быстрый сон'][value]
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const phase = context.raw as number;
                  return ['Засыпание', 'Лёгкий сон', 'Глубокий сон', 'Быстрый сон'][phase];
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
      if (sleepStore.wakeTime) {
        sleepStore.calculateSleep();
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
</style>