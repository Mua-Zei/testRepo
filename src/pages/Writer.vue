<template>
  <div class="writer">
    <div class="sidebar">
      <input v-model="search" placeholder="搜索" class="search" />
      <ul class="file-list">
        <li v-for="doc in filteredDocs" :key="doc.id">
          <button @click="loadDoc(doc.id)">{{ doc.title }}</button>
        </li>
      </ul>
    </div>
    <div class="editor-container">
      <input v-model="title" placeholder="标题" class="title-input" />
      <div id="editor" class="editor"></div>
      <button @click="save">保存</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { getAllDocs, getDoc, saveDoc } from '@/db';

export default defineComponent({
  name: 'Writer',
  setup() {
    const title = ref('');
    const search = ref('');
    const docs = ref<Array<{ id: number; title: string }>>([]);
    const currentId = ref<number | null>(null);
    let quill: Quill;

    const loadDocs = async () => {
      docs.value = await getAllDocs();
    };

    const filteredDocs = computed(() => {
      return docs.value.filter(d =>
        d.title.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const loadDoc = async (id: number) => {
      const doc = await getDoc(id);
      if (doc) {
        title.value = doc.title;
        quill.setContents(doc.content);
        currentId.value = id;
      }
    };

    const save = async () => {
      const id = await saveDoc({
        id: currentId.value ?? undefined,
        title: title.value || '未命名',
        content: quill.getContents()
      });
      currentId.value = id;
      await loadDocs();
    };

    onMounted(async () => {
      quill = new Quill('#editor', { theme: 'snow' });
      await loadDocs();
    });

    return { title, search, filteredDocs, loadDoc, save };
  }
});
</script>

<style scoped>
.writer {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
.sidebar {
  width: 200px;
  border-right: 1px solid #ddd;
  padding-right: 1rem;
}
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.editor {
  height: 400px;
}
.file-list {
  list-style: none;
  padding: 0;
}
.file-list li {
  margin-bottom: 0.5rem;
}
.title-input,
.search {
  width: 100%;
  padding: 0.25rem;
  box-sizing: border-box;
}
</style>
