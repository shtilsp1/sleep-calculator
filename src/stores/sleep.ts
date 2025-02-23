import { defineStore } from 'pinia';

interface SleepState {
  sleepTime: string;
  wakeTime: string;
  results: string[];
}

export const useSleepStore = defineStore('sleep', {
  state: (): SleepState => ({
    sleepTime: '',
    wakeTime: '',
    results: []
  }),
  actions: {
    calculateWakeUp() {
      if (!this.sleepTime) return;
      const [hours, minutes] = this.sleepTime.split(':').map(Number);
      const bedtime = new Date();
      bedtime.setHours(hours, minutes, 0, 0);
      this.results = [];
      for (let i = 1; i <= 6; i++) {
        const wakeTime = new Date(bedtime);
        wakeTime.setMinutes(wakeTime.getMinutes() + 15 + i * 90);
        this.results.push(wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    },
    calculateSleep() {
      if (!this.wakeTime) return;
      const [hours, minutes] = this.wakeTime.split(':').map(Number);
      const wakeUp = new Date();
      wakeUp.setHours(hours, minutes, 0, 0);
      this.results = [];
      for (let i = 1; i <= 6; i++) {
        const sleepTime = new Date(wakeUp);
        sleepTime.setMinutes(sleepTime.getMinutes() - 15 - i * 90);
        this.results.push(sleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    },
    clearResults() {
      this.results = [];
      this.sleepTime = '';
      this.wakeTime = '';
    }
  }
});