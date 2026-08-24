<template>
  <div class="avatar-uploader">
    <img :src="preview || defaultAvatar" alt="头像预览" class="avatar-preview" />
    <div class="avatar-actions">
      <label class="upload-button">
        选择图片
        <input type="file" accept="image/png,image/jpeg,image/webp" @change="selectImage" />
      </label>
      <button v-if="preview" type="button" class="text-button" @click="clear">使用默认头像</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import defaultAvatar from "@/assets/default-avatar.png";

const emit = defineEmits(["update:file"]);
const preview = ref("");

function selectImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const side = Math.min(image.width, image.height);
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      canvas.getContext("2d").drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 512, 512);
      canvas.toBlob((blob) => {
        if (!blob) return;
        preview.value = URL.createObjectURL(blob);
        emit("update:file", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.9);
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function clear() {
  preview.value = "";
  emit("update:file", null);
}
</script>

<style scoped lang="scss">
.avatar-uploader { display: flex; align-items: center; gap: 18px; }
.avatar-preview { width: 86px; height: 86px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,.9); box-shadow: 0 12px 25px rgba(131,83,180,.18); }
.avatar-actions { display: grid; gap: 8px; }
.upload-button, .text-button { cursor: pointer; color: #714aa6; font: inherit; }
.upload-button { padding: 8px 13px; border-radius: 10px; background: #f1ddff; font-weight: 700; }
.upload-button input { display: none; }
.text-button { border: 0; background: transparent; text-align: left; font-size: 12px; }
</style>
