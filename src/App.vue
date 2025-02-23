<template>
  <div>
    <nav>
      <router-link to="/">Когда проснуться</router-link> |
      <router-link to="/sleep">Когда лечь</router-link>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App'
});
</script>

<style>

</style>