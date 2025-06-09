import { openDB, DBSchema } from 'idb';

interface WriterDB extends DBSchema {
  documents: {
    key: number;
    value: {
      id?: number;
      title: string;
      content: any;
    };
    indexes: { 'by-title': string };
  };
}

const dbPromise = openDB<WriterDB>('writer-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
    store.createIndex('by-title', 'title');
  }
});

export async function getAllDocs() {
  const db = await dbPromise;
  const docs = await db.getAll('documents');
  return docs.map(d => ({ id: d.id as number, title: d.title }));
}

export async function getDoc(id: number) {
  const db = await dbPromise;
  return db.get('documents', id);
}

export async function saveDoc(doc: { id?: number; title: string; content: any }) {
  const db = await dbPromise;
  const tx = db.transaction('documents', 'readwrite');
  const id = await tx.store.put(doc);
  await tx.done;
  return id as number;
}
