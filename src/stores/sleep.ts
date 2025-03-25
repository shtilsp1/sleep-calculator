import { defineStore } from 'pinia';

interface SleepState {
  sleepTime: string;
  wakeTime: string;
  fallAsleepTime: number;
  results: string[];
}

interface SleepPhase {
  time: string;
  phase: number;
}

export const useSleepStore = defineStore('sleep', {
  state: (): SleepState => {
    const savedFallAsleepTime = localStorage.getItem('fallAsleepTime');
    return {
      sleepTime: '',
      wakeTime: '',
      fallAsleepTime: savedFallAsleepTime !== null ? Number(savedFallAsleepTime) : 15,
      results: []
    };
  },
  actions: {
    calculateWakeUp() {
      if (!this.sleepTime) return;
      const [hours, minutes] = this.sleepTime.split(':').map(Number);
      const bedtime = new Date();
      bedtime.setHours(hours, minutes, 0, 0);
      this.results = [];
      for (let i = 1; i <= 6; i++) {
        const wakeTime = new Date(bedtime);
        wakeTime.setMinutes(wakeTime.getMinutes() + this.fallAsleepTime + i * 90);
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
        sleepTime.setMinutes(sleepTime.getMinutes() - this.fallAsleepTime - i * 90);
        this.results.push(sleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    },
    calculateNap(napDuration: number = 20) {
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes() + this.fallAsleepTime + napDuration;
      const wakeHours = Math.floor(totalMinutes / 60) % 24;
      const wakeMinutes = totalMinutes % 60;
      const formattedHours = wakeHours.toString().padStart(2, '0');
      const formattedMinutes = wakeMinutes.toString().padStart(2, '0');
      this.results = [`${formattedHours}:${formattedMinutes}`];
      console.log('Now:', now.getHours(), now.getMinutes(), 'FallAsleep:', this.fallAsleepTime, 'Nap:', napDuration, 'Result:', this.results[0]); // Для отладки
    },
    clearResults() {
      this.results = [];
      this.sleepTime = '';
      this.wakeTime = '';
    },
    savePreferences() {
      localStorage.setItem('fallAsleepTime', this.fallAsleepTime.toString());
      console.log('Saved fallAsleepTime:', this.fallAsleepTime);
    },
    getSleepPhases(): SleepPhase[] {
      if (!this.results.length) return [];
      const phases: SleepPhase[] = [];
      const startTime = this.sleepTime || this.results[0];
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      let currentTime = new Date();
      currentTime.setHours(startHours, startMinutes, 0, 0);

      phases.push({ time: startTime, phase: 0 });
      this.results.forEach((result, index) => {
        const cycleDuration = 90;
        const lightPhase = 20;
        const deepPhase = 40;
        const remPhase = 30;

        const lightTime = new Date(currentTime);
        lightTime.setMinutes(currentTime.getMinutes() + this.fallAsleepTime + lightPhase);
        phases.push({ time: lightTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), phase: 1 });

        const deepTime = new Date(currentTime);
        deepTime.setMinutes(currentTime.getMinutes() + this.fallAsleepTime + lightPhase + deepPhase);
        phases.push({ time: deepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), phase: 2 });

        currentTime.setMinutes(currentTime.getMinutes() + this.fallAsleepTime + cycleDuration);
        phases.push({ time: result, phase: 3 });

        currentTime = new Date(currentTime);
      });
      return phases;
    },
    getSleepTips(): { tip: string; reason: string }[] {
      return [
        { tip: 'Избегайте экранов за час до сна.', reason: 'Синий свет от устройств подавляет выработку мелатонина, гормона сна, нарушая ваш циркадный ритм.' },
        { tip: 'Поддерживайте температуру в спальне 18-20°C.', reason: 'Прохладная среда помогает телу быстрее заснуть и улучшает глубокий сон.' },
        { tip: 'Не пейте кофе после 14:00.', reason: 'Кофеин блокирует аденозин, который накапливается днём и вызывает сонливость, мешая засыпанию.' },
        { tip: 'Ложитесь спать в одно и то же время.', reason: 'Регулярный график укрепляет циркадные ритмы, улучшая качество и продолжительность сна.' },
        { tip: 'Создать темноту за пару часов до сна.', reason: 'Свет подавляет выработку гормона сна - мелатонина.' },
        { tip: 'Не смотрите ночью на часы.', reason: 'Пробуждение в три часа ночи часто вызывает тревогу, что мешает снова заснуть. Узнавать время не стоит — это только усилит напряжение.' },
      ];
    }
  }
});