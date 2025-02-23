<template>
  <div>
    <h1>Когда лечь спать</h1>
    <label>Во сколько хочешь проснуться?</label>
    <input type="time" v-model="sleepStore.wakeTime" @change="sleepStore.calculateSleep" />
    <ul>
      <li v-for="(time, index) in sleepStore.results" :key="index">
        {{ time }} (цикл {{ index + 1 }})
      </li>
      <p>Во времени учтены 15 минут на засыпание</p>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import { useSleepStore } from '@/stores/sleep';

export default defineComponent({
  name: 'SleepView',
  setup() {
    const sleepStore = useSleepStore();
    onMounted(() => {
      sleepStore.clearResults();
    })
    return { sleepStore };
  }
});
</script>

<style>

</style>