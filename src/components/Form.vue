<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">アカウント登録</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓</label>
            <input 
              v-model="formData.lastName"
              @input="saveToDraft"
              type="text" 
              placeholder="山田"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">名</label>
            <input 
              v-model="formData.firstName"
              @input="saveToDraft"
              type="text" 
              placeholder="太郎"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
          <input 
            v-model="formData.phoneNumber"
            @input="saveToDraft"
            type="tel" 
            placeholder="09012345678"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input 
            v-model="formData.email"
            @input="saveToDraft"
            type="email" 
            placeholder="example@mail.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
          <input 
            v-model="formData.zipCode"
            @input="saveToDraft"
            type="text" 
            placeholder="1234567"
            maxlength="7"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
          <p class="mt-1 text-xs text-gray-500">ハイフンなしで入力してください</p>
        </div>

        <button 
          type="submit"
          class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
        >
          登録する
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-400 font-mono">Storage Status: Saved locally</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

interface RegistrationForm {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  zipCode: number | null;
}

const STORAGE_KEY_DRAFT = 'user_registration_draft';
const STORAGE_KEY_FINAL = 'registered_user_data';

const formData = reactive<RegistrationForm>({
  lastName: '',
  firstName: '',
  phoneNumber: '',
  email: '',
  zipCode: null,
});

// 1. ページ読み込み時にローカルストレージから復元
onMounted(() => {
  const savedData = localStorage.getItem(STORAGE_KEY_DRAFT);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      Object.assign(formData, parsed);
    } catch (e) {
      console.error('データのパースに失敗しました', e);
    }
  }
});

// 2. 入力するたびに一時保存（下書き機能）
const saveToDraft = () => {
  localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(formData));
};

// 3. 送信時に確定データを保存し、下書きを消去
const handleSubmit = () => {
  // 確定データとして保存
  localStorage.setItem(STORAGE_KEY_FINAL, JSON.stringify(formData));
  
  // 下書き（一時保存）を削除
  localStorage.removeItem(STORAGE_KEY_DRAFT);
  
  alert('ローカルストレージにデータを保存しました！');
  console.log('保存された確定データ:', localStorage.getItem(STORAGE_KEY_FINAL));
};
</script>