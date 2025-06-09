<template>
  <div class="writer">
    <div class="sidebar">
      <div class="sidebar-header">
        <input v-model="search" placeholder="搜索" class="search" />
        <button class="new-btn" @click="newDoc">新建</button>
      </div>
      <ul class="file-list">
        <li
          v-for="doc in filteredDocs"
          :key="doc.id"
          :class="{ active: doc.id === currentId }"
        >
          <button @click="loadDoc(doc.id)">{{ doc.title }}</button>
        </li>
      </ul>
    </div>
    <div class="editor-container">
      <input v-model="title" placeholder="标题" class="title-input" />
      <div id="editor" class="editor"></div>
      <div class="actions">
        <button class="primary" @click="save">保存</button>
        <button class="danger" @click="remove" :disabled="!currentId">删除</button>
        <button @click="showShortcuts = true">快捷键</button>
      </div>
    </div>

    <div class="drawer" :class="{ open: showShortcuts }">
      <h3>快捷键</h3>
      <ul>
        <li><strong>Ctrl+N</strong> 新建文档</li>
        <li><strong>Ctrl+S</strong> 保存文档</li>
        <li><strong>Ctrl+Delete</strong> 删除文档</li>
        <li><strong>Ctrl+/</strong> 打开/关闭本窗口</li>
      </ul>
      <button @click="showShortcuts = false">关闭</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, onBeforeUnmount } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { getAllDocs, getDoc, saveDoc, deleteDoc } from '@/db';

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

    const newDoc = () => {
      title.value = '';
      quill.setContents([]);
      currentId.value = null;
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

    const remove = async () => {
      if (currentId.value !== null) {
        await deleteDoc(currentId.value);
        newDoc();
        await loadDocs();
      }
    };

    const showShortcuts = ref(false);

    const handleShortcut = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      switch (e.key) {
        case 's':
        case 'S':
          e.preventDefault();
          save();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          newDoc();
          break;
        case 'Delete':
          e.preventDefault();
          remove();
          break;
        case '/':
          e.preventDefault();
          showShortcuts.value = !showShortcuts.value;
          break;
      }
    };

    onMounted(async () => {
      quill = new Quill('#editor', { theme: 'snow' });
      await loadDocs();
      window.addEventListener('keydown', handleShortcut);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleShortcut);
    });

    return {
      title,
      search,
      filteredDocs,
      currentId,
      loadDoc,
      save,
      newDoc,
      remove,
      showShortcuts
    };
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
.sidebar-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.new-btn {
  flex-shrink: 0;
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
.file-list li.active button {
  font-weight: bold;
}
.title-input,
.search {
  width: 100%;
  padding: 0.25rem;
  box-sizing: border-box;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.primary {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
}
.danger {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
}
.drawer {
  position: fixed;
  top: 0;
  right: -300px;
  width: 250px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: right 0.3s;
  z-index: 1000;
}
.drawer.open {
  right: 0;
}
</style>
