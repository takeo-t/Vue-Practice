<template>
  <main class="register-page">
    <section class="register-card">
      <div class="register-header">
        <p class="register-kicker">Member Registration</p>
        <h1>アカウント登録</h1>
        <p>必要情報を入力してアカウントを作成してください。</p>
      </div>

      <form class="register-form" @submit.prevent="submitForm">
        <div class="form-field">
          <label for="name">ユーザー名</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            placeholder="山田 太郎"
            :class="{ 'is-error': errors.name }"
            @blur="touchAndValidate('name')"
          />
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>

        <div class="form-field">
          <label for="email">メールアドレス</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="example@email.com"
            :class="{ 'is-error': errors.email }"
            @blur="touchAndValidate('email')"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div class="form-field">
          <label for="phone">電話番号</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            type="tel"
            placeholder="090-1234-5678"
            :class="{ 'is-error': errors.phone }"
            @blur="touchAndValidate('phone')"
          />
          <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
        </div>

        <div class="form-field">
          <label for="address">住所</label>
          <input
            id="address"
            v-model.trim="form.address"
            type="text"
            placeholder="名古屋市中区..."
            :class="{ 'is-error': errors.address }"
            @blur="touchAndValidate('address')"
          />
          <p v-if="errors.address" class="error-message">{{ errors.address }}</p>
        </div>

        <div class="form-field">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="8文字以上"
            :class="{ 'is-error': errors.password }"
            @blur="touchAndValidate('password')"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div class="form-field">
          <label for="confirmPassword">パスワード確認</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="もう一度入力"
            :class="{ 'is-error': errors.confirmPassword }"
            @blur="touchAndValidate('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>

        <label class="terms-field">
          <input v-model="form.acceptTerms" type="checkbox" />
          <span>利用規約とプライバシーポリシーに同意します。</span>
        </label>
        <p v-if="errors.acceptTerms" class="error-message form-wide">{{ errors.acceptTerms }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="submit-button"
        >
          {{ isSubmitting ? '登録中...' : '登録する' }}
        </button>

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

type Field = 'name' | 'email' | 'phone' | 'address' | 'password' | 'confirmPassword' | 'acceptTerms';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type FormErrors = Record<Field, string>;

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
});

const errors = reactive<FormErrors>({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
});

const isSubmitting = ref(false);
const successMessage = ref('');

const validateField = (field: Field): void => {
  switch (field) {
    case 'name':
      errors.name = form.name ? '' : 'ユーザー名を入力してください。';
      break;
    case 'email':
      if (!form.email) {
        errors.email = 'メールアドレスを入力してください。';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errors.email = emailRegex.test(form.email) ? '' : 'メールアドレスの形式が正しくありません。';
      }
      break;
    case 'phone':
      if (!form.phone) {
        errors.phone = '電話番号を入力してください。';
      } else {
        const phoneRegex = /^[0-9-]{10,13}$/;
        errors.phone = phoneRegex.test(form.phone) ? '' : '電話番号の形式が正しくありません。';
      }
      break;
    case 'address':
      errors.address = form.address ? '' : '住所を入力してください。';
      break;
    case 'password':
      errors.password = form.password.length >= 8 ? '' : 'パスワードは8文字以上で入力してください。';
      if (form.confirmPassword) validateField('confirmPassword');
      break;
    case 'confirmPassword':
      errors.confirmPassword = form.password === form.confirmPassword ? '' : 'パスワードが一致しません。';
      break;
    case 'acceptTerms':
      errors.acceptTerms = form.acceptTerms ? '' : '利用規約への同意が必要です。';
      break;
  }
};

const touchAndValidate = (field: Field): void => {
  validateField(field);
};

const validateAll = (): boolean => {
  (Object.keys(errors) as Field[]).forEach(validateField);
  return !Object.values(errors).some((message) => message);
};

const submitForm = async (): Promise<void> => {
  successMessage.value = '';
  if (!validateAll()) return;

  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  isSubmitting.value = false;
  successMessage.value = `${form.name} さんのアカウントを作成しました。`;
};
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  background: #eef3f8;
  color: #172033;
  font-family:
    Inter,
    "Noto Sans JP",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.register-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  background:
    radial-gradient(circle at 15% 12%, rgba(20, 184, 166, 0.18), transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(59, 130, 246, 0.16), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #e9f0f7 52%, #f4f7fb 100%);
}

.register-card {
  width: min(100%, 720px);
  padding: 34px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.13);
  backdrop-filter: blur(18px);
}

.register-header {
  margin-bottom: 28px;
  text-align: center;
}

.register-kicker {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.register-header h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
  line-height: 1.25;
}

.register-header p:last-child {
  margin: 10px auto 0;
  max-width: 30rem;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.register-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 16px;
}

.form-field {
  min-width: 0;
}

.form-field label {
  display: block;
  margin-bottom: 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.form-field input {
  width: 100%;
  height: 46px;
  border: 1px solid #d6dee8;
  border-radius: 8px;
  background: #fbfdff;
  color: #172033;
  font-size: 15px;
  outline: none;
  padding: 0 14px;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.form-field input::placeholder {
  color: #9aa7b6;
}

.form-field input:focus {
  border-color: #0f766e;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.14);
}

.form-field input.is-error {
  border-color: #ef4444;
  background: #fffafa;
}

.form-field input.is-error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
}

.terms-field {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border: 1px solid #dce6ef;
  border-radius: 8px;
  background: #f8fafc;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.terms-field input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #0f766e;
  flex: 0 0 auto;
}

.submit-button,
.success-message,
.form-wide {
  grid-column: 1 / -1;
}

.submit-button {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f766e, #2563eb);
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.28);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.error-message {
  margin: 7px 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
}

.success-message {
  margin: 0;
  padding: 13px 14px;
  border: 1px solid #b7ebcf;
  border-radius: 8px;
  background: #effdf5;
  color: #047857;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 640px) {
  .register-page {
    align-items: start;
    padding: 24px 14px;
  }

  .register-card {
    padding: 24px 18px;
  }

  .register-header h1 {
    font-size: 26px;
  }

  .register-form {
    grid-template-columns: 1fr;
  }
}
</style>
