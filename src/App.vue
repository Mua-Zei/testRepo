<template>
  <div id="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/writer">Writer</router-link>
      <router-link to="/playground">Playground</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eee;
}
.nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
