<template>
  <div>
    <h1>Когда проснуться</h1>
    <label>Во сколько ложишься спать?</label>
    <input type="time" v-model="sleepStore.sleepTime" @change="sleepStore.calculateWakeUp" />
    <ul>
      <li v-for="(time, index) in sleepStore.results" :key="index">
        {{ time }} (цикл {{ index + 1 }})
      </li>
    </ul>
    <p>Во времени учтены 15 минут на засыпание</p>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import { useSleepStore } from '@/stores/sleep';

export default defineComponent({
  name: 'WakeUpView',
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