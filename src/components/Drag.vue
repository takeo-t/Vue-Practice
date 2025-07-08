<template>
  <div
    ref="boxRef"
    class="draggable-box"
    @mousedown="startDrag"
    :style="{ transform: `rotate(${rotation}deg)` }"
  >
    回転してみてね！
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const rotation = ref(0)
const isDragging = ref(false)
const boxRef = ref<HTMLElement | null>(null)

let prevAngleRad = 0

function getAngleRad(event: MouseEvent): number {
  const box = boxRef.value
  if (!box) return 0

  const rect = box.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = event.clientX - centerX
  const dy = event.clientY - centerY

  return Math.atan2(dy, dx)
}

// ドラッグ開始時の処理
/**
 * isDragging を true に設定し、マウスの位置から角度を計算
 * マウスの位置から中心点までの角度をラジアンで取得し、prevAngleRad に保存
 * @param event 
 */
function startDrag(event: MouseEvent) {
  isDragging.value = true
  prevAngleRad = getAngleRad(event)
}

/**
 * 
 * @param event 
 */
function onDrag(event: MouseEvent) {
  if (!isDragging.value) return

  // getAngleRad を使って現在のマウス位置から角度を計算
  const currentAngleRad = getAngleRad(event)
  let deltaRad = currentAngleRad - prevAngleRad

  // 差分を -π〜π の範囲に正規化
  if (deltaRad > Math.PI) deltaRad -= 2 * Math.PI
  if (deltaRad < -Math.PI) deltaRad += 2 * Math.PI

  rotation.value += deltaRad * (180 / Math.PI)
  prevAngleRad = currentAngleRad
}

// ドラッグ終了時の処理
function stopDrag() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.draggable-box {
  width: 200px;
  height: 200px;
  background-color: lightgreen;
  border: 2px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: grab;
  transition: transform 0.05s linear;
}
</style>
