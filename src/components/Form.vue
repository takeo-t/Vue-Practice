<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">アカウント登録</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="flex flex-col items-center mb-6">
          <div class="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 mb-2 relative group">
            <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
            <div v-else class="flex items-center justify-center h-full text-gray-400 text-xs text-center p-2">No Image</div>
          </div>
          <label class="cursor-pointer bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
            画像を選択
            <input type="file" class="hidden" accept="image/*" @change="handleImageChange" />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓</label>
            <input v-model="formData.lastName" @input="saveToDraft" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">名</label>
            <input v-model="formData.firstName" @input="saveToDraft" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
          <input v-model="formData.phoneNumber" @input="saveToDraft" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input v-model="formData.email" @input="saveToDraft" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
          <input v-model="formData.zipCode" @input="saveToDraft" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
        </div>

        <button type="submit" class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition">
          登録する
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';

interface RegistrationForm {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  zipCode: string;
}

const STORAGE_KEY_DRAFT = 'user_registration_draft';
const DB_NAME = 'UserDatabase';
const STORE_NAME = 'images';
const IMG_KEY = 'profile_image';

const formData = reactive<RegistrationForm>({
  lastName: '',
  firstName: '',
  phoneNumber: '',
  email: '',
  zipCode: '',
});

const previewUrl = ref<string | null>(null);

// --- IndexedDB の基本操作 ---

// DBを開く処理
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      // 初めてDBを作る際に「images」というストア（テーブルのようなもの）を作成
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// 画像を保存する処理
const saveImageToDB = async (file: File) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(file, IMG_KEY); // Blob(File)をそのまま保存！
};

// 画像を取得する処理
const loadImageFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(IMG_KEY);
  
  request.onsuccess = () => {
    if (request.result) {
      // 保存されていたBlobから表示用のURLを作成
      previewUrl.value = URL.createObjectURL(request.result);
    }
  };
};

// --- イベントハンドラ ---

// 画像選択時
const handleImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    previewUrl.value = URL.createObjectURL(file); // プレビュー表示
    await saveImageToDB(file); // IndexedDBへ保存
  }
};

onMounted(async () => {
  // テキストデータの復元
  const savedData = localStorage.getItem(STORAGE_KEY_DRAFT);
  if (savedData) Object.assign(formData, JSON.parse(savedData));
  
  // 画像データの復元
  await loadImageFromDB();
});

const saveToDraft = () => {
  localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(formData));
};

const handleSubmit = () => {
  alert('登録完了！画像はIndexedDBに、テキストはLocalStorageに保存されました。');
};
</script>