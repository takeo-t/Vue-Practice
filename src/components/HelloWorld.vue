<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Modal, Button } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

defineProps<{ msg: string }>()

const count = ref(0)
const isModalVisible = ref(false)

const icons = Array.from({ length: 100 }, (_, i) => `icon${i + 1}`)
const modalContent = ref<HTMLElement | null>(null)

function showModal() {
  isModalVisible.value = true
  nextTick(() => {
    const initialIcon = document.getElementById('icon10')
    if (initialIcon && modalContent.value) {
      modalContent.value.scrollTop = initialIcon.offsetTop - modalContent.value.offsetTop
      console.log('modalContent:', modalContent.value.scrollTop)

    }
  })
}

function handleOk() {
  isModalVisible.value = false
}

function handleCancel() {
  isModalVisible.value = false
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <Button @click="count++">count is {{ count }}</Button>
    <Button type="primary" @click="showModal">モーダルを開く</Button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <Modal
    v-model:open="isModalVisible"
    title="Ant Design モーダル"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div ref="modalContent" style="height: 300px; overflow-y: auto;">
      <div v-for="icon in icons" :key="icon" :id="icon">
        {{ icon }}
      </div>
    </div>
  </Modal>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>,
    the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
    >
      Vue Docs Scaling up Guide
    </a>
    .
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
