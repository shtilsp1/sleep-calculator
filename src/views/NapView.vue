<template>
  <div>
    <h1>Короткий сон: польза и как правильно вздремнуть</h1>
    <label class="fallAsleep">Сколько минут вам нужно, чтобы заснуть?</label>
    <input aria-label="time-to-fall-asleep" type="number" v-model.number="sleepStore.fallAsleepTime" min="0" max="60" step="1" placeholder="15" />
    <label class="block-label">Тип короткого сна</label>
    <select v-model="napDuration">
      <option value="10">10 минут — Бодрость</option>
      <option value="20">20 минут — Энергия</option>
      <option value="30">30 минут — Память</option>
    </select>
    <ul v-if="sleepStore.results.length">
      <li>Проснуться в {{ sleepStore.results[0] }}</li>
    </ul>
    <div class="nap-info" v-if="sleepStore.results.length">
      <p>{{ getNapDescription }}</p>
      <p>Короткий сон помогает восстановить силы без сонной инерции.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { useSleepStore } from '@/stores/sleep';
import {useHead} from "@vueuse/head";

export default defineComponent({
  name: 'NapView',
  setup() {
    useHead({
      title: 'Короткий сон: польза и советы от Somnivance',
      meta: [
        {
          name: 'description',
          content: 'Узнайте пользу короткого сна и как правильно вздремнуть с Somnivance. Советы для дневного отдыха.'
        }
      ]
    });
    const sleepStore = useSleepStore();
    const napDuration = ref<number>(20); // Явно указываем тип number

    const calculateNap = () => {
      sleepStore.calculateNap(Number(napDuration.value)); // Приводим к числу
    };

    const getNapDescription = computed(() => {
      switch (Number(napDuration.value)) { // Приводим к числу
        case 10:
          return '10 минут: Быстрое восстановление бодрости, идеально для перерыва.';
        case 20:
          return '20 минут: Повышение энергии и внимания, без глубокого сна.';
        case 30:
          return '30 минут: Улучшение памяти и креативности, лёгкий сон включён.';
        default:
          return '';
      }
    });

    onMounted(() => {
      calculateNap();
    });

    watch(() => sleepStore.fallAsleepTime, (newValue) => {
      calculateNap();
      sleepStore.savePreferences();
    });

    watch(napDuration, (newValue) => {
      console.log('NapDuration changed to:', newValue);
      calculateNap();
    });

    return { sleepStore, napDuration, getNapDescription };
  }
});
</script>

<style scoped>
select {
  width: 100%;
  padding: 12px 16px;
  margin: 15px 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white"><polygon points="0,0 10,0 5,10"/></svg>') no-repeat right 10px center;
  background-size: 10px;
  color: #ffffff;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select option {
  background: #2c3e50;
  color: #ffffff;
}

select:focus {
  background: rgba(255, 255, 255, 0.15) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white"><polygon points="0,0 10,0 5,10"/></svg>') no-repeat right 10px center;
  box-shadow: 0 0 10px rgba(127, 156, 245, 0.5), inset 0 2px 5px rgba(0, 0, 0, 0.2);
  outline: none;
}

.nap-info {
  margin-top: 20px;
  padding: 15px;
  background: rgba(163, 191, 250, 0.15);
  border-radius: 8px;
  color: #d6deff;
  font-size: 14px;
}

.nap-info p:first-child {
  font-weight: 600;
  color: #e0e7ff;
}
</style>