<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue';
import { onMounted, ref } from 'vue';

let url = ref('');

onMounted(() => {
  window.addEventListener('message', (event) => {
    console.log(event, 'app event...');
    console.log(event.data.cfgObj.extensionPath);
    const path = event.data.cfgObj.extensionPath;
    url = path.scheme + '://' + path.authority + path.path;
    console.log(url, 'url');
  });
})

</script>

<template>
  <img alt="Vue logo" :src="url + '/logo.png'" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
