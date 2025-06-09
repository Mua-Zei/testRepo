<template>
  <div class="writer">
    <div id="editor" class="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default defineComponent({
  name: 'Writer',
  setup() {
    onMounted(() => {
      new Quill('#editor', { theme: 'snow' });
    });
  }
});
</script>

<style scoped>
.editor {
  height: 400px;
}
</style>
