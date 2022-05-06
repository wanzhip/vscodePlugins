<script setup>
import { ref } from 'vue'
// import { vscode } from '../utils/vscode';
const vscode = window.acquireVsCodeApi();
defineProps({
  msg: String
})

let count = ref(0)

const add = () => {
  count.value ++;
  vscode.postMessage({
    name: 123,
    age: 456
  });  
}

const go = () => {
  console.log(111);
  window.open('https://v3.vuejs.org/', '_blank')
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <span @click="go">Vue 3 Documentation</span>
  </p>

  <button type="button" @click="add">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
